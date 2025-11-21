// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organizationId = await getCurrentOrganizationId();
    const data = await request.json();
    const { id } = params;

    const unit = await prisma.propertyUnit.update({
      where: {
        organizationId, id 
      },
      data: {
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

    return NextResponse.json({ unit });
  } catch (error) {
    console.error('Error updating property unit:', error);
    return NextResponse.json(
      { error: 'Failed to update property unit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    await prisma.propertyUnit.delete({
      where: {
        organizationId, id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property unit:', error);
    return NextResponse.json(
      { error: 'Failed to delete property unit' },
      { status: 500 }
    );
  }
}
