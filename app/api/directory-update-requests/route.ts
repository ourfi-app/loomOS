
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { hasAdminAccess } from '@/lib/auth';
import {
  validateAuthentication,
  ApiError,
  successResponse,
  errorResponse,
  logApiCall,
  validateRequiredFields,
} from '@/lib/api-utils';
import { serverNotifications, logIntegrationEvent, getAdminUserIds } from '@/lib/server-integration';

/**
 * GET /api/directory-update-requests
 * Fetch directory update requests
 * - Admins can see all requests (optionally filtered by status)
 * - Regular users can only see their own requests
 */
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Only admins can see all requests
    const isAdmin = session.user.role === 'ADMIN';
    
    // Build where clause based on user role
    const where: any = isAdmin 
      ? status ? { status } : {}
      : { requestedBy: session.user.id };
    
    // Fetch directory update requests
    const requests = await prisma.directoryUpdateRequest.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    logApiCall(
      'GET',
      '/api/directory-update-requests',
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ requests }, 'Directory update requests retrieved successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'GET',
        '/api/directory-update-requests',
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'GET',
      '/api/directory-update-requests',
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to fetch directory update requests');
  }
}

/**
 * POST /api/directory-update-requests
 * Create a new directory update request
 * - Users can request updates for their own profile
 * - Admins can request updates for any user
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    
    // Parse and validate request body
    const body = await request.json();
    const { userId, updateType, requestedData, reason, currentData } = body;
    
    // Validate required fields
    validateRequiredFields(body, ['userId', 'updateType', 'requestedData']);
    
    // Validate update type
    const validTypes = ['profile', 'contact', 'household'];
    if (!validTypes.includes(updateType)) {
      throw new ApiError('Invalid update type', 400);
    }
    
    // Authorization: Users can only request updates for themselves unless they're admin
    if (!hasAdminAccess((session.user as any).role) && userId !== session.user.id) {
      throw new ApiError(
        'You can only request updates for your own profile',
        403
      );
    }
    
    // Create the update request
    const updateRequest = await prisma.directoryUpdateRequest.create({
      data: {
        organizationId,
        userId,
        requestedBy: session.user.id,
        updateType,
        currentData,
        requestedData,
        reason,
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
      },
    });
    
    // Integration: Notify admins of new update request
    try {
      const adminIds = await getAdminUserIds(organizationId);
      if (adminIds.length > 0) {
        const requesterName = session.user.name || session.user.email || 'A user';
        await serverNotifications.notifyDirectoryUpdateRequest(
          requesterName,
          updateRequest.id,
          organizationId
        );

        logIntegrationEvent({
          type: 'DIRECTORY_UPDATE_REQUEST',
          data: {
            requestId: updateRequest.id,
            userId: userId,
            updateType,
          },
        });
      }
    } catch (notificationError) {
      console.error('[Integration] Failed to send directory update notifications:', notificationError);
      // Don't fail the request if notifications fail
    }
    
    logApiCall(
      'POST',
      '/api/directory-update-requests',
      201,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse(
      { request: updateRequest },
      'Update request submitted successfully',
      201
    );
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'POST',
        '/api/directory-update-requests',
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'POST',
      '/api/directory-update-requests',
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to create directory update request');
  }
}
