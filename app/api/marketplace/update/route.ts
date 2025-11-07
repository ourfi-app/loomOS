/**
 * API Route: /api/marketplace/update
 * Update an app to the latest version
 */

import { NextRequest, NextResponse } from 'next/server';
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
    const { appId } = body;

    if (!appId) {
      return NextResponse.json({ error: 'App ID is required' }, { status: 400 });
    }

    const installService = getAppInstallationService();

    // Update the app
    const updated = await installService.updateApp(
      appId,
      (session.user as any).id,
      organizationId
    );

    return NextResponse.json({
      success: true,
      installed: updated,
      message: 'App updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating app:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update app' },
      { status: 400 }
    );
  }
}
