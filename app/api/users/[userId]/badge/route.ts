import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { UserRole, MemberBadge } from '@prisma/client';

export const dynamic = 'force-dynamic';

// PATCH - Update user's member badge (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('PATCH', `/api/users/${params.userId}/badge`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const targetUserId = params.userId;

    // Get admin user to check permissions
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Only ADMIN and SUPER_ADMIN can assign badges
    if (!adminUser || (adminUser.role !== UserRole.ADMIN && adminUser.role !== UserRole.SUPER_ADMIN)) {
      return handleApiError(
        new Error('Unauthorized: Only admins can assign member badges'),
        'Failed to update badge',
        request
      );
    }

    const body = await request.json();
    const { badge } = body;

    // Validate badge value
    if (badge !== null && !Object.values(MemberBadge).includes(badge)) {
      return handleApiError(
        new Error(`Invalid badge. Must be one of: ${Object.values(MemberBadge).join(', ')}, or null`),
        'Failed to update badge',
        request
      );
    }

    // Check if target user exists and belongs to the organization
    const targetUser = await prisma.user.findFirst({
      where: {
        id: targetUserId,
        organizationId,
      },
    });

    if (!targetUser) {
      return handleApiError(
        new Error('User not found'),
        'Failed to update badge',
        request
      );
    }

    // Update the user's badge
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { badge: badge || null },
      select: {
        id: true,
        badge: true,
        name: true,
        email: true,
      },
    });

    return createSuccessResponse({
      userId: updatedUser.id,
      badge: updatedUser.badge,
      userName: updatedUser.name || updatedUser.email,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to update member badge', request);
  }
}
