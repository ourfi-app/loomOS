/**
 * App Import API Endpoint
 *
 * POST /api/marketplace/import
 *
 * Allows importing apps from JSON definitions.
 * Supports both single app import and bulk imports.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppImportService } from '@/lib/marketplace/AppImportService';
import { AppImportDefinition, AppImportOptions } from '@/lib/marketplace/app-import-types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Import apps from JSON payload
 * POST /api/marketplace/import
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add authorization check - only admins/developers should be able to import
    // For now, require authenticated user
    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { apps, options } = body;

    if (!apps) {
      return NextResponse.json(
        { error: 'Missing required field: apps' },
        { status: 400 }
      );
    }

    // Initialize import service
    const importService = new AppImportService(prisma);

    // Prepare import options
    const importOptions: AppImportOptions = {
      updateExisting: options?.updateExisting ?? true,
      autoPublish: options?.autoPublish ?? false,
      defaultOrganizationId: options?.organizationId,
      defaultDeveloperId: options?.developerId || userId,
      dryRun: options?.dryRun ?? false,
      skipValidation: options?.skipValidation ?? false,
    };

    // Import apps (supports both single app and array of apps)
    const appsArray: AppImportDefinition[] = Array.isArray(apps) ? apps : [apps];
    const results = [];

    for (const app of appsArray) {
      const result = await importService.importApp(app, importOptions);
      results.push(result);
    }

    // Calculate summary
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: failed === 0,
      totalApps: results.length,
      successful,
      failed,
      results,
    });
  } catch (error) {
    console.error('App import error:', error);
    return NextResponse.json(
      {
        error: 'Failed to import apps',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Export apps to JSON format
 * GET /api/marketplace/import?export=true
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appId');
    const organizationId = searchParams.get('organizationId');

    const importService = new AppImportService(prisma);

    // Export single app
    if (appId) {
      const definition = await importService.exportApp(appId);
      if (!definition) {
        return NextResponse.json(
          { error: 'App not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ app: definition });
    }

    // Export all apps (optionally filtered by organization)
    const definitions = await importService.exportAllApps(
      organizationId || undefined
    );

    return NextResponse.json({ apps: definitions });
  } catch (error) {
    console.error('App export error:', error);
    return NextResponse.json(
      {
        error: 'Failed to export apps',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
