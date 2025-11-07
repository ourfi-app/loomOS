/**
 * API Middleware Utilities
 *
 * Provides reusable middleware functions for API routes to handle common concerns:
 * - Authentication
 * - Authorization (role-based access control)
 * - Organization context
 * - Error handling
 *
 * Usage:
 *   export const GET = withAuth(async (req, session) => {
 *     // Your handler code with guaranteed session
 *   });
 *
 *   export const POST = withAdmin(async (req, session) => {
 *     // Your handler code with guaranteed admin access
 *   });
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions, hasAdminAccess, hasBoardAccess, isSuperAdmin } from './auth';
import { getCurrentOrganizationId } from './tenant-context';
import { UserRole } from '@prisma/client';

/**
 * Extended session type with our custom user properties
 */
export interface AuthSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    organizationId: string | null;
    unitNumber?: string;
    onboardingCompleted: boolean;
  };
}

/**
 * API handler with authenticated session
 */
export type AuthenticatedHandler = (
  req: NextRequest,
  session: AuthSession
) => Promise<NextResponse> | NextResponse;

/**
 * API handler with authenticated session and organization ID
 */
export type TenantHandler = (
  req: NextRequest,
  session: AuthSession,
  organizationId: string
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware: Require authentication
 * Ensures user is logged in before proceeding
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'You must be logged in to access this resource' },
          { status: 401 }
        );
      }

      return handler(req, session as AuthSession);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'An error occurred during authentication' },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware: Require admin access
 * Ensures user has ADMIN or SUPER_ADMIN role
 */
export function withAdmin(handler: AuthenticatedHandler) {
  return withAuth(async (req, session) => {
    if (!hasAdminAccess(session.user.role)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'You do not have permission to access this resource. Admin access required.',
        },
        { status: 403 }
      );
    }

    return handler(req, session);
  });
}

/**
 * Middleware: Require board member access
 * Ensures user has BOARD_MEMBER, ADMIN, or SUPER_ADMIN role
 */
export function withBoardAccess(handler: AuthenticatedHandler) {
  return withAuth(async (req, session) => {
    if (!hasBoardAccess(session.user.role)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'You do not have permission to access this resource. Board member access required.',
        },
        { status: 403 }
      );
    }

    return handler(req, session);
  });
}

/**
 * Middleware: Require super admin access
 * Ensures user has SUPER_ADMIN role
 */
export function withSuperAdmin(handler: AuthenticatedHandler) {
  return withAuth(async (req, session) => {
    if (!isSuperAdmin(session.user.role)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'You do not have permission to access this resource. Super admin access required.',
        },
        { status: 403 }
      );
    }

    return handler(req, session);
  });
}

/**
 * Middleware: Require authentication and provide organization context
 * Automatically includes the current organization ID
 */
export function withTenant(handler: TenantHandler) {
  return withAuth(async (req, session) => {
    try {
      const organizationId = await getCurrentOrganizationId();
      return handler(req, session, organizationId);
    } catch (error) {
      console.error('Tenant context error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to determine organization context' },
        { status: 500 }
      );
    }
  });
}

/**
 * Middleware: Admin access with organization context
 */
export function withAdminTenant(handler: TenantHandler) {
  return withAdmin(async (req, session) => {
    try {
      const organizationId = await getCurrentOrganizationId();
      return handler(req, session, organizationId);
    } catch (error) {
      console.error('Tenant context error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to determine organization context' },
        { status: 500 }
      );
    }
  });
}

/**
 * Helper: Extract and validate request body with Zod schema
 */
export async function validateRequestBody<T>(
  req: NextRequest,
  schema: { parse: (data: unknown) => T }
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Invalid request data',
            details: zodError.issues.map((issue) => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON in request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Helper: Check if user owns a resource
 * Useful for ensuring users can only modify their own data
 */
export function isResourceOwner(session: AuthSession, resourceUserId: string): boolean {
  return session.user.id === resourceUserId || isSuperAdmin(session.user.role);
}

/**
 * Helper: Check if user belongs to the same organization as the resource
 */
export function isSameOrganization(session: AuthSession, resourceOrgId: string): boolean {
  return (
    session.user.organizationId === resourceOrgId ||
    isSuperAdmin(session.user.role)
  );
}
