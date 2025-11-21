
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  validateAdminRole,
  ApiError,
  successResponse,
  errorResponse,
  logApiCall,
  validateRequiredFields,
} from '@/lib/api-utils';
import { serverNotifications, logIntegrationEvent } from '@/lib/server-integration';

/**
 * PATCH /api/directory-update-requests/[id]
 * Review (approve or reject) a directory update request
 * - Admin only
 * - If approved, applies the requested changes to the user profile
 */
export const dynamic = 'force-dynamic';
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const startTime = Date.now();
  
  try {
    // Authenticate user and validate admin role
    const session = await validateAuthentication(request);

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    validateAdminRole(session);
    
    // Parse and validate request body
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { status, reviewNotes } = body;
    
    // Validate required fields
    validateRequiredFields(body, ['status']);
    
    // Validate status value
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      throw new ApiError('Status must be either APPROVED or REJECTED', 400);
    }
    
    // Fetch the update request
    const updateRequest = await prisma.directoryUpdateRequest.findUnique({
      where: {
        organizationId,
        id: params.id 
      },
      include: {
        user: true,
      },
    });
    
    if (!updateRequest) {
      throw new ApiError('Update request not found', 404);
    }
    
    // Check if request has already been reviewed
    if (updateRequest.status !== 'PENDING') {
      throw new ApiError('This request has already been reviewed', 400);
    }
    
    // If approved, apply the changes to the user profile
    if (status === 'APPROVED') {
      const requestedData = updateRequest.requestedData as any;
      
      if (updateRequest.updateType === 'profile') {
        await prisma.user.update({
          where: {
        organizationId,
        id: updateRequest.userId 
      },
          data: {
            firstName: requestedData.firstName,
            lastName: requestedData.lastName,
            name: requestedData.name,
            unitNumber: requestedData.unitNumber,
            phone: requestedData.phone,
          },
        });
      }
    }
    
    // Update the request status
    const updated = await prisma.directoryUpdateRequest.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        status,
        reviewNotes,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            unitNumber: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    
    // Integration: Notify requester of decision
    try {
      if (status === 'APPROVED') {
        await serverNotifications.notifyDirectoryUpdateApproved(
          updateRequest.requestedBy,
          session.user.name || session.user.email || 'Admin',
          organizationId
        );

        logIntegrationEvent({
          type: 'DIRECTORY_UPDATE_APPROVED',
          data: {
            requestId: updateRequest.id,
            userId: updateRequest.requestedBy,
          },
        });
      } else {
        await serverNotifications.notifyDirectoryUpdateRejected(
          updateRequest.requestedBy,
          session.user.name || session.user.email || 'Admin',
          reviewNotes || 'No reason provided',
          organizationId
        );

        logIntegrationEvent({
          type: 'DIRECTORY_UPDATE_REJECTED',
          data: {
            requestId: updateRequest.id,
            userId: updateRequest.requestedBy,
            reason: reviewNotes,
          },
        });
      }
    } catch (notificationError) {
      console.error('[Integration] Failed to send decision notification:', notificationError);
      // Don't fail the request if notifications fail
    }
    
    logApiCall(
      'PATCH',
      `/api/directory-update-requests/${params.id}`,
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse(
      { request: updated },
      `Request ${status.toLowerCase()} successfully`
    );
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'PATCH',
        `/api/directory-update-requests/${params.id}`,
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'PATCH',
      `/api/directory-update-requests/${params.id}`,
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to update directory update request');
  }

  } catch (error) {
    console.error('[API Error] PATCH error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
