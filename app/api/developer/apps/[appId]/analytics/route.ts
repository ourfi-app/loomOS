/**
 * App Analytics API
 * GET /api/developer/apps/[appId]/analytics - Get app analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeveloperService, getDeveloperAnalyticsService } from '@/lib/marketplace';
import { prisma } from '@/lib/db';

const developerService = getDeveloperService();
const analyticsService = getDeveloperAnalyticsService();

export async function GET(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const developer = await developerService.getDeveloperByUserId(session.user.id);

    if (!developer) {
      return NextResponse.json(
        { error: 'Not registered as a developer' },
        { status: 403 }
      );
    }

    // Verify app belongs to developer
    const app = await prisma.marketplaceApp.findFirst({
      where: {
        id: params.appId,
        developerId: developer.id,
      },
    });

    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    const endDate = endParam ? new Date(endParam) : new Date();
    const startDate = startParam
      ? new Date(startParam)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days

    const timeRange = { startDate, endDate };

    // Get analytics data and summary
    const [analytics, summary, realTimeStats] = await Promise.all([
      analyticsService.getAppAnalytics(params.appId, timeRange),
      analyticsService.getAnalyticsSummary(params.appId, timeRange),
      analyticsService.getRealTimeStats(params.appId),
    ]);

    return NextResponse.json({
      analytics,
      summary,
      realTimeStats,
      timeRange,
    });
  } catch (error: any) {
    console.error('Get app analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
