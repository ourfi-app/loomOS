/**
 * Domains List API
 * Get all organizations with their domain configuration
 */

import { NextResponse } from 'next/server';
import { validateAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { withSuperAdminAuth } from '@/lib/api/with-tenant-auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/super-admin/domains
 * Get all organizations with domain configuration
 */
export const GET = withSuperAdminAuth(async () => {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { subdomain: { not: null } },
          { customDomain: { not: null } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        subdomain: true,
        customDomain: true,
        domainVerified: true,
        domainVerifiedAt: true,
        domainVerificationToken: true,
        sslCertificateStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const domains = organizations.map((org) => ({
      organizationId: org.id,
      organizationName: org.name,
      subdomain: org.subdomain,
      customDomain: org.customDomain,
      verified: org.domainVerified || false,
      verifiedAt: org.domainVerifiedAt,
      verificationToken: org.domainVerificationToken,
      sslStatus: org.sslCertificateStatus,
      createdAt: org.createdAt.toISOString(),
    }));

    return NextResponse.json(domains);
  } catch (error: any) {
    console.error('List domains error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch domains' },
      { status: 500 }
    );
  }
});
