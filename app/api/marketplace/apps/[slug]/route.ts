// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * API Route: /api/marketplace/apps/[slug]
 * Get detailed information about a specific app
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { getAppRegistryService, getAppReviewService } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const { slug } = params;

    // Get app details
    const appRegistry = getAppRegistryService();
    const app = await appRegistry.getApp(slug, organizationId);

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Get review statistics
    const reviewService = getAppReviewService();
    const reviewStats = await reviewService.getReviewStats(app.id);

    // Get recent reviews
    const { reviews } = await reviewService.getAppReviews(app.id, 1, 5);

    // Check if user has reviewed this app
    const userReview = await reviewService.getUserReview(
      app.id,
      (session.user as any).id
    );

    return NextResponse.json({
      app,
      reviewStats,
      recentReviews: reviews,
      userReview,
    });
  } catch (error: any) {
    console.error('Error fetching app details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch app details' },
      { status: 500 }
    );
  }
}
