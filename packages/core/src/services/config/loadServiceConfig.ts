import { ServiceConfig } from './ServiceConfig';

/**
 * Load service configuration from environment variables
 *
 * This function reads environment variables and constructs a complete
 * ServiceConfig object. It supports both server-side and client-side
 * environment variables (prefixed with NEXT_PUBLIC_).
 */
export function loadServiceConfig(): ServiceConfig {
  return {
    storage: {
      provider: (process.env.STORAGE_PROVIDER as any) || 'aws-s3',
      bucket: process.env.STORAGE_BUCKET || process.env.AWS_BUCKET_NAME || '',
      region: process.env.STORAGE_REGION || process.env.AWS_REGION,
      endpoint: process.env.STORAGE_ENDPOINT, // For MinIO
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || ''
      },
      publicUrlBase: process.env.STORAGE_PUBLIC_URL_BASE
    },

    email: {
      provider: (process.env.EMAIL_PROVIDER as any) || 'sendgrid',
      apiKey: process.env.EMAIL_API_KEY || process.env.SENDGRID_API_KEY,
      fromEmail: process.env.EMAIL_FROM || process.env.SENDGRID_FROM_EMAIL || '',
      fromName: process.env.EMAIL_FROM_NAME,
      smtp: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      } : undefined
    },

    payment: {
      provider: 'stripe',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
    },

    ai: {
      provider: (process.env.AI_PROVIDER as any) || 'none',
      apiKey: process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY,
      model: process.env.AI_MODEL,
      maxTokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : undefined
    },

    maps: {
      provider: 'maplibre',
      tileServerUrl: process.env.NEXT_PUBLIC_MAPS_TILE_SERVER_URL || 'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png',
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY
    }
  };
}
