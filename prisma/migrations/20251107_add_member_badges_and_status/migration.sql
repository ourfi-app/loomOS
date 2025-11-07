-- Add Member Badges and Status
-- Add community features: member badges, online status, and last seen tracking

-- Create MemberBadge enum
DO $$ BEGIN
    CREATE TYPE "MemberBadge" AS ENUM ('NEW_MEMBER', 'VERIFIED', 'MODERATOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create MemberStatus enum
DO $$ BEGIN
    CREATE TYPE "MemberStatus" AS ENUM ('ONLINE', 'AWAY', 'BUSY', 'OFFLINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add badge column to users table (nullable)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "badge" "MemberBadge";

-- Add status column to users table (default OFFLINE)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" "MemberStatus" DEFAULT 'OFFLINE';

-- Add lastSeenAt column to track when user was last active
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3);

-- Create index on status for efficient filtering
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");

-- Create index on badge for efficient filtering
CREATE INDEX IF NOT EXISTS "users_badge_idx" ON "users"("badge");
