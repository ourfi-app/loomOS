
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const organizationId = await getCurrentOrganizationId();
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { name, description, type, email, displayOrder, isActive } = body;

    const committee = await prisma.committee.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        name,
        description,
        type,
        email,
        displayOrder,
        isActive
      }
    });

    return NextResponse.json({ committee });
  } catch (error) {
    console.error('Error updating committee:', error);
    return NextResponse.json(
      { error: 'Failed to update committee' },
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
    
    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const organizationId = await getCurrentOrganizationId();

    await prisma.committee.delete({
      where: {
        organizationId,
        id: params.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting committee:', error);
    return NextResponse.json(
      { error: 'Failed to delete committee' },
      { status: 500 }
    );
  }
}
