// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * App Registry Service
 * Handles app discovery, search, filtering, and categorization
 */

import { prisma } from '@/lib/db';
import type {
  App,
  AppSearchFilters,
  AppSearchResult,
  AppCategory,
  AppStatus,
  AppVersion,
} from './types';

export class AppRegistryService {
  /**
   * Search and filter apps
   */
  async searchApps(
    filters: AppSearchFilters,
    page = 1,
    pageSize = 20,
    organizationId?: string
  ): Promise<AppSearchResult> {
    const query = this.buildSearchQuery(filters, organizationId);
    const offset = (page - 1) * pageSize;

    const [apps, total] = await Promise.all([
      prisma.marketplaceApp.findMany({
        where: query,
        skip: offset,
        take: pageSize,
        orderBy: this.getOrderBy(filters),
        include: {
          reviews: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          versions: {
            where: { isCurrentVersion: true },
            take: 1,
          },
        },
      }),
      prisma.marketplaceApp.count({ where: query }),
    ]);

    return {
      apps: apps as any[],
      total,
      page,
      pageSize,
    };
  }

  /**
   * Get app by ID or slug
   */
  async getApp(idOrSlug: string, organizationId?: string): Promise<App | null> {
    const app = await prisma.marketplaceApp.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return app as any;
  }

  /**
   * Get apps by category
   */
  async getAppsByCategory(
    category: AppCategory,
    limit = 10,
    organizationId?: string
  ): Promise<App[]> {
    const apps = await prisma.marketplaceApp.findMany({
      where: {
        category,
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        ...(organizationId ? { organizationId } : {}),
      },
      orderBy: { rating: 'desc' },
      take: limit,
    });

    return apps as any[];
  }

  /**
   * Get featured apps
   */
  async getFeaturedApps(limit = 6, organizationId?: string): Promise<App[]> {
    const apps = await prisma.marketplaceApp.findMany({
      where: {
        isFeatured: true,
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        ...(organizationId ? { organizationId } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return apps as any[];
  }

  /**
   * Get trending apps
   */
  async getTrendingApps(limit = 10, organizationId?: string): Promise<App[]> {
    const apps = await prisma.marketplaceApp.findMany({
      where: {
        trending: true,
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        ...(organizationId ? { organizationId } : {}),
      },
      orderBy: [{ downloads: 'desc' }, { rating: 'desc' }],
      take: limit,
    });

    return apps as any[];
  }

  /**
   * Get new apps (recently published)
   */
  async getNewApps(limit = 10, organizationId?: string): Promise<App[]> {
    const apps = await prisma.marketplaceApp.findMany({
      where: {
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        ...(organizationId ? { organizationId } : {}),
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return apps as any[];
  }

  /**
   * Get app versions
   */
  async getAppVersions(appId: string): Promise<AppVersion[]> {
    const versions = await prisma.appVersion.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
    });

    return versions as any[];
  }

  /**
   * Get latest version for an app
   */
  async getLatestVersion(appId: string): Promise<AppVersion | null> {
    const version = await prisma.appVersion.findFirst({
      where: {
        appId,
        status: 'published',
      },
      orderBy: { createdAt: 'desc' },
    });

    return version as any;
  }

  /**
   * Check if update available for installed app
   */
  async checkForUpdate(
    appId: string,
    currentVersion: string
  ): Promise<AppVersion | null> {
    const latest = await this.getLatestVersion(appId);

    if (!latest || latest.version === currentVersion) {
      return null;
    }

    return this.isNewerVersion(latest.version, currentVersion) ? latest : null;
  }

  /**
   * Get category counts
   */
  async getCategoryCounts(organizationId?: string): Promise<Record<string, number>> {
    const counts = await prisma.marketplaceApp.groupBy({
      by: ['category'],
      where: {
        status: { in: ['PUBLISHED', 'AVAILABLE'] },
        ...(organizationId ? { organizationId } : {}),
      },
      _count: true,
    });

    const result: Record<string, number> = {};
    counts.forEach((item) => {
      result[item.category] = item._count;
    });

    return result;
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats(organizationId?: string) {
    const where = {
      status: { in: ['PUBLISHED', 'AVAILABLE'] },
      ...(organizationId ? { organizationId } : {}),
    };

    const [
      totalApps,
      featuredCount,
      totalDownloads,
      avgRating,
      categoryCounts,
    ] = await Promise.all([
      prisma.marketplaceApp.count({ where }),
      prisma.marketplaceApp.count({ where: { ...where, isFeatured: true } }),
      prisma.marketplaceApp.aggregate({
        where,
        _sum: { downloads: true },
      }),
      prisma.marketplaceApp.aggregate({
        where: { ...where, rating: { not: null } },
        _avg: { rating: true },
      }),
      this.getCategoryCounts(organizationId),
    ]);

    return {
      totalApps,
      featuredApps: featuredCount,
      totalDownloads: totalDownloads._sum.downloads || 0,
      averageRating: avgRating._avg.rating || 0,
      categoryCounts,
    };
  }

  /**
   * Increment download count
   */
  async incrementDownloads(appId: string): Promise<void> {
    await prisma.marketplaceApp.update({
      where: { id: appId },
      data: {
        downloads: { increment: 1 },
        installCount: { increment: 1 },
      },
    });
  }

  // ============================================================
  // PRIVATE HELPER METHODS
  // ============================================================

  private buildSearchQuery(
    filters: AppSearchFilters,
    organizationId?: string
  ): any {
    const query: any = {
      status: { in: ['PUBLISHED', 'AVAILABLE'] },
      ...(organizationId ? { organizationId } : {}),
    };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { hasSome: filters.tags };
    }

    if (filters.rating) {
      query.rating = { gte: filters.rating };
    }

    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }

    if (filters.trending !== undefined) {
      query.trending = filters.trending;
    }

    if (filters.query) {
      const searchQuery = filters.query.toLowerCase();
      query.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { shortDescription: { contains: searchQuery, mode: 'insensitive' } },
        { longDescription: { contains: searchQuery, mode: 'insensitive' } },
        { tags: { has: searchQuery } },
      ];
    }

    if (filters.priceRange) {
      query.price = {
        gte: filters.priceRange.min,
        lte: filters.priceRange.max,
      };
    }

    return query;
  }

  private getOrderBy(filters: AppSearchFilters): any {
    if (filters.isFeatured) {
      return { publishedAt: 'desc' };
    }
    if (filters.trending) {
      return [{ downloads: 'desc' }, { rating: 'desc' }];
    }
    if (filters.query) {
      return { downloads: 'desc' }; // Most popular first for search results
    }
    return { rating: 'desc' }; // Default to highest rated
  }

  private isNewerVersion(latest: string, current: string): boolean {
    // Simple semantic version comparison
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const l = latestParts[i] || 0;
      const c = currentParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  }
}

// Singleton instance
let registryInstance: AppRegistryService | null = null;

export function getAppRegistryService(): AppRegistryService {
  if (!registryInstance) {
    registryInstance = new AppRegistryService();
  }
  return registryInstance;
}
