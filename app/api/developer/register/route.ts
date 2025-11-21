/**
 * Developer Registration API
 * POST /api/developer/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeveloperService } from '@/lib/marketplace';
import type { CreateDeveloperInput } from '@/lib/marketplace';

const developerService = getDeveloperService();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { displayName, companyName, bio, website, supportEmail, tier } = body;

    // Validate required fields
    if (!displayName || !bio || !supportEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: displayName, bio, supportEmail' },
        { status: 400 }
      );
    }

    const input: CreateDeveloperInput = {
      userId: session.user.id,
      displayName,
      companyName,
      bio,
      website,
      supportEmail,
      tier,
    };

    const developer = await developerService.registerDeveloper(input);

    return NextResponse.json({
      success: true,
      developer,
      message: 'Developer account created. Please check your email to verify your account.',
    });
  } catch (error: any) {
    console.error('Developer registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register developer' },
      { status: 500 }
    );
  }
}
