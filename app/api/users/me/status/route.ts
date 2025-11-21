import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { MemberStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// PATCH - Update current user's status
export async function PATCH(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('PATCH', '/api/users/me/status', { userId: session?.user?.id });

    const userId = (session.user as any).id;

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { status } = body;

    // Validate status value
    if (!Object.values(MemberStatus).includes(status)) {
      return handleApiError(
        new Error(`Invalid status. Must be one of: ${Object.values(MemberStatus).join(', ')}`),
        'Failed to update status',
        request
      );
    }

    // Update the user's status and lastSeenAt
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        lastSeenAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        lastSeenAt: true,
      },
    });

    return createSuccessResponse({
      userId: updatedUser.id,
      status: updatedUser.status,
      lastSeenAt: updatedUser.lastSeenAt,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to update status', request);
  }
}

// GET - Get current user's status
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('GET', '/api/users/me/status', { userId: session?.user?.id });

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
        lastSeenAt: true,
      },
    });

    if (!user) {
      return handleApiError(
        new Error('User not found'),
        'Failed to get status',
        request
      );
    }

    return createSuccessResponse({
      userId: user.id,
      status: user.status,
      lastSeenAt: user.lastSeenAt,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to get status', request);
  }
}
