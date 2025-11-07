/**
 * Comprehensive Marketplace Types
 * Based on enhanced Prisma schema for loomOS App Marketplace
 */

import { type UserRole } from '@prisma/client';

// ============================================================
// ENUMS
// ============================================================

export enum AppCategory {
  COMMUNICATION = 'COMMUNICATION',
  PRODUCTIVITY = 'PRODUCTIVITY',
  COMMUNITY = 'COMMUNITY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  UTILITIES = 'UTILITIES',
  LIFESTYLE = 'LIFESTYLE',
  FINANCE = 'FINANCE',
  EDUCATION = 'EDUCATION',
  BUSINESS = 'BUSINESS',
  HEALTH = 'HEALTH',
  SOCIAL = 'SOCIAL',
  DEVELOPER_TOOLS = 'DEVELOPER_TOOLS',
  INDUSTRY_SPECIFIC = 'INDUSTRY_SPECIFIC',
}

export enum AppStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
  // Legacy statuses for backward compatibility
  AVAILABLE = 'AVAILABLE',
  BETA = 'BETA',
  COMING_SOON = 'COMING_SOON',
  DEPRECATED = 'DEPRECATED',
}

export enum AppInstallationType {
  WEB_APP = 'WEB_APP',
  NATIVE_WEBOS = 'NATIVE_WEBOS',
  HYBRID = 'HYBRID',
}

export enum AppPricingModel {
  FREE = 'FREE',
  PAID = 'PAID',
  SUBSCRIPTION = 'SUBSCRIPTION',
  FREEMIUM = 'FREEMIUM',
}

export enum AppPermission {
  STORAGE_READ = 'storage:read',
  STORAGE_WRITE = 'storage:write',
  CONTACTS_READ = 'contacts:read',
  CONTACTS_WRITE = 'contacts:write',
  CALENDAR_READ = 'calendar:read',
  CALENDAR_WRITE = 'calendar:write',
  EMAIL_SEND = 'email:send',
  EMAIL_READ = 'email:read',
  LOCATION = 'location',
  CAMERA = 'camera',
  MICROPHONE = 'microphone',
  NOTIFICATIONS = 'notifications',
  NETWORK = 'network',
  AI_SERVICES = 'ai:services',
}

// ============================================================
// MAIN TYPES
// ============================================================

export interface App {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  shortDescription: string;
  description: string;

  // Developer info
  developerId?: string;
  developerName?: string;
  developer: string;
  developerWebsite?: string;

  // Categorization
  category: AppCategory;
  tags: string[];

  // Versioning
  currentVersion: string;
  version: string; // Deprecated
  minimumLoomOSVersion?: string;

  // Pricing
  pricing: AppPricing;

  // Assets
  icon: string;
  iconName: string;
  color: string;
  screenshots: AppScreenshot[];
  video?: string;

  // Stats
  downloads: number;
  rating: number;
  reviewCount: number;
  installCount: number;

  // Metadata
  status: AppStatus;
  isFeatured: boolean;
  trending: boolean;

  // Permissions required
  permissions: AppPermission[];

  // Installation
  path: string;
  packageUrl?: string;
  packageSize?: number;
  installationType: AppInstallationType;

  // Features
  features: string[];

  // System
  isSystem: boolean;
  minRole?: UserRole;

  // Dates
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  releaseDate?: Date;
  lastUpdated?: Date;
}

export interface AppPricing {
  model: AppPricingModel;
  price?: number;
  currency?: string;
  subscriptionPriceId?: string;
  trialDays?: number;
  freeTier?: boolean;
}

export interface AppScreenshot {
  url: string;
  caption?: string;
  order: number;
  platform?: 'desktop' | 'mobile' | 'tablet';
}

export interface AppVersion {
  id: string;
  appId: string;
  version: string;
  releaseNotes: string;
  packageUrl?: string;
  packageSize?: number;
  minimumLoomOSVersion?: string;
  status: 'draft' | 'published' | 'deprecated';
  downloads: number;
  isCurrentVersion: boolean;
  createdAt: Date;
  publishedAt?: Date;
}

export interface AppReview {
  id: string;
  appId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  version: string;
  helpful: number;
  developerResponse?: string;
  developerResponseDate?: Date;
  isVerifiedPurchase: boolean;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstalledApp {
  id: string;
  appId: string;
  userId: string;
  organizationId?: string;
  installedVersion: string;
  installDate: Date;
  lastLaunched?: Date;
  lastUpdatedAt?: Date;
  launchCount: number;
  autoUpdate: boolean;
  isPinned: boolean;
  sortOrder: number;
  customSettings?: Record<string, any>;
  app?: App;
}

// ============================================================
// SEARCH & FILTER TYPES
// ============================================================

export interface AppSearchFilters {
  category?: AppCategory;
  tags?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  isFeatured?: boolean;
  trending?: boolean;
  query?: string;
  status?: AppStatus;
}

export interface AppSearchResult {
  apps: App[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================
// INSTALLATION TYPES
// ============================================================

export interface InstallOptions {
  userId: string;
  organizationId?: string;
  autoUpdate?: boolean;
}

export interface InstallProgress {
  stage: 'downloading' | 'extracting' | 'installing' | 'configuring' | 'complete';
  progress: number; // 0-100
  message: string;
}

// ============================================================
// REVIEW TYPES
// ============================================================

export interface CreateReviewInput {
  appId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  version: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  content?: string;
}

export interface ReviewSortOptions {
  sortBy?: 'recent' | 'helpful' | 'rating';
  order?: 'asc' | 'desc';
}

// ============================================================
// APP UPDATE TYPES
// ============================================================

export interface AppUpdate {
  appId: string;
  app?: App;
  installed?: InstalledApp;
  latestVersion: AppVersion;
  currentVersion: string;
  releaseNotes: string;
}

// ============================================================
// CATEGORY TYPES
// ============================================================

export interface CategoryInfo {
  id: string;
  title: string;
  icon: any;
  gradient: string;
  description: string;
  appCount?: number;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// MARKETPLACE STATS TYPES
// ============================================================

export interface MarketplaceStats {
  totalApps: number;
  totalDownloads: number;
  totalReviews: number;
  averageRating: number;
  featuredApps: number;
  categoryCounts: Record<AppCategory, number>;
}

// ============================================================
// USER APP PREFERENCES
// ============================================================

export interface UserAppPreferences {
  userId: string;
  pinnedApps: string[];
  appLayout: 'grid' | 'list';
  sortMode: 'alphabetical' | 'recent' | 'frequent' | 'default';
  autoUpdate: boolean;
  notificationsEnabled: boolean;
}
