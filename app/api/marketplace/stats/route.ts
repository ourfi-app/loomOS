
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// GET /api/marketplace/stats - Get marketplace statistics
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const organizationId = await getCurrentOrganizationId();

    // Get counts
    const [totalApps, availableApps, installedCount] = await Promise.all([
      prisma.marketplaceApp.count({
        where: { organizationId },
      }),
      prisma.marketplaceApp.count({
        where: { organizationId, status: 'AVAILABLE' },
      }),
      prisma.userInstalledApp.count({
        where: { organizationId, userId },
      }),
    ]);
    
    // Get installed apps with versions to count updates
    const installedApps = await prisma.userInstalledApp.findMany({
      where: {
        organizationId,
        userId,
      },
      include: {
        app: true,
      },
    });
    
    const updateCount = installedApps.filter((installed) => {
      const currentVersion = installed.app.version;
      const installedVersion = installed.installedVersion || currentVersion;
      return currentVersion !== installedVersion;
    }).length;

    return NextResponse.json({
      totalApps,
      availableApps,
      installedCount,
      updateCount,
    });
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
