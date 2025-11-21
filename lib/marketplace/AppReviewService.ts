// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * App Review Service
 * Handles app reviews, ratings, and developer responses
 */

import { prisma } from '@/lib/db';
import type {
  AppReview,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewSortOptions,
} from './types';

export class AppReviewService {
  /**
   * Create a review
   */
  async createReview(input: CreateReviewInput): Promise<AppReview> {
    // Check if user has already reviewed this app
    const existing = await prisma.appReview.findUnique({
      where: {
        appId_userId: {
          appId: input.appId,
          userId: input.userId,
        },
      },
    });

    if (existing) {
      throw new Error('You have already reviewed this app. You can edit your existing review.');
    }

    // Validate rating
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user has installed the app
    const installed = await prisma.userInstalledApp.findFirst({
      where: {
        appId: input.appId,
        userId: input.userId,
      },
    });

    // Create review
    const review = await prisma.appReview.create({
      data: {
        appId: input.appId,
        userId: input.userId,
        rating: input.rating,
        title: input.title,
        content: input.content,
        version: input.version,
        isVerifiedPurchase: !!installed,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Update app rating
    await this.updateAppRating(input.appId);

    return review as any;
  }

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    updates: UpdateReviewInput
  ): Promise<AppReview> {
    const review = await prisma.appReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Validate rating if provided
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updated = await prisma.appReview.update({
      where: { id: reviewId },
      data: {
        ...updates,
        isEdited: true,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Recalculate app rating if rating changed
    if (updates.rating !== undefined) {
      await this.updateAppRating(review.appId);
    }

    return updated as any;
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await prisma.appReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.appReview.delete({
      where: { id: reviewId },
    });

    await this.updateAppRating(review.appId);
  }

  /**
   * Get reviews for an app
   */
  async getAppReviews(
    appId: string,
    page = 1,
    pageSize = 10,
    options: ReviewSortOptions = {}
  ): Promise<{ reviews: AppReview[]; total: number }> {
    const { sortBy = 'recent', order = 'desc' } = options;
    const orderBy = this.getReviewOrderBy(sortBy, order);
    const offset = (page - 1) * pageSize;

    const [reviews, total] = await Promise.all([
      prisma.appReview.findMany({
        where: { appId },
        orderBy,
        skip: offset,
        take: pageSize,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.appReview.count({ where: { appId } }),
    ]);

    return {
      reviews: reviews as any[],
      total,
    };
  }

  /**
   * Get review by user for an app
   */
  async getUserReview(appId: string, userId: string): Promise<AppReview | null> {
    const review = await prisma.appReview.findUnique({
      where: {
        appId_userId: {
          appId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return review as any;
  }

  /**
   * Add developer response to review
   */
  async addDeveloperResponse(
    reviewId: string,
    developerId: string,
    response: string
  ): Promise<AppReview> {
    const review = await prisma.appReview.findUnique({
      where: { id: reviewId },
      include: { app: true },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    // Check if user is the developer (simplified check)
    if (review.app.developerId && review.app.developerId !== developerId) {
      throw new Error('Only the app developer can respond to reviews');
    }

    const updated = await prisma.appReview.update({
      where: { id: reviewId },
      data: {
        developerResponse: response,
        developerResponseDate: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return updated as any;
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<void> {
    await prisma.appReview.update({
      where: { id: reviewId },
      data: {
        helpful: { increment: 1 },
      },
    });
  }

  /**
   * Get review statistics for an app
   */
  async getReviewStats(appId: string) {
    const reviews = await prisma.appReview.findMany({
      where: { appId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    const ratingDistribution = reviews.reduce(
      (dist, r) => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
        return dist;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    );

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    };
  }

  /**
   * Get recent reviews across all apps
   */
  async getRecentReviews(
    limit = 10,
    organizationId?: string
  ): Promise<AppReview[]> {
    const reviews = await prisma.appReview.findMany({
      where: organizationId ? { organizationId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        app: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconName: true,
            color: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return reviews as any[];
  }

  /**
   * Get top-rated apps
   */
  async getTopRatedApps(
    limit = 10,
    organizationId?: string,
    minReviews = 5
  ): Promise<any[]> {
    const apps = await prisma.marketplaceApp.findMany({
      where: {
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        reviewCount: { gte: minReviews },
        ...(organizationId ? { organizationId } : {}),
      },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    return apps;
  }

  // ============================================================
  // PRIVATE HELPER METHODS
  // ============================================================

  private async updateAppRating(appId: string): Promise<void> {
    const reviews = await prisma.appReview.findMany({
      where: { appId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      await prisma.marketplaceApp.update({
        where: { id: appId },
        data: {
          rating: 0,
          reviewCount: 0,
          ratingCount: 0,
        },
      });
      return;
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.marketplaceApp.update({
      where: { id: appId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        ratingCount: reviews.length,
      },
    });
  }

  private getReviewOrderBy(
    sortBy: 'recent' | 'helpful' | 'rating',
    order: 'asc' | 'desc'
  ): any {
    switch (sortBy) {
      case 'helpful':
        return { helpful: order };
      case 'rating':
        return [{ rating: order }, { createdAt: 'desc' }];
      case 'recent':
      default:
        return { createdAt: order };
    }
  }
}

// Singleton instance
let reviewInstance: AppReviewService | null = null;

export function getAppReviewService(): AppReviewService {
  if (!reviewInstance) {
    reviewInstance = new AppReviewService();
  }
  return reviewInstance;
}
