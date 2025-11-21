// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * Simplified Single-Tenant Context Utilities
 * 
 * This app now uses a single default organization for all users,
 * simplifying the architecture and removing multi-tenancy complexity.
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './db';

const DEFAULT_ORGANIZATION_ID = 'default-org-id';

/**
 * Get the default organization ID for all users
 * In single-tenant mode, all users (including super admins) use the default organization
 */
export async function getCurrentOrganizationId(): Promise<string> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - No session found');
  }
  
  // In single-tenant mode, all users use the default organization
  // Super admin privileges are checked separately at the application level
  return DEFAULT_ORGANIZATION_ID;
}

/**
 * Get the current user's full context (user + organization)
 */
export async function getCurrentUserContext() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - No session found');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: true,
    },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    user,
    organization: user.organization,
    isSuperAdmin: user.role === 'SUPER_ADMIN',
    isAdmin: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN',
  };
}

/**
 * Middleware helper to enforce tenant isolation in Prisma queries
 * Automatically adds organizationId filter to where clauses
 */
export function withTenantFilter(organizationId: string) {
  return {
    organizationId,
  };
}

/**
 * Check if user has access to a specific organization
 */
export async function checkOrganizationAccess(organizationId: string): Promise<boolean> {
  const context = await getCurrentUserContext();
  
  // Super admins can access all organizations
  if (context.isSuperAdmin) {
    return true;
  }
  
  // Regular users can only access the default organization
  return organizationId === DEFAULT_ORGANIZATION_ID;
}

/**
 * Get the default organization
 */
export function getDefaultOrganizationId(): string {
  return DEFAULT_ORGANIZATION_ID;
}

/**
 * Check if the current user has admin privileges
 * Super admins always have admin access
 * @returns true if user is ADMIN or SUPER_ADMIN
 */
export async function requireAdmin(): Promise<void> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - No session found');
  }
  
  const userRole = (session.user as any).role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  
  if (!isAdmin) {
    throw new Error('Forbidden - Admin access required');
  }
}

/**
 * Check if the current user is a super admin
 * @returns true if user is SUPER_ADMIN
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return false;
  }
  
  const userRole = (session.user as any).role;
  return userRole === 'SUPER_ADMIN';
}
