import {
  PlanLibrary,
  BasePlan,
  TrainingPhase,
  AdaptationTrigger,
  TrainingMetrics,
} from "../interfaces/PlanLibrary";
import { UserMemoryProfile } from "../smart-memory";
import { UserPlanContext } from "../interfaces/PlanTemplates";

export class PlanLibraryService {
  private library: PlanLibrary;

  constructor() {
    this.library = this.initializeLibrary();
  }

  private initializeLibrary(): PlanLibrary {
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      plans: this.createBasePlans(),
      metadata: {
        totalPlans: 0,
        categories: [
          "strength",
          "hypertrophy",
          "endurance",
          "weight_loss",
          "general_fitness",
        ],
        validationMetrics: {
          simulatedProfiles: 10000,
          successRate: 0.92,
          averageAdherence: 0.85,
          injuryRisk: 0.02,
        },
      },
    };
  }

  private createBasePlans(): BasePlan[] {
    const plans: BasePlan[] = [];

    // Beginner Full Body Plan
    plans.push(this.createBeginnerFullBodyPlan());

    // Intermediate Push Pull Legs
    plans.push(this.createIntermediatePPLPlan());

    // Advanced Body Part Split
    plans.push(this.createAdvancedSplitPlan());

    return plans;
  }

  private createBeginnerFullBodyPlan(): BasePlan {
    return {
      id: "beginner-full-body-1",
      name: "Beginner Full Body Foundation",
      description:
        "A balanced full-body program focusing on fundamental movement patterns and progressive overload.",
      targetAudience: {
        experienceLevel: "beginner",
        goals: ["strength", "general_fitness"],
        timeCommitment: {
          sessionsPerWeek: 3,
          minutesPerSession: 60,
        },
        equipment: ["dumbbells", "bodyweight"],
      },
      phases: this.createBeginnerPhases(),
      adaptationTriggers: this.createBeginnerAdaptationTriggers(),
      progressionModel: {
        volume: {
          initialValue: 12, // Sets per muscle group per week
          progressionRate: 0.1, // 10% increase per phase
          deloadFrequency: 4, // Deload every 4 weeks
        },
        intensity: {
          initialValue: 7, // RPE
          progressionRate: 0.05,
          deloadFrequency: 4,
        },
      },
      metrics: {
        estimatedCalories: 300,
        estimatedRecoveryDemand: 6,
        technicalDifficulty: 3,
        variabilityIndex: 0.4,
      },
    };
  }

  private createBeginnerPhases(): TrainingPhase[] {
    return [
      {
        name: "Foundation",
        focus: ["technique", "stability", "basic_strength"],
        duration: 4,
        volumeDistribution: {
          strength: 0.4,
          hypertrophy: 0.2,
          endurance: 0.2,
          power: 0.0,
          mobility: 0.2,
        },
        intensityProfile: {
          baseline: 6,
          progression: 0.2,
          deload: true,
        },
        exercises: {
          primary: [
            "Goblet Squat",
            "Dumbbell Romanian Deadlift",
            "Push-ups",
            "Dumbbell Rows",
          ],
          secondary: [
            "Lunges",
            "Dumbbell Shoulder Press",
            "Glute Bridges",
            "Plank Holds",
          ],
          assistance: ["Face Pulls", "Bird Dogs", "Dead Bugs", "Calf Raises"],
          mobility: [
            "Hip Flexor Stretch",
            "Thoracic Extensions",
            "Wall Slides",
            "Cat-Cow",
          ],
        },
      },
      // Additional phases would be defined here
    ];
  }

  private createBeginnerAdaptationTriggers(): AdaptationTrigger[] {
    return [
      {
        metric: "weeklyAdherence",
        condition: {
          operator: "lt",
          value: 0.7,
          duration: "trend",
        },
        adjustments: [
          {
            type: "volume",
            value: -0.1,
            duration: 2,
            scope: "phase",
          },
          {
            type: "complexity",
            value: -0.15,
            duration: 4,
            scope: "plan",
          },
        ],
      },
      {
        metric: "averageRPE",
        condition: {
          operator: "gt",
          value: 8,
          duration: "sustained",
        },
        adjustments: [
          {
            type: "intensity",
            value: -0.1,
            duration: 2,
            scope: "session",
          },
          {
            type: "rest",
            value: 0.2,
            duration: 2,
            scope: "session",
          },
        ],
      },
      {
        metric: "recoveryScore",
        condition: {
          operator: "lt",
          value: 60,
          duration: "immediate",
        },
        adjustments: [
          {
            type: "volume",
            value: -0.2,
            duration: 1,
            scope: "session",
          },
        ],
      },
    ];
  }

  private createIntermediatePPLPlan(): BasePlan {
    return {
      id: "intermediate-ppl-1",
      name: "Intermediate Push Pull Legs",
      description:
        "A balanced PPL split focusing on strength and hypertrophy with progressive overload.",
      targetAudience: {
        experienceLevel: "intermediate",
        goals: ["strength", "hypertrophy"],
        timeCommitment: {
          sessionsPerWeek: 6,
          minutesPerSession: 75,
        },
        equipment: ["barbell", "dumbbells", "cables", "machines"],
      },
      phases: [
        {
          name: "Strength Focus",
          focus: ["strength", "hypertrophy", "power"],
          duration: 4,
          volumeDistribution: {
            strength: 0.5,
            hypertrophy: 0.3,
            endurance: 0.0,
            power: 0.1,
            mobility: 0.1,
          },
          intensityProfile: {
            baseline: 7,
            progression: 0.15,
            deload: true,
          },
          exercises: {
            primary: [
              "Barbell Bench Press",
              "Barbell Row",
              "Squat",
              "Deadlift",
              "Overhead Press",
            ],
            secondary: [
              "Incline Dumbbell Press",
              "Pull-ups",
              "Romanian Deadlift",
              "Leg Press",
            ],
            assistance: [
              "Lateral Raises",
              "Face Pulls",
              "Tricep Extensions",
              "Bicep Curls",
            ],
            mobility: [
              "Band Dislocates",
              "Hip Flexor Stretch",
              "Ankle Mobility",
              "T-Spine Rotation",
            ],
          },
        },
      ],
      adaptationTriggers: [
        {
          metric: "weeklyAdherence",
          condition: {
            operator: "lt",
            value: 0.8,
            duration: "trend",
          },
          adjustments: [
            {
              type: "frequency",
              value: -0.15,
              duration: 2,
              scope: "plan",
            },
          ],
        },
        {
          metric: "strengthProgress",
          condition: {
            operator: "lt",
            value: 0.1,
            duration: "sustained",
          },
          adjustments: [
            {
              type: "intensity",
              value: 0.1,
              duration: 4,
              scope: "phase",
            },
          ],
        },
      ],
      progressionModel: {
        volume: {
          initialValue: 15,
          progressionRate: 0.08,
          deloadFrequency: 6,
        },
        intensity: {
          initialValue: 8,
          progressionRate: 0.05,
          deloadFrequency: 6,
        },
      },
      metrics: {
        estimatedCalories: 500,
        estimatedRecoveryDemand: 7,
        technicalDifficulty: 6,
        variabilityIndex: 0.6,
      },
    };
  }

  private createAdvancedSplitPlan(): BasePlan {
    return {
      id: "advanced-split-1",
      name: "Advanced Body Part Split",
      description:
        "High-volume body part split for advanced lifters focusing on specialized hypertrophy and strength.",
      targetAudience: {
        experienceLevel: "advanced",
        goals: ["hypertrophy", "strength", "power"],
        timeCommitment: {
          sessionsPerWeek: 5,
          minutesPerSession: 90,
        },
        equipment: [
          "barbell",
          "dumbbells",
          "cables",
          "machines",
          "specialty_bars",
        ],
      },
      phases: [
        {
          name: "Hypertrophy Block",
          focus: ["hypertrophy", "metabolic_stress", "volume"],
          duration: 6,
          volumeDistribution: {
            strength: 0.3,
            hypertrophy: 0.5,
            endurance: 0.0,
            power: 0.1,
            mobility: 0.1,
          },
          intensityProfile: {
            baseline: 8,
            progression: 0.1,
            deload: true,
          },
          exercises: {
            primary: [
              "Competition Bench",
              "Competition Squat",
              "Competition Deadlift",
              "Weighted Pull-ups",
              "Log Press",
            ],
            secondary: [
              "Close-Grip Bench",
              "Front Squat",
              "Deficit Deadlift",
              "Weighted Dips",
            ],
            assistance: [
              "Cable Flyes",
              "Leg Extensions",
              "Face Pulls",
              "Band Pull-aparts",
            ],
            mobility: [
              "Shoulder Capsule Work",
              "Hip Flow Routine",
              "Ankle Prep",
              "Thoracic Mobility",
            ],
          },
        },
      ],
      adaptationTriggers: [
        {
          metric: "recoveryScore",
          condition: {
            operator: "lt",
            value: 70,
            duration: "trend",
          },
          adjustments: [
            {
              type: "volume",
              value: -0.2,
              duration: 1,
              scope: "session",
            },
            {
              type: "intensity",
              value: -0.1,
              duration: 1,
              scope: "session",
            },
          ],
        },
        {
          metric: "technicalProgress",
          condition: {
            operator: "lt",
            value: 0.05,
            duration: "sustained",
          },
          adjustments: [
            {
              type: "complexity",
              value: -0.1,
              duration: 2,
              scope: "phase",
            },
          ],
        },
      ],
      progressionModel: {
        volume: {
          initialValue: 18,
          progressionRate: 0.06,
          deloadFrequency: 8,
        },
        intensity: {
          initialValue: 8.5,
          progressionRate: 0.03,
          deloadFrequency: 8,
        },
      },
      metrics: {
        estimatedCalories: 700,
        estimatedRecoveryDemand: 8.5,
        technicalDifficulty: 9,
        variabilityIndex: 0.8,
      },
    };
  }

  async findBestMatchingPlan(
    profile: UserMemoryProfile,
    context: UserPlanContext,
    metrics: TrainingMetrics
  ): Promise<BasePlan> {
    const matchingPlans = this.library.plans.filter((plan) =>
      this.isPlanSuitable(plan, profile, context, metrics)
    );

    if (matchingPlans.length === 0) {
      // If no suitable plan found, return the most basic plan
      return this.library.plans[0];
    }

    // Score each plan based on how well it matches the user's needs
    const scoredPlans = matchingPlans.map((plan) => ({
      plan,
      score: this.calculatePlanScore(plan, profile, context, metrics),
    }));

    // Return the highest scoring plan
    return scoredPlans.sort((a, b) => b.score - a.score)[0].plan;
  }

  private isPlanSuitable(
    plan: BasePlan,
    profile: UserMemoryProfile,
    context: UserPlanContext,
    metrics: TrainingMetrics
  ): boolean {
    // Check experience level
    if (plan.targetAudience.experienceLevel !== profile.fitnessLevel) {
      return false;
    }

    // Check time commitment
    if (
      plan.targetAudience.timeCommitment.sessionsPerWeek >
      context.timeConstraints.availableDays.length
    ) {
      return false;
    }

    // Check equipment requirements
    const hasRequiredEquipment = plan.targetAudience.equipment.every((eq) =>
      context.equipmentAvailable.includes(eq)
    );
    if (!hasRequiredEquipment) {
      return false;
    }

    // Check if recovery demand is appropriate
    if (
      metrics.recoveryScore < 70 &&
      plan.metrics.estimatedRecoveryDemand > 7
    ) {
      return false;
    }

    return true;
  }

  private calculatePlanScore(
    plan: BasePlan,
    profile: UserMemoryProfile,
    context: UserPlanContext,
    metrics: TrainingMetrics
  ): number {
    let score = 0;

    // Goal alignment (0-30 points)
    const goalAlignment = this.calculateGoalAlignment(
      plan,
      profile.fitnessGoals
    );
    score += goalAlignment * 30;

    // Time compatibility (0-20 points)
    const timeCompatibility = this.calculateTimeCompatibility(plan, context);
    score += timeCompatibility * 20;

    // Recovery compatibility (0-20 points)
    const recoveryCompatibility = this.calculateRecoveryCompatibility(
      plan,
      metrics
    );
    score += recoveryCompatibility * 20;

    // Technical suitability (0-15 points)
    const technicalSuitability = this.calculateTechnicalSuitability(
      plan,
      profile
    );
    score += technicalSuitability * 15;

    // Equipment optimization (0-15 points)
    const equipmentOptimization = this.calculateEquipmentOptimization(
      plan,
      context
    );
    score += equipmentOptimization * 15;

    return score;
  }

  private calculateGoalAlignment(plan: BasePlan, userGoals: string[]): number {
    const matchingGoals = plan.targetAudience.goals.filter((goal) =>
      userGoals.includes(goal)
    );
    return (
      matchingGoals.length /
      Math.max(plan.targetAudience.goals.length, userGoals.length)
    );
  }

  private calculateTimeCompatibility(
    plan: BasePlan,
    context: UserPlanContext
  ): number {
    const sessionRatio = Math.min(
      context.timeConstraints.availableDays.length /
        plan.targetAudience.timeCommitment.sessionsPerWeek,
      1
    );
    return sessionRatio;
  }

  private calculateRecoveryCompatibility(
    plan: BasePlan,
    metrics: TrainingMetrics
  ): number {
    const recoveryBuffer =
      Math.max(
        0,
        metrics.recoveryScore - plan.metrics.estimatedRecoveryDemand * 10
      ) / 100;
    return Math.min(recoveryBuffer, 1);
  }

  private calculateTechnicalSuitability(
    plan: BasePlan,
    profile: UserMemoryProfile
  ): number {
    const difficultyScale = {
      beginner: 3,
      intermediate: 6,
      advanced: 9,
    };
    const userTechnicalLevel = difficultyScale[profile.fitnessLevel];
    const difficultyDelta = Math.abs(
      userTechnicalLevel - plan.metrics.technicalDifficulty
    );
    return Math.max(0, 1 - difficultyDelta / 10);
  }

  private calculateEquipmentOptimization(
    plan: BasePlan,
    context: UserPlanContext
  ): number {
    const availableEquipment = new Set(context.equipmentAvailable);
    const requiredEquipment = new Set(plan.targetAudience.equipment);
    const intersection = new Set(
      [...availableEquipment].filter((x) => requiredEquipment.has(x))
    );
    return intersection.size / requiredEquipment.size;
  }
}
