// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

// GET /api/marketplace/updates - Check for app updates
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const organizationId = await getCurrentOrganizationId();

    // Get user's installed apps
    const installedApps = await prisma.userInstalledApp.findMany({
      where: {
        organizationId,
        userId,
      },
      include: {
        app: true,
      },
    });

    // Check for updates (compare versions)
    const updates = installedApps
      .filter((installed) => {
        const currentVersion = installed.app.version;
        const installedVersion = installed.installedVersion || currentVersion;
        return compareVersions(currentVersion, installedVersion) > 0;
      })
      .map((installed) => ({
        appId: installed.appId,
        appName: installed.app.name,
        currentVersion: installed.installedVersion || '1.0.0',
        newVersion: installed.app.version,
        updateNotes: installed.app.updateNotes,
      }));

    return NextResponse.json({
      updates,
      count: updates.length,
    });
  } catch (error) {
    console.error('Error checking for updates:', error);
    return NextResponse.json({ error: 'Failed to check updates' }, { status: 500 });
  }
}

// POST /api/marketplace/updates - Update an app
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const organizationId = await getCurrentOrganizationId();
    const { appId } = await req.json();

    if (!appId) {
      return NextResponse.json({ error: 'App ID required' }, { status: 400 });
    }

    // Get the latest app version
    const app = await prisma.marketplaceApp.findUnique({
      where: {
        organizationId,
        id: appId,
      },
    });

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Update the user's installation
    const updated = await prisma.userInstalledApp.updateMany({
      where: {
        organizationId,
        userId,
        appId,
      },
      data: {
        installedVersion: app.version,
        lastUpdatedAt: new Date(),
      },
    });

    // Create update history record
    await prisma.appUpdateHistory.create({
      data: {
        organizationId,
        userId,
        appId,
        fromVersion: '1.0.0', // Would need to track this
        toVersion: app.version,
      },
    });

    return NextResponse.json({
      success: true,
      appName: app.name,
      version: app.version,
    });
  } catch (error) {
    console.error('Error updating app:', error);
    return NextResponse.json({ error: 'Failed to update app' }, { status: 500 });
  }
}

// Helper function to compare semantic versions
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map((n) => parseInt(n, 10));
  const parts2 = v2.split('.').map((n) => parseInt(n, 10));

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}
