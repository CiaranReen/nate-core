import { PlanTemplate } from "./PlanTemplates";

export interface TrainingMetrics {
  // Adherence & Consistency
  weeklyAdherence: number; // 0-1
  sessionCompletionRate: number; // 0-1
  averageRPE: number; // 1-10
  volumeCompletion: number; // 0-1

  // Recovery & Readiness
  recoveryScore: number; // 0-100
  sleepQuality: number; // 0-100
  hrvTrend: number; // -1 to 1 (declining to improving)
  stressTrend: number; // -1 to 1

  // Performance & Progress
  strengthProgress: number; // -1 to 1
  enduranceProgress: number; // -1 to 1
  mobilityProgress: number; // -1 to 1
  technicalProgress: number; // -1 to 1

  // Health & Wellness
  energyLevels: number; // 1-10
  moodTrend: number; // -1 to 1
  soreness: number; // 1-10
  injuryRisk: number; // 0-1

  // Metabolic & Body Composition
  metabolicFlexibility: number; // 0-1
  bodyCompositionTrend: number; // -1 to 1
  nutritionAdherence: number; // 0-1
  hydrationStatus: number; // 0-1
}

export interface AdaptationTrigger {
  metric: keyof TrainingMetrics;
  condition: {
    operator: "lt" | "gt" | "eq" | "lte" | "gte";
    value: number;
    duration: "immediate" | "trend" | "sustained"; // How long the condition must be met
  };
  adjustments: PlanAdjustment[];
}

export interface PlanAdjustment {
  type: "volume" | "intensity" | "frequency" | "rest" | "complexity";
  value: number; // Percentage change (-1 to 1)
  duration: number; // How many sessions to apply this for
  scope: "session" | "phase" | "plan";
}

export interface TrainingPhase {
  name: string;
  focus: string[];
  duration: number; // In weeks
  volumeDistribution: {
    strength: number; // 0-1
    hypertrophy: number;
    endurance: number;
    power: number;
    mobility: number;
  };
  intensityProfile: {
    baseline: number; // 1-10
    progression: number; // Rate of increase per week
    deload: boolean;
  };
  exercises: {
    primary: string[];
    secondary: string[];
    assistance: string[];
    mobility: string[];
  };
}

export interface BasePlan {
  id: string;
  name: string;
  description: string;
  targetAudience: {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    goals: string[];
    timeCommitment: {
      sessionsPerWeek: number;
      minutesPerSession: number;
    };
    equipment: string[];
  };
  phases: TrainingPhase[];
  adaptationTriggers: AdaptationTrigger[];
  progressionModel: {
    volume: {
      initialValue: number;
      progressionRate: number;
      deloadFrequency: number;
    };
    intensity: {
      initialValue: number;
      progressionRate: number;
      deloadFrequency: number;
    };
  };
  metrics: {
    estimatedCalories: number;
    estimatedRecoveryDemand: number;
    technicalDifficulty: number; // 1-10
    variabilityIndex: number; // 0-1, how much the plan varies
  };
}

export interface PlanLibrary {
  version: string;
  lastUpdated: string;
  plans: BasePlan[];
  metadata: {
    totalPlans: number;
    categories: string[];
    validationMetrics: {
      simulatedProfiles: number;
      successRate: number;
      averageAdherence: number;
      injuryRisk: number;
    };
  };
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  type: "beginner" | "intermediate" | "advanced";
  goal:
    | "fat_loss"
    | "muscle_gain"
    | "strength"
    | "endurance"
    | "general_fitness";
  frequency: number;
  duration: number;
  equipment: string[];
  phases: PlanPhase[];
  metadata: {
    estimatedCalories: number;
    primaryMuscleGroups: string[];
    secondaryMuscleGroups: string[];
    skillRequirements: string[];
    prerequisites: string[];
    progressionPath: string[];
  };
}

export interface PlanPhase {
  name: string;
  duration: number;
  description: string;
  workouts: Workout[];
  progressionCriteria: {
    type: "time" | "performance" | "mastery";
    threshold: number;
    metric: string;
  };
}

export interface Workout {
  name: string;
  type: "strength" | "cardio" | "mobility" | "recovery";
  duration: number;
  exercises: Exercise[];
  warmup?: Exercise[];
  cooldown?: Exercise[];
  intensity: {
    targetRPE: number;
    targetHeartRate?: {
      min: number;
      max: number;
    };
  };
}

export interface Exercise {
  name: string;
  type: "compound" | "isolation" | "cardio" | "mobility";
  equipment: string[];
  sets: number;
  reps?: number;
  duration?: number;
  restPeriod: number;
  tempo?: string;
  notes?: string;
  technique: {
    cues: string[];
    commonErrors: string[];
    modifications: {
      easier: string[];
      harder: string[];
    };
  };
  progressions: {
    previous: string[];
    next: string[];
  };
}
