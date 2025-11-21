
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/roles - Get all roles
export async function GET(request: NextRequest) {
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

    // Super admins can see all roles across all organizations
    // Regular admins can only see roles for their organization
    const whereClause = user.role === 'SUPER_ADMIN' 
      ? {} 
      : { organizationId: user.organizationId };

    const roles = await prisma.customRole.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST /api/roles - Create a new role
export async function POST(request: NextRequest) {
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

    // Only admins and super admins can create roles
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { name, description, basedOn, permissionIds, organizationId } = body;

    // Validate required fields
    if (!name || !permissionIds || !Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'Name and permissionIds are required' },
        { status: 400 }
      );
    }

    // For regular admins, ensure they're only creating roles for their org
    const targetOrgId = user.role === 'SUPER_ADMIN' 
      ? (organizationId || user.organizationId)
      : user.organizationId;

    if (!targetOrgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Check if role name already exists in the organization
    const existingRole = await prisma.customRole.findFirst({
      where: {
        name,
        organizationId: targetOrgId,
      },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 409 }
      );
    }

    // Create the role with permissions
    const role = await prisma.customRole.create({
      data: {
        name,
        description,
        basedOn,
        organizationId: targetOrgId,
        rolePermissions: {
          create: permissionIds.map((permissionId: string) => ({
            permissionId,
            organizationId: targetOrgId,
          })),
        },
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}
