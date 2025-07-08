import { Redis } from "@upstash/redis";
import { OpenAI } from "openai";
export class PlanTemplateService {
    constructor(config, cacheService) {
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
    getTemplateCacheKey(type, goal, frequency, split) {
        return `plan:template:${type}:${goal}:${frequency}:${split}`;
    }
    getUserPlanKey(userId) {
        return `plan:user:${userId}`;
    }
    async cacheTemplate(template) {
        try {
            const key = this.getTemplateCacheKey(template.type, template.goal, template.frequency, template.split);
            await this.redis.set(key, template, { ex: this.defaultTTL });
        }
        catch (error) {
            console.error("Failed to cache template:", error);
        }
    }
    async getTemplate(type, goal, frequency, split) {
        try {
            const key = this.getTemplateCacheKey(type, goal, frequency, split);
            return await this.redis.get(key);
        }
        catch (error) {
            console.error("Failed to get template:", error);
            return null;
        }
    }
    async personalizeTemplate(template, userProfile, context) {
        const personalized = { ...template };
        // Adjust based on real-time data
        if (context.recentHRV && context.recentHRV < 50) {
            personalized.baseStructure.phases = this.adjustForLowHRV(personalized.baseStructure.phases);
        }
        // Adjust based on sleep score
        if (context.recentSleepScore && context.recentSleepScore < 70) {
            personalized.baseStructure.phases = this.adjustForPoorSleep(personalized.baseStructure.phases);
        }
        // Adjust based on pricing tier
        if (context.pricingTier === "basic") {
            personalized.baseStructure.adaptiveTriggers =
                this.simplifyAdaptiveTriggers(personalized.baseStructure.adaptiveTriggers);
        }
        // Adjust workouts based on equipment availability
        personalized.baseStructure.phases = this.adjustForEquipment(personalized.baseStructure.phases, context.equipmentAvailable);
        // Adjust workout duration based on time constraints
        if (context.timeConstraints.maxWorkoutDuration) {
            personalized.baseStructure.phases = this.adjustWorkoutDuration(personalized.baseStructure.phases, context.timeConstraints.maxWorkoutDuration);
        }
        return personalized;
    }
    async diffWithPreviousPlan(userId, newPlan) {
        try {
            const previousPlan = await this.redis.get(this.getUserPlanKey(userId));
            if (!previousPlan) {
                return {
                    similarityScore: 0,
                    reusableComponents: { phases: [], workouts: [], exercises: [] },
                    recommendedChanges: [],
                };
            }
            return this.calculatePlanDiff(previousPlan, newPlan);
        }
        catch (error) {
            console.error("Failed to diff plans:", error);
            throw error;
        }
    }
    calculateGenerationCost(template, context) {
        const baseTokens = 500; // Base token cost for plan generation
        const adaptationTokens = 100; // Tokens per adaptation
        return {
            estimatedComputeUnits: this.calculateComputeUnits(template),
            estimatedAITokens: this.calculateAITokens(template, baseTokens, adaptationTokens),
            estimatedStorageCost: this.calculateStorageCost(template),
            adaptationCosts: {
                tokensPerAdaptation: adaptationTokens,
                expectedAdaptationsPerWeek: this.estimateWeeklyAdaptations(template, context),
            },
        };
    }
    adjustForLowHRV(phases) {
        return phases.map((phase) => ({
            ...phase,
            workouts: phase.workouts.map((workout) => ({
                ...workout,
                intensity: Math.max(1, workout.intensity * 0.9), // Reduce intensity by 10%
            })),
        }));
    }
    adjustForPoorSleep(phases) {
        return phases.map((phase) => ({
            ...phase,
            workouts: phase.workouts.map((workout) => ({
                ...workout,
                duration: Math.floor(workout.duration * 0.8), // Reduce duration by 20%
                intensity: Math.max(1, workout.intensity * 0.8), // Reduce intensity by 20%
            })),
        }));
    }
    simplifyAdaptiveTriggers(triggers) {
        // Keep only essential triggers for basic tier
        return triggers.filter((trigger) => ["volume", "intensity"].includes(trigger.adjustment.type));
    }
    adjustForEquipment(phases, availableEquipment) {
        return phases.map((phase) => ({
            ...phase,
            workouts: phase.workouts.map((workout) => ({
                ...workout,
                exercises: workout.exercises.map((exercise) => {
                    // If equipment not available, use alternative
                    if (!availableEquipment.some((eq) => exercise.name.toLowerCase().includes(eq.toLowerCase()))) {
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
    adjustWorkoutDuration(phases, maxDuration) {
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
    compressWorkout(workout, targetDuration) {
        const compressionRatio = targetDuration / workout.duration;
        return {
            ...workout,
            duration: targetDuration,
            exercises: workout.exercises.map((exercise) => ({
                ...exercise,
                sets: Math.max(1, Math.floor(exercise.sets * compressionRatio)),
                restInterval: Math.max(30, Math.floor(exercise.restInterval * compressionRatio)),
            })),
        };
    }
    findAlternativeExercise(exercise, availableEquipment) {
        // Return first alternative that matches available equipment
        for (const alt of exercise.alternatives) {
            if (availableEquipment.some((eq) => alt.toLowerCase().includes(eq.toLowerCase()))) {
                return alt;
            }
        }
        // If no alternative found, return a bodyweight alternative
        return `Bodyweight ${exercise.name}`;
    }
    calculatePlanDiff(previous, current) {
        const result = {
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
        result.recommendedChanges = this.generateRecommendedChanges(previous, current);
        return result;
    }
    calculateSimilarityScore(previous, current) {
        let score = 0;
        // Base similarity (type, goal, frequency)
        if (previous.type === current.type)
            score += 0.2;
        if (previous.goal === current.goal)
            score += 0.2;
        if (previous.frequency === current.frequency)
            score += 0.1;
        if (previous.split === current.split)
            score += 0.1;
        // Phase similarity
        const phaseScore = this.calculatePhasesSimilarity(previous.baseStructure.phases, current.baseStructure.phases);
        score += phaseScore * 0.4;
        return Math.min(1, score);
    }
    calculatePhasesSimilarity(previousPhases, currentPhases) {
        // Implementation of phase similarity calculation
        // This would compare workout structures, exercise selection, etc.
        return 0.5; // Placeholder
    }
    findReusableComponents(previous, current) {
        return {
            phases: previous.baseStructure.phases
                .filter((p) => current.baseStructure.phases.some((c) => this.arePhasesSimilar(p, c)))
                .map((p) => p.name),
            workouts: [], // Implementation needed
            exercises: [], // Implementation needed
        };
    }
    arePhasesSimilar(p1, p2) {
        return p1.name === p2.name && p1.focus === p2.focus;
    }
    generateRecommendedChanges(previous, current) {
        const changes = [];
        // Compare phases
        current.baseStructure.phases.forEach((phase) => {
            const previousPhase = previous.baseStructure.phases.find((p) => p.name === phase.name);
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
    calculateComputeUnits(template) {
        // Implementation of compute units calculation
        return 100; // Placeholder
    }
    calculateAITokens(template, baseTokens, adaptationTokens) {
        // Implementation of AI token calculation
        return (baseTokens +
            template.baseStructure.adaptiveTriggers.length * adaptationTokens);
    }
    calculateStorageCost(template) {
        // Implementation of storage cost calculation
        return 50; // Placeholder
    }
    estimateWeeklyAdaptations(template, context) {
        // Implementation of weekly adaptations estimation
        return context.pricingTier === "premium" ? 3 : 1;
    }
    async generatePlan(profile, config) {
        const cacheKey = this.generateCacheKey(profile);
        // Try to get from cache if enabled
        if (config.useCache) {
            const cached = await this.cacheService.get(cacheKey);
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
    async generatePlanWithAI(profile, config) {
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
            const planData = JSON.parse(completion.choices[0].message.content || "{}");
            return this.validateAndEnhancePlan(planData);
        }
        catch (error) {
            console.error("Error generating plan with AI:", error);
            throw new Error("Failed to generate workout plan");
        }
    }
    validateAndEnhancePlan(planData) {
        // Implement validation logic here
        // This should ensure the plan meets all requirements and has all necessary fields
        return planData;
    }
    generateCacheKey(profile) {
        // Generate a unique cache key based on important profile attributes
        const keyParts = [
            profile.userId,
            profile.fitnessLevel,
            ...profile.fitnessGoals,
            profile.personalityProfile.motivationType,
            profile.behaviorPatterns.motivationCycles.averageCycleDuration,
        ];
        return `plan:${keyParts.join(":")}`;
    }
    async adaptPlan(currentPlan, profile, metrics) {
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
            const adaptedPlan = JSON.parse(completion.choices[0].message.content || "{}");
            return this.validateAndEnhancePlan(adaptedPlan);
        }
        catch (error) {
            console.error("Error adapting plan:", error);
            throw new Error("Failed to adapt workout plan");
        }
    }
}
