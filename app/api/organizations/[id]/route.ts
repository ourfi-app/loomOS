// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * Organization API
 * Get organization details for tenant context
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { withAuth } from '@/lib/api/with-tenant-auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/organizations/[id]
 * Get organization details
 */
export const GET = withAuth(
  async (req: NextRequest, context: { params: { id: string } }) => {
    try {
      const { id } = context.params;
      const { session } = context as any;

      // Check if user has access to this organization
      if (session.user.role !== 'SUPER_ADMIN' && session.user.organizationId !== id) {
        return NextResponse.json(
          { error: 'Access denied. You do not have access to this organization.' },
          { status: 403 }
        );
      }

      const organization = await prisma.organization.findUnique({
        where: { id },
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

      if (!organization) {
        return NextResponse.json(
          { error: 'Organization not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(organization);
    } catch (error: any) {
      console.error('Get organization error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch organization' },
        { status: 500 }
      );
    }
  }
);
