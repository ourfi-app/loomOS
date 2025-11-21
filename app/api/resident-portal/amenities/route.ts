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

    const amenities = await prisma.propertyAmenity.findMany({
      orderBy: {
        displayOrder: 'asc'
      }
    });

    return NextResponse.json(amenities);
  } catch (error) {
    console.error('Failed to fetch amenities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = await getCurrentOrganizationId();
    const data = await request.json();

    const amenity = await prisma.propertyAmenity.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
        category: data.category,
        icon: data.icon,
        imagePath: data.imagePath,
        isAvailable: true,
        displayOrder: data.displayOrder || 0,
      },
    });

    return NextResponse.json(amenity);
  } catch (error) {
    console.error('Failed to create amenity:', error);
    return NextResponse.json(
      { error: 'Failed to create amenity' },
      { status: 500 }
    );
  }
}
