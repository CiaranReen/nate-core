import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
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
    constructor(url, key) {
        this.client = createClient(url, key);
    }
    // Authentication methods
    async signUp(email, password, userData) {
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: userData,
            },
        });
        if (error)
            throw error;
        return data;
    }
    async signIn(email, password) {
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password,
        });
        if (error)
            throw error;
        return data;
    }
    async signOut() {
        const { error } = await this.client.auth.signOut();
        if (error)
            throw error;
    }
    async getCurrentUser() {
        const { data: { user }, error, } = await this.client.auth.getUser();
        if (error)
            throw error;
        return user;
    }
    // User Profile methods
    async createUserProfile(profileData) {
        const validatedData = UserProfileSchema.parse(profileData);
        const { data, error } = await this.client
            .from("profiles")
            .insert([validatedData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserProfile(userId) {
        const { data, error } = await this.client
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        if (error)
            throw error;
        return data;
    }
    async updateUserProfile(userId, updates) {
        const { data, error } = await this.client
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async checkOnboardingStatus(userId) {
        const { data, error } = await this.client
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", userId)
            .single();
        if (error)
            throw error;
        return data?.onboarding_completed || false;
    }
    // Workout Plan methods
    async createWorkoutPlan(planData) {
        const { data, error } = await this.client
            .from("workout_plans")
            .insert([planData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserWorkoutPlans(userId) {
        const { data, error } = await this.client
            .from("workout_plans")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error)
            throw error;
        return data;
    }
    async getWorkoutPlan(planId) {
        const { data, error } = await this.client
            .from("workout_plans")
            .select("*")
            .eq("id", planId)
            .single();
        if (error)
            throw error;
        return data;
    }
    async updateWorkoutPlan(planId, updates) {
        const { data, error } = await this.client
            .from("workout_plans")
            .update(updates)
            .eq("id", planId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    // Meal Plan methods
    async createMealPlan(planData) {
        const { data, error } = await this.client
            .from("meal_plans")
            .insert([planData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserMealPlans(userId, mealType) {
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
        if (error)
            throw error;
        return data;
    }
    async getMealPlan(planId) {
        const { data, error } = await this.client
            .from("meal_plans")
            .select("*")
            .eq("id", planId)
            .single();
        if (error)
            throw error;
        return data;
    }
    // Conversation methods
    async createConversation(userId, title) {
        const { data, error } = await this.client
            .from("conversations")
            .insert([{ user_id: userId, title }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserConversations(userId) {
        const { data, error } = await this.client
            .from("conversations")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });
        if (error)
            throw error;
        return data;
    }
    async getConversation(conversationId) {
        const { data, error } = await this.client
            .from("conversations")
            .select("*")
            .eq("id", conversationId)
            .single();
        if (error)
            throw error;
        return data;
    }
    // Message methods
    async createMessage(messageData) {
        const { data, error } = await this.client
            .from("messages")
            .insert([messageData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getConversationMessages(conversationId, limit = 50) {
        const { data, error } = await this.client
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true })
            .limit(limit);
        if (error)
            throw error;
        return data;
    }
    async getRecentMessages(userId, limit = 10) {
        const { data, error } = await this.client
            .from("messages")
            .select("*, conversations!inner(*)")
            .eq("conversations.user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit);
        if (error)
            throw error;
        return data;
    }
    // Progress tracking methods
    async createProgressEntry(progressData) {
        const { data, error } = await this.client
            .from("user_progress")
            .insert([progressData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserProgress(userId, startDate, endDate) {
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
        if (error)
            throw error;
        return data;
    }
    async getLatestProgress(userId) {
        const { data, error } = await this.client
            .from("user_progress")
            .select("*")
            .eq("user_id", userId)
            .order("date", { ascending: false })
            .limit(1)
            .single();
        if (error && error.code !== "PGRST116")
            throw error; // PGRST116 = no rows returned
        return data;
    }
    async updateProgressEntry(progressId, updates) {
        const { data, error } = await this.client
            .from("user_progress")
            .update(updates)
            .eq("id", progressId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    // Workout logging methods
    async logWorkout(workoutData) {
        const { data, error } = await this.client
            .from("workouts")
            .insert([workoutData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserWorkouts(userId, limit = 20) {
        const { data, error } = await this.client
            .from("workouts")
            .select("*, workout_plans(*)")
            .eq("user_id", userId)
            .order("started_at", { ascending: false })
            .limit(limit);
        if (error)
            throw error;
        return data;
    }
    // Food logging methods
    async logFood(foodData) {
        const { data, error } = await this.client
            .from("food_logs")
            .insert([foodData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getUserFoodLogs(userId, date) {
        let query = this.client.from("food_logs").select("*").eq("user_id", userId);
        if (date) {
            query = query
                .gte("logged_at", date)
                .lt("logged_at", new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString());
        }
        const { data, error } = await query.order("logged_at", {
            ascending: false,
        });
        if (error)
            throw error;
        return data;
    }
    // Analytics and reporting methods
    async getUserStats(userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const [workouts, foodLogs, progress] = await Promise.all([
            this.getUserWorkouts(userId, 100),
            this.getUserFoodLogs(userId),
            this.getUserProgress(userId, startDate.toISOString().split("T")[0]),
        ]);
        return {
            workouts: workouts?.filter((w) => new Date(w.started_at) >= startDate) || [],
            foodLogs: foodLogs?.filter((f) => new Date(f.logged_at) >= startDate) || [],
            progress: progress || [],
        };
    }
    // Real-time subscriptions
    subscribeToUserMessages(userId, callback) {
        return this.client
            .channel("messages")
            .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `user_id=eq.${userId}`,
        }, (payload) => callback(payload.new))
            .subscribe();
    }
    subscribeToUserProgress(userId, callback) {
        return this.client
            .channel("progress")
            .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "user_progress",
            filter: `user_id=eq.${userId}`,
        }, (payload) => callback(payload.new))
            .subscribe();
    }
    // Utility methods
    async uploadFile(bucket, path, file) {
        const { data, error } = await this.client.storage
            .from(bucket)
            .upload(path, file);
        if (error)
            throw error;
        return data;
    }
    async getFileUrl(bucket, path) {
        const { data } = this.client.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }
    // Batch operations
    async batchCreateMealPlans(mealPlans) {
        const { data, error } = await this.client
            .from("meal_plans")
            .insert(mealPlans)
            .select();
        if (error)
            throw error;
        return data;
    }
    async batchCreateWorkoutPlans(workoutPlans) {
        const { data, error } = await this.client
            .from("workout_plans")
            .insert(workoutPlans)
            .select();
        if (error)
            throw error;
        return data;
    }
    // Helper method to get client for custom queries
    getClient() {
        return this.client;
    }
}
//# sourceMappingURL=supabase.js.map