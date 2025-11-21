import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';

// GET - List all community posts for the organization
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('GET', '/api/community-posts', { userId: session?.user?.id });

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    // Fetch posts with author info, like count, comment count, and user's like status
    const userId = (session.user as any).id;
    
    const posts = await prisma.communityPost.findMany({
      where: {
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
            role: true,
            badge: true,
            status: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Add isLikedByUser flag to each post
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLikedByUser: post.likes.some(like => like.userId === userId),
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      // Remove the detailed likes array from response
      likes: undefined,
      _count: undefined,
    }));

    return createSuccessResponse({ posts: postsWithLikeStatus }, { count: postsWithLikeStatus.length });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch community posts', request);
  }
}

// POST - Create a new community post
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('POST', '/api/community-posts', { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { content, imageUrl, category } = body;

    if (!content || content.trim() === '') {
      return handleApiError(
        new Error('Content is required'),
        'Failed to create post',
        request
      );
    }

    const post = await prisma.communityPost.create({
      data: {
        organizationId,
        authorId: userId,
        content: content.trim(),
        imageUrl: imageUrl || null,
        category: category || 'GENERAL',
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
            role: true,
            badge: true,
            status: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Add initial values for new post
    const postWithDefaults = {
      ...post,
      isLikedByUser: false,
      likesCount: 0,
      commentsCount: 0,
      _count: undefined,
    };

    return createSuccessResponse({ post: postWithDefaults });
  } catch (error) {
    return handleApiError(error, 'Failed to create post', request);
  }
}
