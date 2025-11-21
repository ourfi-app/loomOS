
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  ApiError,
  successResponse,
  errorResponse,
  logApiCall,
  validateRequiredFields,
} from '@/lib/api-utils';

/**
 * PUT /api/household/residents/[id]
 * Update an additional resident
 * - Users can only update residents in their own unit
 */
export const dynamic = 'force-dynamic';
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    // Get user details
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email! 
      },
      select: { id: true, unitNumber: true },
    });
    
    if (!user?.unitNumber) {
      throw new ApiError('User unit information not found', 404);
    }
    
    // Parse and validate request body
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    validateRequiredFields(body, ['name', 'relationship']);
    
    // Check if resident exists and belongs to user's unit
    const existingResident = await prisma.additionalResident.findUnique({
      where: {
        organizationId,
        id: params.id 
      },
      select: { unitNumber: true },
    });
    
    if (!existingResident) {
      throw new ApiError('Resident not found', 404);
    }
    
    if (existingResident.unitNumber !== user.unitNumber) {
      throw new ApiError('You can only update residents in your own unit', 403);
    }
    
    // Update the resident
    const resident = await prisma.additionalResident.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        name: body.name,
        relationship: body.relationship,
        email: body.email,
        phone: body.phone,
        isEmergencyContact: body.isEmergencyContact
      }
    });
    
    logApiCall(
      'PUT',
      `/api/household/residents/${params.id}`,
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ resident }, 'Resident updated successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'PUT',
        `/api/household/residents/${params.id}`,
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'PUT',
      `/api/household/residents/${params.id}`,
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to update resident');
  }

  } catch (error) {
    console.error('[API Error] PUT error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

/**
 * DELETE /api/household/residents/[id]
 * Delete an additional resident
 * - Users can only delete residents from their own unit
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email! 
      },
      select: { id: true, unitNumber: true },
    });
    
    if (!user?.unitNumber) {
      throw new ApiError('User unit information not found', 404);
    }
    
    // Check if resident exists and belongs to user's unit
    const existingResident = await prisma.additionalResident.findUnique({
      where: {
        organizationId,
        id: params.id 
      },
      select: { unitNumber: true },
    });
    
    if (!existingResident) {
      throw new ApiError('Resident not found', 404);
    }
    
    if (existingResident.unitNumber !== user.unitNumber) {
      throw new ApiError('You can only delete residents from your own unit', 403);
    }
    
    // Delete the resident
    await prisma.additionalResident.delete({
      where: {
        organizationId,
        id: params.id 
      }
    });
    
    logApiCall(
      'DELETE',
      `/api/household/residents/${params.id}`,
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse(null, 'Resident deleted successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'DELETE',
        `/api/household/residents/${params.id}`,
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'DELETE',
      `/api/household/residents/${params.id}`,
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to delete resident');
  }

  } catch (error) {
    console.error('[API Error] DELETE error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
