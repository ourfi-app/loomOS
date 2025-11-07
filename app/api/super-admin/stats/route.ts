
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Fetch organization stats
    const totalOrgs = await prisma.organization.count();
    const activeOrgs = await prisma.organization.count({
      where: { isActive: true, isSuspended: false }
    });
    const suspendedOrgs = await prisma.organization.count({
      where: { isSuspended: true }
    });
    const trialOrgs = await prisma.organization.count({
      where: { planType: 'trial' }
    });

    // Fetch user stats
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });
    const admins = await prisma.user.count({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });
    const residents = await prisma.user.count({
      where: { role: 'RESIDENT' }
    });

    // Fetch storage stats (simplified)
    const files = await prisma.file.aggregate({
      _sum: { size: true },
      _count: true
    });
    const totalStorage = Number(files._sum.size || 0) / (1024 * 1024 * 1024); // Convert to GB
    const storageLimit = 1000; // 1TB default
    const storagePercentage = (totalStorage / storageLimit) * 100;

    // Mock API stats (you can implement actual tracking)
    const apiCalls = {
      today: Math.floor(Math.random() * 10000) + 5000,
      thisWeek: Math.floor(Math.random() * 50000) + 25000,
      thisMonth: Math.floor(Math.random() * 200000) + 100000
    };

    // Recent activity (fetch last 5 system events)
    const recentOrgs = await prisma.organization.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    const recentUsers = await prisma.user.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const recentActivity = [
      ...recentOrgs.map(org => ({
        id: `org-${org.id}`,
        type: 'success',
        description: `New organization created: ${org.name}`,
        timestamp: org.createdAt.toISOString()
      })),
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'info',
        description: `New ${user.role.toLowerCase()} registered: ${user.email}`,
        timestamp: user.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    const stats = {
      organizations: {
        total: totalOrgs,
        active: activeOrgs,
        suspended: suspendedOrgs,
        trial: trialOrgs
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        admins,
        residents
      },
      storage: {
        used: totalStorage,
        limit: storageLimit,
        percentage: storagePercentage
      },
      apiCalls,
      recentActivity
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
