
import { NextResponse } from 'next/server';
import { z } from 'zod';
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

    const transactions = await prisma.transaction.findMany({
      include: {
        account: {
          select: {
            accountName: true,
            accountType: true,
          }
        }
      },
      orderBy: {
        transactionDate: 'desc'
      },
      take: 100, // Limit to recent 100 transactions
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
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
    const transactionDate = new Date(data.transactionDate);

    const transaction = await prisma.transaction.create({
      data: {
        organizationId,
        transactionDate,
        accountId: data.accountId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        memo: data.memo,
        payee: data.payee,
        category: data.category,
        fiscalYear: transactionDate.getFullYear(),
        fiscalMonth: transactionDate.getMonth() + 1,
        createdById: session.user.id,
        tags: data.tags || [],
      },
    });

    // Update account balance
    const account = await prisma.chartOfAccounts.findUnique({
      where: {
        id: data.accountId 
      }
    });

    if (account) {
      const balanceChange = data.type === 'INCOME' ? 
        Number(data.amount) : 
        -Number(data.amount);

      await prisma.chartOfAccounts.update({
        where: {
          id: data.accountId 
        },
        data: {
          balance: Number(account.balance) + balanceChange
        }
      });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
