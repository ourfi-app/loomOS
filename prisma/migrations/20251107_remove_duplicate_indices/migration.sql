-- Remove Duplicate Indices
-- This migration removes redundant regular indices where a unique index already exists
-- Unique indices provide all the functionality of regular indices plus uniqueness enforcement

-- Drop duplicate index on organizations.slug
-- We keep the unique index "organizations_slug_key" and drop the redundant regular index
DROP INDEX IF EXISTS "organizations_slug_idx";

-- Drop duplicate index on organizations.subdomain
-- We keep the unique index "organizations_subdomain_key" and drop the redundant regular index
DROP INDEX IF EXISTS "organizations_subdomain_idx";

-- Drop duplicate index on marketplace_apps.slug
-- We keep the unique index "marketplace_apps_slug_key" and drop the redundant regular index
DROP INDEX IF EXISTS "marketplace_apps_slug_idx";
