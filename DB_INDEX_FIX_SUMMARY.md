# Database Index Cleanup

## Problem
The database had duplicate indices where both a UNIQUE index and a regular index were created on the same column. This is wasteful because:
- A UNIQUE index already provides all the functionality of a regular index
- Having both consumes extra storage and memory
- Index maintenance overhead is doubled during writes

## Issues Fixed

### 1. Organization Table
**Columns affected:** `slug`, `subdomain`

**Before:**
- `organizations_slug_key` (UNIQUE INDEX) ✓
- `organizations_slug_idx` (regular INDEX) ✗ DUPLICATE
- `organizations_subdomain_key` (UNIQUE INDEX) ✓
- `organizations_subdomain_idx` (regular INDEX) ✗ DUPLICATE

**Root cause:** schema.prisma had both:
```prisma
slug String @unique           // Creates UNIQUE index
@@index([slug])                // Creates redundant regular index
```

**Fix:**
- Removed `@@index([slug])` and `@@index([subdomain])` from schema
- Created migration to drop redundant regular indices

### 2. MarketplaceApp Table
**Column affected:** `slug`

**Before:**
- `marketplace_apps_slug_key` (UNIQUE INDEX) ✓
- `marketplace_apps_slug_idx` (regular INDEX) ✗ DUPLICATE

**Root cause:** Same as above

**Fix:**
- Removed `@@index([slug])` from schema
- Created migration to drop redundant regular index

## Files Changed

1. **prisma/schema.prisma**
   - Organization model: Removed duplicate `@@index([slug])` and `@@index([subdomain])`
   - MarketplaceApp model: Removed duplicate `@@index([slug])`

2. **prisma/migrations/20251107_remove_duplicate_indices/migration.sql**
   - New migration to drop the 3 redundant regular indices from database

## Migration Instructions

To apply these fixes to your database:

```bash
# Apply the migration
npx prisma migrate deploy

# Or if in development
npx prisma migrate dev
```

## Expected Results

After applying this migration:
- 3 redundant indices will be removed
- Database storage will be reduced
- Write performance will slightly improve (less index maintenance)
- Query performance will be unaffected (UNIQUE indices remain)

## Verification

To verify the fix was applied, you can check the database indices:

```sql
-- Check Organization table indices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'organizations'
  AND schemaname = 'public'
ORDER BY indexname;

-- Check MarketplaceApp table indices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'marketplace_apps'
  AND schemaname = 'public'
ORDER BY indexname;
```

You should see the `_key` (unique) indices but NOT the `_idx` regular indices for slug and subdomain.
