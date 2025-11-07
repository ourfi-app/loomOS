import Anthropic from '@anthropic-ai/sdk';
import { AIService, AIMessage, AIGenerateOptions, AIGenerateResult } from './AIService';
import { AIConfig } from '../config/ServiceConfig';

/**
 * Claude AI Service Implementation
 *
 * Implements the AIService interface using Anthropic's Claude.
 */
export class ClaudeAIService implements AIService {
  private client: Anthropic;
  private model: string;
  private defaultMaxTokens: number;

  constructor(config: AIConfig) {
    if (!config.apiKey) {
      throw new Error('Claude API key is required');
    }

    this.client = new Anthropic({
      apiKey: config.apiKey
    });

    this.model = config.model || 'claude-sonnet-4-20250514';
    this.defaultMaxTokens = config.maxTokens || 4096;
  }

  async generate(prompt: string, options: AIGenerateOptions = {}): Promise<AIGenerateResult> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens || this.defaultMaxTokens,
      temperature: options.temperature,
      stop_sequences: options.stopSequences,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      content,
      tokens: response.usage.input_tokens + response.usage.output_tokens,
      finishReason: response.stop_reason === 'end_turn' ? 'stop' : 'max_tokens'
    };
  }

  async chat(messages: AIMessage[], options: AIGenerateOptions = {}): Promise<AIGenerateResult> {
    // Separate system messages from conversation
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens || this.defaultMaxTokens,
      temperature: options.temperature,
      stop_sequences: options.stopSequences,
      system: systemMessages.map(m => m.content).join('\n'),
      messages: conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    });

    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      content,
      tokens: response.usage.input_tokens + response.usage.output_tokens,
      finishReason: response.stop_reason === 'end_turn' ? 'stop' : 'max_tokens'
    };
  }

  async stream(
    prompt: string,
    onChunk: (chunk: string) => void,
    options: AIGenerateOptions = {}
  ): Promise<void> {
    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: options.maxTokens || this.defaultMaxTokens,
      temperature: options.temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        onChunk(event.delta.text);
      }
    }
  }
}
