import { UserProfile } from "./prompt-builders";
export interface GPTMessage {
    role: "system" | "user" | "assistant";
    content: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
}
export interface SessionContext {
    conversationId: string;
    userId: string;
    userProfile: UserProfile;
    messages: GPTMessage[];
    maxTokens: number;
    contextWindow: number;
    priority: "recent" | "relevant" | "balanced";
}
export declare class ContextFormatter {
    private static readonly MAX_CONTEXT_TOKENS;
    private static readonly SYSTEM_PROMPT_TOKENS;
    private static readonly RESPONSE_BUFFER_TOKENS;
    /**
     * Format conversation context for GPT API
     */
    static formatForGPT(sessionContext: SessionContext, systemPrompt: string, currentUserMessage?: string): GPTMessage[];
    /**
     * Select which history messages to include based on strategy and token limit
     */
    private static selectHistoryMessages;
    /**
     * Select most recent messages that fit within token limit
     */
    private static selectRecentMessages;
    /**
     * Select messages based on relevance to current conversation
     */
    private static selectRelevantMessages;
    /**
     * Balanced approach: prioritize recent messages but include some relevant older ones
     */
    private static selectBalancedMessages;
    /**
     * Calculate relevance score for a message
     */
    private static calculateRelevanceScore;
    /**
     * Estimate token count for text (rough approximation)
     */
    private static estimateTokens;
    /**
     * Summarize conversation context for long-term memory
     */
    static summarizeContext(messages: GPTMessage[], userProfile: UserProfile, timeframe: "session" | "day" | "week"): string;
    /**
     * Extract main topics from conversation
     */
    private static extractTopics;
    /**
     * Extract key points from assistant responses
     */
    private static extractKeyPoints;
    /**
     * Extract user concerns and questions
     */
    private static extractUserConcerns;
    /**
     * Create context for continuing a conversation
     */
    static createContinuationContext(sessionContext: SessionContext, lastActivity?: {
        type: "workout" | "meal" | "progress_update";
        data: Record<string, any>;
        timestamp: Date;
    }): string;
    /**
     * Optimize context for specific use cases
     */
    static optimizeContextFor(sessionContext: SessionContext, useCase: "workout_planning" | "nutrition_advice" | "motivation" | "progress_review"): SessionContext;
}
//# sourceMappingURL=context-formatter.d.ts.map