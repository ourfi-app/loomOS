
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
 * GET /api/household/children
 * Fetch all children for the authenticated user's unit
 */
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    
    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, unitNumber: true },
    });
    
    if (!user?.unitNumber) {
      throw new ApiError('User unit information not found', 404);
    }
    
    // Fetch children for this unit within the organization
    const children = await prisma.child.findMany({
      where: { 
        organizationId,
        unitNumber: user.unitNumber 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    logApiCall(
      'GET',
      '/api/household/children',
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ children }, 'Children retrieved successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'GET',
        '/api/household/children',
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'GET',
      '/api/household/children',
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to fetch children');
  }
}

/**
 * POST /api/household/children
 * Create a new child record for the authenticated user's unit
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    
    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, unitNumber: true },
    });
    
    if (!user?.unitNumber) {
      throw new ApiError('User unit information not found', 404);
    }
    
    // Parse and validate request body
    const body = await request.json();
    validateRequiredFields(body, ['name']);
    
    // Create the child record within the organization
    const child = await prisma.child.create({
      data: {
        organizationId,
        unitNumber: user.unitNumber,
        name: body.name,
        age: body.age,
        birthYear: body.birthYear,
        grade: body.grade,
        school: body.school
      }
    });
    
    logApiCall(
      'POST',
      '/api/household/children',
      201,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ child }, 'Child record created successfully', 201);
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'POST',
        '/api/household/children',
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'POST',
      '/api/household/children',
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to create child record');
  }
}
