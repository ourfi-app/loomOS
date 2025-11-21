
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

    const invoices = await prisma.invoice.findMany({
      orderBy: {
        dueDate: 'desc'
      },
      take: 100,
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
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

    const invoice = await prisma.invoice.create({
      data: {
        organizationId,
        invoiceNumber: data.invoiceNumber,
        vendorName: data.vendorName,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        amount: data.amount,
        balance: data.amount,
        description: data.description,
        category: data.category,
        status: 'unpaid',
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
