
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  validateRequiredFields,
  logApiCall,
  successResponse,
  errorResponse,
  ApiError,
  handleApiError,
} from '@/lib/api-utils';

/**
 * GET /api/notifications
 * Fetch user notifications with optional filtering
 * 
 * Query Parameters:
 * - limit: Number of notifications to fetch (default: 10)
 * - unread: Filter to only unread notifications (true/false)
 * 
 * @returns {Object} - Notifications list and unread count
 */
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const { user, session } = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Cap at 100
    const onlyUnread = searchParams.get('unread') === 'true';

    // Fetch user notifications with notification details
    const userNotifications = await prisma.userNotification.findMany({
      where: {
        organizationId,
        userId: user.id,
        ...(onlyUnread && { isRead: false }),
      },
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Count unread notifications
    const unreadCount = await prisma.userNotification.count({
      where: {
        organizationId,
        userId: user.id,
        isRead: false,
      },
    });

    // Log successful API call
    logApiCall(
      'GET',
      '/api/notifications',
      200,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      {
        notifications: userNotifications,
        unreadCount,
        metadata: {
          limit,
          onlyUnread,
          count: userNotifications.length,
        },
      },
      'Notifications fetched successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/notifications', request);
  }

  } catch (error) {
    console.error('[API Error] GET error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

/**
 * PATCH /api/notifications
 * Mark notification(s) as read
 * 
 * Request Body:
 * - notificationId: ID of specific notification to mark as read (optional)
 * - markAllAsRead: Boolean to mark all notifications as read (optional)
 * 
 * @returns {Object} - Success status
 */
export async function PATCH(request: Request) {
  try {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const { user, session } = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();

    // Parse and validate request body
    const body = await request.json();
    const bodySchema = z.object({
      notificationId: z.string().optional(),
      markAllAsRead: z.boolean().optional(),
    }).refine(
      (data) => data.notificationId || data.markAllAsRead,
      { message: 'Either notificationId or markAllAsRead must be provided' }
    );
    const validatedBody = bodySchema.parse(body);
    
    const { notificationId, markAllAsRead } = validatedBody;

    let result;
    let message;

    if (markAllAsRead) {
      // Mark all notifications as read
      result = await prisma.userNotification.updateMany({
        where: {
          organizationId,
          userId: user.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      message = `Marked ${result.count} notifications as read`;

      // Log successful API call
      logApiCall(
        'PATCH',
        '/api/notifications',
        200,
        Date.now() - startTime,
        user.id
      );

      return successResponse(
        {
          success: true,
          message,
          updatedCount: result.count,
        },
        message,
        200
      );
    }

    // Validate notification ID for single notification update
    validateRequiredFields({ notificationId }, ['notificationId']);

    // Mark specific notification as read
    result = await prisma.userNotification.updateMany({
      where: {
        organizationId,
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new ApiError('Notification not found or access denied', 404);
    }

    message = 'Notification marked as read';

    // Log successful API call
    logApiCall(
      'PATCH',
      '/api/notifications',
      200,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      {
        success: true,
        message,
      },
      message,
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/notifications', request);
  }

  } catch (error) {
    console.error('[API Error] PATCH error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
