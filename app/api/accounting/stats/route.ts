// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

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
    // Get current fiscal year
    const currentYear = new Date().getFullYear();
    
    // Get all accounts by type
    const accounts = await prisma.chartOfAccounts.findMany({
      where: {
        organizationId,
        isActive: true 
      },
    });

    // Calculate totals by account type
    const totalAssets = accounts
      .filter(a => a.accountType === 'ASSET')
      .reduce((sum, a) => sum + Number(a.balance), 0);

    const totalLiabilities = accounts
      .filter(a => a.accountType === 'LIABILITY')
      .reduce((sum, a) => sum + Number(a.balance), 0);

    // Get transactions for current year
    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId,
        fiscalYear: currentYear,
      
      },
    });

    const totalRevenue = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const netIncome = totalRevenue - totalExpenses;

    // Get accounts receivable (from payments)
    const accountsReceivable = await prisma.payment.aggregate({
      where: {
        organizationId,
        status: {
          in: ['PENDING', 'OVERDUE']
        
      }
      },
      _sum: {
        amount: true
      }
    });

    // Get accounts payable (from invoices)
    const accountsPayable = await prisma.invoice.aggregate({
      where: {
        organizationId,
        status: {
          in: ['unpaid', 'partial']
        
      }
      },
      _sum: {
        balance: true
      }
    });

    // Get cash balance
    const cashAccounts = accounts.filter(a => 
      a.accountType === 'ASSET' && 
      a.accountName.toLowerCase().includes('cash')
    );
    const cashBalance = cashAccounts.reduce((sum, a) => sum + Number(a.balance), 0);

    return NextResponse.json({
      totalAssets,
      totalLiabilities,
      totalRevenue,
      totalExpenses,
      netIncome,
      accountsReceivable: Number(accountsReceivable._sum.amount || 0),
      accountsPayable: Number(accountsPayable._sum.balance || 0),
      cashBalance,
    });
  } catch (error) {
    console.error('Failed to fetch accounting stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
