import { z } from "zod";
export interface UserProfile {
    id: string;
    name: string;
    age: number;
    height: number;
    weight: number;
    fitnessGoal: "weight_loss" | "muscle_gain" | "endurance" | "strength" | "general_fitness";
    activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
    workoutFrequency: number;
    workoutDuration: number;
    dietaryRestrictions: string[];
    allergies: string[];
    equipment: string[];
    experience: "beginner" | "intermediate" | "advanced";
    injuries?: string[];
    preferences?: string[];
}
export interface ConversationContext {
    userId: string;
    conversationId: string;
    messageHistory: Array<{
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
    }>;
    currentTopic?: "fitness" | "nutrition" | "motivation" | "general";
    userMood?: number;
    lastWorkout?: {
        date: Date;
        type: string;
        duration: number;
        completed: boolean;
    };
    recentProgress?: {
        weight?: number;
        measurements?: Record<string, number>;
        achievements?: string[];
    };
}
export declare class PromptBuilder {
    /**
     * Build a personalized fitness coaching prompt
     */
    static buildCoachingPrompt(userProfile: UserProfile, context: ConversationContext, userMessage: string): string;
    /**
     * Build a workout generation prompt
     */
    static buildWorkoutPrompt(userProfile: UserProfile, workoutType: "strength" | "cardio" | "hiit" | "flexibility" | "full_body", duration: number, difficulty: "easy" | "moderate" | "hard"): string;
    /**
     * Build a meal planning prompt
     */
    static buildMealPlanPrompt(userProfile: UserProfile, calories: number, macros: {
        protein: number;
        carbs: number;
        fat: number;
    }, mealType: "breakfast" | "lunch" | "dinner" | "snack", preferences?: string[]): string;
    /**
     * Build a progress analysis prompt
     */
    static buildProgressAnalysisPrompt(userProfile: UserProfile, progressData: {
        workouts: Array<{
            date: Date;
            type: string;
            duration: number;
            completed: boolean;
            rating?: number;
        }>;
        nutrition: Array<{
            date: Date;
            calories: number;
            protein: number;
            adherence: boolean;
        }>;
        measurements?: {
            weight: Array<{
                date: Date;
                value: number;
            }>;
            bodyFat?: Array<{
                date: Date;
                value: number;
            }>;
            measurements?: Record<string, Array<{
                date: Date;
                value: number;
            }>>;
        };
        mood: Array<{
            date: Date;
            score: number;
            notes?: string;
        }>;
    }, timeframe: "week" | "month" | "quarter"): string;
    /**
     * Build a motivational prompt based on user's current state
     */
    static buildMotivationalPrompt(userProfile: UserProfile, context: {
        recentStruggle?: string;
        missedWorkouts?: number;
        mood?: number;
        lastAchievement?: string;
    }): string;
}
export declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    age: z.ZodNumber;
    height: z.ZodNumber;
    weight: z.ZodNumber;
    fitnessGoal: z.ZodEnum<["weight_loss", "muscle_gain", "endurance", "strength", "general_fitness"]>;
    activityLevel: z.ZodEnum<["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]>;
    workoutFrequency: z.ZodNumber;
    workoutDuration: z.ZodNumber;
    dietaryRestrictions: z.ZodArray<z.ZodString, "many">;
    allergies: z.ZodArray<z.ZodString, "many">;
    equipment: z.ZodArray<z.ZodString, "many">;
    experience: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    injuries: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preferences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    weight: number;
    id: string;
    name: string;
    fitnessGoal: "strength" | "endurance" | "weight_loss" | "muscle_gain" | "general_fitness";
    activityLevel: "moderately_active" | "sedentary" | "lightly_active" | "very_active" | "extremely_active";
    height: number;
    age: number;
    experience: "beginner" | "intermediate" | "advanced";
    workoutFrequency: number;
    workoutDuration: number;
    dietaryRestrictions: string[];
    allergies: string[];
    equipment: string[];
    preferences?: string[] | undefined;
    injuries?: string[] | undefined;
}, {
    weight: number;
    id: string;
    name: string;
    fitnessGoal: "strength" | "endurance" | "weight_loss" | "muscle_gain" | "general_fitness";
    activityLevel: "moderately_active" | "sedentary" | "lightly_active" | "very_active" | "extremely_active";
    height: number;
    age: number;
    experience: "beginner" | "intermediate" | "advanced";
    workoutFrequency: number;
    workoutDuration: number;
    dietaryRestrictions: string[];
    allergies: string[];
    equipment: string[];
    preferences?: string[] | undefined;
    injuries?: string[] | undefined;
}>;
export declare const ConversationContextSchema: z.ZodObject<{
    userId: z.ZodString;
    conversationId: z.ZodString;
    messageHistory: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodString;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        role: "user" | "assistant";
        content: string;
    }, {
        timestamp: Date;
        role: "user" | "assistant";
        content: string;
    }>, "many">;
    currentTopic: z.ZodOptional<z.ZodEnum<["fitness", "nutrition", "motivation", "general"]>>;
    userMood: z.ZodOptional<z.ZodNumber>;
    lastWorkout: z.ZodOptional<z.ZodObject<{
        date: z.ZodDate;
        type: z.ZodString;
        duration: z.ZodNumber;
        completed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: string;
        date: Date;
        duration: number;
        completed: boolean;
    }, {
        type: string;
        date: Date;
        duration: number;
        completed: boolean;
    }>>;
    recentProgress: z.ZodOptional<z.ZodObject<{
        weight: z.ZodOptional<z.ZodNumber>;
        measurements: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        achievements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        weight?: number | undefined;
        measurements?: Record<string, number> | undefined;
        achievements?: string[] | undefined;
    }, {
        weight?: number | undefined;
        measurements?: Record<string, number> | undefined;
        achievements?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    conversationId: string;
    messageHistory: {
        timestamp: Date;
        role: "user" | "assistant";
        content: string;
    }[];
    currentTopic?: "nutrition" | "motivation" | "fitness" | "general" | undefined;
    userMood?: number | undefined;
    lastWorkout?: {
        type: string;
        date: Date;
        duration: number;
        completed: boolean;
    } | undefined;
    recentProgress?: {
        weight?: number | undefined;
        measurements?: Record<string, number> | undefined;
        achievements?: string[] | undefined;
    } | undefined;
}, {
    userId: string;
    conversationId: string;
    messageHistory: {
        timestamp: Date;
        role: "user" | "assistant";
        content: string;
    }[];
    currentTopic?: "nutrition" | "motivation" | "fitness" | "general" | undefined;
    userMood?: number | undefined;
    lastWorkout?: {
        type: string;
        date: Date;
        duration: number;
        completed: boolean;
    } | undefined;
    recentProgress?: {
        weight?: number | undefined;
        measurements?: Record<string, number> | undefined;
        achievements?: string[] | undefined;
    } | undefined;
}>;
//# sourceMappingURL=prompt-builders.d.ts.map