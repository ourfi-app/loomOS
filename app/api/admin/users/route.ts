
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const user = session.user as any;

    // SUPER_ADMIN has unrestricted access to everything
    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organizationId = await getCurrentOrganizationId();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
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
    const user = session.user as any;

    // SUPER_ADMIN has unrestricted access to everything
    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, unitNumber, phone, role, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        organizationId, email 
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        organizationId,
        name,
        email,
        password: hashedPassword,
        unitNumber: unitNumber || null,
        phone: phone || null,
        role: role || 'RESIDENT',
        isActive: true
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

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
