/**
 * AI Service Interface
 *
 * This interface abstracts AI/LLM operations, allowing the application
 * to work with different AI providers (Claude, OpenAI, etc.) without changing code.
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerateOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
}

export interface AIGenerateResult {
  content: string;
  tokens: number;
  finishReason: 'stop' | 'max_tokens' | 'error';
}

export interface AIService {
  /**
   * Generate a single completion
   */
  generate(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult>;

  /**
   * Chat-style conversation with message history
   */
  chat(messages: AIMessage[], options?: AIGenerateOptions): Promise<AIGenerateResult>;

  /**
   * Stream a response (for real-time UI)
   */
  stream(prompt: string, onChunk: (chunk: string) => void, options?: AIGenerateOptions): Promise<void>;
}
