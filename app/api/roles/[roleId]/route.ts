
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/roles/[roleId] - Get a specific role
export async function GET(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, organizationId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const role = await prisma.customRole.findUnique({
      where: { id: params.roleId },
      include: {
        organization: {
          select: { id: true, name: true },
        },
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role !== 'SUPER_ADMIN' && role.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PUT /api/roles/[roleId] - Update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, organizationId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admins can update roles
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existingRole = await prisma.customRole.findUnique({
      where: { id: params.roleId },
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role !== 'SUPER_ADMIN' && existingRole.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot modify system roles
    if (existingRole.isSystem) {
      return NextResponse.json(
        { error: 'System roles cannot be modified' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, basedOn, permissionIds } = body;

    // If name is being changed, check for conflicts
    if (name && name !== existingRole.name) {
      const nameConflict = await prisma.customRole.findFirst({
        where: {
          name,
          organizationId: existingRole.organizationId,
          id: { not: params.roleId },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Role with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update the role
    const updatedRole = await prisma.customRole.update({
      where: { id: params.roleId },
      data: {
        name,
        description,
        basedOn,
      },
      include: {
        organization: {
          select: { id: true, name: true },
        },
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Update permissions if provided
    if (permissionIds && Array.isArray(permissionIds)) {
      // Delete existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: params.roleId },
      });

      // Create new permissions
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId: string) => ({
          roleId: params.roleId,
          permissionId,
          organizationId: existingRole.organizationId,
        })),
      });

      // Fetch updated role with new permissions
      const role = await prisma.customRole.findUnique({
        where: { id: params.roleId },
        include: {
          organization: {
            select: { id: true, name: true },
          },
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      return NextResponse.json({ role });
    }

    return NextResponse.json({ role: updatedRole });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE /api/roles/[roleId] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true, organizationId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admins can delete roles
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const role = await prisma.customRole.findUnique({
      where: { id: params.roleId },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role !== 'SUPER_ADMIN' && role.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot delete system roles
    if (role.isSystem) {
      return NextResponse.json(
        { error: 'System roles cannot be deleted' },
        { status: 403 }
      );
    }

    // Cannot delete role if users are assigned to it
    if (role._count.userRoles > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role with assigned users' },
        { status: 409 }
      );
    }

    // Delete the role
    await prisma.customRole.delete({
      where: { id: params.roleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}
