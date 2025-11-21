
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

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    // Get the next upcoming payment (pending or overdue) within organization
    const nextPayment = await prisma.payment.findFirst({
      where: { 
        organizationId,
        userId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.OVERDUE] }
      },
      orderBy: { dueDate: 'asc' }
    });

    // If no upcoming payment, return null data
    if (!nextPayment) {
      logApiCall('GET', '/api/payments/next', 200, Date.now() - startTime, userId);
      return successResponse(null, 'No upcoming payments');
    }

    // Serialize payment data
    const serializedPayment = {
      id: nextPayment.id,
      amount: Number(nextPayment.amount),
      dueDate: nextPayment.dueDate.toISOString(),
      status: nextPayment.status,
      description: nextPayment.description || 'HOA Dues'
    };

    logApiCall('GET', '/api/payments/next', 200, Date.now() - startTime, userId);
    return successResponse(serializedPayment, 'Next payment fetched successfully');

  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : 'Failed to fetch next payment';
    
    logApiCall('GET', '/api/payments/next', status, Date.now() - startTime, userId, message);
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
