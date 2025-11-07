
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfMonth, endOfMonth } from 'date-fns';
import {
  validateAuthentication,
  validateAdminRole,
  logApiCall,
  successResponse,
  handleApiError,
} from '@/lib/api-utils';

/**
 * GET /api/admin/stats
 * Fetch comprehensive admin statistics
 * Requires ADMIN role
 * 
 * @returns {Object} - Admin dashboard statistics
 */
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate and validate admin role
    const { user, session } = await validateAuthentication(request);
    validateAdminRole(user);

    const organizationId = user.organizationId;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Fetch all stats in parallel
    const [
      totalUsers,
      activeUsers,
      totalPayments,
      pendingPayments,
      overduePayments,
      paidPayments,
      monthlyPayments,
      totalDocuments,
      pendingRequests,
      recentPayments,
      recentUsers,
      recentRequests
    ] = await Promise.all([
      // User stats
      prisma.user.count({ where: { organizationId } }),
      prisma.user.count({ 
        where: {
          organizationId,
          isActive: true 
        } 
      }),

      // Payment stats
      prisma.payment.count({ where: { organizationId } }),
      prisma.payment.count({ 
        where: {
          organizationId,
          status: 'PENDING' 
        } 
      }),
      prisma.payment.count({ 
        where: {
          organizationId,
          status: 'OVERDUE' 
        } 
      }),
      prisma.payment.count({ 
        where: {
          organizationId,
          status: 'PAID',
          paidDate: { 
            gte: monthStart, 
            lte: monthEnd 
          }
        } 
      }),
      prisma.payment.findMany({
        where: {
          organizationId,
          status: 'PAID',
          paidDate: { 
            gte: monthStart, 
            lte: monthEnd 
          }
        },
        select: { amount: true }
      }),

      // Document stats
      prisma.file.count({ where: { organizationId } }),

      // Request stats
      prisma.directoryUpdateRequest.count({ 
        where: {
          organizationId,
          status: 'PENDING' 
        } 
      }),

      // Recent activity
      prisma.payment.findMany({
        where: {
          organizationId,
          createdAt: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: true }
      }),
      prisma.user.findMany({
        where: {
          organizationId,
          createdAt: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.directoryUpdateRequest.findMany({
        where: {
          organizationId,
          createdAt: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { requester: true }
      })
    ]);

    // Calculate monthly revenue
    const monthlyRevenue = monthlyPayments.reduce((sum: number, payment: any) => {
      return sum + Number(payment.amount);
    }, 0);

    // Calculate collection rate
    const totalDueThisMonth = await prisma.payment.count({
      where: {
        organizationId,
        dueDate: { 
          gte: monthStart, 
          lte: monthEnd 
        }
      }
    });

    const collectionRate = totalDueThisMonth > 0 
      ? (paidPayments / totalDueThisMonth) * 100 
      : 0;

    // Get unique unit count
    const uniqueUnits = await prisma.user.findMany({
      where: {
        organizationId,
        unitNumber: { not: null }
      },
      select: { unitNumber: true },
      distinct: ['unitNumber']
    });

    // Compile recent activity
    const recentActivity = [
      ...recentPayments.map((p: any) => ({
        type: 'payment',
        description: `${p.user.name} made a payment of $${Number(p.amount).toFixed(2)}`,
        timestamp: p.createdAt
      })),
      ...recentUsers.map((u: any) => ({
        type: 'user',
        description: `New user registered: ${u.name}`,
        timestamp: u.createdAt
      })),
      ...recentRequests.map((r: any) => ({
        type: 'request',
        description: `${r.requester.name} submitted a directory update request`,
        timestamp: r.createdAt
      }))
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const stats = {
      totalUsers,
      activeUsers,
      totalUnits: uniqueUnits.length,
      totalPayments,
      pendingPayments,
      overduePayments,
      paidPayments,
      monthlyRevenue: monthlyRevenue,
      collectionRate: Math.round(collectionRate * 100) / 100, // Round to 2 decimal places
      totalDocuments,
      pendingRequests,
      recentActivity
    };

    // Log successful API call
    logApiCall(
      'GET',
      '/api/admin/stats',
      200,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      stats,
      'Admin stats fetched successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/admin/stats', request);
  }
}
