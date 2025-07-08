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

// Types for plan generation
export interface UserProfile {
  id: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  bodyFat?: number; // percentage
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  fitnessGoal:
    | "weight_loss"
    | "muscle_gain"
    | "strength"
    | "endurance"
    | "body_recomposition";
  experience: "beginner" | "intermediate" | "advanced";
  trainingHistory: TrainingHistory;
  metabolicProfile: MetabolicProfile;
  preferences: PlanPreferences;
  restrictions: PlanRestrictions;
}

export interface TrainingHistory {
  totalWeeksTraining: number;
  currentMaxes: Record<string, number>; // exercise -> 1RM
  recentVolume: number; // weekly sets
  injuryHistory: string[];
  plateauHistory: PlateauData[];
  adherenceRate: number; // 0-1
}

export interface MetabolicProfile {
  bmr: number; // calculated or measured
  tdee: number; // total daily energy expenditure
  metabolicFlexibility: number; // 1-10 scale
  insulinSensitivity: number; // 1-10 scale
  recoveryRate: number; // 1-10 scale
}

export interface PlanPreferences {
  trainingDays: number; // 1-7
  sessionDuration: number; // minutes
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
  duration: number; // weeks
  lastBreakthrough: Date;
  strategies: string[];
}

export interface MacroTargets {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  timing: MacroTiming;
  cyclical: CyclicalStrategy;
}

export interface MacroTiming {
  preworkout: { carbs: number; protein: number };
  postworkout: { carbs: number; protein: number };
  bedtime: { protein: number; fat: number };
  distribution: "even" | "backloaded" | "frontloaded" | "workout_focused";
}

export interface CyclicalStrategy {
  enabled: boolean;
  highDays: number; // per week
  lowDays: number; // per week
  cycleDuration: number; // weeks
  carbVariation: number; // percentage swing
}

export interface WorkoutPlan {
  id: string;
  name: string;
  duration: number; // weeks
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
  percentage1RM: [number, number]; // range
  rpeRange: [number, number]; // rate of perceived exertion
  restPeriods: number; // seconds
  tempoTargets: TempoTargets;
}

export interface TempoTargets {
  eccentric: number; // seconds
  pause: number; // seconds
  concentric: number; // seconds
  rest: number; // seconds between reps
}

export interface VolumeMetrics {
  setsPerWeek: number;
  repsPerSet: [number, number]; // range
  frequencyPerWeek: number;
  totalVolume: number; // sets x reps x weight
}

export interface ExerciseProgression {
  exercise: string;
  category: "compound" | "isolation" | "accessory";
  muscleGroups: string[];
  progression: ProgressionMethod;
  volumeProgression: VolumeProgression;
  intensityProgression: IntensityProgression;
  alternatives: string[]; // for variety/stagnation
}

export interface ProgressionMethod {
  type: "linear" | "double_progression" | "wave" | "block" | "autoregulation";
  parameters: Record<string, number>;
  autoRegulation: AutoRegulationRules;
}

export interface VolumeProgression {
  startingSets: number;
  setProgression: number; // per week
  maxSets: number;
  deloadReduction: number; // percentage
}

export interface IntensityProgression {
  startingIntensity: number; // %1RM
  weeklyIncrease: number; // %1RM
  maxIntensity: number; // %1RM
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
  intensityDrop: number; // percentage
  volumeAdjustment: number; // percentage
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
  duration: number; // weeks
}

export interface FailureProtocol {
  failureType: string;
  responseDelay: number; // days
  adjustments: Adjustment[];
}

export interface Adjustment {
  target: "volume" | "intensity" | "frequency" | "exercise";
  modification: number; // percentage or absolute
  duration: number; // weeks
}

export interface DeloadProtocol {
  frequency: number; // every X weeks
  type: "volume" | "intensity" | "both" | "complete_rest";
  reduction: number; // percentage
  duration: number; // weeks
  indicators: string[]; // when to trigger early deload
}

export interface AdaptiveElement {
  name: string;
  triggerConditions: string[];
  modifications: PlanModification[];
  duration: number; // days
  priority: "low" | "medium" | "high" | "critical";
}

export interface PlanModification {
  type: "add" | "remove" | "modify" | "replace";
  target: string;
  value: any;
  reasoning: string;
}

export class PlanGenerationEngine {
  private metabolicCalculator: MetabolicCalculator;
  private progressionEngine: ProgressionEngine;
  private adaptationEngine: AdaptationEngine;
  private optimizationEngine: OptimizationEngine;

  constructor() {
    this.metabolicCalculator = new MetabolicCalculator();
    this.progressionEngine = new ProgressionEngine();
    this.adaptationEngine = new AdaptationEngine();
    this.optimizationEngine = new OptimizationEngine();
  }

  /**
   * Generate comprehensive macro targets using proprietary algorithms
   */
  generateMacroTargets(userProfile: UserProfile): MacroTargets {
    // Calculate enhanced TDEE using Nate's proprietary formula
    const tdee = this.metabolicCalculator.calculateEnhancedTDEE(userProfile);

    // Apply goal-specific caloric adjustments
    const calories = this.metabolicCalculator.applyGoalAdjustments(
      tdee,
      userProfile
    );

    // Calculate optimal macro distribution
    const macros = this.metabolicCalculator.calculateOptimalMacros(
      calories,
      userProfile
    );

    // Generate timing strategy
    const timing = this.metabolicCalculator.generateMacroTiming(
      macros,
      userProfile
    );

    // Create cyclical strategy if beneficial
    const cyclical =
      this.metabolicCalculator.createCyclicalStrategy(userProfile);

    return {
      calories,
      ...macros,
      timing,
      cyclical,
    };
  }

  /**
   * Generate adaptive workout plan using progressive overload algorithms
   */
  generateWorkoutPlan(userProfile: UserProfile): WorkoutPlan {
    // Determine optimal training split and volume
    const planStructure =
      this.progressionEngine.determinePlanStructure(userProfile);

    // Create training phases with progressive overload
    const phases = this.progressionEngine.createTrainingPhases(
      userProfile,
      planStructure
    );

    // Design progression strategy
    const progressionStrategy =
      this.progressionEngine.createProgressionStrategy(userProfile);

    // Create deload protocol
    const deloadProtocol =
      this.progressionEngine.createDeloadProtocol(userProfile);

    // Add adaptive elements
    const adaptiveElements =
      this.adaptationEngine.createAdaptiveElements(userProfile);

    return {
      id: this.generatePlanId(),
      name: this.generatePlanName(userProfile),
      duration: this.calculateOptimalDuration(userProfile),
      phases,
      progressionStrategy,
      deloadProtocol,
      adaptiveElements,
    };
  }

  /**
   * Optimize existing plan based on performance data
   */
  optimizePlan(
    currentPlan: WorkoutPlan,
    performanceData: PerformanceData,
    userProfile: UserProfile
  ): WorkoutPlan {
    return this.optimizationEngine.optimizePlan(
      currentPlan,
      performanceData,
      userProfile
    );
  }

  /**
   * Generate micro-cycle adjustments based on real-time data
   */
  generateMicroAdjustments(
    userProfile: UserProfile,
    recentData: RecentData
  ): MicroAdjustment[] {
    return this.adaptationEngine.generateMicroAdjustments(
      userProfile,
      recentData
    );
  }

  // Private helper methods
  private generatePlanId(): string {
    return `nate_plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePlanName(userProfile: UserProfile): string {
    const goal = userProfile.fitnessGoal.replace("_", " ").toUpperCase();
    const experience = userProfile.experience.toUpperCase();
    return `${goal} - ${experience} PROTOCOL`;
  }

  private calculateOptimalDuration(userProfile: UserProfile): number {
    // Proprietary algorithm for optimal plan duration
    const baseDuration = 8; // weeks
    const experienceMultiplier = {
      beginner: 1.5,
      intermediate: 1.0,
      advanced: 0.75,
    };

    return Math.round(
      baseDuration * experienceMultiplier[userProfile.experience]
    );
  }
}

class MetabolicCalculator {
  /**
   * Enhanced TDEE calculation using Nate's proprietary formula
   */
  calculateEnhancedTDEE(userProfile: UserProfile): number {
    // Start with improved Mifflin-St Jeor equation
    const { weight, height, age } = userProfile;
    const baseBMR = 10 * weight + 6.25 * height - 5 * age + 5;

    // Apply body composition adjustments if available
    let adjustedBMR = baseBMR;
    if (userProfile.bodyFat) {
      const leanMass = weight * (1 - userProfile.bodyFat / 100);
      adjustedBMR = 22 * leanMass + 500; // Katch-McArdle formula
    }

    // Enhanced activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    // Apply metabolic flexibility adjustments
    const flexibilityBonus =
      userProfile.metabolicProfile.metabolicFlexibility * 0.02;
    const finalMultiplier =
      activityMultipliers[userProfile.activityLevel] * (1 + flexibilityBonus);

    return Math.round(adjustedBMR * finalMultiplier);
  }

  /**
   * Apply goal-specific caloric adjustments
   */
  applyGoalAdjustments(tdee: number, userProfile: UserProfile): number {
    const goalAdjustments = {
      weight_loss: -500,
      muscle_gain: 300,
      strength: 100,
      endurance: 200,
      body_recomposition: -200,
    };

    let baseAdjustment = goalAdjustments[userProfile.fitnessGoal];

    // Adjust based on experience and adherence
    if (userProfile.experience === "beginner") {
      baseAdjustment *= 0.8; // More conservative for beginners
    }

    if (userProfile.trainingHistory.adherenceRate < 0.7) {
      baseAdjustment *= 0.7; // Less aggressive if poor adherence
    }

    return Math.round(tdee + baseAdjustment);
  }

  /**
   * Calculate optimal macro distribution
   */
  calculateOptimalMacros(
    calories: number,
    userProfile: UserProfile
  ): { protein: number; carbs: number; fat: number; fiber: number } {
    const { weight, fitnessGoal, activityLevel } = userProfile;

    // Protein calculation (proprietary formula)
    let proteinPerKg = this.calculateOptimalProtein(userProfile);
    const protein = Math.round(weight * proteinPerKg);
    const proteinCalories = protein * 4;

    // Fat calculation (minimum 0.8g/kg, adjusted for goals)
    const fatPerKg = this.calculateOptimalFat(userProfile);
    const fat = Math.round(weight * fatPerKg);
    const fatCalories = fat * 9;

    // Carbs fill remaining calories
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.round(Math.max(50, remainingCalories / 4)); // Minimum 50g carbs

    // Fiber recommendation
    const fiber = Math.round((calories / 1000) * 14); // 14g per 1000 calories

    return { protein, carbs, fat, fiber };
  }

  /**
   * Generate macro timing strategy
   */
  generateMacroTiming(
    macros: { protein: number; carbs: number; fat: number },
    userProfile: UserProfile
  ): MacroTiming {
    const workoutTiming = this.determineWorkoutTiming(userProfile);

    return {
      preworkout: {
        carbs: Math.round(macros.carbs * 0.3),
        protein: Math.round(macros.protein * 0.2),
      },
      postworkout: {
        carbs: Math.round(macros.carbs * 0.4),
        protein: Math.round(macros.protein * 0.3),
      },
      bedtime: {
        protein: Math.round(macros.protein * 0.25),
        fat: Math.round(macros.fat * 0.3),
      },
      distribution:
        workoutTiming === "morning" ? "frontloaded" : "workout_focused",
    };
  }

  /**
   * Create cyclical strategy for advanced users
   */
  createCyclicalStrategy(userProfile: UserProfile): CyclicalStrategy {
    const shouldUseCyclical =
      userProfile.experience === "advanced" &&
      userProfile.fitnessGoal === "body_recomposition" &&
      userProfile.trainingHistory.adherenceRate > 0.8;

    if (!shouldUseCyclical) {
      return {
        enabled: false,
        highDays: 0,
        lowDays: 0,
        cycleDuration: 0,
        carbVariation: 0,
      };
    }

    return {
      enabled: true,
      highDays: userProfile.preferences.trainingDays,
      lowDays: 7 - userProfile.preferences.trainingDays,
      cycleDuration: 2, // 2-week cycles
      carbVariation: 40, // 40% variation between high and low days
    };
  }

  private calculateOptimalProtein(userProfile: UserProfile): number {
    const baseProtein = 1.6; // g/kg

    // Adjust for goals
    const goalMultipliers = {
      weight_loss: 1.4,
      muscle_gain: 1.2,
      strength: 1.1,
      endurance: 1.0,
      body_recomposition: 1.3,
    };

    // Adjust for age (sarcopenia prevention)
    const ageMultiplier = userProfile.age > 40 ? 1.1 : 1.0;

    return (
      baseProtein * goalMultipliers[userProfile.fitnessGoal] * ageMultiplier
    );
  }

  private calculateOptimalFat(userProfile: UserProfile): number {
    const baseFat = 1.0; // g/kg

    // Adjust for insulin sensitivity
    const insulinAdjustment =
      (userProfile.metabolicProfile.insulinSensitivity - 5) * 0.1;

    return Math.max(0.8, baseFat + insulinAdjustment);
  }

  private determineWorkoutTiming(userProfile: UserProfile): string {
    if (userProfile.preferences.timeAvailability.morningAvailable)
      return "morning";
    if (userProfile.preferences.timeAvailability.afternoonAvailable)
      return "afternoon";
    return "evening";
  }
}

class ProgressionEngine {
  determinePlanStructure(userProfile: UserProfile): PlanStructure {
    // Implementation for determining optimal plan structure
    const { trainingDays, preferredSplit } = userProfile.preferences;
    const { experience } = userProfile;

    return {
      split: this.selectOptimalSplit(trainingDays, experience),
      frequency: this.calculateOptimalFrequency(userProfile),
      volume: this.calculateStartingVolume(userProfile),
    };
  }

  createTrainingPhases(
    userProfile: UserProfile,
    structure: PlanStructure
  ): TrainingPhase[] {
    // Implementation for creating progressive training phases
    return [];
  }

  createProgressionStrategy(userProfile: UserProfile): ProgressionStrategy {
    // Implementation for progression strategy
    return {
      type: "linear",
      autoProgression: true,
      adaptiveThresholds: [],
      failureProtocols: [],
    };
  }

  createDeloadProtocol(userProfile: UserProfile): DeloadProtocol {
    // Implementation for deload protocol
    return {
      frequency: 4,
      type: "volume",
      reduction: 40,
      duration: 1,
      indicators: ["fatigue", "strength_loss", "motivation_drop"],
    };
  }

  private selectOptimalSplit(trainingDays: number, experience: string): string {
    if (trainingDays <= 2) return "full_body";
    if (trainingDays <= 4) return "upper_lower";
    return "push_pull_legs";
  }

  private calculateOptimalFrequency(userProfile: UserProfile): number {
    // Proprietary frequency calculation
    return userProfile.preferences.trainingDays;
  }

  private calculateStartingVolume(userProfile: UserProfile): number {
    // Proprietary volume calculation
    const baseVolume = {
      beginner: 10,
      intermediate: 16,
      advanced: 20,
    };

    return baseVolume[userProfile.experience];
  }
}

class AdaptationEngine {
  createAdaptiveElements(userProfile: UserProfile): AdaptiveElement[] {
    // Implementation for adaptive elements
    return [];
  }

  generateMicroAdjustments(
    userProfile: UserProfile,
    recentData: RecentData
  ): MicroAdjustment[] {
    // Implementation for micro-adjustments
    return [];
  }
}

class OptimizationEngine {
  optimizePlan(
    currentPlan: WorkoutPlan,
    performanceData: PerformanceData,
    userProfile: UserProfile
  ): WorkoutPlan {
    // Implementation for plan optimization
    return currentPlan;
  }
}

// Supporting interfaces
interface PlanStructure {
  split: string;
  frequency: number;
  volume: number;
}

interface PerformanceData {
  // Performance tracking data
}

interface RecentData {
  // Recent user data
}

interface MicroAdjustment {
  type: string;
  adjustment: number;
  reasoning: string;
}

// Export validation schemas
export const UserProfileSchema = z.object({
  id: z.string(),
  age: z.number().min(13).max(120),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
  bodyFat: z.number().min(3).max(50).optional(),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  fitnessGoal: z.enum([
    "weight_loss",
    "muscle_gain",
    "strength",
    "endurance",
    "body_recomposition",
  ]),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
});

export const MacroTargetsSchema = z.object({
  calories: z.number().min(800).max(5000),
  protein: z.number().min(50).max(400),
  carbs: z.number().min(50).max(800),
  fat: z.number().min(20).max(200),
  fiber: z.number().min(20).max(80),
});
