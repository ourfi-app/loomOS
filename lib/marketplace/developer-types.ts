/**
 * Developer Portal Types
 * Types for developer registration, app submissions, and analytics
 */

// ============================================================
// DEVELOPER TYPES
// ============================================================

export enum DeveloperTier {
  FREE = 'FREE',           // Up to 3 apps
  PRO = 'PRO',             // Up to 25 apps, priority review
  ENTERPRISE = 'ENTERPRISE' // Unlimited, dedicated support
}

export enum DeveloperStatus {
  PENDING = 'PENDING',     // Awaiting verification
  ACTIVE = 'ACTIVE',       // Can publish apps
  SUSPENDED = 'SUSPENDED', // Temporarily blocked
  BANNED = 'BANNED'        // Permanently blocked
}

export interface Developer {
  id: string;
  userId: string; // Links to core user account

  // Profile
  displayName: string;
  companyName?: string;
  bio: string;
  website?: string;
  supportEmail: string;

  // Assets
  avatar?: string;
  logo?: string;

  // Verification
  verified: boolean;
  verificationDate?: Date;

  // Developer tier
  tier: DeveloperTier;

  // Stats
  totalApps: number;
  publishedApps: number;
  totalDownloads: number;
  averageRating: number;
  totalRevenue: number;

  // Payment info
  stripeAccountId?: string;
  paymentMethodSetup: boolean;

  // Status
  status: DeveloperStatus;

  // Dates
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeveloperInput {
  userId: string;
  displayName: string;
  companyName?: string;
  bio: string;
  website?: string;
  supportEmail: string;
  tier?: DeveloperTier;
}

export interface DeveloperStats {
  totalApps: number;
  publishedApps: number;
  totalDownloads: number;
  totalRevenue: number;
  averageRating: number;
  recentDownloads: number; // Last 30 days
  recentRevenue: number;   // Last 30 days
}

// ============================================================
// APP SUBMISSION TYPES
// ============================================================

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED'
}

export interface AppSubmission {
  id: string;
  appId: string;
  developerId: string;

  // Submission details
  version: string;
  releaseNotes: string;
  packageUrl: string;
  packageSize: number;

  // Review
  status: SubmissionStatus;
  submittedAt: Date;
  reviewStartedAt?: Date;
  reviewedAt?: Date;
  reviewerId?: string;
  reviewNotes?: string;

  // Rejection details
  rejectionReason?: string;
  rejectionDetails?: string;
}

// ============================================================
// DEVELOPER ANALYTICS TYPES
// ============================================================

export interface DeveloperAnalytics {
  id: string;
  appId: string;
  date: Date;

  // Usage metrics
  downloads: number;
  installations: number;
  uninstalls: number;
  activeUsers: number;
  launches: number;

  // Engagement
  avgSessionDuration: number;
  crashRate: number;

  // Revenue (if paid app)
  revenue: number;
  refunds: number;

  // Ratings
  newReviews: number;
  averageRating: number;
}

export interface AnalyticsTimeRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsSummary {
  downloads: number;
  installations: number;
  uninstalls: number;
  activeUsers: number;
  launches: number;
  revenue: number;
  averageRating: number;
  crashRate: number;
}

// ============================================================
// PAYOUT TYPES
// ============================================================

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface PayoutRequest {
  id: string;
  developerId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  requestedAt: Date;
  processedAt?: Date;
  stripePayoutId?: string;
  failureReason?: string;
}
