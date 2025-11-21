/**
 * Developer Apps API
 * GET /api/developer/apps - Get all apps for current developer
 * POST /api/developer/apps - Create new app
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeveloperService, getAppSubmissionService } from '@/lib/marketplace';
import type { CreateAppInput } from '@/lib/marketplace/AppSubmissionService';

const developerService = getDeveloperService();
const appSubmissionService = getAppSubmissionService();

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
        { error: 'Not registered as a developer' },
        { status: 403 }
      );
    }

    const apps = await developerService.getDeveloperApps(developer.id);

    return NextResponse.json({ apps });
  } catch (error: any) {
    console.error('Get developer apps error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get apps' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    

    const input: CreateAppInput = {
      developerId: developer.id,
      name: body.name,
      slug: body.slug,
      tagline: body.tagline,
      description: body.description,
      shortDescription: body.shortDescription,
      category: body.category,
      tags: body.tags || [],
      pricing: body.pricing,
      icon: body.icon,
      screenshots: body.screenshots || [],
      video: body.video,
      permissions: body.permissions || [],
      minimumLoomOSVersion: body.minimumLoomOSVersion || '1.0.0',
      installationType: body.installationType,
      features: body.features || [],
    };

    const app = await appSubmissionService.createApp(input);

    return NextResponse.json({
      success: true,
      app,
      message: 'App created successfully',
    });
  } catch (error: any) {
    console.error('Create app error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create app' },
      { status: 500 }
    );
  }
}
