import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

interface CompletionOptions {
  model: string;
  messages: ChatCompletionMessageParam[];
}

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateCompletion(options: CompletionOptions) {
    const completion = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages as any, // Type assertion needed due to OpenAI types
    });

    return completion;
  }
}
