
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await prisma.chartOfAccounts.findMany({
      orderBy: [
        { accountType: 'asc' },
        { accountNumber: 'asc' }
      ]
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = await getCurrentOrganizationId();
    const data = await request.json();

    const account = await prisma.chartOfAccounts.create({
      data: {
        organizationId,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        accountType: data.accountType,
        description: data.description,
        parentAccountId: data.parentAccountId,
        isActive: true,
        balance: 0,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Failed to create account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
