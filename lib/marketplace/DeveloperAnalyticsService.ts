/**
 * Developer Analytics Service
 * Tracks app usage, downloads, revenue, and engagement metrics
 */

import { prisma } from '@/lib/db';
import type {
  DeveloperAnalytics,
  AnalyticsTimeRange,
  AnalyticsSummary,
} from './developer-types';
import type { App } from './types';

export class DeveloperAnalyticsService {
  /**
   * Record app event (download, install, launch, etc.)
   */
  async recordEvent(
    appId: string,
    eventType: 'download' | 'install' | 'uninstall' | 'launch' | 'crash',
    userId?: string
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's analytics record
    const existing = await prisma.$queryRaw<DeveloperAnalytics[]>`
      SELECT * FROM developer_analytics
      WHERE app_id = ${appId} AND date = ${today}
      LIMIT 1
    `;

    let analytics = existing[0];

    if (!analytics) {
      // Create new analytics record
      const id = this.generateId();
      await prisma.$executeRaw`
        INSERT INTO developer_analytics (
          id, app_id, date, downloads, installations, uninstalls,
          active_users, launches, avg_session_duration, crash_rate,
          revenue, refunds, new_reviews, average_rating
        ) VALUES (
          ${id}, ${appId}, ${today}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        )
      `;

      analytics = {
        id,
        appId,
        date: today,
        downloads: 0,
        installations: 0,
        uninstalls: 0,
        activeUsers: 0,
        launches: 0,
        avgSessionDuration: 0,
        crashRate: 0,
        revenue: 0,
        refunds: 0,
        newReviews: 0,
        averageRating: 0,
      };
    }

    // Update counters based on event type
    switch (eventType) {
      case 'download':
        await prisma.$executeRaw`
          UPDATE developer_analytics
          SET downloads = downloads + 1
          WHERE app_id = ${appId} AND date = ${today}
        `;

        // Update app download count
        await prisma.$executeRaw`
          UPDATE marketplace_apps
          SET downloads = downloads + 1
          WHERE id = ${appId}
        `;
        break;

      case 'install':
        await prisma.$executeRaw`
          UPDATE developer_analytics
          SET installations = installations + 1
          WHERE app_id = ${appId} AND date = ${today}
        `;

        // Update app install count
        await prisma.$executeRaw`
          UPDATE marketplace_apps
          SET install_count = install_count + 1
          WHERE id = ${appId}
        `;
        break;

      case 'uninstall':
        await prisma.$executeRaw`
          UPDATE developer_analytics
          SET uninstalls = uninstalls + 1
          WHERE app_id = ${appId} AND date = ${today}
        `;
        break;

      case 'launch':
        await prisma.$executeRaw`
          UPDATE developer_analytics
          SET launches = launches + 1
          WHERE app_id = ${appId} AND date = ${today}
        `;
        break;

      case 'crash':
        // Recalculate crash rate
        const totalLaunches = analytics.launches + 1;
        const crashes = Math.floor(analytics.crashRate * analytics.launches) + 1;
        const newCrashRate = crashes / totalLaunches;

        await prisma.$executeRaw`
          UPDATE developer_analytics
          SET crash_rate = ${newCrashRate}
          WHERE app_id = ${appId} AND date = ${today}
        `;
        break;
    }
  }

  /**
   * Record revenue event
   */
  async recordRevenue(
    appId: string,
    amount: number,
    type: 'purchase' | 'subscription' | 'refund'
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure analytics record exists
    await this.ensureAnalyticsRecord(appId, today);

    if (type === 'refund') {
      await prisma.$executeRaw`
        UPDATE developer_analytics
        SET refunds = refunds + ${amount}
        WHERE app_id = ${appId} AND date = ${today}
      `;
    } else {
      await prisma.$executeRaw`
        UPDATE developer_analytics
        SET revenue = revenue + ${amount}
        WHERE app_id = ${appId} AND date = ${today}
      `;
    }
  }

  /**
   * Get analytics for an app
   */
  async getAppAnalytics(
    appId: string,
    timeRange: AnalyticsTimeRange
  ): Promise<DeveloperAnalytics[]> {
    const analytics = await prisma.$queryRaw<DeveloperAnalytics[]>`
      SELECT * FROM developer_analytics
      WHERE app_id = ${appId}
        AND date >= ${timeRange.startDate}
        AND date <= ${timeRange.endDate}
      ORDER BY date ASC
    `;

    return analytics;
  }

  /**
   * Get analytics summary
   */
  async getAnalyticsSummary(
    appId: string,
    timeRange: AnalyticsTimeRange
  ): Promise<AnalyticsSummary> {
    const analytics = await this.getAppAnalytics(appId, timeRange);

    const summary: AnalyticsSummary = {
      downloads: 0,
      installations: 0,
      uninstalls: 0,
      activeUsers: 0,
      launches: 0,
      revenue: 0,
      averageRating: 0,
      crashRate: 0,
    };

    for (const day of analytics) {
      summary.downloads += day.downloads;
      summary.installations += day.installations;
      summary.uninstalls += day.uninstalls;
      summary.activeUsers = Math.max(summary.activeUsers, day.activeUsers);
      summary.launches += day.launches;
      summary.revenue += day.revenue;
    }

    // Calculate averages
    if (analytics.length > 0) {
      const totalRating = analytics.reduce((sum, d) => sum + d.averageRating, 0);
      summary.averageRating = totalRating / analytics.length;

      const totalCrashRate = analytics.reduce((sum, d) => sum + d.crashRate, 0);
      summary.crashRate = totalCrashRate / analytics.length;
    }

    return summary;
  }

  /**
   * Get top performing apps for a developer
   */
  async getTopApps(
    developerId: string,
    metric: 'downloads' | 'revenue' | 'rating',
    limit = 5
  ): Promise<Array<{ appId: string; app: App; value: number }>> {
    const apps = await prisma.marketplaceApp.findMany({
      where: { developerId },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = [];

    for (const app of apps) {
      let value = 0;

      if (metric === 'downloads') {
        const result = await prisma.$queryRaw<Array<{ total: bigint }>>`
          SELECT COALESCE(SUM(downloads), 0) as total
          FROM developer_analytics
          WHERE app_id = ${app.id}
            AND date >= ${thirtyDaysAgo}
        `;
        value = result[0] ? Number(result[0].total) : 0;
      } else if (metric === 'revenue') {
        const result = await prisma.$queryRaw<Array<{ total: number }>>`
          SELECT COALESCE(SUM(revenue), 0) as total
          FROM developer_analytics
          WHERE app_id = ${app.id}
            AND date >= ${thirtyDaysAgo}
        `;
        value = result[0]?.total || 0;
      } else if (metric === 'rating') {
        const result = await prisma.$queryRaw<Array<{ avg_rating: number }>>`
          SELECT COALESCE(AVG(average_rating), 0) as avg_rating
          FROM developer_analytics
          WHERE app_id = ${app.id}
            AND date >= ${thirtyDaysAgo}
        `;
        value = result[0]?.avg_rating || 0;
      }

      results.push({ appId: app.id, app: app as any, value });
    }

    return results.sort((a, b) => b.value - a.value).slice(0, limit);
  }

  /**
   * Get real-time stats (for dashboard)
   */
  async getRealTimeStats(
    appId: string
  ): Promise<{
    activeUsers: number;
    sessionsToday: number;
    crashesToday: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await prisma.$queryRaw<DeveloperAnalytics[]>`
      SELECT * FROM developer_analytics
      WHERE app_id = ${appId} AND date = ${today}
      LIMIT 1
    `;

    if (!analytics[0]) {
      return {
        activeUsers: 0,
        sessionsToday: 0,
        crashesToday: 0,
      };
    }

    const data = analytics[0];

    return {
      activeUsers: data.activeUsers,
      sessionsToday: data.launches,
      crashesToday: Math.floor(data.crashRate * data.launches),
    };
  }

  /**
   * Update active users count
   */
  async updateActiveUsers(appId: string, count: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.ensureAnalyticsRecord(appId, today);

    await prisma.$executeRaw`
      UPDATE developer_analytics
      SET active_users = ${count}
      WHERE app_id = ${appId} AND date = ${today}
    `;
  }

  /**
   * Record session duration
   */
  async recordSessionDuration(
    appId: string,
    durationSeconds: number
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.ensureAnalyticsRecord(appId, today);

    // Get current average and launches
    const analytics = await prisma.$queryRaw<
      Array<{ avg_session_duration: number; launches: number }>
    >`
      SELECT avg_session_duration, launches
      FROM developer_analytics
      WHERE app_id = ${appId} AND date = ${today}
      LIMIT 1
    `;

    if (analytics[0]) {
      const { avg_session_duration, launches } = analytics[0];
      const totalDuration = avg_session_duration * launches + durationSeconds;
      const newAvg = totalDuration / (launches + 1);

      await prisma.$executeRaw`
        UPDATE developer_analytics
        SET avg_session_duration = ${newAvg}
        WHERE app_id = ${appId} AND date = ${today}
      `;
    }
  }

  /**
   * Ensure analytics record exists for a given date
   */
  private async ensureAnalyticsRecord(
    appId: string,
    date: Date
  ): Promise<void> {
    const existing = await prisma.$queryRaw<DeveloperAnalytics[]>`
      SELECT id FROM developer_analytics
      WHERE app_id = ${appId} AND date = ${date}
      LIMIT 1
    `;

    if (!existing[0]) {
      const id = this.generateId();
      await prisma.$executeRaw`
        INSERT INTO developer_analytics (
          id, app_id, date, downloads, installations, uninstalls,
          active_users, launches, avg_session_duration, crash_rate,
          revenue, refunds, new_reviews, average_rating
        ) VALUES (
          ${id}, ${appId}, ${date}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        )
      `;
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let developerAnalyticsServiceInstance: DeveloperAnalyticsService | null = null;

export function getDeveloperAnalyticsService(): DeveloperAnalyticsService {
  if (!developerAnalyticsServiceInstance) {
    developerAnalyticsServiceInstance = new DeveloperAnalyticsService();
  }
  return developerAnalyticsServiceInstance;
}
