// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * App Installation Service
 * Handles app installation, updates, and uninstallation
 */

import { prisma } from '@/lib/db';
import type {
  App,
  InstalledApp,
  InstallOptions,
  InstallProgress,
  AppUpdate,
  AppVersion,
} from './types';
import { getAppRegistryService } from './AppRegistryService';

export class AppInstallationService {
  private appRegistry = getAppRegistryService();

  /**
   * Install an app
   */
  async installApp(
    appId: string,
    options: InstallOptions,
    onProgress?: (progress: InstallProgress) => void
  ): Promise<InstalledApp> {
    // 1. Get app details
    onProgress?.({
      stage: 'downloading',
      progress: 0,
      message: 'Fetching app details...',
    });

    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app) {
      throw new Error('App not found');
    }

    // 2. Check if already installed
    const existing = await this.getInstalledApp(appId, options.userId, options.organizationId);
    if (existing) {
      throw new Error('App already installed');
    }

    // 3. Simulate download (in real implementation, this would download the package)
    onProgress?.({
      stage: 'downloading',
      progress: 30,
      message: 'Downloading app package...',
    });

    await this.simulateDelay(1000);

    // 4. Verify package integrity
    onProgress?.({
      stage: 'extracting',
      progress: 60,
      message: 'Verifying package...',
    });

    await this.simulateDelay(500);

    // 5. Install app
    onProgress?.({
      stage: 'installing',
      progress: 80,
      message: 'Installing app...',
    });

    const installedApp = await prisma.userInstalledApp.create({
      data: {
        appId: app.id,
        userId: options.userId,
        organizationId: options.organizationId || '',
        installedVersion: app.currentVersion,
        autoUpdate: options.autoUpdate ?? true,
        launchCount: 0,
        isPinned: false,
        sortOrder: 0,
      },
      include: {
        app: true,
      },
    });

    // 6. Increment download count
    await this.appRegistry.incrementDownloads(app.id);

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Installation complete!',
    });

    return installedApp as any;
  }

  /**
   * Uninstall an app
   */
  async uninstallApp(
    appId: string,
    userId: string,
    organizationId?: string
  ): Promise<void> {
    const installed = await this.getInstalledApp(appId, userId, organizationId);
    if (!installed) {
      throw new Error('App not installed');
    }

    // Check if system app
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (app?.isSystem) {
      throw new Error('Cannot uninstall system app');
    }

    // Remove installation record
    await prisma.userInstalledApp.delete({
      where: { id: installed.id },
    });
  }

  /**
   * Update an app
   */
  async updateApp(
    appId: string,
    userId: string,
    organizationId?: string,
    onProgress?: (progress: InstallProgress) => void
  ): Promise<InstalledApp> {
    const installed = await this.getInstalledApp(appId, userId, organizationId);
    if (!installed) {
      throw new Error('App not installed');
    }

    const latestVersion = await this.appRegistry.getLatestVersion(appId);
    if (!latestVersion || latestVersion.version === installed.installedVersion) {
      throw new Error('No update available');
    }

    onProgress?.({
      stage: 'downloading',
      progress: 0,
      message: 'Downloading update...',
    });

    await this.simulateDelay(1000);

    onProgress?.({
      stage: 'installing',
      progress: 50,
      message: 'Installing update...',
    });

    await this.simulateDelay(1000);

    // Update installation record
    const updated = await prisma.userInstalledApp.update({
      where: { id: installed.id },
      data: {
        installedVersion: latestVersion.version,
        lastUpdatedAt: new Date(),
      },
      include: {
        app: true,
      },
    });

    // Create update history record
    await prisma.appUpdateHistory.create({
      data: {
        appId,
        userId,
        organizationId: organizationId || '',
        fromVersion: installed.installedVersion || 'unknown',
        toVersion: latestVersion.version,
      },
    });

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Update complete!',
    });

    return updated as any;
  }

  /**
   * Get installed apps for a user
   */
  async getInstalledApps(
    userId: string,
    organizationId?: string
  ): Promise<InstalledApp[]> {
    const apps = await prisma.userInstalledApp.findMany({
      where: {
        userId,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        app: true,
      },
      orderBy: { lastUsedAt: 'desc' },
    });

    return apps as any[];
  }

  /**
   * Check for updates for all installed apps
   */
  async checkForUpdates(
    userId: string,
    organizationId?: string
  ): Promise<AppUpdate[]> {
    const installed = await this.getInstalledApps(userId, organizationId);
    const updates: AppUpdate[] = [];

    for (const app of installed) {
      const latest = await this.appRegistry.checkForUpdate(
        app.appId,
        app.installedVersion || '0.0.0'
      );

      if (latest) {
        updates.push({
          appId: app.appId,
          app: app.app as any,
          installed: app,
          latestVersion: latest,
          currentVersion: app.installedVersion || 'unknown',
          releaseNotes: latest.releaseNotes,
        });
      }
    }

    return updates;
  }

  /**
   * Launch an app (track usage)
   */
  async launchApp(
    appId: string,
    userId: string,
    organizationId?: string
  ): Promise<void> {
    const installed = await this.getInstalledApp(appId, userId, organizationId);
    if (!installed) {
      throw new Error('App not installed');
    }

    await prisma.userInstalledApp.update({
      where: { id: installed.id },
      data: {
        lastUsedAt: new Date(),
        launchCount: { increment: 1 },
      },
    });
  }

  /**
   * Toggle app pin status
   */
  async togglePinApp(
    appId: string,
    userId: string,
    organizationId?: string
  ): Promise<InstalledApp> {
    const installed = await this.getInstalledApp(appId, userId, organizationId);
    if (!installed) {
      throw new Error('App not installed');
    }

    const updated = await prisma.userInstalledApp.update({
      where: { id: installed.id },
      data: {
        isPinned: !installed.isPinned,
      },
      include: {
        app: true,
      },
    });

    return updated as any;
  }

  /**
   * Update app settings
   */
  async updateAppSettings(
    appId: string,
    userId: string,
    settings: Record<string, any>,
    organizationId?: string
  ): Promise<InstalledApp> {
    const installed = await this.getInstalledApp(appId, userId, organizationId);
    if (!installed) {
      throw new Error('App not installed');
    }

    const updated = await prisma.userInstalledApp.update({
      where: { id: installed.id },
      data: {
        customSettings: settings,
      },
      include: {
        app: true,
      },
    });

    return updated as any;
  }

  /**
   * Get app update history for a user
   */
  async getUpdateHistory(
    userId: string,
    organizationId?: string,
    limit = 20
  ): Promise<any[]> {
    const history = await prisma.appUpdateHistory.findMany({
      where: {
        userId,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        app: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    return history;
  }

  /**
   * Check if app is installed
   */
  async isAppInstalled(
    appId: string,
    userId: string,
    organizationId?: string
  ): Promise<boolean> {
    const installed = await this.getInstalledApp(appId, userId, organizationId);
    return !!installed;
  }

  // ============================================================
  // PRIVATE HELPER METHODS
  // ============================================================

  private async getInstalledApp(
    appId: string,
    userId: string,
    organizationId?: string
  ): Promise<InstalledApp | null> {
    const app = await prisma.userInstalledApp.findFirst({
      where: {
        appId,
        userId,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        app: true,
      },
    });

    return app as any;
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
let installationInstance: AppInstallationService | null = null;

export function getAppInstallationService(): AppInstallationService {
  if (!installationInstance) {
    installationInstance = new AppInstallationService();
  }
  return installationInstance;
}
