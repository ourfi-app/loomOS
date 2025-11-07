
-- Add fields to MarketplaceApp
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "marketplace_apps" ADD COLUMN IF NOT EXISTS "updateNotes" TEXT;

-- Add fields to UserInstalledApp
ALTER TABLE "user_installed_apps" ADD COLUMN IF NOT EXISTS "installedVersion" TEXT;
ALTER TABLE "user_installed_apps" ADD COLUMN IF NOT EXISTS "lastUpdatedAt" TIMESTAMP(3);

-- Create AppUpdateHistory table
CREATE TABLE IF NOT EXISTS "app_update_history" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "fromVersion" TEXT NOT NULL,
    "toVersion" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_update_history_pkey" PRIMARY KEY ("id")
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "app_update_history_organizationId_idx" ON "app_update_history"("organizationId");
CREATE INDEX IF NOT EXISTS "app_update_history_userId_idx" ON "app_update_history"("userId");
CREATE INDEX IF NOT EXISTS "app_update_history_appId_idx" ON "app_update_history"("appId");

-- Add foreign keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_update_history_organizationId_fkey') THEN
        ALTER TABLE "app_update_history" ADD CONSTRAINT "app_update_history_organizationId_fkey" 
            FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_update_history_userId_fkey') THEN
        ALTER TABLE "app_update_history" ADD CONSTRAINT "app_update_history_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_update_history_appId_fkey') THEN
        ALTER TABLE "app_update_history" ADD CONSTRAINT "app_update_history_appId_fkey" 
            FOREIGN KEY ("appId") REFERENCES "marketplace_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
