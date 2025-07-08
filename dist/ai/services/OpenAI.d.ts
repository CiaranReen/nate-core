import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
interface CompletionOptions {
    model: string;
    messages: ChatCompletionMessageParam[];
}
export declare class OpenAIService {
    private client;
    constructor(apiKey: string);
    generateCompletion(options: CompletionOptions): Promise<OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string | null;
    }>;
}
export {};
