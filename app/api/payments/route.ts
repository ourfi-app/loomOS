
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";
import { getCurrentOrganizationId } from "@/lib/tenant-context";
import {
  validateAuthentication,
  successResponse,
  errorResponse,
  logApiCall,
  ApiError
} from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Validate authentication
    const session = await validateAuthentication(request);
    userId = session.user.id;
    const userRole = session.user.role;

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    let payments: any[] = [];
    let stats: any = {};

    // Role-based data retrieval
    if (userRole === 'ADMIN' || userRole === 'BOARD_MEMBER') {
      // Admin/Board: Get all payments with user details (within organization)
      payments = await prisma.payment.findMany({
        where: { organizationId },
        orderBy: { dueDate: 'desc' },
        take: 50,
        include: {
          user: {
            select: {
              name: true,
              unitNumber: true,
              email: true
            }
          }
        }
      });

      // Admin statistics (within organization)
      const [totalPaid, currentDue, overdueCount] = await Promise.all([
        prisma.payment.aggregate({
          where: { 
            organizationId,
        status: PaymentStatus.PAID 
          },
          _sum: { amount: true }
        }),
        prisma.payment.aggregate({
          where: { 
            organizationId,
        status: PaymentStatus.PENDING 
          },
          _sum: { amount: true }
        }),
        prisma.payment.count({
          where: { 
            organizationId,
        status: PaymentStatus.OVERDUE 
          }
        })
      ]);

      stats = {
        totalPaid: Number(totalPaid._sum.amount) || 0,
        currentDue: Number(currentDue._sum.amount) || 0,
        overdueCount,
        paymentStatus: overdueCount > 0 ? 'Issues' : 'Good'
      };
    } else {
      // Resident: Get only their payments (within organization)
      payments = await prisma.payment.findMany({
        where: { 
          organizationId,
          userId 
        },
        orderBy: { dueDate: 'desc' },
        take: 20
      });

      // Resident statistics (within organization)
      const [totalPaid, currentDue] = await Promise.all([
        prisma.payment.aggregate({
          where: { 
            organizationId,
            userId,
            status: PaymentStatus.PAID 
          },
          _sum: { amount: true }
        }),
        prisma.payment.findFirst({
          where: { 
            organizationId,
            userId,
            status: { in: [PaymentStatus.PENDING, PaymentStatus.OVERDUE] }
          },
          orderBy: { dueDate: 'asc' }
        })
      ]);

      stats = {
        totalPaid: Number(totalPaid._sum.amount) || 0,
        currentDue: currentDue ? Number(currentDue.amount) : 0,
        paymentStatus: currentDue ? (currentDue.status === 'OVERDUE' ? 'Overdue' : 'Pending') : 'Current',
        nextDueDate: currentDue ? new Date(currentDue.dueDate).toLocaleDateString() : 'N/A'
      };
    }

    // Convert BigInt to Number for JSON serialization
    const serializedPayments = payments.map(payment => ({
      ...payment,
      amount: Number(payment.amount)
    }));

    logApiCall('GET', '/api/payments', 200, Date.now() - startTime, userId);
    return successResponse(
      { payments: serializedPayments, stats },
      'Payments fetched successfully'
    );

  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : 'Failed to fetch payments';
    
    logApiCall('GET', '/api/payments', status, Date.now() - startTime, userId, message);
    return errorResponse(message, status);
  }

  } catch (error) {
    console.error('[API Error] GET error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
