
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  validateAuthentication,
  validateAdminRole,
  validateRequiredFields,
  logApiCall,
  successResponse,
  ApiError,
  handleApiError,
} from '@/lib/api-utils';

/**
 * GET /api/admin/settings
 * Fetch active dues settings
 * Requires ADMIN role
 * 
 * @returns {Object} - Active dues settings
 */
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate and validate admin role
    const { user, session } = await validateAuthentication(request);
    validateAdminRole(user);

    const organizationId = user.organizationId;

    const settings = await prisma.duesSettings.findFirst({
      where: {
        organizationId,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Log successful API call
    logApiCall(
      'GET',
      '/api/admin/settings',
      200,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      { settings },
      'Settings fetched successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/admin/settings', request);
  }
}

/**
 * POST /api/admin/settings
 * Create new dues settings
 * Requires ADMIN role
 * 
 * Request Body:
 * - monthlyAmount: Monthly dues amount (required, > 0)
 * - dueDay: Day of month (required, 1-28)
 * - lateFee: Late fee amount (optional, default: 0)
 * - gracePeriod: Grace period in days (optional, default: 5)
 * 
 * @returns {Object} - Created settings
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate and validate admin role
    const { user, session } = await validateAuthentication(request);
    validateAdminRole(user);

    const organizationId = user.organizationId;

    // Parse and validate request body
    const body = await request.json();
    const { monthlyAmount, dueDay, lateFee, gracePeriod } = body;

    // Validate required fields
    validateRequiredFields(body, ['monthlyAmount', 'dueDay']);

    // Validate monthly amount
    if (monthlyAmount <= 0) {
      throw new ApiError('Monthly amount must be greater than 0', 400);
    }

    // Validate due day
    if (dueDay < 1 || dueDay > 28) {
      throw new ApiError('Due day must be between 1 and 28', 400);
    }

    // Deactivate all previous settings
    await prisma.duesSettings.updateMany({
      where: {
        organizationId,
        isActive: true 
      },
      data: { isActive: false }
    });

    // Create new settings
    const settings = await prisma.duesSettings.create({
      data: {
        organizationId,
        monthlyAmount,
        dueDay,
        lateFee: lateFee || 0,
        gracePeriod: gracePeriod || 5,
        isActive: true
      }
    });

    // Log successful API call
    logApiCall(
      'POST',
      '/api/admin/settings',
      201,
      Date.now() - startTime,
      user.id
    );

    return successResponse(
      { settings },
      'Settings created successfully',
      201
    );
  } catch (error) {
    return handleApiError(error, '/api/admin/settings', request);
  }
}
