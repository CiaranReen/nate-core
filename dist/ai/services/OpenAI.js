import OpenAI from "openai";
export class OpenAIService {
    constructor(apiKey) {
        this.client = new OpenAI({ apiKey });
    }
    async generateCompletion(options) {
        const completion = await this.client.chat.completions.create({
            model: options.model,
            messages: options.messages, // Type assertion needed due to OpenAI types
        });
        return completion;
    }
}
