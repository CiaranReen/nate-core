import { UserMetrics, MacroTargets } from "../fitness/calculations";
export interface Exercise {
    name: string;
    category: "strength" | "cardio" | "flexibility" | "core";
    equipment: string[];
    primaryMuscles: string[];
    secondaryMuscles: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    instructions: string[];
    modifications: {
        easier: string;
        harder: string;
    };
}
export interface WorkoutPlan {
    id: string;
    title: string;
    type: "strength" | "cardio" | "hiit" | "flexibility" | "full_body";
    difficulty: "easy" | "moderate" | "hard";
    duration: number;
    equipment: string[];
    exercises: Array<{
        name: string;
        sets?: number;
        reps?: string;
        duration?: string;
        instructions: string;
    }>;
    estimatedCalories: number;
}
export interface MealPlan {
    id: string;
    title: string;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    prepTime: number;
    cookTime: number;
    servings: number;
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
    };
    ingredients: Array<{
        item: string;
        amount: string;
        unit: string;
    }>;
    instructions: string[];
    tags: string[];
}
export declare class PlanGenerators {
    /**
     * Generate a basic workout plan
     */
    static generateWorkoutPlan(preferences: {
        type: "strength" | "cardio" | "hiit" | "flexibility" | "full_body";
        duration: number;
        equipment: string[];
        difficulty: "easy" | "moderate" | "hard";
    }): WorkoutPlan;
    /**
     * Generate a basic meal plan
     */
    static generateMealPlan(requirements: {
        mealType: "breakfast" | "lunch" | "dinner" | "snack";
        calories: number;
        protein: number;
        dietaryRestrictions: string[];
    }): MealPlan;
    /**
     * Generate weekly workout schedule
     */
    static generateWeeklySchedule(preferences: {
        workoutsPerWeek: number;
        workoutTypes: string[];
        duration: number;
        equipment: string[];
    }): Array<{
        day: string;
        workout?: WorkoutPlan;
        isRestDay: boolean;
    }>;
    /**
     * Generate meal prep plan for the week
     */
    static generateMealPrepPlan(userMetrics: UserMetrics, macroTargets: MacroTargets, preferences: {
        mealsPerDay: number;
        prepDays: string[];
        dietaryRestrictions: string[];
        allergies: string[];
        budget?: "low" | "medium" | "high";
    }): {
        meals: MealPlan[];
        shoppingList: Array<{
            item: string;
            amount: string;
            unit: string;
            category: string;
        }>;
        prepInstructions: string[];
    };
    private static getExercisesForType;
    private static getRecipesForMealType;
    private static selectRecipe;
    private static generateWorkoutTitle;
    private static estimateCalories;
    private static generateShoppingList;
    private static categorizeIngredient;
    private static generatePrepInstructions;
    private static generateId;
}
//# sourceMappingURL=generators.d.ts.map