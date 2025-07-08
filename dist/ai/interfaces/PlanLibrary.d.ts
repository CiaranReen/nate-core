export interface TrainingMetrics {
    weeklyAdherence: number;
    sessionCompletionRate: number;
    averageRPE: number;
    volumeCompletion: number;
    recoveryScore: number;
    sleepQuality: number;
    hrvTrend: number;
    stressTrend: number;
    strengthProgress: number;
    enduranceProgress: number;
    mobilityProgress: number;
    technicalProgress: number;
    energyLevels: number;
    moodTrend: number;
    soreness: number;
    injuryRisk: number;
    metabolicFlexibility: number;
    bodyCompositionTrend: number;
    nutritionAdherence: number;
    hydrationStatus: number;
}
export interface AdaptationTrigger {
    metric: keyof TrainingMetrics;
    condition: {
        operator: "lt" | "gt" | "eq" | "lte" | "gte";
        value: number;
        duration: "immediate" | "trend" | "sustained";
    };
    adjustments: PlanAdjustment[];
}
export interface PlanAdjustment {
    type: "volume" | "intensity" | "frequency" | "rest" | "complexity";
    value: number;
    duration: number;
    scope: "session" | "phase" | "plan";
}
export interface TrainingPhase {
    name: string;
    focus: string[];
    duration: number;
    volumeDistribution: {
        strength: number;
        hypertrophy: number;
        endurance: number;
        power: number;
        mobility: number;
    };
    intensityProfile: {
        baseline: number;
        progression: number;
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
        technicalDifficulty: number;
        variabilityIndex: number;
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
    goal: "fat_loss" | "muscle_gain" | "strength" | "endurance" | "general_fitness";
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
