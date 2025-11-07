/**
 * Developer Stats API
 * GET /api/developer/stats - Get developer statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeveloperService } from '@/lib/marketplace';

const developerService = getDeveloperService();

export async function GET(request: NextRequest) {
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
        { error: 'Developer profile not found' },
        { status: 404 }
      );
    }

    const stats = await developerService.getDeveloperStats(developer.id);

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Get developer stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get developer stats' },
      { status: 500 }
    );
  }
}
