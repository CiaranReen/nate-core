import type { TrainingMetrics } from "./PlanLibrary";
export interface PlanTemplate {
    id: string;
    name: string;
    type: "beginner" | "intermediate" | "advanced";
    goal: "fat_loss" | "muscle_gain" | "strength" | "endurance" | "general_fitness";
    frequency: number;
    split: "full_body" | "upper_lower" | "push_pull_legs" | "body_part";
    baseStructure: {
        phases: PlanPhase[];
        progressions: PlanProgression[];
        adaptiveTriggers: AdaptiveTrigger[];
    };
    metadata: {
        lastUpdated: string;
        version: string;
        targetAudience: string[];
        equipmentNeeded: string[];
    };
}
export interface PlanPhase {
    name: string;
    duration: number;
    focus: string;
    workouts: WorkoutTemplate[];
}
export interface WorkoutTemplate {
    id: string;
    type: string;
    exercises: ExerciseTemplate[];
    duration: number;
    intensity: number;
    recoveryTime: number;
}
export interface ExerciseTemplate {
    name: string;
    sets: number;
    repsRange: [number, number];
    restInterval: number;
    intensity: number;
    alternatives: string[];
}
export interface PlanProgression {
    metric: string;
    trigger: string;
    adjustment: {
        type: "volume" | "intensity" | "frequency";
        value: number;
    };
}
export interface AdaptiveTrigger {
    metric: string;
    condition: string;
    adjustment: {
        type: string;
        value: number;
        duration: number;
    };
}
export interface PlanGenerationCostMeta {
    estimatedComputeUnits: number;
    estimatedAITokens: number;
    estimatedStorageCost: number;
    adaptationCosts: {
        tokensPerAdaptation: number;
        expectedAdaptationsPerWeek: number;
    };
}
export interface UserPlanContext {
    recentHRV?: number;
    recentSleepScore?: number;
    recentRecoveryScore?: number;
    equipmentAvailable: string[];
    timeConstraints: {
        maxWorkoutDuration: number;
        preferredTimeOfDay: string;
        availableDays: string[];
    };
    pricingTier: "basic" | "premium";
}
export interface PlanDiffResult {
    similarityScore: number;
    reusableComponents: {
        phases: string[];
        workouts: string[];
        exercises: string[];
    };
    recommendedChanges: {
        type: "modify" | "add" | "remove";
        component: string;
        reason: string;
    }[];
}
export interface UserMemoryProfile {
    userId: string;
    workoutHistory: WorkoutHistoryEntry[];
    fitnessGoals: string[];
    fitnessLevel: "beginner" | "intermediate" | "advanced";
    personalityProfile: {
        motivationType: "achievement" | "social" | "health" | "mixed";
        preferredFeedbackStyle: "direct" | "supportive" | "balanced";
        consistencyLevel: "low" | "moderate" | "high";
        adaptabilityScore: number;
    };
    behaviorPatterns: {
        workoutPreferences: {
            preferredExercises?: string[];
            avoidedExercises?: string[];
            timeConstraints?: {
                maxDuration: number;
                preferredTime: string[];
            };
        };
        recoveryProfile: {
            optimalFrequency: number;
            recoverySpeed: "slow" | "moderate" | "fast";
        };
    };
}
export interface WorkoutHistoryEntry {
    date: string;
    type: string;
    duration: number;
    intensity: number;
    completed: boolean;
}
export interface PlanAdaptation {
    type: "volume" | "intensity" | "exercise_selection" | "frequency" | "progression";
    reason: string;
    metrics: Partial<TrainingMetrics>;
    changes: {
        target: string;
        from: any;
        to: any;
    }[];
    confidence: number;
}
export interface PlanGenerationConfig {
    useCache: boolean;
    includeDiff: boolean;
    generateVisuals: boolean;
    calculateCosts: boolean;
    optimizationLevel: "speed" | "quality" | "balanced";
    maxTokens?: number;
    temperature?: number;
}
export interface PlanGenerationResult {
    plan: {
        id: string;
        version: number;
        createdAt: string;
        validUntil: string;
        data: any;
    };
    metrics: {
        generationTime: number;
        tokenUsage: number;
        estimatedCost: number;
        cacheHit: boolean;
        optimizationScore: number;
    };
    adaptations?: PlanAdaptation[];
    visualizations?: {
        type: string;
        data: any;
    }[];
}
