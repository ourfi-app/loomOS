import { ServiceConfig } from './config/ServiceConfig';
import { StorageService } from './storage/StorageService';
import { S3StorageService } from './storage/S3StorageService';
import { MinIOStorageService } from './storage/MinIOStorageService';
import { EmailService } from './email/EmailService';
import { ResendEmailService } from './email/ResendEmailService';
import { SendGridEmailService } from './email/SendGridEmailService';
import { PaymentService } from './payment/PaymentService';
import { StripePaymentService } from './payment/StripePaymentService';
import { AIService } from './ai/AIService';
import { ClaudeAIService } from './ai/ClaudeAIService';
import { OpenAIService } from './ai/OpenAIService';

/**
 * Service Provider Interface
 *
 * All services available through the registry
 */
export interface ServiceProvider {
  storage: StorageService;
  email: EmailService;
  payment: PaymentService;
  ai?: AIService; // Optional - not all deployments need AI
}

/**
 * Service Registry
 *
 * Central registry for all external services. This provides dependency injection
 * and allows for easy testing and provider swapping.
 *
 * Usage:
 * ```typescript
 * // Initialize once at app startup
 * ServiceRegistry.initialize(loadServiceConfig());
 *
 * // Use anywhere in your app
 * const storage = ServiceRegistry.get().storage;
 * await storage.upload('key', data);
 * ```
 */
export class ServiceRegistry {
  private static providers: ServiceProvider | null = null;
  private static config: ServiceConfig | null = null;

  /**
   * Initialize services with configuration
   * Call this once at application startup
   */
  static initialize(config: ServiceConfig): void {
    this.config = config;

    // Initialize storage
    const storage = this.createStorageService(config.storage);

    // Initialize email
    const email = this.createEmailService(config.email);

    // Initialize payment
    const payment = this.createPaymentService(config.payment);

    // Initialize AI (optional)
    const ai = config.ai.provider !== 'none'
      ? this.createAIService(config.ai)
      : undefined;

    this.providers = {
      storage,
      email,
      payment,
      ai
    };

    console.log('✅ loomOS ServiceRegistry initialized:', {
      storage: config.storage.provider,
      email: config.email.provider,
      payment: config.payment.provider,
      ai: config.ai.provider
    });
  }

  /**
   * Get service providers
   * Throws if not initialized
   */
  static get(): ServiceProvider {
    if (!this.providers) {
      throw new Error(
        'ServiceRegistry not initialized. Call ServiceRegistry.initialize(config) first.'
      );
    }
    return this.providers;
  }

  /**
   * Get current configuration
   */
  static getConfig(): ServiceConfig {
    if (!this.config) {
      throw new Error('ServiceRegistry not initialized.');
    }
    return this.config;
  }

  /**
   * Reset services (useful for testing)
   */
  static reset(): void {
    this.providers = null;
    this.config = null;
  }

  /**
   * Check if registry is initialized
   */
  static isInitialized(): boolean {
    return this.providers !== null;
  }

  private static createStorageService(config: ServiceConfig['storage']): StorageService {
    switch (config.provider) {
      case 'minio':
        return new MinIOStorageService(config);
      case 'aws-s3':
        return new S3StorageService(config);
      default:
        throw new Error(`Unknown storage provider: ${config.provider}`);
    }
  }

  private static createEmailService(config: ServiceConfig['email']): EmailService {
    switch (config.provider) {
      case 'resend':
        return new ResendEmailService(config);
      case 'sendgrid':
        return new SendGridEmailService(config);
      case 'smtp':
        throw new Error('SMTP email service not yet implemented');
      default:
        throw new Error(`Unknown email provider: ${config.provider}`);
    }
  }

  private static createPaymentService(config: ServiceConfig['payment']): PaymentService {
    switch (config.provider) {
      case 'stripe':
        return new StripePaymentService(config);
      default:
        throw new Error(`Unknown payment provider: ${config.provider}`);
    }
  }

  private static createAIService(config: ServiceConfig['ai']): AIService {
    switch (config.provider) {
      case 'claude':
        return new ClaudeAIService(config);
      case 'openai':
        return new OpenAIService(config);
      case 'none':
        throw new Error('AI provider is set to "none"');
      default:
        throw new Error(`Unknown AI provider: ${config.provider}`);
    }
  }
}

/**
 * React hooks for using services
 * Use these in your React components
 */
export function useServices(): ServiceProvider {
  return ServiceRegistry.get();
}

export function useStorage(): StorageService {
  return ServiceRegistry.get().storage;
}

export function useEmail(): EmailService {
  return ServiceRegistry.get().email;
}

export function usePayment(): PaymentService {
  return ServiceRegistry.get().payment;
}

export function useAI(): AIService {
  const ai = ServiceRegistry.get().ai;
  if (!ai) {
    throw new Error('AI service not configured. Set AI_PROVIDER in your environment.');
  }
  return ai;
}
