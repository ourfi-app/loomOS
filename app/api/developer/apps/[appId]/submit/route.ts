/**
 * App Version Submission API
 * POST /api/developer/apps/[appId]/submit - Submit new version for review
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDeveloperService, getAppSubmissionService } from '@/lib/marketplace';
import type { SubmitVersionInput } from '@/lib/marketplace/AppSubmissionService';

const developerService = getDeveloperService();
const appSubmissionService = getAppSubmissionService();

export async function POST(
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
    

    const input: SubmitVersionInput = {
      appId: params.appId,
      version: body.version,
      releaseNotes: body.releaseNotes,
      packageUrl: body.packageUrl,
      packageSize: body.packageSize,
      minimumLoomOSVersion: body.minimumLoomOSVersion || '1.0.0',
    };

    const submission = await appSubmissionService.submitVersion(input);

    return NextResponse.json({
      success: true,
      submission,
      message: 'Version submitted for review',
    });
  } catch (error: any) {
    console.error('Submit version error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit version' },
      { status: 500 }
    );
  }
}
