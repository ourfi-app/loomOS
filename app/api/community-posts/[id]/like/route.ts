import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// POST - Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', `/api/community-posts/${params.id}/like`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const postId = params.id;

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
        'Failed to toggle like',
        request
      );
    }

    // Check if user has already liked the post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        organizationId_postId_userId: {
          organizationId,
          postId,
          userId,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      isLiked = false;
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          organizationId,
          postId,
          userId,
        },
      });
      isLiked = true;
    }

    // Get updated like count
    const likesCount = await prisma.postLike.count({
      where: {
        postId,
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
