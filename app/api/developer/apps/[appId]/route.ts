/**
 * Developer App Details API
 * GET /api/developer/apps/[appId] - Get app details
 * PUT /api/developer/apps/[appId] - Update app details
 * DELETE /api/developer/apps/[appId] - Delete app
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeveloperService, getAppSubmissionService } from '@/lib/marketplace';
import { prisma } from '@/lib/db';

const developerService = getDeveloperService();
const appSubmissionService = getAppSubmissionService();

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

    const app = await prisma.marketplaceApp.findFirst({
      where: {
        id: params.appId,
        developerId: developer.id,
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ app });
  } catch (error: any) {
    console.error('Get app details error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get app details' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    

    const app = await appSubmissionService.updateApp(
      params.appId,
      developer.id,
      body
    );

    return NextResponse.json({
      success: true,
      app,
      message: 'App updated successfully',
    });
  } catch (error: any) {
    console.error('Update app error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update app' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await appSubmissionService.deleteApp(params.appId, developer.id);

    return NextResponse.json({
      success: true,
      message: 'App deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete app error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete app' },
      { status: 500 }
    );
  }
}
