
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

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const budgets = await prisma.annualBudget.findMany({
      include: {
        categories: {
          include: {
            account: {
              select: {
                accountNumber: true,
                accountType: true,
              }
            }
          }
        }
      },
      orderBy: {
        fiscalYear: 'desc'
      }
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
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

    const budget = await prisma.annualBudget.create({
      data: {
        organizationId,
        fiscalYear: data.fiscalYear,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'DRAFT',
        notes: data.notes,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Failed to create budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}
