/**
 * loomOS Core Package
 *
 * Service Abstraction Layer for external services
 * Provides a unified interface for storage, email, payment, and AI services
 */

// Service Registry
export { ServiceRegistry, useServices, useStorage, useEmail, usePayment, useAI } from './services/ServiceRegistry';
export type { ServiceProvider } from './services/ServiceRegistry';

// Configuration
export { loadServiceConfig } from './services/config/loadServiceConfig';
export type {
  ServiceConfig,
  StorageConfig,
  EmailConfig,
  PaymentConfig,
  AIConfig,
  MapsConfig
} from './services/config/ServiceConfig';

// Storage Service
export type {
  StorageService,
  UploadOptions,
  UploadResult
} from './services/storage/StorageService';
export { S3StorageService } from './services/storage/S3StorageService';
export { MinIOStorageService } from './services/storage/MinIOStorageService';

// Email Service
export type {
  EmailService,
  EmailMessage,
  EmailAttachment,
  EmailResult
} from './services/email/EmailService';
export { SendGridEmailService } from './services/email/SendGridEmailService';
export { ResendEmailService } from './services/email/ResendEmailService';

// Payment Service
export type {
  PaymentService,
  PaymentCustomer,
  PaymentPrice,
  CheckoutSession,
  PaymentIntent,
  Subscription,
  SubscriptionItem
} from './services/payment/PaymentService';
export { StripePaymentService } from './services/payment/StripePaymentService';

// AI Service
export type {
  AIService,
  AIMessage,
  AIGenerateOptions,
  AIGenerateResult
} from './services/ai/AIService';
export { ClaudeAIService } from './services/ai/ClaudeAIService';
export { OpenAIService } from './services/ai/OpenAIService';
