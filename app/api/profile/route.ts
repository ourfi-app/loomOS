
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  validateRequiredFields,
  successResponse,
  errorResponse,
  logApiCall,
  ApiError
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Validate authentication
    const session = await validateAuthentication(request);

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    userId = session.user.id;

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: {
        id: userId 
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        unitNumber: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      logApiCall('GET', '/api/profile', 404, Date.now() - startTime, userId);
      throw new ApiError('User not found', 404);
    }

    logApiCall('GET', '/api/profile', 200, Date.now() - startTime, userId);
    return successResponse({ user }, 'Profile fetched successfully');

  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : 'Failed to fetch profile';
    
    logApiCall('GET', '/api/profile', status, Date.now() - startTime, userId, message);
    return errorResponse(message, status);
  }

  } catch (error) {
    console.error('[API Error] GET error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function PUT(request: NextRequest) {
  try {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Validate authentication
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    userId = session.user.id;

    // Parse request body
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { firstName, lastName, phone, email, currentPassword, newPassword } = body;

    // Validate required fields for profile update
    validateRequiredFields(body, ['firstName', 'lastName']);

    // If email is being changed, check if it's already in use
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
        organizationId, email 
      }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ApiError('Email is already in use', 400);
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone,
      email
    };

    // If password change is requested, verify current password first
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: {
        id: userId 
      }
      });

      if (!user?.password) {
        throw new ApiError('Current password verification failed', 400);
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValid) {
        throw new ApiError('Current password is incorrect', 400);
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        organizationId,
        id: userId 
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        unitNumber: true,
        phone: true,
        image: true,
        role: true,
        updatedAt: true
      }
    });

    logApiCall('PUT', '/api/profile', 200, Date.now() - startTime, userId);
    return successResponse({ user: updatedUser }, 'Profile updated successfully');

  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : 'Failed to update profile';
    
    logApiCall('PUT', '/api/profile', status, Date.now() - startTime, userId, message);
    return errorResponse(message, status);
  }

  } catch (error) {
    console.error('[API Error] PUT error:', error);
    
    if (error instanceof Error) {
      return createErrorResponse(error.message, 500, 'INTERNAL_ERROR');
    }
    
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}
