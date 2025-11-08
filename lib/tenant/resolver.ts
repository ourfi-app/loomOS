/**
 * Server-side Tenant Resolver
 * Resolves organization from various sources (headers, params, session)
 */

import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resolveTenantFromRequest } from './routing';

export interface ResolvedTenant {
  organizationId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    subdomain: string | null;
    customDomain: string | null;
    logo: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    features: any;
    planType: string | null;
    isActive: boolean;
    isSuspended: boolean;
  };
  source: 'subdomain' | 'custom_domain' | 'session' | 'param';
}

/**
 * Resolve tenant from multiple sources
 * Priority:
 * 1. URL parameter (for SUPER_ADMIN impersonation)
 * 2. Subdomain/Custom domain
 * 3. User's session (their organization)
 */
export async function resolveTenant(
  orgIdParam?: string
): Promise<ResolvedTenant | null> {
  // Priority 1: URL parameter (SUPER_ADMIN switching organizations)
  if (orgIdParam) {
    const session = await getServerSession(authOptions);

    // Only allow SUPER_ADMIN to use this
    if (session?.user?.role === 'SUPER_ADMIN') {
      const org = await prisma.organization.findUnique({
        where: { id: orgIdParam },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          customDomain: true,
          logo: true,
          primaryColor: true,
          secondaryColor: true,
          features: true,
          planType: true,
          isActive: true,
          isSuspended: true,
        },
      });

      if (org) {
        return {
          organizationId: org.id,
          organization: org,
          source: 'param',
        };
      }
    }
  }

  // Priority 2: Subdomain or custom domain from request
  const tenantInfo = await resolveTenantFromRequest();
  if (tenantInfo) {
    const org = await prisma.organization.findUnique({
      where: { id: tenantInfo.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        subdomain: true,
        customDomain: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        features: true,
        planType: true,
        isActive: true,
        isSuspended: true,
      },
    });

    if (org) {
      return {
        organizationId: org.id,
        organization: org,
        source: tenantInfo.customDomain ? 'custom_domain' : 'subdomain',
      };
    }
  }

  // Priority 3: User's session organization
  const session = await getServerSession(authOptions);
  if (session?.user?.organizationId) {
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        subdomain: true,
        customDomain: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        features: true,
        planType: true,
        isActive: true,
        isSuspended: true,
      },
    });

    if (org) {
      return {
        organizationId: org.id,
        organization: org,
        source: 'session',
      };
    }
  }

  return null;
}

/**
 * Get organization by ID (with permission check)
 */
export async function getOrganization(organizationId: string) {
  const session = await getServerSession(authOptions);

  // SUPER_ADMIN can access any organization
  if (session?.user?.role === 'SUPER_ADMIN') {
    return prisma.organization.findUnique({
      where: { id: organizationId },
    });
  }

  // Others can only access their own organization
  if (session?.user?.organizationId !== organizationId) {
    throw new Error('Unauthorized: Cannot access this organization');
  }

  return prisma.organization.findUnique({
    where: { id: organizationId },
  });
}

/**
 * Ensure user has access to organization
 */
export async function ensureOrganizationAccess(organizationId: string): Promise<void> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // SUPER_ADMIN has access to everything
  if (session.user.role === 'SUPER_ADMIN') {
    return;
  }

  // Check if user belongs to this organization
  if (session.user.organizationId !== organizationId) {
    throw new Error('Unauthorized: You do not have access to this organization');
  }
}
