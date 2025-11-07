/**
 * Service Configuration Interfaces
 *
 * These interfaces define the configuration for all external services
 * used by loomOS. This allows for easy swapping of service providers
 * without changing application code.
 */

export interface ServiceConfig {
  storage: StorageConfig;
  email: EmailConfig;
  payment: PaymentConfig;
  ai: AIConfig;
  maps: MapsConfig;
}

export interface StorageConfig {
  provider: 'aws-s3' | 'minio';
  bucket: string;
  region?: string;
  endpoint?: string; // For MinIO or custom S3-compatible services
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  publicUrlBase?: string; // For generating public URLs
}

export interface EmailConfig {
  provider: 'sendgrid' | 'resend' | 'smtp';
  apiKey?: string;
  fromEmail: string;
  fromName?: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface PaymentConfig {
  provider: 'stripe'; // Only Stripe for now, but typed for future providers
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
}

export interface AIConfig {
  provider: 'claude' | 'openai' | 'none';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
}

export interface MapsConfig {
  provider: 'maplibre';
  tileServerUrl: string;
  apiKey?: string; // For hosted tile services like MapTiler
}
