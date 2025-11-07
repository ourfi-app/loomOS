import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// POST - Toggle like on a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', `/api/community-posts/${params.id}/comments/${params.commentId}/like`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const commentId = params.commentId;
    const postId = params.id;

    // Check if comment exists and belongs to the organization and post
    const comment = await prisma.postComment.findFirst({
      where: {
        id: commentId,
        postId,
        organizationId,
      },
    });

    if (!comment) {
      return handleApiError(
        new Error('Comment not found'),
        'Failed to toggle like',
        request
      );
    }

    // Check if user has already liked the comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        organizationId_commentId_userId: {
          organizationId,
          commentId,
          userId,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      // Unlike the comment
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      isLiked = false;
    } else {
      // Like the comment
      await prisma.commentLike.create({
        data: {
          organizationId,
          commentId,
          userId,
        },
      });
      isLiked = true;
    }

    // Get updated like count
    const likesCount = await prisma.commentLike.count({
      where: {
        commentId,
        organizationId,
      },
    });

    return createSuccessResponse({ 
      isLiked, 
      likesCount,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to toggle like', request);
  }
}
