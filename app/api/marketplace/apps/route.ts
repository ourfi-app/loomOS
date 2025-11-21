// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

// GET /api/marketplace/apps - Get all available apps
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const userRole = (session.user as any).role;

    const apps = await prisma.marketplaceApp.findMany({
      where: {
        organizationId,
        status: 'AVAILABLE',
        ...(category && category !== 'ALL' ? { category: category as any 
      } : {}),
      },
      orderBy: [
        { installCount: 'desc' },
        { name: 'asc' },
      ],
    });

    // Filter based on user role
    const filteredApps = apps.filter((app: any) => {
      if (!app.minRole) return true;
      const roleHierarchy = { RESIDENT: 0, BOARD_MEMBER: 1, ADMIN: 2 };
      const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[app.minRole as keyof typeof roleHierarchy] || 0;
      return userLevel >= requiredLevel;
    });

    return NextResponse.json(filteredApps);
  } catch (error) {
    console.error('Error fetching marketplace apps:', error);
    return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 });
  }
}
