/**
 * App Import Types and Schema
 *
 * Standardized format for importing apps into loomOS marketplace
 * Apps can be defined in JSON files and imported programmatically
 */

import { z } from 'zod';

/**
 * App Definition Schema - validates imported app manifests
 */
export const AppImportSchema = z.object({
  // Required Core Fields
  name: z.string().min(1).max(100),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .min(1)
    .max(100),
  tagline: z.string().min(1).max(200),
  description: z.string().min(10),

  // Asset Configuration
  iconName: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  path: z.string().optional(), // App route path

  // Categorization
  category: z.enum([
    'PRODUCTIVITY',
    'COMMUNICATION',
    'ANALYTICS',
    'DEVELOPER_TOOLS',
    'DESIGN',
    'FINANCE',
    'HR',
    'MARKETING',
    'SALES',
    'SUPPORT',
    'OTHER'
  ]),
  tags: z.array(z.string()).default([]),

  // Features & Capabilities
  features: z.array(z.string()).default([]),
  permissions: z.array(z.string()).default([]),

  // Access Control
  minRole: z.enum(['VIEWER', 'MEMBER', 'ADMIN', 'OWNER']).default('MEMBER'),
  isActive: z.boolean().default(true),

  // Version & Publishing
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver (e.g., 1.0.0)').default('1.0.0'),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED']).default('DRAFT'),

  // Organization (optional - defaults to system-wide)
  organizationId: z.string().optional(),
  developerId: z.string().optional(),

  // Pricing
  pricingModel: z.enum(['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE']).default('FREE'),
  price: z.number().min(0).default(0),
  currency: z.string().default('USD'),

  // Additional Metadata (optional)
  longDescription: z.string().optional(),
  screenshots: z.array(z.string()).default([]),
  videoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  supportUrl: z.string().url().optional(),
  privacyUrl: z.string().url().optional(),
  termsUrl: z.string().url().optional(),

  // Compatibility & Requirements
  compatibility: z.array(z.string()).default([]),
  requiredIntegrations: z.array(z.string()).default([]),

  // SEO & Discovery
  searchKeywords: z.array(z.string()).default([]),

  // Import Metadata
  importVersion: z.string().default('1.0'),
  importSource: z.string().optional(),
});

export type AppImportDefinition = z.infer<typeof AppImportSchema>;

/**
 * Import Result - returned after importing an app
 */
export interface AppImportResult {
  success: boolean;
  appId?: string;
  slug: string;
  action: 'created' | 'updated' | 'skipped' | 'failed';
  message: string;
  errors?: string[];
  warnings?: string[];
}

/**
 * Bulk Import Result - returned after importing multiple apps
 */
export interface BulkImportResult {
  totalApps: number;
  successful: number;
  failed: number;
  results: AppImportResult[];
}

/**
 * Import Options
 */
export interface AppImportOptions {
  // Whether to update existing apps or skip them
  updateExisting?: boolean;

  // Whether to publish immediately or keep in DRAFT
  autoPublish?: boolean;

  // Default organization for imported apps
  defaultOrganizationId?: string;

  // Default developer for imported apps
  defaultDeveloperId?: string;

  // Whether to validate only without importing
  dryRun?: boolean;

  // Whether to skip validation errors
  skipValidation?: boolean;
}

/**
 * App Manifest File Structure
 * Expected format when reading from filesystem
 */
export interface AppManifest {
  app: AppImportDefinition;
  // Additional metadata about the manifest itself
  manifest?: {
    version: string;
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  };
}
