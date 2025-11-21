
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && userRole !== 'BOARD_MEMBER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organizationId = await getCurrentOrganizationId();
    const units = await prisma.propertyUnit.findMany({
      orderBy: [
        { building: 'asc' },
        { floor: 'asc' },
        { unitNumber: 'asc' }
      ]
    });

    return NextResponse.json({ units });
  } catch (error) {
    console.error('Error fetching property units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property units' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Check if unit number already exists
    const existingUnit = await prisma.propertyUnit.findUnique({
      where: {
        organizationId,
        unitNumber: data.unitNumber 
      }
    });

    if (existingUnit) {
      return NextResponse.json(
        { error: 'Unit number already exists' },
        { status: 400 }
      );
    }

    const unit = await prisma.propertyUnit.create({
      data: {
        organizationId,
        unitNumber: data.unitNumber,
        building: data.building || null,
        floor: data.floor || null,
        streetAddress: data.streetAddress || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        squareFootage: data.squareFootage || null,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        parkingSpaces: data.parkingSpaces || 0,
        storageUnit: data.storageUnit || null,
        occupancyStatus: data.occupancyStatus || 'occupied',
        monthlyDues: data.monthlyDues || null,
        notes: data.notes || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });

    return NextResponse.json({ unit }, { status: 201 });
  } catch (error) {
    console.error('Error creating property unit:', error);
    return NextResponse.json(
      { error: 'Failed to create property unit' },
      { status: 500 }
    );
  }
}
