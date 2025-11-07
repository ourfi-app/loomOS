import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { validateAuth, createSuccessResponse, handleApiError, logApiRequest } from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// DELETE - Delete a post (Author or Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('DELETE', `/api/community-posts/${params.id}`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const postId = params.id;

    // Get user to check permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Check if post exists and belongs to the organization
    const post = await prisma.communityPost.findFirst({
      where: {
        id: postId,
        organizationId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!post) {
      return handleApiError(
        new Error('Post not found'),
        'Failed to delete post',
        request
      );
    }

    // Check permissions: user must be the author OR an admin
    const isAuthor = post.authorId === userId;
    const isAdmin = user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN);

    if (!isAuthor && !isAdmin) {
      return handleApiError(
        new Error('Unauthorized: You can only delete your own posts or must be an admin'),
        'Failed to delete post',
        request
      );
    }

    // Delete the post (cascade will handle likes and comments)
    await prisma.communityPost.delete({
      where: { id: postId },
    });

    return createSuccessResponse({
      postId,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Failed to delete post', request);
  }
}

// PATCH - Edit a post (Author or Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('PATCH', `/api/community-posts/${params.id}`, { userId: session?.user?.id });

    const userId = (session.user as any).id;
    const postId = params.id;
    const body = await request.json();
    const { content, imageUrl } = body;

    if (!content || content.trim() === '') {
      return handleApiError(
        new Error('Content is required'),
        'Failed to update post',
        request
      );
    }

    // Get user to check permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Check if post exists and belongs to the organization
    const post = await prisma.communityPost.findFirst({
      where: {
        id: postId,
        organizationId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!post) {
      return handleApiError(
        new Error('Post not found'),
        'Failed to update post',
        request
      );
    }

    // Check permissions: user must be the author OR an admin
    const isAuthor = post.authorId === userId;
    const isAdmin = user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN);

    if (!isAuthor && !isAdmin) {
      return handleApiError(
        new Error('Unauthorized: You can only edit your own posts or must be an admin'),
        'Failed to update post',
        request
      );
    }

    // Update the post
    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        content: content.trim(),
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
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
            comments: true,
          },
        },
      },
    });

    return createSuccessResponse({
      post: {
        ...updatedPost,
        likesCount: updatedPost._count.likes,
        commentsCount: updatedPost._count.comments,
        _count: undefined,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Failed to update post', request);
  }
}
