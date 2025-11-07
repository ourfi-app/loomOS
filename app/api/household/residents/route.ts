
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
 * GET /api/household/residents
 * Fetch all additional residents for the authenticated user's unit
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
    
    // Fetch residents for this unit within the organization
    const residents = await prisma.additionalResident.findMany({
      where: { 
        organizationId,
        unitNumber: user.unitNumber 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    logApiCall(
      'GET',
      '/api/household/residents',
      200,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ residents }, 'Residents retrieved successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'GET',
        '/api/household/residents',
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'GET',
      '/api/household/residents',
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to fetch residents');
  }
}

/**
 * POST /api/household/residents
 * Create a new additional resident for the authenticated user's unit
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
    validateRequiredFields(body, ['name', 'relationship']);
    
    // Create the resident within the organization
    const resident = await prisma.additionalResident.create({
      data: {
        organizationId,
        unitNumber: user.unitNumber,
        name: body.name,
        relationship: body.relationship,
        email: body.email,
        phone: body.phone,
        isEmergencyContact: body.isEmergencyContact || false
      }
    });
    
    logApiCall(
      'POST',
      '/api/household/residents',
      201,
      Date.now() - startTime,
      session.user.id
    );
    
    return successResponse({ resident }, 'Resident created successfully', 201);
  } catch (error) {
    if (error instanceof ApiError) {
      logApiCall(
        'POST',
        '/api/household/residents',
        error.statusCode,
        Date.now() - startTime,
        undefined,
        error.message
      );
      return errorResponse(error.message, error.statusCode);
    }
    
    logApiCall(
      'POST',
      '/api/household/residents',
      500,
      Date.now() - startTime,
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return errorResponse('Failed to create resident');
  }
}
