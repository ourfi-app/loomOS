import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import {
  validateAuth,
  createSuccessResponse,
  handleApiError,
  logApiRequest,
} from '@/lib/api-utils';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    const organizationId = await getCurrentOrganizationId();
    logApiRequest('GET', '/api/community/analytics', { userId: session?.user?.id });

    // Date for active members calculation (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Parallel queries for performance
    const [
      totalPosts,
      totalMembers,
      totalComments,
      totalLikes,
      postsByCategory,
      topContributors,
      activeMemberIds,
      membersByBadge,
      membersByStatus,
      recentPosts,
    ] = await Promise.all([
      // Total posts
      prisma.communityPost.count({
        where: { organizationId },
      }),

      // Total members
      prisma.user.count({
        where: { organizationId },
      }),

      // Total comments
      prisma.postComment.count({
        where: {
          post: { organizationId },
        },
      }),

      // Total likes
      prisma.postLike.count({
        where: {
          post: { organizationId },
        },
      }),

      // Posts by category
      prisma.communityPost.groupBy({
        by: ['category'],
        where: { organizationId },
        _count: true,
      }),

      // Top contributors (most posts)
      prisma.communityPost.groupBy({
        by: ['authorId'],
        where: { organizationId },
        _count: true,
        orderBy: {
          _count: {
            authorId: 'desc',
          },
        },
        take: 10,
      }),

      // Active members (posted or commented in last 30 days)
      prisma.communityPost.findMany({
        where: {
          organizationId,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { authorId: true },
        distinct: ['authorId'],
      }),

      // Members by badge
      prisma.user.groupBy({
        by: ['badge'],
        where: { organizationId },
        _count: true,
      }),

      // Members by status
      prisma.user.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: true,
      }),

      // Recent posts (last 7 days) for trend calculation
      prisma.communityPost.findMany({
        where: {
          organizationId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdAt: true },
      }),
    ]);

    // Get author details for top contributors
    const topContributorIds = topContributors.map((c) => c.authorId);
    const contributorDetails = await prisma.user.findMany({
      where: {
        id: { in: topContributorIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        firstName: true,
        lastName: true,
        badge: true,
        role: true,
      },
    });

    // Map contributors with their post counts
    const topContributorsWithDetails = topContributors.map((contributor) => {
      const user = contributorDetails.find((u) => u.id === contributor.authorId);
      const userName = user?.name ||
        `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
        user?.email || 'Unknown';

      return {
        userId: contributor.authorId,
        name: userName,
        email: user?.email,
        image: user?.image,
        badge: user?.badge,
        role: user?.role,
        postCount: contributor._count,
      };
    });

    // Calculate engagement metrics
    const avgLikesPerPost = totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : '0';
    const avgCommentsPerPost = totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : '0';

    // Active members count (including commenters)
    const activeCommenters = await prisma.postComment.findMany({
      where: {
        post: { organizationId },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { authorId: true },
      distinct: ['authorId'],
    });

    const activeMembers = new Set([
      ...activeMemberIds.map((p) => p.authorId),
      ...activeCommenters.map((c) => c.authorId),
    ]);

    // Format category breakdown
    const categoryBreakdown = postsByCategory.map((cat) => ({
      category: cat.category,
      count: cat._count,
      percentage: totalPosts > 0 ? ((cat._count / totalPosts) * 100).toFixed(1) : '0',
    }));

    // Format badge distribution
    const badgeDistribution = membersByBadge.map((badge) => ({
      badge: badge.badge || 'NONE',
      count: badge._count,
    }));

    // Format status distribution
    const statusDistribution = membersByStatus.map((status) => ({
      status: status.status,
      count: status._count,
    }));

    // Calculate posts per day trend
    const postsPerDay = recentPosts.length / 7;

    const analytics = {
      overview: {
        totalPosts,
        totalMembers,
        activeMembers: activeMembers.size,
        totalComments,
        totalLikes,
      },
      engagement: {
        avgLikesPerPost: parseFloat(avgLikesPerPost),
        avgCommentsPerPost: parseFloat(avgCommentsPerPost),
        postsPerDay: parseFloat(postsPerDay.toFixed(1)),
        engagementRate: totalMembers > 0
          ? parseFloat(((activeMembers.size / totalMembers) * 100).toFixed(1))
          : 0,
      },
      categoryBreakdown,
      topContributors: topContributorsWithDetails,
      badgeDistribution,
      statusDistribution,
    };

    return createSuccessResponse(analytics);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch community analytics', request);
  }
}
