-- Remove Duplicate Indices
-- This migration removes redundant regular indices where a unique or composite unique index already exists
--
-- Key Principle: A composite unique index on (A, B, C) can be used for queries on:
--   - A alone
--   - A, B together
--   - A, B, C together
-- So a separate index on just A is redundant.

-- =============================================================================
-- PART 1: Duplicate indices on unique columns (3 indices)
-- =============================================================================

-- 1. Drop duplicate index on organizations.slug
--    Covered by: organizations_slug_key (UNIQUE)
DROP INDEX IF EXISTS "organizations_slug_idx";

-- 2. Drop duplicate index on organizations.subdomain
--    Covered by: organizations_subdomain_key (UNIQUE)
DROP INDEX IF EXISTS "organizations_subdomain_idx";

-- 3. Drop duplicate index on marketplace_apps.slug
--    Covered by: marketplace_apps_slug_key (UNIQUE)
DROP INDEX IF EXISTS "marketplace_apps_slug_idx";

-- =============================================================================
-- PART 2: Duplicate indices on first column of composite unique indices (11 indices)
-- =============================================================================

-- 4. Drop duplicate index on annual_budgets.fiscalYear
--    Covered by: annual_budgets_fiscalYear_key (UNIQUE)
DROP INDEX IF EXISTS "annual_budgets_fiscalYear_idx";

-- 5. Drop duplicate index on app_reviews.appId
--    Covered by: app_reviews_appId_userId_key (UNIQUE on appId, userId)
DROP INDEX IF EXISTS "app_reviews_appId_idx";

-- 6. Drop duplicate index on app_versions.appId
--    Covered by: app_versions_appId_version_key (UNIQUE on appId, version)
DROP INDEX IF EXISTS "app_versions_appId_idx";

-- 7. Drop duplicate index on comment_likes.organizationId
--    Covered by: comment_likes_organizationId_commentId_userId_key (UNIQUE on organizationId, commentId, userId)
DROP INDEX IF EXISTS "comment_likes_organizationId_idx";

-- 8. Drop duplicate index on committee_members.organizationId
--    Covered by: committee_members_organizationId_committeeId_userId_key (UNIQUE on organizationId, committeeId, userId)
DROP INDEX IF EXISTS "committee_members_organizationId_idx";

-- 9. Drop duplicate index on custom_roles.organizationId
--    Covered by: custom_roles_organizationId_name_key (UNIQUE on organizationId, name)
DROP INDEX IF EXISTS "custom_roles_organizationId_idx";

-- 10. Drop duplicate index on developer_analytics.appId
--     Covered by: developer_analytics_appId_date_key (UNIQUE on appId, date)
DROP INDEX IF EXISTS "developer_analytics_appId_idx";

-- 11. Drop duplicate index on developers.userId
--     Covered by: developers_userId_key (UNIQUE)
DROP INDEX IF EXISTS "developers_userId_idx";

-- 12. Drop duplicate index on message_recipients.organizationId
--     Covered by: message_recipients_organizationId_messageId_userId_key (UNIQUE on organizationId, messageId, userId)
DROP INDEX IF EXISTS "message_recipients_organizationId_idx";

-- 13. Drop duplicate index on post_likes.organizationId
--     Covered by: post_likes_organizationId_postId_userId_key (UNIQUE on organizationId, postId, userId)
DROP INDEX IF EXISTS "post_likes_organizationId_idx";

-- 14. Drop duplicate index on role_permissions.organizationId
--     Covered by: role_permissions_organizationId_roleId_permissionId_key (UNIQUE on organizationId, roleId, permissionId)
DROP INDEX IF EXISTS "role_permissions_organizationId_idx";

-- 15. Drop duplicate index on user_custom_roles.organizationId
--     Covered by: user_custom_roles_organizationId_userId_customRoleId_key (UNIQUE on organizationId, userId, customRoleId)
DROP INDEX IF EXISTS "user_custom_roles_organizationId_idx";

-- 16. Drop duplicate index on user_installed_apps.organizationId
--     Covered by: user_installed_apps_organizationId_userId_appId_key (UNIQUE on organizationId, userId, appId)
DROP INDEX IF EXISTS "user_installed_apps_organizationId_idx";

-- 17. Drop duplicate index on user_notifications.organizationId
--     Covered by: user_notifications_organizationId_userId_notificationId_key (UNIQUE on organizationId, userId, notificationId)
DROP INDEX IF EXISTS "user_notifications_organizationId_idx";

-- =============================================================================
-- Summary: 17 duplicate indices removed
-- Expected impact:
--   - Reduced storage usage
--   - Improved write performance (less index maintenance)
--   - No change to query performance (covered by unique indices)
-- =============================================================================
