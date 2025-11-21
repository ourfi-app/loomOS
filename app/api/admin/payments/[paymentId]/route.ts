
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions, hasAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function PATCH(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const user = session.user as any;

    if (!hasAdminAccess(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { paymentId } = params;
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { status, paidDate } = body;

    const updatedPayment = await prisma.payment.update({
      where: {
        organizationId,
        id: paymentId 
      },
      data: {
        status,
        paidDate: paidDate ? new Date(paidDate) : null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            unitNumber: true
          }
        }
      }
    });

    return NextResponse.json({ payment: updatedPayment });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}
