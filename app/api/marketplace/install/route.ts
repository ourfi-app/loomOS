// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * API Route: /api/marketplace/install
 * Install an app
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import { getAppInstallationService } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const body = await request.json();
    // TODO: Add specific validation schema for this endpoint
    const bodySchema = z.object({
      // Define your schema here
    });
    // Uncomment to enable validation:
    // const validatedBody = bodySchema.parse(body);
    
    const { appId } = body;

    if (!appId) {
      return NextResponse.json({ error: 'App ID is required' }, { status: 400 });
    }

    const installService = getAppInstallationService();

    // Install the app
    const installed = await installService.installApp(
      appId,
      {
        userId: (session.user as any).id,
        organizationId,
        autoUpdate: true,
      }
    );

    return NextResponse.json({
      success: true,
      installed,
      message: 'App installed successfully',
    });
  } catch (error: any) {
    console.error('Error installing app:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to install app' },
      { status: 400 }
    );
  }
}
