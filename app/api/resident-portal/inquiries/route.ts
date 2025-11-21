// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const inquiries = await prisma.residentInquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 100,
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // For public inquiry form, organizationId should be provided in the request
    const organizationId = data.organizationId;
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.residentInquiry.create({
      data: {
        organizationId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        inquiryType: data.inquiryType,
        unitOfInterest: data.unitOfInterest,
        message: data.message,
        preferredContactTime: data.preferredContactTime,
        status: 'new',
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
