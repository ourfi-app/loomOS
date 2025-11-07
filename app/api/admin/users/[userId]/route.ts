
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organizationId = await getCurrentOrganizationId();
    const { userId } = params;
    const body = await request.json();
    const { name, unitNumber, phone, role } = body;

    const updatedUser = await prisma.user.update({
      where: {
        organizationId,
        id: userId 
      },
      data: {
        name,
        unitNumber: unitNumber || null,
        phone: phone || null,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        unitNumber: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = params;
    const body = await request.json();
    const { isActive } = body;

    const updatedUser = await prisma.user.update({
      where: {
        organizationId,
        id: userId 
      },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        unitNumber: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = params;

    await prisma.user.delete({
      where: {
        organizationId,
        id: userId 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
