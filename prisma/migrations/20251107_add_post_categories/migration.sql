-- Add Post Categories
-- Add category system for organizing community posts

-- Create PostCategory enum
DO $$ BEGIN
    CREATE TYPE "PostCategory" AS ENUM ('GENERAL', 'ANNOUNCEMENTS', 'HELP', 'FEEDBACK', 'EVENTS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add category column to community_posts table (default GENERAL)
ALTER TABLE "community_posts" ADD COLUMN IF NOT EXISTS "category" "PostCategory" DEFAULT 'GENERAL';

-- Create index on category for efficient filtering
CREATE INDEX IF NOT EXISTS "community_posts_category_idx" ON "community_posts"("category");
