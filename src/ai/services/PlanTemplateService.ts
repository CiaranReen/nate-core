import { Redis } from "@upstash/redis";
import {
  PlanTemplate,
  UserPlanContext,
  PlanDiffResult,
  PlanGenerationCostMeta,
  WorkoutTemplate,
  PlanPhase,
  ExerciseTemplate,
  AdaptiveTrigger,
  PlanGenerationConfig,
} from "../interfaces/PlanTemplates";
import { UserMemoryProfile } from "../smart-memory";
import { CacheConfig } from "./CacheService";
import { OpenAI } from "openai";
import type { CacheService } from "./CacheService";

export class PlanTemplateService {
  private redis: Redis;
  private defaultTTL: number;
  private openai: OpenAI;
  private cacheService: CacheService;

  constructor(config: CacheConfig, cacheService: CacheService) {
    this.redis = new Redis({
      url: config.url,
      token: config.token,
    });
    this.defaultTTL = config.ttl || 86400; // Default 24 hour TTL for templates
    this.cacheService = cacheService;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private getTemplateCacheKey(
    type: string,
    goal: string,
    frequency: number,
    split: string
  ): string {
    return `plan:template:${type}:${goal}:${frequency}:${split}`;
  }

  private getUserPlanKey(userId: string): string {
    return `plan:user:${userId}`;
  }

  async cacheTemplate(template: PlanTemplate): Promise<void> {
    try {
      const key = this.getTemplateCacheKey(
        template.type,
        template.goal,
        template.frequency,
        template.split
      );
      await this.redis.set(key, template, { ex: this.defaultTTL });
    } catch (error) {
      console.error("Failed to cache template:", error);
    }
  }

  async getTemplate(
    type: string,
    goal: string,
    frequency: number,
    split: string
  ): Promise<PlanTemplate | null> {
    try {
      const key = this.getTemplateCacheKey(type, goal, frequency, split);
      return await this.redis.get<PlanTemplate>(key);
    } catch (error) {
      console.error("Failed to get template:", error);
      return null;
    }
  }

  async personalizeTemplate(
    template: PlanTemplate,
    userProfile: UserMemoryProfile,
    context: UserPlanContext
  ): Promise<PlanTemplate> {
    const personalized = { ...template };

    // Adjust based on real-time data
    if (context.recentHRV && context.recentHRV < 50) {
      personalized.baseStructure.phases = this.adjustForLowHRV(
        personalized.baseStructure.phases
      );
    }

    // Adjust based on sleep score
    if (context.recentSleepScore && context.recentSleepScore < 70) {
      personalized.baseStructure.phases = this.adjustForPoorSleep(
        personalized.baseStructure.phases
      );
    }

    // Adjust based on pricing tier
    if (context.pricingTier === "basic") {
      personalized.baseStructure.adaptiveTriggers =
        this.simplifyAdaptiveTriggers(
          personalized.baseStructure.adaptiveTriggers
        );
    }

    // Adjust workouts based on equipment availability
    personalized.baseStructure.phases = this.adjustForEquipment(
      personalized.baseStructure.phases,
      context.equipmentAvailable
    );

    // Adjust workout duration based on time constraints
    if (context.timeConstraints.maxWorkoutDuration) {
      personalized.baseStructure.phases = this.adjustWorkoutDuration(
        personalized.baseStructure.phases,
        context.timeConstraints.maxWorkoutDuration
      );
    }

    return personalized;
  }

  async diffWithPreviousPlan(
    userId: string,
    newPlan: PlanTemplate
  ): Promise<PlanDiffResult> {
    try {
      const previousPlan = await this.redis.get<PlanTemplate>(
        this.getUserPlanKey(userId)
      );
      if (!previousPlan) {
        return {
          similarityScore: 0,
          reusableComponents: { phases: [], workouts: [], exercises: [] },
          recommendedChanges: [],
        };
      }

      return this.calculatePlanDiff(previousPlan, newPlan);
    } catch (error) {
      console.error("Failed to diff plans:", error);
      throw error;
    }
  }

  calculateGenerationCost(
    template: PlanTemplate,
    context: UserPlanContext
  ): PlanGenerationCostMeta {
    const baseTokens = 500; // Base token cost for plan generation
    const adaptationTokens = 100; // Tokens per adaptation

    return {
      estimatedComputeUnits: this.calculateComputeUnits(template),
      estimatedAITokens: this.calculateAITokens(
        template,
        baseTokens,
        adaptationTokens
      ),
      estimatedStorageCost: this.calculateStorageCost(template),
      adaptationCosts: {
        tokensPerAdaptation: adaptationTokens,
        expectedAdaptationsPerWeek: this.estimateWeeklyAdaptations(
          template,
          context
        ),
      },
    };
  }

  private adjustForLowHRV(phases: PlanPhase[]): PlanPhase[] {
    return phases.map((phase) => ({
      ...phase,
      workouts: phase.workouts.map((workout) => ({
        ...workout,
        intensity: Math.max(1, workout.intensity * 0.9), // Reduce intensity by 10%
      })),
    }));
  }

  private adjustForPoorSleep(phases: PlanPhase[]): PlanPhase[] {
    return phases.map((phase) => ({
      ...phase,
      workouts: phase.workouts.map((workout) => ({
        ...workout,
        duration: Math.floor(workout.duration * 0.8), // Reduce duration by 20%
        intensity: Math.max(1, workout.intensity * 0.8), // Reduce intensity by 20%
      })),
    }));
  }

  private simplifyAdaptiveTriggers(
    triggers: AdaptiveTrigger[]
  ): AdaptiveTrigger[] {
    // Keep only essential triggers for basic tier
    return triggers.filter((trigger) =>
      ["volume", "intensity"].includes(trigger.adjustment.type)
    );
  }

  private adjustForEquipment(
    phases: PlanPhase[],
    availableEquipment: string[]
  ): PlanPhase[] {
    return phases.map((phase) => ({
      ...phase,
      workouts: phase.workouts.map((workout) => ({
        ...workout,
        exercises: workout.exercises.map((exercise) => {
          // If equipment not available, use alternative
          if (
            !availableEquipment.some((eq) =>
              exercise.name.toLowerCase().includes(eq.toLowerCase())
            )
          ) {
            return {
              ...exercise,
              name: this.findAlternativeExercise(exercise, availableEquipment),
            };
          }
          return exercise;
        }),
      })),
    }));
  }

  private adjustWorkoutDuration(
    phases: PlanPhase[],
    maxDuration: number
  ): PlanPhase[] {
    return phases.map((phase) => ({
      ...phase,
      workouts: phase.workouts.map((workout) => {
        if (workout.duration > maxDuration) {
          return this.compressWorkout(workout, maxDuration);
        }
        return workout;
      }),
    }));
  }

  private compressWorkout(
    workout: WorkoutTemplate,
    targetDuration: number
  ): WorkoutTemplate {
    const compressionRatio = targetDuration / workout.duration;
    return {
      ...workout,
      duration: targetDuration,
      exercises: workout.exercises.map((exercise) => ({
        ...exercise,
        sets: Math.max(1, Math.floor(exercise.sets * compressionRatio)),
        restInterval: Math.max(
          30,
          Math.floor(exercise.restInterval * compressionRatio)
        ),
      })),
    };
  }

  private findAlternativeExercise(
    exercise: ExerciseTemplate,
    availableEquipment: string[]
  ): string {
    // Return first alternative that matches available equipment
    for (const alt of exercise.alternatives) {
      if (
        availableEquipment.some((eq) =>
          alt.toLowerCase().includes(eq.toLowerCase())
        )
      ) {
        return alt;
      }
    }
    // If no alternative found, return a bodyweight alternative
    return `Bodyweight ${exercise.name}`;
  }

  private calculatePlanDiff(
    previous: PlanTemplate,
    current: PlanTemplate
  ): PlanDiffResult {
    const result: PlanDiffResult = {
      similarityScore: 0,
      reusableComponents: {
        phases: [],
        workouts: [],
        exercises: [],
      },
      recommendedChanges: [],
    };

    // Calculate similarity score
    result.similarityScore = this.calculateSimilarityScore(previous, current);

    // Find reusable components
    result.reusableComponents = this.findReusableComponents(previous, current);

    // Generate recommended changes
    result.recommendedChanges = this.generateRecommendedChanges(
      previous,
      current
    );

    return result;
  }

  private calculateSimilarityScore(
    previous: PlanTemplate,
    current: PlanTemplate
  ): number {
    let score = 0;

    // Base similarity (type, goal, frequency)
    if (previous.type === current.type) score += 0.2;
    if (previous.goal === current.goal) score += 0.2;
    if (previous.frequency === current.frequency) score += 0.1;
    if (previous.split === current.split) score += 0.1;

    // Phase similarity
    const phaseScore = this.calculatePhasesSimilarity(
      previous.baseStructure.phases,
      current.baseStructure.phases
    );
    score += phaseScore * 0.4;

    return Math.min(1, score);
  }

  private calculatePhasesSimilarity(
    previousPhases: PlanPhase[],
    currentPhases: PlanPhase[]
  ): number {
    // Implementation of phase similarity calculation
    // This would compare workout structures, exercise selection, etc.
    return 0.5; // Placeholder
  }

  private findReusableComponents(
    previous: PlanTemplate,
    current: PlanTemplate
  ): PlanDiffResult["reusableComponents"] {
    return {
      phases: previous.baseStructure.phases
        .filter((p) =>
          current.baseStructure.phases.some((c) => this.arePhasesSimilar(p, c))
        )
        .map((p) => p.name),
      workouts: [], // Implementation needed
      exercises: [], // Implementation needed
    };
  }

  private arePhasesSimilar(p1: PlanPhase, p2: PlanPhase): boolean {
    return p1.name === p2.name && p1.focus === p2.focus;
  }

  private generateRecommendedChanges(
    previous: PlanTemplate,
    current: PlanTemplate
  ): PlanDiffResult["recommendedChanges"] {
    const changes: PlanDiffResult["recommendedChanges"] = [];

    // Compare phases
    current.baseStructure.phases.forEach((phase) => {
      const previousPhase = previous.baseStructure.phases.find(
        (p) => p.name === phase.name
      );
      if (!previousPhase) {
        changes.push({
          type: "add",
          component: `phase:${phase.name}`,
          reason: "New phase introduced in updated plan",
        });
      }
    });

    // Add more change detection logic as needed

    return changes;
  }

  private calculateComputeUnits(template: PlanTemplate): number {
    // Implementation of compute units calculation
    return 100; // Placeholder
  }

  private calculateAITokens(
    template: PlanTemplate,
    baseTokens: number,
    adaptationTokens: number
  ): number {
    // Implementation of AI token calculation
    return (
      baseTokens +
      template.baseStructure.adaptiveTriggers.length * adaptationTokens
    );
  }

  private calculateStorageCost(template: PlanTemplate): number {
    // Implementation of storage cost calculation
    return 50; // Placeholder
  }

  private estimateWeeklyAdaptations(
    template: PlanTemplate,
    context: UserPlanContext
  ): number {
    // Implementation of weekly adaptations estimation
    return context.pricingTier === "premium" ? 3 : 1;
  }

  async generatePlan(
    profile: UserMemoryProfile,
    config: PlanGenerationConfig
  ): Promise<PlanTemplate> {
    const cacheKey = this.generateCacheKey(profile);

    // Try to get from cache if enabled
    if (config.useCache) {
      const cached = await this.cacheService.get<PlanTemplate>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Generate plan using AI
    const plan = await this.generatePlanWithAI(profile, config);

    // Cache the result if caching is enabled
    if (config.useCache) {
      await this.cacheService.set(cacheKey, plan, 60 * 60 * 24); // Cache for 24 hours
    }

    return plan;
  }

  private async generatePlanWithAI(
    profile: UserMemoryProfile,
    config: PlanGenerationConfig
  ): Promise<PlanTemplate> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert fitness coach specializing in creating personalized workout plans.
            Create a detailed workout plan based on the user's profile, considering their fitness level,
            goals, and constraints. The plan should be progressive and adaptable.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              profile,
              requirements: {
                optimizationLevel: config.optimizationLevel,
                generateVisuals: config.generateVisuals,
              },
            }),
          },
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 4000,
      });

      const planData = JSON.parse(
        completion.choices[0].message.content || "{}"
      );
      return this.validateAndEnhancePlan(planData);
    } catch (error) {
      console.error("Error generating plan with AI:", error);
      throw new Error("Failed to generate workout plan");
    }
  }

  private validateAndEnhancePlan(planData: any): PlanTemplate {
    // Implement validation logic here
    // This should ensure the plan meets all requirements and has all necessary fields
    return planData as PlanTemplate;
  }

  private generateCacheKey(profile: UserMemoryProfile): string {
    // Generate a unique cache key based on important profile attributes
    const keyParts = [
      profile.userId,
      profile.fitnessLevel,
      ...profile.fitnessGoals,
      profile.personalityProfile.motivationType,
      profile.behaviorPatterns.recoveryProfile.optimalFrequency,
    ];
    return `plan:${keyParts.join(":")}`;
  }

  async adaptPlan(
    currentPlan: PlanTemplate,
    profile: UserMemoryProfile,
    metrics: any
  ): Promise<PlanTemplate> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert fitness coach specializing in adapting workout plans based on
            user progress and metrics. Analyze the current plan and user metrics to suggest appropriate
            modifications while maintaining the core structure and progression.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              currentPlan,
              profile,
              metrics,
            }),
          },
        ],
        temperature: 0.5,
      });

      const adaptedPlan = JSON.parse(
        completion.choices[0].message.content || "{}"
      );
      return this.validateAndEnhancePlan(adaptedPlan);
    } catch (error) {
      console.error("Error adapting plan:", error);
      throw new Error("Failed to adapt workout plan");
    }
  }
}
