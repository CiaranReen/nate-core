/**
 * Nate's Proprietary Plan Generation Algorithms
 *
 * This module contains custom algorithms for:
 * - Macro calculations
 * - Progressive overload systems
 * - Volume/intensity scaling
 * - Plan optimization
 *
 * These algorithms are built in-house and not reliant on GPT,
 * making them harder for competitors to replicate.
 */
import { z } from "zod";
export interface UserProfile {
    id: string;
    age: number;
    weight: number;
    height: number;
    bodyFat?: number;
    activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
    fitnessGoal: "weight_loss" | "muscle_gain" | "strength" | "endurance" | "body_recomposition";
    experience: "beginner" | "intermediate" | "advanced";
    trainingHistory: TrainingHistory;
    metabolicProfile: MetabolicProfile;
    preferences: PlanPreferences;
    restrictions: PlanRestrictions;
}
export interface TrainingHistory {
    totalWeeksTraining: number;
    currentMaxes: Record<string, number>;
    recentVolume: number;
    injuryHistory: string[];
    plateauHistory: PlateauData[];
    adherenceRate: number;
}
export interface MetabolicProfile {
    bmr: number;
    tdee: number;
    metabolicFlexibility: number;
    insulinSensitivity: number;
    recoveryRate: number;
}
export interface PlanPreferences {
    trainingDays: number;
    sessionDuration: number;
    preferredSplit: "full_body" | "upper_lower" | "push_pull_legs" | "body_part";
    intensityPreference: "low" | "moderate" | "high" | "variable";
    equipmentAvailable: string[];
    timeAvailability: TimeAvailability;
}
export interface TimeAvailability {
    morningAvailable: boolean;
    afternoonAvailable: boolean;
    eveningAvailable: boolean;
    weekendDifference: boolean;
}
export interface PlanRestrictions {
    injuries: string[];
    allergies: string[];
    dietaryRestrictions: string[];
    timeConstraints: string[];
    equipmentLimitations: string[];
}
export interface PlateauData {
    metric: string;
    duration: number;
    lastBreakthrough: Date;
    strategies: string[];
}
export interface MacroTargets {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    timing: MacroTiming;
    cyclical: CyclicalStrategy;
}
export interface MacroTiming {
    preworkout: {
        carbs: number;
        protein: number;
    };
    postworkout: {
        carbs: number;
        protein: number;
    };
    bedtime: {
        protein: number;
        fat: number;
    };
    distribution: "even" | "backloaded" | "frontloaded" | "workout_focused";
}
export interface CyclicalStrategy {
    enabled: boolean;
    highDays: number;
    lowDays: number;
    cycleDuration: number;
    carbVariation: number;
}
export interface WorkoutPlan {
    id: string;
    name: string;
    duration: number;
    phases: TrainingPhase[];
    progressionStrategy: ProgressionStrategy;
    deloadProtocol: DeloadProtocol;
    adaptiveElements: AdaptiveElement[];
}
export interface TrainingPhase {
    name: string;
    weeks: number;
    focus: "strength" | "hypertrophy" | "power" | "endurance" | "recovery";
    intensity: IntensityZone;
    volume: VolumeMetrics;
    exercises: ExerciseProgression[];
}
export interface IntensityZone {
    percentage1RM: [number, number];
    rpeRange: [number, number];
    restPeriods: number;
    tempoTargets: TempoTargets;
}
export interface TempoTargets {
    eccentric: number;
    pause: number;
    concentric: number;
    rest: number;
}
export interface VolumeMetrics {
    setsPerWeek: number;
    repsPerSet: [number, number];
    frequencyPerWeek: number;
    totalVolume: number;
}
export interface ExerciseProgression {
    exercise: string;
    category: "compound" | "isolation" | "accessory";
    muscleGroups: string[];
    progression: ProgressionMethod;
    volumeProgression: VolumeProgression;
    intensityProgression: IntensityProgression;
    alternatives: string[];
}
export interface ProgressionMethod {
    type: "linear" | "double_progression" | "wave" | "block" | "autoregulation";
    parameters: Record<string, number>;
    autoRegulation: AutoRegulationRules;
}
export interface VolumeProgression {
    startingSets: number;
    setProgression: number;
    maxSets: number;
    deloadReduction: number;
}
export interface IntensityProgression {
    startingIntensity: number;
    weeklyIncrease: number;
    maxIntensity: number;
    plateauHandling: PlateauHandling;
}
export interface AutoRegulationRules {
    rpeBasedAdjustments: boolean;
    velocityBasedAdjustments: boolean;
    biofeedbackIntegration: boolean;
    adaptationTriggers: AdaptationTrigger[];
}
export interface AdaptationTrigger {
    condition: string;
    threshold: number;
    response: string;
    magnitude: number;
}
export interface PlateauHandling {
    detectionWeeks: number;
    strategies: string[];
    intensityDrop: number;
    volumeAdjustment: number;
    exerciseVariation: boolean;
}
export interface ProgressionStrategy {
    type: "linear" | "undulating" | "block" | "conjugate";
    autoProgression: boolean;
    adaptiveThresholds: AdaptiveThreshold[];
    failureProtocols: FailureProtocol[];
}
export interface AdaptiveThreshold {
    metric: string;
    threshold: number;
    adaptation: string;
    duration: number;
}
export interface FailureProtocol {
    failureType: string;
    responseDelay: number;
    adjustments: Adjustment[];
}
export interface Adjustment {
    target: "volume" | "intensity" | "frequency" | "exercise";
    modification: number;
    duration: number;
}
export interface DeloadProtocol {
    frequency: number;
    type: "volume" | "intensity" | "both" | "complete_rest";
    reduction: number;
    duration: number;
    indicators: string[];
}
export interface AdaptiveElement {
    name: string;
    triggerConditions: string[];
    modifications: PlanModification[];
    duration: number;
    priority: "low" | "medium" | "high" | "critical";
}
export interface PlanModification {
    type: "add" | "remove" | "modify" | "replace";
    target: string;
    value: any;
    reasoning: string;
}
export declare class PlanGenerationEngine {
    private metabolicCalculator;
    private progressionEngine;
    private adaptationEngine;
    private optimizationEngine;
    constructor();
    /**
     * Generate comprehensive macro targets using proprietary algorithms
     */
    generateMacroTargets(userProfile: UserProfile): MacroTargets;
    /**
     * Generate adaptive workout plan using progressive overload algorithms
     */
    generateWorkoutPlan(userProfile: UserProfile): WorkoutPlan;
    /**
     * Optimize existing plan based on performance data
     */
    optimizePlan(currentPlan: WorkoutPlan, performanceData: PerformanceData, userProfile: UserProfile): WorkoutPlan;
    /**
     * Generate micro-cycle adjustments based on real-time data
     */
    generateMicroAdjustments(userProfile: UserProfile, recentData: RecentData): MicroAdjustment[];
    private generatePlanId;
    private generatePlanName;
    private calculateOptimalDuration;
}
interface PerformanceData {
}
interface RecentData {
}
interface MicroAdjustment {
    type: string;
    adjustment: number;
    reasoning: string;
}
export declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodString;
    age: z.ZodNumber;
    weight: z.ZodNumber;
    height: z.ZodNumber;
    bodyFat: z.ZodOptional<z.ZodNumber>;
    activityLevel: z.ZodEnum<["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]>;
    fitnessGoal: z.ZodEnum<["weight_loss", "muscle_gain", "strength", "endurance", "body_recomposition"]>;
    experience: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
}, "strip", z.ZodTypeAny, {
    weight: number;
    id: string;
    age: number;
    height: number;
    fitnessGoal: "weight_loss" | "muscle_gain" | "endurance" | "strength" | "body_recomposition";
    activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
    experience: "beginner" | "intermediate" | "advanced";
    bodyFat?: number | undefined;
}, {
    weight: number;
    id: string;
    age: number;
    height: number;
    fitnessGoal: "weight_loss" | "muscle_gain" | "endurance" | "strength" | "body_recomposition";
    activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
    experience: "beginner" | "intermediate" | "advanced";
    bodyFat?: number | undefined;
}>;
export declare const MacroTargetsSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}, {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}>;
export {};
