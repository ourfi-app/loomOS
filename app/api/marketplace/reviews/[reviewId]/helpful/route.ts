/**
 * API Route: /api/marketplace/reviews/[reviewId]/helpful
 * Mark a review as helpful
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAppReviewService } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

// POST - Mark review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = params;

    const reviewService = getAppReviewService();
    await reviewService.markHelpful(reviewId);

    return NextResponse.json({
      success: true,
      message: 'Review marked as helpful',
    });
  } catch (error: any) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark review as helpful' },
      { status: 400 }
    );
  }
}
