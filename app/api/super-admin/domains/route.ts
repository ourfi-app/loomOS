
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

    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { subdomain: { not: null } },
          { customDomain: { not: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        customDomain: true,
        createdAt: true
      }
    });

    const domains = organizations.map(org => ({
      organizationId: org.id,
      organizationName: org.name,
      subdomain: org.subdomain,
      customDomain: org.customDomain,
      verified: true, // You can add actual verification logic
      createdAt: org.createdAt.toISOString()
    }));

    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
