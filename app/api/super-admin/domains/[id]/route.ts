/**
 * Domain Management API
 * CRUD operations for organization domains
 */

import { NextRequest, NextResponse } from 'next/server';
import { withSuperAdminAuth } from '@/lib/api/with-tenant-auth';
import { prisma } from '@/lib/prisma';
import {
  validateSubdomain,
  validateCustomDomain,
  generateDNSVerificationToken,
} from '@/lib/tenant/routing';

interface UpdateDomainBody {
  subdomain?: string | null;
  customDomain?: string | null;
}

/**
 * GET /api/super-admin/domains/[id]
 * Get domain configuration for an organization
 */
export const GET = withSuperAdminAuth(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;

      const organization = await prisma.organization.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          customDomain: true,
          domainVerificationToken: true,
          domainVerified: true,
          domainVerifiedAt: true,
          sslCertificateStatus: true,
          sslCertificateExpiry: true,
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
      console.error('Get domain error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to get domain configuration' },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/super-admin/domains/[id]
 * Update domain configuration
 */
export const PUT = withSuperAdminAuth(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      const body: UpdateDomainBody = await req.json();

      const { subdomain, customDomain } = body;

      // Validate subdomain if provided
      if (subdomain !== undefined && subdomain !== null) {
        const validation = validateSubdomain(subdomain);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        // Check if subdomain is already taken
        const existing = await prisma.organization.findFirst({
          where: {
            subdomain,
            id: { not: id },
          },
        });

        if (existing) {
          return NextResponse.json(
            { error: 'Subdomain is already taken' },
            { status: 409 }
          );
        }
      }

      // Validate custom domain if provided
      if (customDomain !== undefined && customDomain !== null) {
        const validation = validateCustomDomain(customDomain);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        // Check if custom domain is already taken
        const existing = await prisma.organization.findFirst({
          where: {
            customDomain,
            id: { not: id },
          },
        });

        if (existing) {
          return NextResponse.json(
            { error: 'Custom domain is already in use' },
            { status: 409 }
          );
        }
      }

      // Prepare update data
      const updateData: any = {};

      if (subdomain !== undefined) {
        updateData.subdomain = subdomain;
      }

      if (customDomain !== undefined) {
        updateData.customDomain = customDomain;

        // Generate verification token if setting a new custom domain
        if (customDomain) {
          updateData.domainVerificationToken = generateDNSVerificationToken();
          updateData.domainVerified = false;
          updateData.domainVerifiedAt = null;
        } else {
          // Clearing custom domain
          updateData.domainVerificationToken = null;
          updateData.domainVerified = false;
          updateData.domainVerifiedAt = null;
          updateData.sslCertificateStatus = null;
          updateData.sslCertificateExpiry = null;
        }
      }

      // Update organization
      const updated = await prisma.organization.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          customDomain: true,
          domainVerificationToken: true,
          domainVerified: true,
          domainVerifiedAt: true,
          sslCertificateStatus: true,
          sslCertificateExpiry: true,
        },
      });

      return NextResponse.json({
        success: true,
        organization: updated,
      });
    } catch (error: any) {
      console.error('Update domain error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update domain configuration' },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/super-admin/domains/[id]
 * Remove custom domain configuration
 */
export const DELETE = withSuperAdminAuth(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;

      // Remove custom domain but keep subdomain
      await prisma.organization.update({
        where: { id },
        data: {
          customDomain: null,
          domainVerificationToken: null,
          domainVerified: false,
          domainVerifiedAt: null,
          sslCertificateStatus: null,
          sslCertificateExpiry: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Custom domain removed successfully',
      });
    } catch (error: any) {
      console.error('Delete domain error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to remove custom domain' },
        { status: 500 }
      );
    }
  }
);
