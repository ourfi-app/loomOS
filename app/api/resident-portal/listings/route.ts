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

    const listings = await prisma.propertyListing.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
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

    const listing = await prisma.propertyListing.create({
      data: {
        organizationId,
        unitNumber: data.unitNumber,
        listingType: data.listingType,
        status: 'available',
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFootage: data.squareFootage,
        floor: data.floor,
        building: data.building,
        description: data.description,
        features: data.features,
        images: data.images,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        isActive: true,
        publishedDate: new Date(),
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Failed to create listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
