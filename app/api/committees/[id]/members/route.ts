
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const body = await request.json();
    const { userId, position, bio, displayOrder } = body;

    const member = await prisma.committeeMember.create({
      data: {
        organizationId,
        committeeId: params.id,
        userId,
        position,
        bio,
        displayOrder: displayOrder || 0
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
    console.error('Error adding committee member:', error);
    return NextResponse.json(
      { error: 'Failed to add committee member' },
      { status: 500 }
    );
  }
}
