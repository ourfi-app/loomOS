
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// GET /api/marketplace/featured - Get featured/recommended apps
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const userRole = (session.user as any).role;

    const apps = await prisma.marketplaceApp.findMany({
      where: {
        organizationId,
        status: 'AVAILABLE',
        isFeatured: true,
      },
      orderBy: [
        { rating: 'desc' },
        { installCount: 'desc' },
      ],
      take: 6,
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
    console.error('Error fetching featured apps:', error);
    return NextResponse.json({ error: 'Failed to fetch featured apps' }, { status: 500 });
  }
}
