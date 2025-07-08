export class ContextFormatter {
    /**
     * Format conversation context for GPT API
     */
    static formatForGPT(sessionContext, systemPrompt, currentUserMessage) {
        const availableTokens = sessionContext.maxTokens -
            this.SYSTEM_PROMPT_TOKENS -
            this.RESPONSE_BUFFER_TOKENS -
            (currentUserMessage ? this.estimateTokens(currentUserMessage) : 0);
        // Start with system prompt
        const messages = [
            {
                role: "system",
                content: systemPrompt,
                timestamp: new Date(),
            },
        ];
        // Add conversation history based on priority strategy
        const historyMessages = this.selectHistoryMessages(sessionContext.messages, availableTokens, sessionContext.priority);
        messages.push(...historyMessages);
        // Add current user message if provided
        if (currentUserMessage) {
            messages.push({
                role: "user",
                content: currentUserMessage,
                timestamp: new Date(),
            });
        }
        return messages;
    }
    /**
     * Select which history messages to include based on strategy and token limit
     */
    static selectHistoryMessages(messages, availableTokens, priority) {
        // Filter out system messages from history
        const historyMessages = messages.filter((msg) => msg.role !== "system");
        switch (priority) {
            case "recent":
                return this.selectRecentMessages(historyMessages, availableTokens);
            case "relevant":
                return this.selectRelevantMessages(historyMessages, availableTokens);
            case "balanced":
                return this.selectBalancedMessages(historyMessages, availableTokens);
            default:
                return this.selectRecentMessages(historyMessages, availableTokens);
        }
    }
    /**
     * Select most recent messages that fit within token limit
     */
    static selectRecentMessages(messages, availableTokens) {
        const selectedMessages = [];
        let tokenCount = 0;
        // Start from most recent and work backwards
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const messageTokens = this.estimateTokens(message.content);
            if (tokenCount + messageTokens <= availableTokens) {
                selectedMessages.unshift(message);
                tokenCount += messageTokens;
            }
            else {
                break;
            }
        }
        return selectedMessages;
    }
    /**
     * Select messages based on relevance to current conversation
     */
    static selectRelevantMessages(messages, availableTokens) {
        // Score messages by relevance
        const scoredMessages = messages.map((message) => ({
            message,
            score: this.calculateRelevanceScore(message, messages),
            tokens: this.estimateTokens(message.content),
        }));
        // Sort by relevance score (descending)
        scoredMessages.sort((a, b) => b.score - a.score);
        // Select highest scoring messages that fit within token limit
        const selectedMessages = [];
        let tokenCount = 0;
        for (const { message, tokens } of scoredMessages) {
            if (tokenCount + tokens <= availableTokens) {
                selectedMessages.push(message);
                tokenCount += tokens;
            }
        }
        // Sort selected messages by timestamp to maintain conversation flow
        return selectedMessages.sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
    }
    /**
     * Balanced approach: prioritize recent messages but include some relevant older ones
     */
    static selectBalancedMessages(messages, availableTokens) {
        const recentTokens = Math.floor(availableTokens * 0.7); // 70% for recent
        const relevantTokens = availableTokens - recentTokens; // 30% for relevant
        // Get recent messages
        const recentMessages = this.selectRecentMessages(messages, recentTokens);
        const recentMessageIds = new Set(recentMessages.map((m) => m.timestamp?.getTime()));
        // Get relevant messages not already included
        const remainingMessages = messages.filter((m) => !recentMessageIds.has(m.timestamp?.getTime()));
        const relevantMessages = this.selectRelevantMessages(remainingMessages, relevantTokens);
        // Combine and sort by timestamp
        const allMessages = [...recentMessages, ...relevantMessages];
        return allMessages.sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
    }
    /**
     * Calculate relevance score for a message
     */
    static calculateRelevanceScore(message, allMessages) {
        let score = 0;
        // Base score by message type
        if (message.role === "user")
            score += 2;
        if (message.role === "assistant")
            score += 1;
        // Recency bonus (more recent = higher score)
        const messageTime = message.timestamp?.getTime() || 0;
        const latestTime = Math.max(...allMessages.map((m) => m.timestamp?.getTime() || 0));
        const recencyRatio = messageTime / latestTime;
        score += recencyRatio * 3;
        // Content relevance (keywords)
        const fitnessKeywords = [
            "workout",
            "exercise",
            "training",
            "fitness",
            "strength",
            "cardio",
            "nutrition",
            "diet",
            "meal",
            "calories",
            "protein",
            "weight",
            "goal",
            "progress",
            "motivation",
            "habit",
            "routine",
        ];
        const content = message.content.toLowerCase();
        const keywordMatches = fitnessKeywords.filter((keyword) => content.includes(keyword)).length;
        score += keywordMatches * 0.5;
        // Question/answer pairs get bonus
        if (message.content.includes("?"))
            score += 1;
        if (message.metadata?.isQuestion)
            score += 1;
        if (message.metadata?.isAnswer)
            score += 1;
        return score;
    }
    /**
     * Estimate token count for text (rough approximation)
     */
    static estimateTokens(text) {
        // Rough approximation: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }
    /**
     * Summarize conversation context for long-term memory
     */
    static summarizeContext(messages, userProfile, timeframe) {
        const relevantMessages = messages.filter((msg) => msg.role === "user" || msg.role === "assistant");
        if (relevantMessages.length === 0) {
            return `No conversation history for ${timeframe}.`;
        }
        const topics = this.extractTopics(relevantMessages);
        const keyPoints = this.extractKeyPoints(relevantMessages);
        const userConcerns = this.extractUserConcerns(relevantMessages);
        return `
Conversation Summary (${timeframe}):
User: ${userProfile.name} (Goal: ${userProfile.fitnessGoal.replace("_", " ")})

Topics Discussed: ${topics.join(", ")}

Key Points:
${keyPoints.map((point) => `- ${point}`).join("\n")}

User Concerns/Questions:
${userConcerns.map((concern) => `- ${concern}`).join("\n")}

Message Count: ${relevantMessages.length} exchanges
    `.trim();
    }
    /**
     * Extract main topics from conversation
     */
    static extractTopics(messages) {
        const topics = new Set();
        const topicKeywords = {
            Workouts: ["workout", "exercise", "training", "gym", "fitness"],
            Nutrition: ["nutrition", "diet", "meal", "food", "calories", "protein"],
            Progress: ["progress", "weight", "measurement", "achievement", "goal"],
            Motivation: [
                "motivation",
                "struggle",
                "challenge",
                "encourage",
                "support",
            ],
            Health: ["health", "wellness", "sleep", "stress", "mood", "energy"],
        };
        messages.forEach((message) => {
            const content = message.content.toLowerCase();
            Object.entries(topicKeywords).forEach(([topic, keywords]) => {
                if (keywords.some((keyword) => content.includes(keyword))) {
                    topics.add(topic);
                }
            });
        });
        return Array.from(topics);
    }
    /**
     * Extract key points from assistant responses
     */
    static extractKeyPoints(messages) {
        const keyPoints = [];
        messages
            .filter((msg) => msg.role === "assistant")
            .forEach((message) => {
            // Look for sentences with actionable advice
            const sentences = message.content.split(/[.!?]+/);
            sentences.forEach((sentence) => {
                const trimmed = sentence.trim();
                if (trimmed.length > 20 &&
                    (trimmed.includes("should") ||
                        trimmed.includes("try") ||
                        trimmed.includes("recommend") ||
                        trimmed.includes("suggest") ||
                        trimmed.includes("important"))) {
                    keyPoints.push(trimmed);
                }
            });
        });
        return keyPoints.slice(0, 5); // Limit to top 5 key points
    }
    /**
     * Extract user concerns and questions
     */
    static extractUserConcerns(messages) {
        const concerns = [];
        messages
            .filter((msg) => msg.role === "user")
            .forEach((message) => {
            // Look for questions
            const sentences = message.content.split(/[.!?]+/);
            sentences.forEach((sentence) => {
                const trimmed = sentence.trim();
                if (trimmed.includes("?") ||
                    trimmed.toLowerCase().startsWith("how") ||
                    trimmed.toLowerCase().startsWith("what") ||
                    trimmed.toLowerCase().startsWith("why") ||
                    trimmed.toLowerCase().startsWith("when") ||
                    trimmed.toLowerCase().includes("help") ||
                    trimmed.toLowerCase().includes("struggle")) {
                    concerns.push(trimmed);
                }
            });
        });
        return concerns.slice(0, 3); // Limit to top 3 concerns
    }
    /**
     * Create context for continuing a conversation
     */
    static createContinuationContext(sessionContext, lastActivity) {
        const recentMessages = sessionContext.messages.slice(-3);
        const lastUserMessage = recentMessages
            .filter((msg) => msg.role === "user")
            .pop();
        const lastAssistantMessage = recentMessages
            .filter((msg) => msg.role === "assistant")
            .pop();
        let context = `Continuing conversation with ${sessionContext.userProfile.name}.\n\n`;
        if (lastUserMessage && lastAssistantMessage) {
            context += `Recent Exchange:
User: "${lastUserMessage.content}"
Assistant: "${lastAssistantMessage.content}"

`;
        }
        if (lastActivity) {
            context += `Recent Activity: ${lastActivity.type} at ${lastActivity.timestamp.toLocaleString()}
Data: ${JSON.stringify(lastActivity.data, null, 2)}

`;
        }
        context += `Continue the conversation naturally, referencing previous context when relevant.`;
        return context;
    }
    /**
     * Optimize context for specific use cases
     */
    static optimizeContextFor(sessionContext, useCase) {
        const relevantKeywords = {
            workout_planning: [
                "workout",
                "exercise",
                "training",
                "strength",
                "cardio",
                "plan",
            ],
            nutrition_advice: [
                "nutrition",
                "diet",
                "meal",
                "food",
                "calories",
                "protein",
                "macro",
            ],
            motivation: [
                "motivation",
                "struggle",
                "challenge",
                "goal",
                "progress",
                "encourage",
            ],
            progress_review: [
                "progress",
                "weight",
                "measurement",
                "achievement",
                "goal",
                "result",
            ],
        };
        const keywords = relevantKeywords[useCase] || [];
        // Filter messages that contain relevant keywords
        const relevantMessages = sessionContext.messages.filter((message) => {
            const content = message.content.toLowerCase();
            return (keywords.some((keyword) => content.includes(keyword)) ||
                message.role === "system"); // Always include system messages
        });
        return {
            ...sessionContext,
            messages: relevantMessages,
            priority: "relevant",
        };
    }
}
ContextFormatter.MAX_CONTEXT_TOKENS = 8000; // Conservative limit for GPT-4
ContextFormatter.SYSTEM_PROMPT_TOKENS = 1000; // Estimated tokens for system prompt
ContextFormatter.RESPONSE_BUFFER_TOKENS = 1000; // Buffer for response
//# sourceMappingURL=context-formatter.js.map