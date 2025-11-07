import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// GET - Get all comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('GET', `/api/community-posts/${params.id}/comments`, { userId: session?.user?.id });

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
        'Failed to fetch comments',
        request
      );
    }

    // Fetch all comments with author info and like status
    const comments = await prisma.postComment.findMany({
      where: {
        postId,
        organizationId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Add isLikedByUser flag to each comment
    const commentsWithLikeStatus = comments.map(comment => ({
      ...comment,
      isLikedByUser: comment.likes.some(like => like.userId === userId),
      likesCount: comment._count.likes,
      repliesCount: comment._count.replies,
      // Remove the detailed likes array from response
      likes: undefined,
      _count: undefined,
    }));

    return createSuccessResponse({ comments: commentsWithLikeStatus }, { count: commentsWithLikeStatus.length });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch comments', request);
  }
}

// POST - Add a comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', `/api/community-posts/${params.id}/comments`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const postId = params.id;
    const body = await request.json();
    const { content, parentId } = body;

    if (!content || content.trim() === '') {
      return handleApiError(
        new Error('Content is required'),
        'Failed to create comment',
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
        'Failed to create comment',
        request
      );
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentComment = await prisma.postComment.findFirst({
        where: {
          id: parentId,
          organizationId,
          postId,
        },
      });

      if (!parentComment) {
        return handleApiError(
          new Error('Parent comment not found'),
          'Failed to create comment',
          request
        );
      }
    }

    const comment = await prisma.postComment.create({
      data: {
        organizationId,
        postId,
        authorId: userId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    // Add initial values for new comment
    const commentWithDefaults = {
      ...comment,
      isLikedByUser: false,
      likesCount: 0,
      repliesCount: 0,
      _count: undefined,
    };

    return createSuccessResponse({ comment: commentWithDefaults });
  } catch (error) {
    return handleApiError(error, 'Failed to create comment', request);
  }
}
