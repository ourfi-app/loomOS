#!/bin/bash
# Script to baseline existing migrations in production database
# Run this locally with your production DATABASE_URL

echo "🔍 Marking existing migrations as applied..."

# List of migrations to baseline (all migrations that are already in your database)
MIGRATIONS=(
  "20241021_add_tasks"
  "20251019_add_messages"
  "20251021_202012_add_user_onboarding"
  "20251025084547_add_multi_tenant_organizations"
  "20251025211435_performance_indexes"
  "20251029_add_marketplace_features"
  "20251101_add_roles_permissions"
  "20251107_enhance_marketplace"
)

for migration in "${MIGRATIONS[@]}"
do
  echo "✓ Marking $migration as applied..."
  npx prisma migrate resolve --applied "$migration"
done

echo ""
echo "✅ All migrations marked as applied!"
echo "🚀 You can now run 'npx prisma migrate deploy' safely"
