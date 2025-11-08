/**
 * Tenant Routing Utilities
 * Handles subdomain and custom domain resolution for multi-tenancy
 */

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export interface TenantInfo {
  organizationId: string;
  subdomain: string | null;
  customDomain: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    subdomain: string | null;
    customDomain: string | null;
    isActive: boolean;
    isSuspended: boolean;
  };
}

/**
 * Extract subdomain from hostname
 * Examples:
 * - montrecott.loomos.com -> montrecott
 * - localhost:3000 -> null (development)
 * - loomos.com -> null (main site)
 */
export function extractSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];

  // Development - no subdomain
  if (host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  // Get the app domain from environment
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';

  // If it's the main domain, no subdomain
  if (host === appDomain || host === `www.${appDomain}`) {
    return null;
  }

  // Extract subdomain
  const parts = host.split('.');

  // Custom domain (not our app domain)
  if (!host.endsWith(appDomain)) {
    return null; // Will be handled by custom domain lookup
  }

  // Get subdomain (everything before .appDomain)
  const subdomain = host.replace(`.${appDomain}`, '');

  // Ignore www
  if (subdomain === 'www') {
    return null;
  }

  return subdomain;
}

/**
 * Resolve tenant from current request
 * Checks both subdomain and custom domain
 */
export async function resolveTenantFromRequest(): Promise<TenantInfo | null> {
  const headersList = headers();
  const hostname = headersList.get('host') || '';

  return resolveTenantFromHostname(hostname);
}

/**
 * Resolve tenant from hostname
 * @param hostname - The full hostname (e.g., montrecott.loomos.com or custom.com)
 */
export async function resolveTenantFromHostname(hostname: string): Promise<TenantInfo | null> {
  const host = hostname.split(':')[0]; // Remove port
  const subdomain = extractSubdomain(hostname);

  try {
    let organization;

    // First, try subdomain lookup
    if (subdomain) {
      organization = await prisma.organization.findUnique({
        where: { subdomain },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          customDomain: true,
          isActive: true,
          isSuspended: true,
        },
      });
    }

    // If no subdomain match, try custom domain
    if (!organization && host) {
      organization = await prisma.organization.findUnique({
        where: { customDomain: host },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          customDomain: true,
          isActive: true,
          isSuspended: true,
        },
      });
    }

    if (!organization) {
      return null;
    }

    // Check if organization is active
    if (!organization.isActive || organization.isSuspended) {
      return null;
    }

    return {
      organizationId: organization.id,
      subdomain: organization.subdomain,
      customDomain: organization.customDomain,
      organization,
    };
  } catch (error) {
    console.error('Error resolving tenant:', error);
    return null;
  }
}

/**
 * Get the full URL for a tenant
 * @param subdomain - The organization's subdomain
 * @param customDomain - Optional custom domain
 */
export function getTenantUrl(subdomain: string | null, customDomain: string | null): string {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  // Prefer custom domain if available
  if (customDomain) {
    return `${protocol}://${customDomain}`;
  }

  // Fall back to subdomain
  if (subdomain) {
    return `${protocol}://${subdomain}.${appDomain}`;
  }

  // Main app domain
  return `${protocol}://${appDomain}`;
}

/**
 * Validate subdomain format
 * Rules:
 * - 3-63 characters
 * - Lowercase letters, numbers, hyphens only
 * - Cannot start or end with hyphen
 * - Cannot use reserved words
 */
export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  const reserved = [
    'www',
    'api',
    'admin',
    'app',
    'mail',
    'smtp',
    'ftp',
    'localhost',
    'staging',
    'dev',
    'test',
    'demo',
    'support',
    'help',
    'blog',
    'docs',
    'status',
    'superadmin',
    'super-admin',
  ];

  if (!subdomain) {
    return { valid: false, error: 'Subdomain is required' };
  }

  if (subdomain.length < 3 || subdomain.length > 63) {
    return { valid: false, error: 'Subdomain must be between 3 and 63 characters' };
  }

  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return { valid: false, error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' };
  }

  if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
    return { valid: false, error: 'Subdomain cannot start or end with a hyphen' };
  }

  if (reserved.includes(subdomain)) {
    return { valid: false, error: 'This subdomain is reserved' };
  }

  return { valid: true };
}

/**
 * Validate custom domain format
 */
export function validateCustomDomain(domain: string): { valid: boolean; error?: string } {
  if (!domain) {
    return { valid: false, error: 'Domain is required' };
  }

  // Basic domain validation
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

  if (!domainRegex.test(domain)) {
    return { valid: false, error: 'Invalid domain format' };
  }

  // Prevent using the app domain
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';
  if (domain.endsWith(appDomain)) {
    return { valid: false, error: `Cannot use ${appDomain} as custom domain. Use subdomain instead.` };
  }

  return { valid: true };
}

/**
 * Generate DNS verification token
 */
export function generateDNSVerificationToken(): string {
  return `loomos-verify-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}
