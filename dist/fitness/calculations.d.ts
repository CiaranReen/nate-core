/**
 * Fitness Calculations and Formulas
 * Core utilities for fitness and nutrition calculations
 */
export interface UserMetrics {
    age: number;
    height: number;
    weight: number;
    gender: "male" | "female";
    activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
    fitnessGoal: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "strength";
}
export interface MacroTargets {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}
export interface BodyComposition {
    bmi: number;
    bmr: number;
    tdee: number;
    bodyFatPercentage?: number;
    leanBodyMass?: number;
    idealWeight?: {
        min: number;
        max: number;
    };
}
export declare class FitnessCalculations {
    /**
     * Calculate BMI (Body Mass Index)
     */
    static calculateBMI(weight: number, height: number): number;
    /**
     * Calculate BMR using Mifflin-St Jeor Equation
     */
    static calculateBMR(weight: number, height: number, age: number, gender: "male" | "female"): number;
    /**
     * Calculate TDEE (Total Daily Energy Expenditure)
     */
    static calculateTDEE(bmr: number, activityLevel: UserMetrics["activityLevel"]): number;
    /**
     * Calculate ideal weight range using BMI
     */
    static calculateIdealWeight(height: number): {
        min: number;
        max: number;
    };
    /**
     * Calculate body fat percentage using Navy Method
     */
    static calculateBodyFatNavy(gender: "male" | "female", height: number, // cm
    waist: number, // cm
    neck: number, // cm
    hip?: number): number;
    /**
     * Calculate lean body mass
     */
    static calculateLeanBodyMass(weight: number, bodyFatPercentage: number): number;
    /**
     * Get comprehensive body composition analysis
     */
    static getBodyComposition(metrics: UserMetrics, measurements?: {
        waist?: number;
        neck?: number;
        hip?: number;
    }): BodyComposition;
    /**
     * Calculate calorie target based on goal
     */
    static calculateCalorieTarget(tdee: number, goal: UserMetrics["fitnessGoal"]): number;
    /**
     * Calculate macro targets
     */
    static calculateMacroTargets(calories: number, weight: number, goal: UserMetrics["fitnessGoal"], activityLevel: UserMetrics["activityLevel"]): MacroTargets;
    /**
     * Get protein target based on goal and activity level
     */
    private static getProteinTarget;
    /**
     * Calculate one-rep max using Epley formula
     */
    static calculateOneRepMax(weight: number, reps: number): number;
    /**
     * Calculate training weight for specific rep range
     */
    static calculateTrainingWeight(oneRepMax: number, targetReps: number): number;
    /**
     * Calculate calories burned during exercise
     */
    static calculateCaloriesBurned(weight: number, duration: number, // minutes
    activityMET: number): number;
    /**
     * Get MET values for common activities
     */
    static getActivityMET(activity: string): number;
    /**
     * Calculate workout volume (sets × reps × weight)
     */
    static calculateWorkoutVolume(exercises: Array<{
        sets: number;
        reps: number;
        weight: number;
    }>): number;
    /**
     * Calculate progressive overload recommendations
     */
    static calculateProgressiveOverload(currentWeight: number, currentReps: number, targetReps: number, progressionType: "linear" | "double_progression" | "percentage"): {
        newWeight: number;
        newReps: number;
        recommendation: string;
    };
    /**
     * Calculate recovery time based on workout intensity
     */
    static calculateRecoveryTime(workoutType: "strength" | "cardio" | "hiit" | "flexibility", intensity: "low" | "moderate" | "high", duration: number): {
        recommendedRest: number;
        nextWorkoutType: string[];
    };
    /**
     * Calculate hydration needs
     */
    static calculateHydrationNeeds(weight: number, activityLevel: UserMetrics["activityLevel"], climate?: "temperate" | "hot" | "cold"): {
        dailyWater: number;
        preWorkout: number;
        duringWorkout: number;
        postWorkout: number;
    };
}
/**
 * Nutrition-specific calculations
 */
export declare class NutritionCalculations {
    /**
     * Calculate meal timing for optimal performance
     */
    static calculateMealTiming(workoutTime: string, // HH:MM format
    goal: "performance" | "fat_loss" | "muscle_gain"): {
        preWorkout: {
            time: string;
            calories: number;
            macros: string;
        };
        postWorkout: {
            time: string;
            calories: number;
            macros: string;
        };
        recommendations: string[];
    };
    /**
     * Calculate micronutrient needs
     */
    static calculateMicronutrients(calories: number, age: number, gender: "male" | "female", activityLevel: UserMetrics["activityLevel"]): Record<string, {
        amount: number;
        unit: string;
        sources: string[];
    }>;
}
//# sourceMappingURL=calculations.d.ts.map