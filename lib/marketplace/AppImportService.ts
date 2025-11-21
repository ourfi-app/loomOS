// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * App Import Service
 *
 * Handles importing app definitions from JSON manifests into the marketplace database.
 * Supports both single app import and bulk imports from directories.
 */

import { PrismaClient } from '@prisma/client';
import {
  AppImportDefinition,
  AppImportOptions,
  AppImportResult,
  BulkImportResult,
  AppImportSchema,
  AppManifest,
} from './app-import-types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class AppImportService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Import a single app from a definition
   */
  async importApp(
    definition: AppImportDefinition,
    options: AppImportOptions = {}
  ): Promise<AppImportResult> {
    const {
      updateExisting = true,
      autoPublish = false,
      defaultOrganizationId,
      defaultDeveloperId,
      dryRun = false,
      skipValidation = false,
    } = options;

    const result: AppImportResult = {
      success: false,
      slug: definition.slug,
      action: 'failed',
      message: '',
      errors: [],
      warnings: [],
    };

    try {
      // Validate the definition
      if (!skipValidation) {
        const validation = AppImportSchema.safeParse(definition);
        if (!validation.success) {
          result.errors = validation.error.errors.map(
            (e) => `${e.path.join('.')}: ${e.message}`
          );
          result.message = `Validation failed: ${result.errors.join(', ')}`;
          return result;
        }
      }

      // Check if app already exists
      const existingApp = await this.prisma.marketplaceApp.findUnique({
        where: { slug: definition.slug },
      });

      if (existingApp && !updateExisting) {
        result.action = 'skipped';
        result.message = `App with slug '${definition.slug}' already exists`;
        result.warnings?.push('Use updateExisting option to update existing apps');
        result.appId = existingApp.id;
        return result;
      }

      if (dryRun) {
        result.success = true;
        result.action = existingApp ? 'updated' : 'created';
        result.message = `[DRY RUN] Would ${result.action} app '${definition.name}'`;
        return result;
      }

      // Prepare app data
      const appData = {
        name: definition.name,
        slug: definition.slug,
        tagline: definition.tagline,
        description: definition.description,
        longDescription: definition.longDescription || definition.description,
        iconName: definition.iconName || 'package',
        color: definition.color || '#6366f1',
        path: definition.path || `/${definition.slug}`,
        category: definition.category,
        tags: definition.tags,
        features: definition.features,
        permissions: definition.permissions,
        minRole: definition.minRole,
        isActive: definition.isActive,
        currentVersion: definition.version,
        status: autoPublish ? 'PUBLISHED' : definition.status,
        pricingModel: definition.pricingModel,
        price: definition.price,
        currency: definition.currency,
        screenshots: definition.screenshots,
        videoUrl: definition.videoUrl,
        websiteUrl: definition.websiteUrl,
        supportUrl: definition.supportUrl,
        privacyUrl: definition.privacyUrl,
        termsUrl: definition.termsUrl,
        compatibility: definition.compatibility,
        requiredIntegrations: definition.requiredIntegrations,
        searchKeywords: definition.searchKeywords,
        organizationId: definition.organizationId || defaultOrganizationId || null,
        developerId: definition.developerId || defaultDeveloperId || null,
        // Default values for fields not in import schema
        installCount: existingApp?.installCount || 0,
        downloads: existingApp?.downloads || 0,
        rating: existingApp?.rating || 0,
        ratingCount: existingApp?.ratingCount || 0,
        estimatedSize: existingApp?.estimatedSize || '2.5 MB',
      };

      // Create or update the app
      let app;
      if (existingApp) {
        app = await this.prisma.marketplaceApp.update({
          where: { id: existingApp.id },
          data: appData,
        });

        // Create a new version entry if version changed
        if (definition.version !== existingApp.currentVersion) {
          await this.prisma.appVersion.create({
            data: {
              appId: app.id,
              version: definition.version,
              releaseNotes: `Imported version ${definition.version}`,
              changes: [],
              releasedAt: new Date(),
            },
          });
        }

        result.action = 'updated';
        result.message = `Successfully updated app '${app.name}'`;
      } else {
        app = await this.prisma.marketplaceApp.create({
          data: appData,
        });

        // Create initial version
        await this.prisma.appVersion.create({
          data: {
            appId: app.id,
            version: definition.version,
            releaseNotes: `Initial release`,
            changes: [],
            releasedAt: new Date(),
          },
        });

        result.action = 'created';
        result.message = `Successfully created app '${app.name}'`;
      }

      result.success = true;
      result.appId = app.id;

      if (autoPublish && definition.status !== 'PUBLISHED') {
        result.warnings?.push('App auto-published (status changed from DRAFT/PENDING)');
      }

      return result;
    } catch (error) {
      result.errors?.push(error instanceof Error ? error.message : 'Unknown error');
      result.message = `Failed to import app: ${result.errors.join(', ')}`;
      return result;
    }
  }

  /**
   * Import apps from a directory structure
   * Expected structure: /apps/my-app/app.json
   */
  async importFromDirectory(
    appsDirectory: string,
    options: AppImportOptions = {}
  ): Promise<BulkImportResult> {
    const results: AppImportResult[] = [];

    try {
      // Read all subdirectories in the apps directory
      const entries = await fs.readdir(appsDirectory, { withFileTypes: true });
      const appDirs = entries.filter((entry) => entry.isDirectory());

      for (const dir of appDirs) {
        const appPath = path.join(appsDirectory, dir.name);
        const manifestPath = path.join(appPath, 'app.json');

        try {
          // Check if app.json exists
          await fs.access(manifestPath);

          // Read and parse the manifest
          const manifestContent = await fs.readFile(manifestPath, 'utf-8');
          const manifest: AppManifest = JSON.parse(manifestContent);

          // Import the app
          const result = await this.importApp(manifest.app, options);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            slug: dir.name,
            action: 'failed',
            message: `Failed to read manifest: ${error instanceof Error ? error.message : 'Unknown error'}`,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
          });
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to read apps directory: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      totalApps: results.length,
      successful,
      failed,
      results,
    };
  }

  /**
   * Import apps from JSON array
   */
  async importFromJSON(
    json: string,
    options: AppImportOptions = {}
  ): Promise<BulkImportResult> {
    try {
      const data = JSON.parse(json);
      const apps = Array.isArray(data) ? data : [data];

      const results: AppImportResult[] = [];
      for (const app of apps) {
        const result = await this.importApp(app, options);
        results.push(result);
      }

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      return {
        totalApps: results.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate an app definition without importing
   */
  validateApp(definition: AppImportDefinition): {
    valid: boolean;
    errors: string[];
  } {
    const validation = AppImportSchema.safeParse(definition);
    if (validation.success) {
      return { valid: true, errors: [] };
    }
    return {
      valid: false,
      errors: validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    };
  }

  /**
   * Export an app to import definition format
   */
  async exportApp(appId: string): Promise<AppImportDefinition | null> {
    const app = await this.prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app) {
      return null;
    }

    const definition: AppImportDefinition = {
      name: app.name,
      slug: app.slug,
      tagline: app.tagline,
      description: app.description,
      longDescription: app.longDescription || undefined,
      iconName: app.iconName || undefined,
      color: app.color || undefined,
      path: app.path || undefined,
      category: app.category as any,
      tags: app.tags as string[],
      features: app.features as string[],
      permissions: app.permissions as string[],
      minRole: app.minRole as any,
      isActive: app.isActive,
      version: app.currentVersion || '1.0.0',
      status: app.status as any,
      organizationId: app.organizationId || undefined,
      developerId: app.developerId || undefined,
      pricingModel: app.pricingModel as any,
      price: app.price?.toNumber() || 0,
      currency: app.currency || 'USD',
      screenshots: app.screenshots as string[],
      videoUrl: app.videoUrl || undefined,
      websiteUrl: app.websiteUrl || undefined,
      supportUrl: app.supportUrl || undefined,
      privacyUrl: app.privacyUrl || undefined,
      termsUrl: app.termsUrl || undefined,
      compatibility: app.compatibility as string[],
      requiredIntegrations: app.requiredIntegrations as string[],
      searchKeywords: app.searchKeywords as string[],
    };

    return definition;
  }

  /**
   * Export all apps to import definition format
   */
  async exportAllApps(organizationId?: string): Promise<AppImportDefinition[]> {
    const apps = await this.prisma.marketplaceApp.findMany({
      where: organizationId ? { organizationId } : {},
    });

    const definitions: AppImportDefinition[] = [];
    for (const app of apps) {
      const definition = await this.exportApp(app.id);
      if (definition) {
        definitions.push(definition);
      }
    }

    return definitions;
  }
}
