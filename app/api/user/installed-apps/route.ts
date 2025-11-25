import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentOrganizationId } from '@/lib/tenant-context';
import {
  validateAuthentication,
  logApiCall,
  successResponse,
  handleApiError,
  parseRequestBody,
  validateRequiredFields,
  errorResponse,
} from '@/lib/api-utils';

export const dynamic = "force-dynamic";

/**
 * GET /api/user/installed-apps
 * Fetch user's installed apps with full app details
 * 
 * @returns {Array} - User's installed apps sorted by isPinned (pinned first), then by lastUsedAt
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    const userId = session.user.id;

    // Fetch user's installed apps with full app details
    const installedApps = await prisma.userInstalledApp.findMany({
      where: {
        userId,
        organizationId,
      },
      include: {
        app: true, // Include full MarketplaceApp details
      },
      orderBy: [
        { isPinned: 'desc' }, // Pinned apps first
        { lastUsedAt: 'desc' }, // Then by most recently used
        { installedAt: 'desc' }, // Then by most recently installed
      ],
    });

    // Transform data to include app details at the root level
    const transformedApps = installedApps.map((installation) => ({
      // Installation details
      installationId: installation.id,
      installedAt: installation.installedAt,
      lastUsedAt: installation.lastUsedAt,
      isPinned: installation.isPinned,
      sortOrder: installation.sortOrder,
      launchCount: installation.launchCount,
      installedVersion: installation.installedVersion,
      
      // App details
      appId: installation.app.id,
      name: installation.app.name,
      slug: installation.app.slug,
      tagline: installation.app.tagline,
      shortDescription: installation.app.shortDescription,
      longDescription: installation.app.longDescription,
      category: installation.app.category,
      tags: installation.app.tags,
      status: installation.app.status,
      currentVersion: installation.app.currentVersion,
      developer: installation.app.developer,
      developerName: installation.app.developerName,
      iconName: installation.app.iconName,
      color: installation.app.color,
      path: installation.app.path,
      screenshots: installation.app.screenshots,
      rating: installation.app.rating,
      ratingCount: installation.app.ratingCount,
      installCount: installation.app.installCount,
      isSystem: installation.app.isSystem,
      isFeatured: installation.app.isFeatured,
    }));

    // Log successful API call
    logApiCall(
      'GET',
      '/api/user/installed-apps',
      200,
      Date.now() - startTime,
      userId
    );

    return successResponse(
      transformedApps,
      'Installed apps fetched successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/user/installed-apps', request);
  }
}

/**
 * POST /api/user/installed-apps
 * Install a new app for the user
 * 
 * Body: { appId: string }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    const userId = session.user.id;

    // Parse request body
    const body = await parseRequestBody(request);
    
    // Validate required fields
    const validation = validateRequiredFields(body, ['appId']);
    if (!validation.valid) {
      return errorResponse(
        `Missing required fields: ${validation.missing.join(', ')}`,
        400
      );
    }

    const { appId } = body;

    // Check if app exists
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app) {
      return errorResponse('App not found', 404);
    }

    // Check if already installed
    const existingInstallation = await prisma.userInstalledApp.findUnique({
      where: {
        organizationId_userId_appId: {
          organizationId,
          userId,
          appId,
        },
      },
    });

    if (existingInstallation) {
      return errorResponse('App already installed', 409);
    }

    // Install the app
    const installation = await prisma.userInstalledApp.create({
      data: {
        userId,
        organizationId,
        appId,
        installedVersion: app.currentVersion,
      },
      include: {
        app: true,
      },
    });

    // Update app install count
    await prisma.marketplaceApp.update({
      where: { id: appId },
      data: {
        installCount: { increment: 1 },
        downloads: { increment: 1 },
      },
    });

    // Log successful API call
    logApiCall(
      'POST',
      '/api/user/installed-apps',
      201,
      Date.now() - startTime,
      userId
    );

    return successResponse(
      installation,
      'App installed successfully',
      201
    );
  } catch (error) {
    return handleApiError(error, '/api/user/installed-apps', request);
  }
}

/**
 * PATCH /api/user/installed-apps
 * Update app installation settings (pin/unpin, track usage)
 * 
 * Body: { 
 *   appId: string,
 *   action: 'pin' | 'unpin' | 'track-usage',
 *   data?: any
 * }
 */
export async function PATCH(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    const userId = session.user.id;

    // Parse request body
    const body = await parseRequestBody(request);
    
    // Validate required fields
    const validation = validateRequiredFields(body, ['appId', 'action']);
    if (!validation.valid) {
      return errorResponse(
        `Missing required fields: ${validation.missing.join(', ')}`,
        400
      );
    }

    const { appId, action, data } = body;

    // Find the installation
    const installation = await prisma.userInstalledApp.findUnique({
      where: {
        organizationId_userId_appId: {
          organizationId,
          userId,
          appId,
        },
      },
    });

    if (!installation) {
      return errorResponse('App not installed', 404);
    }

    let updatedInstallation;

    switch (action) {
      case 'pin':
        updatedInstallation = await prisma.userInstalledApp.update({
          where: {
            organizationId_userId_appId: {
              organizationId,
              userId,
              appId,
            },
          },
          data: { isPinned: true },
          include: { app: true },
        });
        break;

      case 'unpin':
        updatedInstallation = await prisma.userInstalledApp.update({
          where: {
            organizationId_userId_appId: {
              organizationId,
              userId,
              appId,
            },
          },
          data: { isPinned: false },
          include: { app: true },
        });
        break;

      case 'track-usage':
        updatedInstallation = await prisma.userInstalledApp.update({
          where: {
            organizationId_userId_appId: {
              organizationId,
              userId,
              appId,
            },
          },
          data: {
            launchCount: { increment: 1 },
            lastUsedAt: new Date(),
          },
          include: { app: true },
        });
        break;

      default:
        return errorResponse('Invalid action', 400);
    }

    // Log successful API call
    logApiCall(
      'PATCH',
      '/api/user/installed-apps',
      200,
      Date.now() - startTime,
      userId
    );

    return successResponse(
      updatedInstallation,
      `App ${action} action completed successfully`,
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/user/installed-apps', request);
  }
}

/**
 * DELETE /api/user/installed-apps
 * Uninstall an app for the user
 * 
 * Body: { appId: string }
 */
export async function DELETE(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Authenticate user
    const session = await validateAuthentication(request);
    const organizationId = await getCurrentOrganizationId();
    const userId = session.user.id;

    // Parse request body
    const body = await parseRequestBody(request);
    
    // Validate required fields
    const validation = validateRequiredFields(body, ['appId']);
    if (!validation.valid) {
      return errorResponse(
        `Missing required fields: ${validation.missing.join(', ')}`,
        400
      );
    }

    const { appId } = body;

    // Check if app is a system app
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app) {
      return errorResponse('App not found', 404);
    }

    if (app.isSystem) {
      return errorResponse('System apps cannot be uninstalled', 403);
    }

    // Find the installation
    const installation = await prisma.userInstalledApp.findUnique({
      where: {
        organizationId_userId_appId: {
          organizationId,
          userId,
          appId,
        },
      },
    });

    if (!installation) {
      return errorResponse('App not installed', 404);
    }

    // Delete the installation
    await prisma.userInstalledApp.delete({
      where: {
        organizationId_userId_appId: {
          organizationId,
          userId,
          appId,
        },
      },
    });

    // Update app install count
    await prisma.marketplaceApp.update({
      where: { id: appId },
      data: {
        installCount: { decrement: 1 },
      },
    });

    // Log successful API call
    logApiCall(
      'DELETE',
      '/api/user/installed-apps',
      200,
      Date.now() - startTime,
      userId
    );

    return successResponse(
      { appId },
      'App uninstalled successfully',
      200
    );
  } catch (error) {
    return handleApiError(error, '/api/user/installed-apps', request);
  }
}
