
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
 * PATCH /api/notifications/[id]
 * Update notification read status
 * 
 * Request Body:
 * - read: Boolean to set read status
 * 
 * @returns {Object} - Updated notification
 */
export const dynamic = 'force-dynamic';
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  const startTime = Date.now();
  const notificationId = params.id; // Move outside try block for error handling
  
  try {
    // Authenticate user
    const { user, session } = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();

    // Validate params
    if (!notificationId) {
      throw new ApiError('Notification ID is required', 400);
    }

    // Parse request body
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { read } = body;

    // Validate required fields
    validateRequiredFields(body, ['read']);

    // Verify notification belongs to user
    const existingNotification = await prisma.userNotification.findFirst({
      where: {
        organizationId,
        id: notificationId,
        userId: user.id,
      
      },
    });

    if (!existingNotification) {
      throw new ApiError('Notification not found or access denied', 404);
    }

    // Update the UserNotification record
    const updated = await prisma.userNotification.update({
      where: {
        organizationId,
        id: notificationId,
      
      },
      data: { 
        isRead: read,
        ...(read && { readAt: new Date() }),
      },
      include: {
        notification: true,
      },
    });

    const statusMessage = `Notification marked as ${read ? 'read' : 'unread'}`;

    // Log successful API call
    logApiCall(
      'PATCH',
      `/api/notifications/${notificationId}`,
      200,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      {
        notification: updated,
      },
      statusMessage,
      200
    );
  } catch (error) {
    return handleApiError(error, `/api/notifications/${notificationId}`, request);
  }

  } catch (error) {
    console.error('[API Error] PATCH error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification for the current user
 * 
 * @returns {Object} - Success status
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  const startTime = Date.now();
  const notificationId = params.id; // Move outside try block for error handling
  
  try {
    // Authenticate user
    const { user, session } = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();

    // Validate params
    if (!notificationId) {
      throw new ApiError('Notification ID is required', 400);
    }

    // Verify notification belongs to user before deleting
    const existingNotification = await prisma.userNotification.findFirst({
      where: {
        organizationId,
        id: notificationId,
        userId: user.id,
      
      },
    });

    if (!existingNotification) {
      throw new ApiError('Notification not found or access denied', 404);
    }

    // Delete the UserNotification record (not the notification itself)
    await prisma.userNotification.delete({
      where: {
        organizationId,
        id: notificationId,
      
      },
    });

    // Log successful API call
    logApiCall(
      'DELETE',
      `/api/notifications/${notificationId}`,
      200,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      {
        success: true,
      },
      'Notification deleted successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, `/api/notifications/${notificationId}`, request);
  }

  } catch (error) {
    console.error('[API Error] DELETE error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
