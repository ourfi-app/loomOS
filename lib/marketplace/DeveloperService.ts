/**
 * Developer Service
 * Handles developer registration, profile management, and statistics
 */

import { prisma } from '@/lib/db';
import type {
  Developer,
  DeveloperTier,
  DeveloperStatus,
  CreateDeveloperInput,
  DeveloperStats,
} from './developer-types';
import type { App } from './types';

export class DeveloperService {
  /**
   * Register a new developer
   */
  async registerDeveloper(input: CreateDeveloperInput): Promise<Developer> {
    // Check if user is already a developer
    const existing = await this.getDeveloperByUserId(input.userId);
    if (existing) {
      throw new Error('User is already registered as a developer');
    }

    // Validate email
    if (!this.isValidEmail(input.supportEmail)) {
      throw new Error('Invalid support email address');
    }

    const developer: Developer = {
      id: this.generateId(),
      userId: input.userId,
      displayName: input.displayName,
      companyName: input.companyName,
      bio: input.bio,
      website: input.website,
      supportEmail: input.supportEmail,
      verified: false,
      tier: input.tier || DeveloperTier.FREE,
      totalApps: 0,
      publishedApps: 0,
      totalDownloads: 0,
      averageRating: 0,
      totalRevenue: 0,
      paymentMethodSetup: false,
      status: DeveloperStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in database (using a custom table for developers)
    await prisma.$executeRaw`
      INSERT INTO developers (
        id, user_id, display_name, company_name, bio, website,
        support_email, verified, tier, total_apps, published_apps,
        total_downloads, average_rating, total_revenue,
        payment_method_setup, status, created_at, updated_at
      ) VALUES (
        ${developer.id}, ${developer.userId}, ${developer.displayName},
        ${developer.companyName}, ${developer.bio}, ${developer.website},
        ${developer.supportEmail}, ${developer.verified}, ${developer.tier},
        ${developer.totalApps}, ${developer.publishedApps}, ${developer.totalDownloads},
        ${developer.averageRating}, ${developer.totalRevenue}, ${developer.paymentMethodSetup},
        ${developer.status}, ${developer.createdAt}, ${developer.updatedAt}
      )
    `;

    // Send verification email
    await this.sendVerificationEmail(developer);

    return developer;
  }

  /**
   * Verify a developer account
   */
  async verifyDeveloper(developerId: string): Promise<Developer> {
    const developer = await this.getDeveloper(developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    if (developer.verified) {
      throw new Error('Developer already verified');
    }

    await prisma.$executeRaw`
      UPDATE developers
      SET verified = true,
          verification_date = NOW(),
          status = ${DeveloperStatus.ACTIVE},
          updated_at = NOW()
      WHERE id = ${developerId}
    `;

    return {
      ...developer,
      verified: true,
      verificationDate: new Date(),
      status: DeveloperStatus.ACTIVE,
      updatedAt: new Date(),
    };
  }

  /**
   * Update developer profile
   */
  async updateDeveloper(
    developerId: string,
    updates: Partial<Pick<Developer, 'displayName' | 'companyName' | 'bio' | 'website' | 'supportEmail' | 'avatar' | 'logo'>>
  ): Promise<Developer> {
    const developer = await this.getDeveloper(developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    const fields = [];
    const values = [];

    if (updates.displayName !== undefined) {
      fields.push('display_name = ?');
      values.push(updates.displayName);
    }
    if (updates.companyName !== undefined) {
      fields.push('company_name = ?');
      values.push(updates.companyName);
    }
    if (updates.bio !== undefined) {
      fields.push('bio = ?');
      values.push(updates.bio);
    }
    if (updates.website !== undefined) {
      fields.push('website = ?');
      values.push(updates.website);
    }
    if (updates.supportEmail !== undefined) {
      fields.push('support_email = ?');
      values.push(updates.supportEmail);
    }
    if (updates.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(updates.avatar);
    }
    if (updates.logo !== undefined) {
      fields.push('logo = ?');
      values.push(updates.logo);
    }

    fields.push('updated_at = NOW()');

    if (fields.length > 0) {
      const query = `UPDATE developers SET ${fields.join(', ')} WHERE id = ?`;
      values.push(developerId);
      await prisma.$executeRawUnsafe(query, ...values);
    }

    return { ...developer, ...updates, updatedAt: new Date() };
  }

  /**
   * Setup payment method
   */
  async setupPaymentMethod(
    developerId: string,
    stripeAccountId: string
  ): Promise<Developer> {
    const developer = await this.getDeveloper(developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    await prisma.$executeRaw`
      UPDATE developers
      SET stripe_account_id = ${stripeAccountId},
          payment_method_setup = true,
          updated_at = NOW()
      WHERE id = ${developerId}
    `;

    return {
      ...developer,
      stripeAccountId,
      paymentMethodSetup: true,
      updatedAt: new Date(),
    };
  }

  /**
   * Check if developer can publish more apps
   */
  async canPublishApp(developerId: string): Promise<boolean> {
    const developer = await this.getDeveloper(developerId);
    if (!developer || developer.status !== DeveloperStatus.ACTIVE) {
      return false;
    }

    const limits: Record<DeveloperTier, number> = {
      [DeveloperTier.FREE]: 3,
      [DeveloperTier.PRO]: 25,
      [DeveloperTier.ENTERPRISE]: Infinity,
    };

    return developer.publishedApps < limits[developer.tier];
  }

  /**
   * Get developer statistics
   */
  async getDeveloperStats(developerId: string): Promise<DeveloperStats> {
    const developer = await this.getDeveloper(developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    // Get apps
    const apps = await prisma.marketplaceApp.findMany({
      where: { developerId },
      select: { id: true },
    });

    const appIds = apps.map((a) => a.id);

    // Calculate recent metrics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAnalytics = await prisma.$queryRaw<
      Array<{ downloads: bigint; revenue: number }>
    >`
      SELECT
        COALESCE(SUM(downloads), 0) as downloads,
        COALESCE(SUM(revenue), 0) as revenue
      FROM developer_analytics
      WHERE app_id IN (${appIds.join(',')})
        AND date >= ${thirtyDaysAgo}
    `;

    const recentDownloads = recentAnalytics[0]?.downloads
      ? Number(recentAnalytics[0].downloads)
      : 0;
    const recentRevenue = recentAnalytics[0]?.revenue || 0;

    return {
      totalApps: developer.totalApps,
      publishedApps: developer.publishedApps,
      totalDownloads: developer.totalDownloads,
      totalRevenue: developer.totalRevenue,
      averageRating: developer.averageRating,
      recentDownloads,
      recentRevenue,
    };
  }

  /**
   * Get developer apps
   */
  async getDeveloperApps(developerId: string): Promise<App[]> {
    const apps = await prisma.marketplaceApp.findMany({
      where: { developerId },
      orderBy: { createdAt: 'desc' },
    });

    return apps as any[];
  }

  /**
   * Get developer by ID
   */
  async getDeveloper(developerId: string): Promise<Developer | null> {
    const result = await prisma.$queryRaw<Developer[]>`
      SELECT * FROM developers WHERE id = ${developerId} LIMIT 1
    `;

    return result[0] || null;
  }

  /**
   * Get developer by user ID
   */
  async getDeveloperByUserId(userId: string): Promise<Developer | null> {
    const result = await prisma.$queryRaw<Developer[]>`
      SELECT * FROM developers WHERE user_id = ${userId} LIMIT 1
    `;

    return result[0] || null;
  }

  /**
   * Send verification email
   */
  private async sendVerificationEmail(developer: Developer): Promise<void> {
    // TODO: Implement email sending
    // For now, just log
    console.log(
      `Verification email would be sent to ${developer.supportEmail}`
    );
    console.log(
      `Verification link: ${process.env.NEXT_PUBLIC_APP_URL}/developer/verify/${developer.id}`
    );
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let developerServiceInstance: DeveloperService | null = null;

export function getDeveloperService(): DeveloperService {
  if (!developerServiceInstance) {
    developerServiceInstance = new DeveloperService();
  }
  return developerServiceInstance;
}
