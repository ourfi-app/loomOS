import OpenAI from 'openai';
import { AIService, AIMessage, AIGenerateOptions, AIGenerateResult } from './AIService';
import { AIConfig } from '../config/ServiceConfig';

/**
 * OpenAI Service Implementation
 *
 * Implements the AIService interface using OpenAI's GPT models.
 */
export class OpenAIService implements AIService {
  private client: OpenAI;
  private model: string;
  private defaultMaxTokens: number;

  constructor(config: AIConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey
    });

    this.model = config.model || 'gpt-4o';
    this.defaultMaxTokens = config.maxTokens || 4096;
  }

  async generate(prompt: string, options: AIGenerateOptions = {}): Promise<AIGenerateResult> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: options.maxTokens || this.defaultMaxTokens,
      temperature: options.temperature,
      stop: options.stopSequences,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const choice = response.choices[0];
    const content = choice.message.content || '';

    return {
      content,
      tokens: response.usage?.total_tokens || 0,
      finishReason: choice.finish_reason === 'stop' ? 'stop' : 'max_tokens'
    };
  }

  async chat(messages: AIMessage[], options: AIGenerateOptions = {}): Promise<AIGenerateResult> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: options.maxTokens || this.defaultMaxTokens,
      temperature: options.temperature,
      stop: options.stopSequences,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    const choice = response.choices[0];
    const content = choice.message.content || '';

    return {
      content,
      tokens: response.usage?.total_tokens || 0,
      finishReason: choice.finish_reason === 'stop' ? 'stop' : 'max_tokens'
    };
  }

  async stream(
    prompt: string,
    onChunk: (chunk: string) => void,
    options: AIGenerateOptions = {}
  ): Promise<void> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: options.maxTokens || this.defaultMaxTokens,
      temperature: options.temperature,
      stream: true,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
  }
}
