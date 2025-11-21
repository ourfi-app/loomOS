// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

// GET /api/marketplace/search - Search marketplace apps
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const userRole = (session.user as any).role;

    if (!query && !category) {
      return NextResponse.json([]);
    }

    const apps = await prisma.marketplaceApp.findMany({
      where: {
        organizationId,
        ...(category && category !== 'ALL' ? { category: category as any } : {}),
        OR: query
          ? [
              { name: { contains: query, mode: 'insensitive' } },
              { shortDescription: { contains: query, mode: 'insensitive' } },
              { longDescription: { contains: query, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: [
        { rating: 'desc' },
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
    console.error('Error searching apps:', error);
    return NextResponse.json({ error: 'Failed to search apps' }, { status: 500 });
  }
}
