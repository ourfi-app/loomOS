
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

    // Fetch recent organizations created
    const recentOrgs = await prisma.organization.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        createdById: true
      }
    });

    // Fetch recent users created
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    // Combine and format activity logs
    const activities = [
      ...recentOrgs.map(org => ({
        id: `org-${org.id}`,
        type: 'success' as const,
        category: 'organization',
        description: `New organization created: ${org.name}`,
        user: null,
        organization: org.name,
        timestamp: org.createdAt.toISOString(),
        metadata: { organizationId: org.id }
      })),
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'info' as const,
        category: 'user',
        description: `New ${user.role.toLowerCase()} registered: ${user.email}`,
        user: user.email,
        organization: user.organization?.name || null,
        timestamp: user.createdAt.toISOString(),
        metadata: { userId: user.id, role: user.role }
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
