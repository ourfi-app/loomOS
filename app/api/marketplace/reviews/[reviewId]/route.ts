// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * API Route: /api/marketplace/reviews/[reviewId]
 * Manage individual reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAppReviewService } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

// PATCH - Update a review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = params;
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    

    const reviewService = getAppReviewService();
    const review = await reviewService.updateReview(
      reviewId,
      (session.user as any).id,
      {
        rating: body.rating,
        title: body.title,
        content: body.content,
      }
    );

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 400 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(
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
    await reviewService.deleteReview(reviewId, (session.user as any).id);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: 400 }
    );
  }
}
