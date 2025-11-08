/**
 * Domain Verification API
 * Verifies custom domain DNS configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { withSuperAdminAuth } from '@/lib/api/with-tenant-auth';
import { prisma } from '@/lib/prisma';
import dns from 'dns/promises';

interface VerifyDomainBody {
  organizationId: string;
}

/**
 * POST /api/super-admin/domains/verify
 * Verify domain ownership via DNS TXT record
 */
export const POST = withSuperAdminAuth(async (req: NextRequest) => {
  try {
    const body: VerifyDomainBody = await req.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        customDomain: true,
        domainVerificationToken: true,
        domainVerified: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (!organization.customDomain) {
      return NextResponse.json(
        { error: 'No custom domain configured' },
        { status: 400 }
      );
    }

    if (!organization.domainVerificationToken) {
      return NextResponse.json(
        { error: 'No verification token generated' },
        { status: 400 }
      );
    }

    // Check DNS TXT record
    try {
      const txtRecords = await dns.resolveTxt(organization.customDomain);
      const flatRecords = txtRecords.flat();

      // Look for our verification token
      const verified = flatRecords.some((record) =>
        record.includes(organization.domainVerificationToken!)
      );

      if (verified) {
        // Update organization as verified
        await prisma.organization.update({
          where: { id: organizationId },
          data: {
            domainVerified: true,
            domainVerifiedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          verified: true,
          message: 'Domain verified successfully',
        });
      } else {
        return NextResponse.json({
          success: false,
          verified: false,
          message: `TXT record not found. Please add the TXT record: ${organization.domainVerificationToken}`,
          txtRecords: flatRecords,
        });
      }
    } catch (dnsError: any) {
      console.error('DNS lookup error:', dnsError);
      return NextResponse.json({
        success: false,
        verified: false,
        message: `DNS lookup failed: ${dnsError.message}. Make sure the domain is properly configured.`,
      });
    }
  } catch (error: any) {
    console.error('Domain verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify domain' },
      { status: 500 }
    );
  }
});
