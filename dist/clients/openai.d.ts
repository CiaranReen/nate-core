import { UserProfile, ConversationContext } from "../ai/prompt-builders";
export type { UserProfile as OpenAIUserProfile, ConversationContext as OpenAIConversationContext, };
import { GPTMessage } from "../ai/context-formatter";
export interface OpenAIConfig {
    apiKey: string;
    organization?: string;
    baseURL?: string;
    defaultModel?: string;
    maxTokens?: number;
    temperature?: number;
}
export interface ChatResponse {
    message: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason: string;
    conversationId: string;
}
export interface WorkoutGenerationRequest {
    userProfile: UserProfile;
    workoutType: "strength" | "cardio" | "hiit" | "flexibility" | "full_body";
    duration: number;
    difficulty: "easy" | "moderate" | "hard";
    equipment?: string[];
    focus?: string[];
}
export interface MealPlanRequest {
    userProfile: UserProfile;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    preferences?: string[];
    restrictions?: string[];
}
export declare class OpenAIService {
    private client;
    private config;
    constructor(config: OpenAIConfig);
    /**
     * Generate a coaching response for user chat
     */
    generateResponse(messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>, options?: {
        model?: string;
        maxTokens?: number;
        temperature?: number;
    }): Promise<ChatResponse>;
    /**
     * Generate a personalized workout plan
     */
    generateWorkoutPlan(request: WorkoutGenerationRequest): Promise<any>;
    /**
     * Generate a personalized meal plan
     */
    generateMealPlan(request: MealPlanRequest): Promise<any>;
    /**
     * Analyze user progress and provide insights
     */
    analyzeProgress(userProfile: UserProfile, progressData: any, timeframe: "week" | "month" | "quarter"): Promise<any>;
    /**
     * Generate motivational content
     */
    generateMotivation(userProfile: UserProfile, context: {
        recentStruggle?: string;
        missedWorkouts?: number;
        mood?: number;
        lastAchievement?: string;
    }): Promise<string>;
    /**
     * Generate exercise alternatives based on equipment/injuries
     */
    generateExerciseAlternatives(originalExercise: string, constraints: {
        equipment?: string[];
        injuries?: string[];
        difficulty?: "easier" | "harder";
        targetMuscles?: string[];
    }): Promise<string[]>;
    /**
     * Summarize conversation for long-term memory
     */
    summarizeConversation(messages: GPTMessage[], userProfile: UserProfile, timeframe: "session" | "day" | "week"): Promise<string>;
    /**
     * Generate content variations (for A/B testing)
     */
    generateContentVariations(content: string, type: "motivational" | "educational" | "instructional", count?: number): Promise<string[]>;
    /**
     * Validate and improve user-generated content
     */
    validateUserContent(content: string, type: "goal" | "preference" | "feedback" | "question"): Promise<{
        isValid: boolean;
        cleanedContent: string;
        suggestions?: string[];
        concerns?: string[];
    }>;
    /**
     * Estimate token count for text
     */
    estimateTokens(text: string): number;
    /**
     * Check if content would exceed token limits
     */
    validateTokenLimits(messages: Array<{
        content: string;
    }>, maxTokens?: number): {
        isValid: boolean;
        estimatedTokens: number;
        suggestions?: string;
    };
    /**
     * Stream responses for real-time interaction
     */
    streamResponse(messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>, options?: {
        model?: string;
        maxTokens?: number;
        temperature?: number;
    }): AsyncGenerator<string, void, unknown>;
}
//# sourceMappingURL=openai.d.ts.map