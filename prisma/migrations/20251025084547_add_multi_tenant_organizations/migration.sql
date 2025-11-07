-- CreateEnum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM (
  'CONDO_ASSOCIATION',
  'HOA',
  'COOPERATIVE',
  'NONPROFIT',
  'COMMUNITY_GROUP',
  'CLUB',
  'CUSTOM'
);

-- CreateTable: organizations
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL DEFAULT 'CUSTOM',
    "subdomain" TEXT,
    "customDomain" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT DEFAULT 'USA',
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "colorPalette" TEXT DEFAULT 'default',
    "settings" JSONB,
    "features" JSONB,
    "terminology" JSONB,
    "industryType" TEXT,
    "totalUnits" INTEGER,
    "yearEstablished" INTEGER,
    "planType" TEXT DEFAULT 'trial',
    "subscriptionStatus" TEXT DEFAULT 'active',
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionEndsAt" TIMESTAMP(3),
    "maxUsers" INTEGER DEFAULT 100,
    "maxStorage" INTEGER DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspensionReason" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "onboardingCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");
CREATE UNIQUE INDEX "organizations_subdomain_key" ON "organizations"("subdomain");
CREATE UNIQUE INDEX "organizations_customDomain_key" ON "organizations"("customDomain");
CREATE INDEX "organizations_slug_idx" ON "organizations"("slug");
CREATE INDEX "organizations_subdomain_idx" ON "organizations"("subdomain");
CREATE INDEX "organizations_type_idx" ON "organizations"("type");
CREATE INDEX "organizations_subscriptionStatus_idx" ON "organizations"("subscriptionStatus");

-- Insert default Montrecott organization
INSERT INTO "organizations" (
  "id",
  "name",
  "slug",
  "type",
  "subdomain",
  "streetAddress",
  "city",
  "state",
  "zipCode",
  "country",
  "email",
  "colorPalette",
  "industryType",
  "totalUnits",
  "yearEstablished",
  "planType",
  "subscriptionStatus",
  "isActive",
  "onboardingCompleted",
  "createdAt",
  "updatedAt"
) VALUES (
  'org_montrecott_default',
  'Montrecott Condominium Association',
  'montrecott',
  'CONDO_ASSOCIATION',
  'montrecott',
  '1907 Montrose Avenue',
  'Chicago',
  'IL',
  '60613',
  'USA',
  'info@montrecott.com',
  'default',
  'residential',
  48,
  2010,
  'enterprise',
  'active',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Add organizationId columns (nullable first)
ALTER TABLE "users" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "payments" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "files" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "notifications" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "announcements" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "documents" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "committees" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "pets" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "children" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "additional_residents" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "property_units" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "message_folders" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "messages" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "marketplace_apps" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "notes" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "calendar_events" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "tasks" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "chart_of_accounts" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "transactions" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "annual_budgets" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "vendors" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "invoices" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "property_listings" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "resident_inquiries" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "property_amenities" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "directory_update_requests" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "chat_sessions" ADD COLUMN "organizationId" TEXT;

-- Update all existing records with default organization ID
UPDATE "users" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "payments" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "files" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "notifications" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "announcements" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "documents" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "committees" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "pets" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "children" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "additional_residents" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "property_units" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "message_folders" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "messages" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "notes" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "calendar_events" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "tasks" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "chart_of_accounts" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "transactions" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "annual_budgets" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "vendors" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "invoices" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "property_listings" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "resident_inquiries" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "property_amenities" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "directory_update_requests" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;
UPDATE "chat_sessions" SET "organizationId" = 'org_montrecott_default' WHERE "organizationId" IS NULL;

-- Make organizationId NOT NULL (except for marketplace_apps, chat_sessions, and users which can be null)
ALTER TABLE "payments" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "files" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "notifications" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "announcements" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "documents" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "committees" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "pets" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "children" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "additional_residents" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "property_units" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "message_folders" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "messages" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "notes" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "calendar_events" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "tasks" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "chart_of_accounts" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "transactions" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "annual_budgets" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "vendors" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "invoices" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "property_listings" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "resident_inquiries" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "property_amenities" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "directory_update_requests" ALTER COLUMN "organizationId" SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "files" ADD CONSTRAINT "files_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "committees" ADD CONSTRAINT "committees_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pets" ADD CONSTRAINT "pets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "children" ADD CONSTRAINT "children_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "additional_residents" ADD CONSTRAINT "additional_residents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_units" ADD CONSTRAINT "property_units_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "message_folders" ADD CONSTRAINT "message_folders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marketplace_apps" ADD CONSTRAINT "marketplace_apps_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notes" ADD CONSTRAINT "notes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "annual_budgets" ADD CONSTRAINT "annual_budgets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resident_inquiries" ADD CONSTRAINT "resident_inquiries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "directory_update_requests" ADD CONSTRAINT "directory_update_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");
CREATE INDEX "payments_organizationId_idx" ON "payments"("organizationId");
CREATE INDEX "files_organizationId_idx" ON "files"("organizationId");
CREATE INDEX "notifications_organizationId_idx" ON "notifications"("organizationId");
CREATE INDEX "announcements_organizationId_idx" ON "announcements"("organizationId");
CREATE INDEX "documents_organizationId_idx" ON "documents"("organizationId");
CREATE INDEX "committees_organizationId_idx" ON "committees"("organizationId");
CREATE INDEX "pets_organizationId_idx" ON "pets"("organizationId");
CREATE INDEX "children_organizationId_idx" ON "children"("organizationId");
CREATE INDEX "additional_residents_organizationId_idx" ON "additional_residents"("organizationId");
CREATE INDEX "property_units_organizationId_idx" ON "property_units"("organizationId");
CREATE INDEX "message_folders_organizationId_idx" ON "message_folders"("organizationId");
CREATE INDEX "messages_organizationId_idx" ON "messages"("organizationId");
CREATE INDEX "notes_organizationId_idx" ON "notes"("organizationId");
CREATE INDEX "calendar_events_organizationId_idx" ON "calendar_events"("organizationId");
CREATE INDEX "tasks_organizationId_idx" ON "tasks"("organizationId");
CREATE INDEX "chart_of_accounts_organizationId_idx" ON "chart_of_accounts"("organizationId");
CREATE INDEX "transactions_organizationId_idx" ON "transactions"("organizationId");
CREATE INDEX "annual_budgets_organizationId_idx" ON "annual_budgets"("organizationId");
CREATE INDEX "vendors_organizationId_idx" ON "vendors"("organizationId");
CREATE INDEX "invoices_organizationId_idx" ON "invoices"("organizationId");
CREATE INDEX "property_listings_organizationId_idx" ON "property_listings"("organizationId");
CREATE INDEX "resident_inquiries_organizationId_idx" ON "resident_inquiries"("organizationId");
CREATE INDEX "property_amenities_organizationId_idx" ON "property_amenities"("organizationId");
CREATE INDEX "directory_update_requests_organizationId_idx" ON "directory_update_requests"("organizationId");
