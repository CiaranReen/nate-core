import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

// Database schema types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age?: number;
  height?: number;
  weight?: number;
  fitness_goal?:
    | "weight_loss"
    | "muscle_gain"
    | "endurance"
    | "strength"
    | "general_fitness";
  activity_level?:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
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
  exercises: any[]; // JSON array of exercises
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
  ingredients: any[]; // JSON array of ingredients
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
  metadata?: any; // JSON metadata
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  body_fat_percentage?: number;
  measurements?: any; // JSON object with measurements
  mood_score?: number;
  energy_level?: number;
  stress_level?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  water_intake_ml?: number;
  notes?: string;
  created_at: string;
}

// Validation schemas
const UserProfileSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  age: z.number().min(13).max(120).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  fitness_goal: z
    .enum([
      "weight_loss",
      "muscle_gain",
      "endurance",
      "strength",
      "general_fitness",
    ])
    .optional(),
  activity_level: z
    .enum([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ])
    .optional(),
  workout_frequency: z.number().min(1).max(7).optional(),
  workout_duration: z.number().min(15).max(180).optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  injuries: z.array(z.string()).optional(),
  onboarding_completed: z.boolean().optional(),
});

export class SupabaseService {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  // Authentication methods
  async signUp(
    email: string,
    password: string,
    userData?: Partial<UserProfile>
  ) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error) throw error;
    return user;
  }

  // User Profile methods
  async createUserProfile(
    profileData: Omit<UserProfile, "id" | "created_at" | "updated_at">
  ) {
    const validatedData = UserProfileSchema.parse(profileData);

    const { data, error } = await this.client
      .from("profiles")
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await this.client
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  async checkOnboardingStatus(userId: string) {
    const { data, error } = await this.client
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.onboarding_completed || false;
  }

  // Workout Plan methods
  async createWorkoutPlan(
    planData: Omit<WorkoutPlan, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await this.client
      .from("workout_plans")
      .insert([planData])
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutPlan;
  }

  async getUserWorkoutPlans(userId: string) {
    const { data, error } = await this.client
      .from("workout_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as WorkoutPlan[];
  }

  async getWorkoutPlan(planId: string) {
    const { data, error } = await this.client
      .from("workout_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (error) throw error;
    return data as WorkoutPlan;
  }

  async updateWorkoutPlan(planId: string, updates: Partial<WorkoutPlan>) {
    const { data, error } = await this.client
      .from("workout_plans")
      .update(updates)
      .eq("id", planId)
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutPlan;
  }

  // Meal Plan methods
  async createMealPlan(
    planData: Omit<MealPlan, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await this.client
      .from("meal_plans")
      .insert([planData])
      .select()
      .single();

    if (error) throw error;
    return data as MealPlan;
  }

  async getUserMealPlans(userId: string, mealType?: string) {
    let query = this.client
      .from("meal_plans")
      .select("*")
      .eq("user_id", userId);

    if (mealType) {
      query = query.eq("meal_type", mealType);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data as MealPlan[];
  }

  async getMealPlan(planId: string) {
    const { data, error } = await this.client
      .from("meal_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (error) throw error;
    return data as MealPlan;
  }

  // Conversation methods
  async createConversation(userId: string, title?: string) {
    const { data, error } = await this.client
      .from("conversations")
      .insert([{ user_id: userId, title }])
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  }

  async getUserConversations(userId: string) {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data as Conversation[];
  }

  async getConversation(conversationId: string) {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (error) throw error;
    return data as Conversation;
  }

  // Message methods
  async createMessage(messageData: Omit<Message, "id" | "created_at">) {
    const { data, error } = await this.client
      .from("messages")
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  }

  async getConversationMessages(conversationId: string, limit: number = 50) {
    const { data, error } = await this.client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as Message[];
  }

  async getRecentMessages(userId: string, limit: number = 10) {
    const { data, error } = await this.client
      .from("messages")
      .select("*, conversations!inner(*)")
      .eq("conversations.user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Message[];
  }

  // Progress tracking methods
  async createProgressEntry(
    progressData: Omit<UserProgress, "id" | "created_at">
  ) {
    const { data, error } = await this.client
      .from("user_progress")
      .insert([progressData])
      .select()
      .single();

    if (error) throw error;
    return data as UserProgress;
  }

  async getUserProgress(userId: string, startDate?: string, endDate?: string) {
    let query = this.client
      .from("user_progress")
      .select("*")
      .eq("user_id", userId);

    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data, error } = await query.order("date", { ascending: false });

    if (error) throw error;
    return data as UserProgress[];
  }

  async getLatestProgress(userId: string) {
    const { data, error } = await this.client
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data as UserProgress | null;
  }

  async updateProgressEntry(
    progressId: string,
    updates: Partial<UserProgress>
  ) {
    const { data, error } = await this.client
      .from("user_progress")
      .update(updates)
      .eq("id", progressId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProgress;
  }

  // Workout logging methods
  async logWorkout(workoutData: {
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
  }) {
    const { data, error } = await this.client
      .from("workouts")
      .insert([workoutData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserWorkouts(userId: string, limit: number = 20) {
    const { data, error } = await this.client
      .from("workouts")
      .select("*, workout_plans(*)")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Food logging methods
  async logFood(foodData: {
    user_id: string;
    meal_plan_id?: string;
    meal_type: "breakfast" | "lunch" | "dinner" | "snack";
    food_items: any[];
    total_calories: number;
    protein_grams: number;
    carbs_grams: number;
    fat_grams: number;
    logged_at: string;
  }) {
    const { data, error } = await this.client
      .from("food_logs")
      .insert([foodData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserFoodLogs(userId: string, date?: string) {
    let query = this.client.from("food_logs").select("*").eq("user_id", userId);

    if (date) {
      query = query
        .gte("logged_at", date)
        .lt(
          "logged_at",
          new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString()
        );
    }

    const { data, error } = await query.order("logged_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  }

  // Analytics and reporting methods
  async getUserStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [workouts, foodLogs, progress] = await Promise.all([
      this.getUserWorkouts(userId, 100),
      this.getUserFoodLogs(userId),
      this.getUserProgress(userId, startDate.toISOString().split("T")[0]),
    ]);

    return {
      workouts:
        workouts?.filter((w) => new Date(w.started_at) >= startDate) || [],
      foodLogs:
        foodLogs?.filter((f) => new Date(f.logged_at) >= startDate) || [],
      progress: progress || [],
    };
  }

  // Real-time subscriptions
  subscribeToUserMessages(
    userId: string,
    callback: (message: Message) => void
  ) {
    return this.client
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  }

  subscribeToUserProgress(
    userId: string,
    callback: (progress: UserProgress) => void
  ) {
    return this.client
      .channel("progress")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as UserProgress)
      )
      .subscribe();
  }

  // Utility methods
  async uploadFile(bucket: string, path: string, file: File | Buffer) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  }

  async getFileUrl(bucket: string, path: string) {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  }

  // Batch operations
  async batchCreateMealPlans(
    mealPlans: Omit<MealPlan, "id" | "created_at" | "updated_at">[]
  ) {
    const { data, error } = await this.client
      .from("meal_plans")
      .insert(mealPlans)
      .select();

    if (error) throw error;
    return data as MealPlan[];
  }

  async batchCreateWorkoutPlans(
    workoutPlans: Omit<WorkoutPlan, "id" | "created_at" | "updated_at">[]
  ) {
    const { data, error } = await this.client
      .from("workout_plans")
      .insert(workoutPlans)
      .select();

    if (error) throw error;
    return data as WorkoutPlan[];
  }

  // Helper method to get client for custom queries
  getClient() {
    return this.client;
  }
}
