/**
 * API Route: /api/marketplace/apps/[slug]/reviews
 * Manage app reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { getAppRegistryService, getAppReviewService } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

// GET - Get reviews for an app
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
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = (searchParams.get('sortBy') || 'recent') as 'recent' | 'helpful' | 'rating';

    // Get app
    const appRegistry = getAppRegistryService();
    const app = await appRegistry.getApp(slug, organizationId);

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Get reviews
    const reviewService = getAppReviewService();
    const { reviews, total } = await reviewService.getAppReviews(
      app.id,
      page,
      pageSize,
      { sortBy }
    );

    return NextResponse.json({
      reviews,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a review
export async function POST(
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
    const body = await request.json();

    // Get app
    const appRegistry = getAppRegistryService();
    const app = await appRegistry.getApp(slug, organizationId);

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Create review
    const reviewService = getAppReviewService();
    const review = await reviewService.createReview({
      appId: app.id,
      userId: (session.user as any).id,
      rating: body.rating,
      title: body.title,
      content: body.content,
      version: body.version || app.currentVersion,
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 400 }
    );
  }
}
