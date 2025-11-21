// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

// GET /api/marketplace/installed - Get user's installed apps
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const userId = (session.user as any).id;
    const organizationId = await getCurrentOrganizationId();

    const installedApps = await prisma.userInstalledApp.findMany({
      where: {
        organizationId, userId 
      },
      include: {
        app: true,
      },
      orderBy: [
        { isPinned: 'desc' },
        { sortOrder: 'asc' },
        { installedAt: 'desc' },
      ],
    });

    return NextResponse.json(installedApps);
  } catch (error) {
    console.error('Error fetching installed apps:', error);
    return NextResponse.json({ error: 'Failed to fetch installed apps' }, { status: 500 });
  }
}

// POST /api/marketplace/installed - Install an app
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;
    const { appId } = await req.json();

    // Check if app exists and is available
    const app = await prisma.marketplaceApp.findUnique({
      where: {
        organizationId,
        id: appId 
      },
    });

    if (!app || app.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'App not available' }, { status: 400 });
    }

    // Check role permissions
    if (app.minRole) {
      const userRole = (session.user as any).role;
      const roleHierarchy = { RESIDENT: 0, BOARD_MEMBER: 1, ADMIN: 2 };
      const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[app.minRole as keyof typeof roleHierarchy] || 0;
      
      if (userLevel < requiredLevel) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }

    // Check if already installed
    const existing = await prisma.userInstalledApp.findUnique({
      where: {
        organizationId_userId_appId: {
          organizationId,
          userId,
          appId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'App already installed' }, { status: 400 });
    }

    // Install the app
    const installation = await prisma.userInstalledApp.create({
      data: {
        organizationId,
        userId,
        appId,
      },
      include: {
        app: true,
      },
    });

    // Update install count
    await prisma.marketplaceApp.update({
      where: {
        organizationId,
        id: appId 
      },
      data: {
        installCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(installation);
  } catch (error) {
    console.error('Error installing app:', error);
    return NextResponse.json({ error: 'Failed to install app' }, { status: 500 });
  }
}

// DELETE /api/marketplace/installed - Uninstall an app
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = await getCurrentOrganizationId();
    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'App ID required' }, { status: 400 });
    }

    // Check if the app is a system app
    const app = await prisma.marketplaceApp.findUnique({
      where: {
        organizationId,
        id: appId 
      },
    });

    if (app?.isSystem) {
      return NextResponse.json({ error: 'Cannot uninstall system apps' }, { status: 400 });
    }

    // Delete the installation
    await prisma.userInstalledApp.deleteMany({
      where: {
        organizationId,
        userId,
        appId,
      
      },
    });

    // Update install count
    await prisma.marketplaceApp.update({
      where: {
        organizationId,
        id: appId 
      },
      data: {
        installCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uninstalling app:', error);
    return NextResponse.json({ error: 'Failed to uninstall app' }, { status: 500 });
  }
}
