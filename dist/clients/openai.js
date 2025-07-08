import OpenAI from "openai";
import { PromptBuilder, } from "../ai/prompt-builders";
import { ContextFormatter, } from "../ai/context-formatter";
export class OpenAIService {
    constructor(config) {
        this.config = {
            defaultModel: "gpt-4-turbo-preview",
            maxTokens: 4000,
            temperature: 0.7,
            organization: config.organization ?? "",
            baseURL: config.baseURL ?? "",
            ...config,
        };
        this.client = new OpenAI({
            apiKey: this.config.apiKey,
            organization: this.config.organization,
            baseURL: this.config.baseURL,
        });
    }
    /**
     * Generate a coaching response for user chat
     */
    async generateResponse(messages, options) {
        const response = await this.client.chat.completions.create({
            model: options?.model || this.config.defaultModel,
            messages,
            max_tokens: options?.maxTokens || this.config.maxTokens,
            temperature: options?.temperature || this.config.temperature,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No response generated from OpenAI");
        }
        return {
            message: choice.message.content,
            usage: {
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                totalTokens: response.usage?.total_tokens || 0,
            },
            finishReason: choice.finish_reason || "stop",
            conversationId: "default",
        };
    }
    /**
     * Generate a personalized workout plan
     */
    async generateWorkoutPlan(request) {
        const prompt = PromptBuilder.buildWorkoutPrompt(request.userProfile, request.workoutType, request.duration, request.difficulty);
        const response = await this.client.chat.completions.create({
            model: this.config.defaultModel,
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness trainer. Generate workout plans in valid JSON format exactly as specified.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 2000,
            temperature: 0.3, // Lower temperature for more consistent JSON
            response_format: { type: "json_object" },
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No workout plan generated");
        }
        try {
            return JSON.parse(choice.message.content);
        }
        catch (error) {
            throw new Error("Invalid JSON response from OpenAI");
        }
    }
    /**
     * Generate a personalized meal plan
     */
    async generateMealPlan(request) {
        const prompt = PromptBuilder.buildMealPlanPrompt(request.userProfile, request.calories, request.macros, request.mealType, request.preferences);
        const response = await this.client.chat.completions.create({
            model: this.config.defaultModel,
            messages: [
                {
                    role: "system",
                    content: "You are an expert nutritionist. Generate meal plans in valid JSON format exactly as specified.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 1500,
            temperature: 0.3,
            response_format: { type: "json_object" },
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No meal plan generated");
        }
        try {
            return JSON.parse(choice.message.content);
        }
        catch (error) {
            throw new Error("Invalid JSON response from OpenAI");
        }
    }
    /**
     * Analyze user progress and provide insights
     */
    async analyzeProgress(userProfile, progressData, timeframe) {
        const prompt = PromptBuilder.buildProgressAnalysisPrompt(userProfile, progressData, timeframe);
        const response = await this.client.chat.completions.create({
            model: this.config.defaultModel,
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness analyst. Provide progress analysis in valid JSON format exactly as specified.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 1500,
            temperature: 0.4,
            response_format: { type: "json_object" },
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No progress analysis generated");
        }
        try {
            return JSON.parse(choice.message.content);
        }
        catch (error) {
            throw new Error("Invalid JSON response from OpenAI");
        }
    }
    /**
     * Generate motivational content
     */
    async generateMotivation(userProfile, context) {
        const prompt = PromptBuilder.buildMotivationalPrompt(userProfile, context);
        const response = await this.client.chat.completions.create({
            model: this.config.defaultModel,
            messages: [
                {
                    role: "system",
                    content: "You are Nate, a supportive fitness coach. Create personalized, authentic motivational messages.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 300,
            temperature: 0.8, // Higher temperature for more creative/personal messages
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No motivational message generated");
        }
        return choice.message.content;
    }
    /**
     * Generate exercise alternatives based on equipment/injuries
     */
    async generateExerciseAlternatives(originalExercise, constraints) {
        const prompt = `Suggest 3-5 alternative exercises for "${originalExercise}" with these constraints:
${constraints.equipment ? `- Available equipment: ${constraints.equipment.join(", ")}` : "- No equipment available (bodyweight only)"}
${constraints.injuries ? `- Avoid due to injuries: ${constraints.injuries.join(", ")}` : ""}
${constraints.difficulty ? `- Make it ${constraints.difficulty}` : ""}
${constraints.targetMuscles ? `- Target muscles: ${constraints.targetMuscles.join(", ")}` : ""}

Provide only the exercise names, one per line, without numbering or additional text.`;
        const response = await this.client.chat.completions.create({
            model: "gpt-3.5-turbo", // Use faster model for simple tasks
            messages: [
                {
                    role: "system",
                    content: "You are a fitness expert. Provide concise exercise alternatives.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 200,
            temperature: 0.5,
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No exercise alternatives generated");
        }
        return choice.message.content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    }
    /**
     * Summarize conversation for long-term memory
     */
    async summarizeConversation(messages, userProfile, timeframe) {
        const contextSummary = ContextFormatter.summarizeContext(messages, userProfile, timeframe);
        const prompt = `Based on this conversation summary, create a concise summary for Nate's memory:

${contextSummary}

Create a brief summary (2-3 sentences) that captures:
1. Main topics discussed
2. User's current state/mood
3. Key advice given or plans made
4. Any important context for future conversations

Keep it concise but informative for future reference.`;
        const response = await this.client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are creating memory summaries for an AI fitness coach.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 200,
            temperature: 0.3,
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No conversation summary generated");
        }
        return choice.message.content;
    }
    /**
     * Generate content variations (for A/B testing)
     */
    async generateContentVariations(content, type, count = 3) {
        const prompt = `Create ${count} variations of this ${type} fitness content, maintaining the same core message but with different tone, style, or approach:

Original: "${content}"

Generate ${count} distinct variations that:
- Keep the same key information/message
- Use different wording and style
- Maintain appropriate ${type} tone
- Are similar in length

Provide only the variations, numbered 1-${count}.`;
        const response = await this.client.chat.completions.create({
            model: this.config.defaultModel,
            messages: [
                {
                    role: "system",
                    content: "You are a fitness content writer creating variations for testing.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 800,
            temperature: 0.8,
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No content variations generated");
        }
        return choice.message.content
            .split(/\d+\.\s+/)
            .slice(1) // Remove empty first element
            .map((variation) => variation.trim())
            .filter((variation) => variation.length > 0);
    }
    /**
     * Validate and improve user-generated content
     */
    async validateUserContent(content, type) {
        const prompt = `Analyze this user ${type} for a fitness app:

"${content}"

Evaluate:
1. Is it appropriate and safe for a fitness context?
2. Is it clear and actionable?
3. Are there any concerns or red flags?
4. How can it be improved or clarified?

Respond in JSON format:
{
  "isValid": boolean,
  "cleanedContent": "improved version",
  "suggestions": ["list of suggestions"],
  "concerns": ["list of concerns if any"]
}`;
        const response = await this.client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a content moderator for a fitness app. Ensure content is safe, appropriate, and helpful.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 400,
            temperature: 0.2,
            response_format: { type: "json_object" },
        });
        const choice = response.choices[0];
        if (!choice?.message?.content) {
            throw new Error("No content validation generated");
        }
        try {
            return JSON.parse(choice.message.content);
        }
        catch (error) {
            throw new Error("Invalid JSON response from content validation");
        }
    }
    /**
     * Estimate token count for text
     */
    estimateTokens(text) {
        // Rough approximation: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }
    /**
     * Check if content would exceed token limits
     */
    validateTokenLimits(messages, maxTokens = 8000) {
        const totalTokens = messages.reduce((sum, msg) => sum + this.estimateTokens(msg.content), 0);
        return {
            isValid: totalTokens <= maxTokens,
            estimatedTokens: totalTokens,
            suggestions: totalTokens > maxTokens
                ? "Consider reducing message history or using shorter prompts"
                : undefined,
        };
    }
    /**
     * Stream responses for real-time interaction
     */
    async *streamResponse(messages, options) {
        const stream = await this.client.chat.completions.create({
            model: options?.model || this.config.defaultModel,
            messages,
            max_tokens: options?.maxTokens || this.config.maxTokens,
            temperature: options?.temperature || this.config.temperature,
            stream: true,
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }
}
//# sourceMappingURL=openai.js.map