/**
 * App Submission Service
 * Handles app creation, version submission, and publishing workflow
 */

import { prisma } from '@/lib/db';
import { getDeveloperService } from './DeveloperService';
import type {
  AppSubmission,
  SubmissionStatus,
} from './developer-types';
import type {
  App,
  AppCategory,
  AppStatus,
  AppVersion,
  AppPricing,
  AppPermission,
  AppInstallationType,
  AppScreenshot,
} from './types';

export interface CreateAppInput {
  developerId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  category: AppCategory;
  tags: string[];
  pricing: AppPricing;
  icon: string; // URL after upload
  screenshots: string[]; // URLs after upload
  video?: string;
  permissions: AppPermission[];
  minimumLoomOSVersion: string;
  installationType: AppInstallationType;
  features?: string[];
}

export interface SubmitVersionInput {
  appId: string;
  version: string;
  releaseNotes: string;
  packageUrl: string; // URL after upload
  packageSize: number;
  minimumLoomOSVersion: string;
}

export class AppSubmissionService {
  private developerService = getDeveloperService();

  /**
   * Create a new app (draft)
   */
  async createApp(input: CreateAppInput): Promise<App> {
    const developer = await this.developerService.getDeveloper(input.developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    // Check if developer can publish more apps
    const canPublish = await this.developerService.canPublishApp(input.developerId);
    if (!canPublish) {
      throw new Error('Developer has reached app limit for their tier');
    }

    // Check slug uniqueness
    const existing = await prisma.marketplaceApp.findFirst({
      where: { slug: input.slug },
    });
    if (existing) {
      throw new Error('App slug already exists');
    }

    // Prepare screenshots
    const screenshots: AppScreenshot[] = input.screenshots.map((url, index) => ({
      url,
      order: index,
      caption: '',
    }));

    // Create app
    const app = await prisma.marketplaceApp.create({
      data: {
        slug: input.slug,
        name: input.name,
        tagline: input.tagline,
        shortDescription: input.shortDescription,
        description: input.description,
        developerId: input.developerId,
        developerName: developer.displayName,
        developer: developer.displayName,
        developerWebsite: developer.website || '',
        category: input.category,
        tags: input.tags,
        currentVersion: '0.0.0', // Will be set on first submission
        version: '0.0.0',
        minimumLoomOSVersion: input.minimumLoomOSVersion,
        pricing: input.pricing as any,
        icon: input.icon,
        iconName: input.name,
        color: '#F18825', // Default loomOS color
        screenshots: screenshots as any,
        video: input.video,
        downloads: 0,
        rating: 0,
        reviewCount: 0,
        installCount: 0,
        status: AppStatus.DRAFT,
        isFeatured: false,
        trending: false,
        permissions: input.permissions,
        path: `/apps/${input.slug}`,
        packageUrl: '', // Will be set on submission
        packageSize: 0,
        installationType: input.installationType,
        features: input.features || [],
        isSystem: false,
      },
    });

    // Update developer stats
    await prisma.$executeRaw`
      UPDATE developers
      SET total_apps = total_apps + 1,
          updated_at = NOW()
      WHERE id = ${input.developerId}
    `;

    return app as any;
  }

  /**
   * Submit app version for review
   */
  async submitVersion(input: SubmitVersionInput): Promise<AppSubmission> {
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: input.appId },
    });

    if (!app) {
      throw new Error('App not found');
    }

    // Validate version format
    if (!this.isValidVersion(input.version)) {
      throw new Error('Invalid version format (use semver: X.Y.Z)');
    }

    // Check if version already exists
    const existingVersion = await prisma.marketplaceAppVersion.findFirst({
      where: {
        appId: input.appId,
        version: input.version,
      },
    });

    if (existingVersion) {
      throw new Error('Version already exists');
    }

    const submissionId = this.generateId();

    // Create submission record
    await prisma.$executeRaw`
      INSERT INTO app_submissions (
        id, app_id, developer_id, version, release_notes,
        package_url, package_size, status, submitted_at
      ) VALUES (
        ${submissionId}, ${input.appId}, ${app.developerId},
        ${input.version}, ${input.releaseNotes}, ${input.packageUrl},
        ${input.packageSize}, ${SubmissionStatus.SUBMITTED}, NOW()
      )
    `;

    // Create app version record
    await prisma.marketplaceAppVersion.create({
      data: {
        appId: input.appId,
        version: input.version,
        releaseNotes: input.releaseNotes,
        packageUrl: input.packageUrl,
        packageSize: input.packageSize,
        minimumLoomOSVersion: input.minimumLoomOSVersion,
        status: 'draft',
        downloads: 0,
        isCurrentVersion: false,
      },
    });

    const submission: AppSubmission = {
      id: submissionId,
      appId: input.appId,
      developerId: app.developerId as string,
      version: input.version,
      releaseNotes: input.releaseNotes,
      packageUrl: input.packageUrl,
      packageSize: input.packageSize,
      status: SubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
    };

    // Notify review team
    await this.notifyReviewTeam(submission);

    return submission;
  }

  /**
   * Update app details (while in draft or after approval)
   */
  async updateApp(
    appId: string,
    developerId: string,
    updates: Partial<CreateAppInput>
  ): Promise<App> {
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app || app.developerId !== developerId) {
      throw new Error('App not found or unauthorized');
    }

    if (app.status === AppStatus.PENDING_REVIEW) {
      throw new Error('Cannot edit app while in review');
    }

    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.tagline) updateData.tagline = updates.tagline;
    if (updates.description) updateData.description = updates.description;
    if (updates.shortDescription) updateData.shortDescription = updates.shortDescription;
    if (updates.category) updateData.category = updates.category;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.pricing) updateData.pricing = updates.pricing;
    if (updates.icon) updateData.icon = updates.icon;
    if (updates.video) updateData.video = updates.video;
    if (updates.permissions) updateData.permissions = updates.permissions;
    if (updates.minimumLoomOSVersion) updateData.minimumLoomOSVersion = updates.minimumLoomOSVersion;
    if (updates.features) updateData.features = updates.features;

    if (updates.screenshots) {
      updateData.screenshots = updates.screenshots.map((url, index) => ({
        url,
        order: index,
        caption: '',
      }));
    }

    const updatedApp = await prisma.marketplaceApp.update({
      where: { id: appId },
      data: updateData,
    });

    return updatedApp as any;
  }

  /**
   * Publish an approved app
   */
  async publishApp(appId: string, developerId: string): Promise<App> {
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app || app.developerId !== developerId) {
      throw new Error('App not found or unauthorized');
    }

    if (app.status !== AppStatus.APPROVED) {
      throw new Error('App must be approved before publishing');
    }

    // Get the latest approved version
    const latestVersion = await prisma.marketplaceAppVersion.findFirst({
      where: { appId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestVersion) {
      throw new Error('No version found');
    }

    // Update version to published
    await prisma.marketplaceAppVersion.update({
      where: { id: latestVersion.id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        isCurrentVersion: true,
      },
    });

    // Update app
    const published = await prisma.marketplaceApp.update({
      where: { id: appId },
      data: {
        status: AppStatus.PUBLISHED,
        currentVersion: latestVersion.version,
        version: latestVersion.version,
        packageUrl: latestVersion.packageUrl || '',
        packageSize: latestVersion.packageSize || 0,
        publishedAt: new Date(),
      },
    });

    // Update developer stats
    await prisma.$executeRaw`
      UPDATE developers
      SET published_apps = published_apps + 1,
          updated_at = NOW()
      WHERE id = ${developerId}
    `;

    return published as any;
  }

  /**
   * Get submission status
   */
  async getSubmission(submissionId: string): Promise<AppSubmission | null> {
    const result = await prisma.$queryRaw<AppSubmission[]>`
      SELECT * FROM app_submissions WHERE id = ${submissionId} LIMIT 1
    `;

    return result[0] || null;
  }

  /**
   * Get all submissions for an app
   */
  async getAppSubmissions(appId: string): Promise<AppSubmission[]> {
    const submissions = await prisma.$queryRaw<AppSubmission[]>`
      SELECT * FROM app_submissions
      WHERE app_id = ${appId}
      ORDER BY submitted_at DESC
    `;

    return submissions;
  }

  /**
   * Withdraw a submission
   */
  async withdrawSubmission(
    submissionId: string,
    developerId: string
  ): Promise<void> {
    const submission = await this.getSubmission(submissionId);
    if (!submission || submission.developerId !== developerId) {
      throw new Error('Submission not found or unauthorized');
    }

    if (
      submission.status !== SubmissionStatus.SUBMITTED &&
      submission.status !== SubmissionStatus.IN_REVIEW
    ) {
      throw new Error('Can only withdraw pending submissions');
    }

    await prisma.$executeRaw`
      DELETE FROM app_submissions WHERE id = ${submissionId}
    `;
  }

  /**
   * Delete an app (only if draft or rejected)
   */
  async deleteApp(appId: string, developerId: string): Promise<void> {
    const app = await prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });

    if (!app || app.developerId !== developerId) {
      throw new Error('App not found or unauthorized');
    }

    if (app.status !== AppStatus.DRAFT && app.status !== AppStatus.REJECTED) {
      throw new Error('Can only delete draft or rejected apps');
    }

    // Delete versions
    await prisma.marketplaceAppVersion.deleteMany({
      where: { appId },
    });

    // Delete app
    await prisma.marketplaceApp.delete({
      where: { id: appId },
    });

    // Update developer stats
    await prisma.$executeRaw`
      UPDATE developers
      SET total_apps = total_apps - 1,
          updated_at = NOW()
      WHERE id = ${developerId}
    `;
  }

  /**
   * Notify review team about new submission
   */
  private async notifyReviewTeam(submission: AppSubmission): Promise<void> {
    // TODO: Implement email notification
    console.log('Review team notified about submission:', submission.id);
  }

  /**
   * Validate version format (semver)
   */
  private isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let appSubmissionServiceInstance: AppSubmissionService | null = null;

export function getAppSubmissionService(): AppSubmissionService {
  if (!appSubmissionServiceInstance) {
    appSubmissionServiceInstance = new AppSubmissionService();
  }
  return appSubmissionServiceInstance;
}
