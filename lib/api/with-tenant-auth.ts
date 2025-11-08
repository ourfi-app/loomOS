/**
 * API Route Protection with Tenant Isolation
 * HOC for protecting API routes and ensuring tenant context
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resolveTenant } from '@/lib/tenant/resolver';

export interface TenantContext {
  organizationId: string;
  userId: string;
  userRole: string;
  session: any;
}

type RouteHandler = (
  req: NextRequest,
  context: TenantContext
) => Promise<NextResponse> | NextResponse;

interface WithTenantAuthOptions {
  requireOrganization?: boolean; // Default: true
  allowedRoles?: string[]; // If specified, only these roles can access
  superAdminOnly?: boolean; // Only SUPER_ADMIN can access
}

/**
 * Higher-order function to protect API routes with tenant context
 *
 * Usage:
 * ```ts
 * export const GET = withTenantAuth(async (req, { organizationId, userId }) => {
 *   // Your route logic here
 *   // organizationId and userId are guaranteed to be available
 * });
 * ```
 */
export function withTenantAuth(
  handler: RouteHandler,
  options: WithTenantAuthOptions = {}
) {
  return async (req: NextRequest, routeContext?: any) => {
    const {
      requireOrganization = true,
      allowedRoles,
      superAdminOnly = false,
    } = options;

    // Get session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Check role restrictions
    if (superAdminOnly && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Super admin access required.' },
        { status: 403 }
      );
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: `Forbidden. Required role: ${allowedRoles.join(' or ')}` },
        { status: 403 }
      );
    }

    // Resolve organization
    let organizationId: string | null = null;

    if (requireOrganization || session.user.role !== 'SUPER_ADMIN') {
      // Try to get organization ID from route params
      const paramOrgId = routeContext?.params?.organizationId;

      const tenant = await resolveTenant(paramOrgId);

      if (!tenant) {
        return NextResponse.json(
          { error: 'Organization not found or inactive' },
          { status: 404 }
        );
      }

      organizationId = tenant.organizationId;

      // Verify user has access to this organization
      if (session.user.role !== 'SUPER_ADMIN') {
        if (session.user.organizationId !== organizationId) {
          return NextResponse.json(
            { error: 'Forbidden. You do not have access to this organization.' },
            { status: 403 }
          );
        }
      }
    }

    // Create tenant context
    const tenantContext: TenantContext = {
      organizationId: organizationId || '',
      userId: session.user.id,
      userRole: session.user.role,
      session,
    };

    try {
      // Call the actual handler with tenant context
      return await handler(req, tenantContext);
    } catch (error: any) {
      console.error('[API Error]', error);
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Simpler auth wrapper that doesn't require organization
 * Useful for user profile routes, etc.
 */
export function withAuth(handler: RouteHandler) {
  return withTenantAuth(handler, { requireOrganization: false });
}

/**
 * Super admin only routes
 */
export function withSuperAdminAuth(handler: RouteHandler) {
  return withTenantAuth(handler, {
    requireOrganization: false,
    superAdminOnly: true,
  });
}
