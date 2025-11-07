
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/users/[userId]/roles - Get user's custom roles
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, organizationId: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, organizationId: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Check permissions
    if (currentUser.role !== 'SUPER_ADMIN' && targetUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userRoles = await prisma.userCustomRole.findMany({
      where: { userId: params.userId },
      include: {
        customRole: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ userRoles });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user roles' },
      { status: 500 }
    );
  }
}

// POST /api/users/[userId]/roles - Assign role to user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, organizationId: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admins can assign roles
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { customRoleId } = body;

    if (!customRoleId) {
      return NextResponse.json(
        { error: 'customRoleId is required' },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, organizationId: true },
    });

    if (!targetUser || !targetUser.organizationId) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Check permissions
    if (currentUser.role !== 'SUPER_ADMIN' && targetUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify the role exists and belongs to the same organization
    const role = await prisma.customRole.findUnique({
      where: { id: customRoleId },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (currentUser.role !== 'SUPER_ADMIN' && role.organizationId !== targetUser.organizationId) {
      return NextResponse.json({ error: 'Role not accessible' }, { status: 403 });
    }

    // Check if user already has this role
    const existingAssignment = await prisma.userCustomRole.findFirst({
      where: {
        userId: params.userId,
        customRoleId,
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'User already has this role' },
        { status: 409 }
      );
    }

    // Assign the role
    const userRole = await prisma.userCustomRole.create({
      data: {
        userId: params.userId,
        customRoleId,
        organizationId: targetUser.organizationId,
        assignedBy: currentUser.id,
      },
      include: {
        customRole: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ userRole }, { status: 201 });
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[userId]/roles - Remove role from user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, organizationId: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admins can remove roles
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const customRoleId = searchParams.get('customRoleId');

    if (!customRoleId) {
      return NextResponse.json(
        { error: 'customRoleId is required' },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, organizationId: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Check permissions
    if (currentUser.role !== 'SUPER_ADMIN' && targetUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.userCustomRole.deleteMany({
      where: {
        userId: params.userId,
        customRoleId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing role:', error);
    return NextResponse.json(
      { error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}
