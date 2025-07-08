import { SupabaseClient } from "@supabase/supabase-js";
export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    age?: number;
    height?: number;
    weight?: number;
    fitness_goal?: "weight_loss" | "muscle_gain" | "endurance" | "strength" | "general_fitness";
    activity_level?: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
    workout_frequency?: number;
    workout_duration?: number;
    dietary_restrictions?: string[];
    allergies?: string[];
    equipment?: string[];
    experience?: "beginner" | "intermediate" | "advanced";
    injuries?: string[];
    onboarding_completed?: boolean;
    created_at: string;
    updated_at: string;
}
export interface WorkoutPlan {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    difficulty: "easy" | "moderate" | "hard";
    duration_minutes: number;
    workout_type: "strength" | "cardio" | "hiit" | "flexibility" | "full_body";
    equipment_needed: string[];
    exercises: any[];
    created_at: string;
    updated_at: string;
}
export interface MealPlan {
    id: string;
    user_id: string;
    title: string;
    meal_type: "breakfast" | "lunch" | "dinner" | "snack";
    calories: number;
    protein_grams: number;
    carbs_grams: number;
    fat_grams: number;
    ingredients: any[];
    instructions: string[];
    prep_time_minutes: number;
    cook_time_minutes?: number;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    created_at: string;
    updated_at: string;
}
export interface Conversation {
    id: string;
    user_id: string;
    title?: string;
    created_at: string;
    updated_at: string;
}
export interface Message {
    id: string;
    conversation_id: string;
    user_id: string;
    sender: "user" | "ai";
    content: string;
    metadata?: any;
    created_at: string;
}
export interface UserProgress {
    id: string;
    user_id: string;
    date: string;
    weight?: number;
    body_fat_percentage?: number;
    measurements?: any;
    mood_score?: number;
    energy_level?: number;
    stress_level?: number;
    sleep_hours?: number;
    sleep_quality?: number;
    water_intake_ml?: number;
    notes?: string;
    created_at: string;
}
export declare class SupabaseService {
    private client;
    constructor(url: string, key: string);
    signUp(email: string, password: string, userData?: Partial<UserProfile>): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    signIn(email: string, password: string): Promise<{
        user: import("@supabase/supabase-js").AuthUser;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    }>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<import("@supabase/supabase-js").AuthUser | null>;
    createUserProfile(profileData: Omit<UserProfile, "id" | "created_at" | "updated_at">): Promise<UserProfile>;
    getUserProfile(userId: string): Promise<UserProfile>;
    updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
    checkOnboardingStatus(userId: string): Promise<any>;
    createWorkoutPlan(planData: Omit<WorkoutPlan, "id" | "created_at" | "updated_at">): Promise<WorkoutPlan>;
    getUserWorkoutPlans(userId: string): Promise<WorkoutPlan[]>;
    getWorkoutPlan(planId: string): Promise<WorkoutPlan>;
    updateWorkoutPlan(planId: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan>;
    createMealPlan(planData: Omit<MealPlan, "id" | "created_at" | "updated_at">): Promise<MealPlan>;
    getUserMealPlans(userId: string, mealType?: string): Promise<MealPlan[]>;
    getMealPlan(planId: string): Promise<MealPlan>;
    createConversation(userId: string, title?: string): Promise<Conversation>;
    getUserConversations(userId: string): Promise<Conversation[]>;
    getConversation(conversationId: string): Promise<Conversation>;
    createMessage(messageData: Omit<Message, "id" | "created_at">): Promise<Message>;
    getConversationMessages(conversationId: string, limit?: number): Promise<Message[]>;
    getRecentMessages(userId: string, limit?: number): Promise<Message[]>;
    createProgressEntry(progressData: Omit<UserProgress, "id" | "created_at">): Promise<UserProgress>;
    getUserProgress(userId: string, startDate?: string, endDate?: string): Promise<UserProgress[]>;
    getLatestProgress(userId: string): Promise<UserProgress | null>;
    updateProgressEntry(progressId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
    logWorkout(workoutData: {
        user_id: string;
        workout_plan_id?: string;
        duration_minutes: number;
        calories_burned?: number;
        exercises_completed?: number;
        completion_percentage: number;
        difficulty?: number;
        user_rating?: number;
        notes?: string;
        started_at: string;
        completed_at?: string;
    }): Promise<any>;
    getUserWorkouts(userId: string, limit?: number): Promise<any[]>;
    logFood(foodData: {
        user_id: string;
        meal_plan_id?: string;
        meal_type: "breakfast" | "lunch" | "dinner" | "snack";
        food_items: any[];
        total_calories: number;
        protein_grams: number;
        carbs_grams: number;
        fat_grams: number;
        logged_at: string;
    }): Promise<any>;
    getUserFoodLogs(userId: string, date?: string): Promise<any[]>;
    getUserStats(userId: string, days?: number): Promise<{
        workouts: any[];
        foodLogs: any[];
        progress: UserProgress[];
    }>;
    subscribeToUserMessages(userId: string, callback: (message: Message) => void): import("@supabase/supabase-js").RealtimeChannel;
    subscribeToUserProgress(userId: string, callback: (progress: UserProgress) => void): import("@supabase/supabase-js").RealtimeChannel;
    uploadFile(bucket: string, path: string, file: File | Buffer): Promise<{
        id: string;
        path: string;
        fullPath: string;
    }>;
    getFileUrl(bucket: string, path: string): Promise<string>;
    batchCreateMealPlans(mealPlans: Omit<MealPlan, "id" | "created_at" | "updated_at">[]): Promise<MealPlan[]>;
    batchCreateWorkoutPlans(workoutPlans: Omit<WorkoutPlan, "id" | "created_at" | "updated_at">[]): Promise<WorkoutPlan[]>;
    getClient(): SupabaseClient<any, "public", any>;
}
//# sourceMappingURL=supabase.d.ts.map