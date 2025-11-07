
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  logApiCall,
  successResponse,
  handleApiError,
} from '@/lib/api-utils';

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard/stats
 * Fetch dashboard statistics based on user role
 * 
 * @returns {Object} - Role-based dashboard statistics
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const { user, session } = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();

    const userId = user.id;
    const userRole = user.role;

    let stats: any = {};

    if (userRole === 'ADMIN' || userRole === 'BOARD_MEMBER') {
      // Admin/Board member stats - comprehensive overview
      const [
        totalUsers,
        totalPayments,
        pendingPayments,
        overduePayments,
        monthlyRevenue,
        recentAnnouncements
      ] = await Promise.all([
        prisma.user.count({ where: {
        organizationId,
        isActive: true 
      } }),
        prisma.payment.count(),
        prisma.payment.count({ where: {
        organizationId,
        status: PaymentStatus.PENDING 
      } }),
        prisma.payment.count({ where: {
        organizationId,
        status: PaymentStatus.OVERDUE 
      } }),
        prisma.payment.aggregate({
          where: {
        organizationId,
        status: PaymentStatus.PAID,
            paidDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            
      }
          },
          _sum: { amount: true }
        }),
        prisma.announcement.findMany({
          where: {
        organizationId,
        isActive: true 
      },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { author: { select: { name: true } } }
        })
      ]);

      stats = {
        totalUsers,
        totalPayments,
        pendingPayments,
        overduePayments,
        monthlyRevenue: Number(monthlyRevenue._sum.amount) || 0,
        recentAnnouncements,
        role: userRole
      };
    }

    if (userRole === 'RESIDENT') {
      // Resident-specific stats - personal overview
      const currentDate = new Date();
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const [userPayments, recentAnnouncements] = await Promise.all([
        prisma.payment.findMany({
          where: {
        organizationId, 
            userId,
            dueDate: { gte: currentMonth 
      }
          },
          orderBy: { dueDate: 'asc' },
          take: 1
        }),
        prisma.announcement.findMany({
          where: {
        organizationId,
        isActive: true 
      },
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { author: { select: { name: true } } }
        })
      ]);

      const currentPayment = userPayments[0];
      
      stats = {
        userPaymentStatus: currentPayment?.status || 'PENDING',
        userNextDue: currentPayment?.dueDate ? new Date(currentPayment.dueDate).toLocaleDateString() : null,
        recentAnnouncements,
        role: userRole
      };
    }

    // Common stats for all users (fallback)
    if (!stats.recentAnnouncements) {
      stats.recentAnnouncements = await prisma.announcement.findMany({
        where: {
        organizationId,
        isActive: true 
      },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { author: { select: { name: true } } }
      });
    }

    // Log successful API call
    logApiCall(
      'GET',
      '/api/dashboard/stats',
      200,
      Date.now() - startTime,
      userId
    );

    return successResponse(
      stats,
      'Dashboard stats fetched successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/dashboard/stats', request);
  }
}
