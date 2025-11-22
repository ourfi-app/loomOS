/**
 * Environment Variable Validation
 *
 * This module validates all required environment variables at application startup,
 * preventing runtime errors due to missing or invalid configuration.
 *
 * Usage:
 *   import { env } from '@/lib/env';
 *   const dbUrl = env.DATABASE_URL;
 */

import { z } from 'zod';

/**
 * Define the schema for environment variables
 * Add all required variables here with appropriate validation
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),

  // OAuth Providers (Optional in development, required in production)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_TENANT_ID: z.string().optional(),

  // AWS S3 (Optional - for file storage)
  AWS_BUCKET_NAME: z.string().optional(),
  AWS_FOLDER_PREFIX: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Stripe (Optional - for payments)
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // SendGrid (Optional - for emails)
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().optional(),

  // Twilio (Optional - for SMS)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Build configuration
  NEXT_DIST_DIR: z.string().optional(),
  NEXT_OUTPUT_MODE: z.string().optional(),
});

/**
 * Additional validation for production environment
 */
const productionEnvSchema = envSchema.extend({
  // In production, we should not use placeholder credentials
  GOOGLE_CLIENT_ID: z.string().refine(
    (val) => !val || !val.includes('placeholder'),
    'Production environment cannot use placeholder Google OAuth credentials'
  ).optional(),
  GOOGLE_CLIENT_SECRET: z.string().refine(
    (val) => !val || !val.includes('placeholder'),
    'Production environment cannot use placeholder Google OAuth credentials'
  ).optional(),
  MICROSOFT_CLIENT_ID: z.string().refine(
    (val) => !val || !val.includes('placeholder'),
    'Production environment cannot use placeholder Microsoft OAuth credentials'
  ).optional(),
  MICROSOFT_CLIENT_SECRET: z.string().refine(
    (val) => !val || !val.includes('placeholder'),
    'Production environment cannot use placeholder Microsoft OAuth credentials'
  ).optional(),
});

/**
 * Check if we're in a browser context
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Validate and parse environment variables
 * In browser context: logs warnings and returns safe defaults
 * In server context: throws an error if validation fails
 */
function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const schema = isProduction ? productionEnvSchema : envSchema;

  try {
    return schema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => {
        const path = err.path.join('.');
        return `  - ${path}: ${err.message}`;
      }).join('\n');

      // In browser context, only log warnings and return a proxy
      if (isBrowser) {
        console.warn('\n⚠️  Missing or invalid environment variables (browser context):\n');
        console.warn(errorMessages);
        console.warn('\n📝 Some features may not work correctly. Check your .env file.\n');
        
        // Return a proxy that logs warnings when accessed
        return new Proxy({} as any, {
          get(target, prop) {
            if (typeof prop === 'string') {
              const value = process.env[prop];
              if (!value) {
                console.warn(`⚠️  Accessing missing environment variable: ${prop}`);
              }
              return value || '';
            }
            return undefined;
          }
        });
      }

      // In server context, throw an error
      console.error('\n❌ Invalid environment variables (server context):\n');
      console.error(errorMessages);
      console.error('\n📝 Please check your .env file and ensure all required variables are set correctly.\n');

      throw new Error('Environment validation failed');
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * In browser context: returns safe proxy with warnings
 * In server context: throws an error at module import time if validation fails
 */
export const env = validateEnv();

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Helper functions to check if optional services are configured
 */
export const hasAwsConfigured = () =>
  !!env.AWS_BUCKET_NAME && !!env.AWS_ACCESS_KEY_ID && !!env.AWS_SECRET_ACCESS_KEY;

export const hasStripeConfigured = () =>
  !!env.STRIPE_SECRET_KEY && !!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const hasSendGridConfigured = () =>
  !!env.SENDGRID_API_KEY && !!env.SENDGRID_FROM_EMAIL;

export const hasTwilioConfigured = () =>
  !!env.TWILIO_ACCOUNT_SID && !!env.TWILIO_AUTH_TOKEN;

export const hasGoogleOAuthConfigured = () =>
  !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET &&
  !env.GOOGLE_CLIENT_ID.includes('placeholder');

export const hasMicrosoftOAuthConfigured = () =>
  !!env.MICROSOFT_CLIENT_ID && !!env.MICROSOFT_CLIENT_SECRET &&
  !env.MICROSOFT_CLIENT_ID.includes('placeholder');
