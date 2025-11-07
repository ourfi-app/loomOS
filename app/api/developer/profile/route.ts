/**
 * Developer Profile API
 * GET /api/developer/profile - Get current developer profile
 * PUT /api/developer/profile - Update developer profile
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

    return NextResponse.json({ developer });
  } catch (error: any) {
    console.error('Get developer profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get developer profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { displayName, companyName, bio, website, supportEmail, avatar, logo } = body;

    const updates = {
      displayName,
      companyName,
      bio,
      website,
      supportEmail,
      avatar,
      logo,
    };

    const updatedDeveloper = await developerService.updateDeveloper(
      developer.id,
      updates
    );

    return NextResponse.json({
      success: true,
      developer: updatedDeveloper,
    });
  } catch (error: any) {
    console.error('Update developer profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update developer profile' },
      { status: 500 }
    );
  }
}
