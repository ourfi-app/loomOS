
import { NextRequest } from 'next/server';
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
 * PUT /api/household/children/[id]
 * Update a child record
 * - Users can only update children in their own unit
 */
export const dynamic = 'force-dynamic';
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    validateRequiredFields(body, ['name']);
    
    // Check if child exists and belongs to user's unit
    const existingChild = await prisma.child.findUnique({
      where: {
        organizationId,
        id: params.id 
      },
      select: { unitNumber: true },
    });
    
    if (!existingChild) {
      throw new ApiError('Child record not found', 404);
    }
    
    if (existingChild.unitNumber !== user.unitNumber) {
      throw new ApiError('You can only update children in your own unit', 403);
    }
    
    // Update the child
    const child = await prisma.child.update({
      where: {
        organizationId,
        id: params.id 
      },
      data: {
        name: body.name,
        age: body.age,
        birthYear: body.birthYear,
        grade: body.grade,
        school: body.school
      }
    });
    
    logApiCall(
      'PUT',
      `/api/household/children/${params.id}`,
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ child }, 'Child record updated successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'PUT',
        `/api/household/children/${params.id}`,
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'PUT',
      `/api/household/children/${params.id}`,
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to update child record');
  }
}

/**
 * DELETE /api/household/children/[id]
 * Delete a child record
 * - Users can only delete children from their own unit
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if child exists and belongs to user's unit
    const existingChild = await prisma.child.findUnique({
      where: {
        organizationId,
        id: params.id 
      },
      select: { unitNumber: true },
    });
    
    if (!existingChild) {
      throw new ApiError('Child record not found', 404);
    }
    
    if (existingChild.unitNumber !== user.unitNumber) {
      throw new ApiError('You can only delete children from your own unit', 403);
    }
    
    // Delete the child
    await prisma.child.delete({
      where: {
        organizationId,
        id: params.id 
      }
    });
    
    logApiCall(
      'DELETE',
      `/api/household/children/${params.id}`,
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse(null, 'Child record deleted successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'DELETE',
        `/api/household/children/${params.id}`,
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'DELETE',
      `/api/household/children/${params.id}`,
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to delete child record');
  }
}
