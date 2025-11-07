import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// POST - Toggle pin status on a post (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', `/api/community-posts/${params.id}/pin`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const postId = params.id;

    // Get user to check permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Only ADMIN and SUPER_ADMIN can pin posts
    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
      return handleApiError(
        new Error('Unauthorized: Only admins can pin posts'),
        'Failed to toggle pin status',
        request
      );
    }

    // Check if post exists and belongs to the organization
    const post = await prisma.communityPost.findFirst({
      where: {
        id: postId,
        organizationId,
      },
    });

    if (!post) {
      return handleApiError(
        new Error('Post not found'),
        'Failed to toggle pin status',
        request
      );
    }

    // Toggle the pin status
    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: { isPinned: !post.isPinned },
      select: {
        id: true,
        isPinned: true,
      },
    });

    return createSuccessResponse({
      isPinned: updatedPost.isPinned,
      postId: updatedPost.id,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to toggle pin status', request);
  }
}
