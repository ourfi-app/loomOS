
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function PUT(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const organizationId = await getCurrentOrganizationId();
    const { position, bio, displayOrder } = body;

    const member = await prisma.committeeMember.update({
      where: {
        organizationId,
        id: params.memberId 
      },
      data: {
        position,
        bio,
        displayOrder
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            unitNumber: true,
            phone: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating committee member:', error);
    return NextResponse.json(
      { error: 'Failed to update committee member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const organizationId = await getCurrentOrganizationId();

    await prisma.committeeMember.delete({
      where: {
        organizationId,
        id: params.memberId 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing committee member:', error);
    return NextResponse.json(
      { error: 'Failed to remove committee member' },
      { status: 500 }
    );
  }
}
