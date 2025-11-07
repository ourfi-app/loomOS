-- Enhanced Marketplace Migration
-- Add comprehensive marketplace features: app versions, reviews, pricing, and more

-- Add new enum values for AppCategory
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'FINANCE';
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'EDUCATION';
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'BUSINESS';
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'HEALTH';
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'SOCIAL';
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'DEVELOPER_TOOLS';
ALTER TYPE "AppCategory" ADD VALUE IF NOT EXISTS 'INDUSTRY_SPECIFIC';

-- Add new enum values for AppStatus
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'DRAFT';
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'PUBLISHED';
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'REJECTED';
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'SUSPENDED';
ALTER TYPE "AppStatus" ADD VALUE IF NOT EXISTS 'ARCHIVED';

-- Create AppInstallationType enum
DO $$ BEGIN
    CREATE TYPE "AppInstallationType" AS ENUM ('WEB_APP', 'NATIVE_WEBOS', 'HYBRID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create AppPricingModel enum
DO $$ BEGIN
    CREATE TYPE "AppPricingModel" AS ENUM ('FREE', 'PAID', 'SUBSCRIPTION', 'FREEMIUM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enhance MarketplaceApp table
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "tagline" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "currentVersion" TEXT DEFAULT '1.0.0';
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "minimumLoomOSVersion" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "developerId" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "developerName" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "developerWebsite" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "video" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "pricingModel" "AppPricingModel" DEFAULT 'FREE';
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "price" DECIMAL(10,2);
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "subscriptionPriceId" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "trialDays" INTEGER;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "freeTier" BOOLEAN DEFAULT true;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "installationType" "AppInstallationType" DEFAULT 'WEB_APP';
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "packageUrl" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "packageSize" BIGINT;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "downloads" INTEGER DEFAULT 0;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER DEFAULT 0;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "trending" BOOLEAN DEFAULT false;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

-- Update screenshots and features to have defaults
ALTER TABLE "marketplace_apps" ALTER COLUMN "screenshots" SET DEFAULT '[]';
ALTER TABLE "marketplace_apps" ALTER COLUMN "features" SET DEFAULT '[]';
ALTER TABLE "marketplace_apps" ALTER COLUMN "permissions" SET DEFAULT '[]';

-- Update status default to PUBLISHED for existing apps
UPDATE "marketplace_apps" SET "status" = 'PUBLISHED' WHERE "status" = 'AVAILABLE';

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS "marketplace_apps_isFeatured_idx" ON "marketplace_apps"("isFeatured");
CREATE INDEX IF NOT EXISTS "marketplace_apps_trending_idx" ON "marketplace_apps"("trending");

-- Create AppVersion table
CREATE TABLE IF NOT EXISTS "app_versions" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "releaseNotes" TEXT NOT NULL,
    "packageUrl" TEXT,
    "packageSize" BIGINT,
    "minimumLoomOSVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "isCurrentVersion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "app_versions_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint and indexes for AppVersion
CREATE UNIQUE INDEX IF NOT EXISTS "app_versions_appId_version_key" ON "app_versions"("appId", "version");
CREATE INDEX IF NOT EXISTS "app_versions_appId_idx" ON "app_versions"("appId");
CREATE INDEX IF NOT EXISTS "app_versions_status_idx" ON "app_versions"("status");

-- Add foreign key for AppVersion
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_versions_appId_fkey') THEN
        ALTER TABLE "app_versions" ADD CONSTRAINT "app_versions_appId_fkey"
            FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create AppReview table
CREATE TABLE IF NOT EXISTS "app_reviews" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "developerResponse" TEXT,
    "developerResponseDate" TIMESTAMP(3),
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_reviews_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint and indexes for AppReview
CREATE UNIQUE INDEX IF NOT EXISTS "app_reviews_appId_userId_key" ON "app_reviews"("appId", "userId");
CREATE INDEX IF NOT EXISTS "app_reviews_appId_idx" ON "app_reviews"("appId");
CREATE INDEX IF NOT EXISTS "app_reviews_userId_idx" ON "app_reviews"("userId");
CREATE INDEX IF NOT EXISTS "app_reviews_rating_idx" ON "app_reviews"("rating");
CREATE INDEX IF NOT EXISTS "app_reviews_createdAt_idx" ON "app_reviews"("createdAt");

-- Add foreign keys for AppReview
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_reviews_appId_fkey') THEN
        ALTER TABLE "app_reviews" ADD CONSTRAINT "app_reviews_appId_fkey"
            FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_reviews_userId_fkey') THEN
        ALTER TABLE "app_reviews" ADD CONSTRAINT "app_reviews_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_reviews_organizationId_fkey') THEN
        ALTER TABLE "app_reviews" ADD CONSTRAINT "app_reviews_organizationId_fkey"
            FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Enhance UserInstalledApp table
ALTER TABLE "user_installed_apps" ADD COLUMN IF NOT EXISTS "launchCount" INTEGER DEFAULT 0;
ALTER TABLE "user_installed_apps" ADD COLUMN IF NOT EXISTS "autoUpdate" BOOLEAN DEFAULT true;
ALTER TABLE "user_installed_apps" ADD COLUMN IF NOT EXISTS "customSettings" JSONB;
