#!/bin/bash

# Baseline Script for Render Database Migration Fix
# This script marks all existing migrations as applied without running them

set -e  # Exit on any error

echo "🔧 Starting database baseline process..."
echo ""

# List of migrations to baseline (all except the very last one which needs to run)
migrations=(
  "20241021_add_tasks"
  "20251019_add_messages"
  "20251021_202012_add_user_onboarding"
  "20251025084547_add_multi_tenant_organizations"
  "20251025211435_performance_indexes"
  "20251029_add_marketplace_features"
  "20251101_add_roles_permissions"
  "20251107_enhance_marketplace"
)

echo "📋 Marking ${#migrations[@]} migrations as already applied..."
echo ""

for migration in "${migrations[@]}"
do
  echo "✓ Resolving: $migration"
  npx prisma migrate resolve --applied "$migration"
done

echo ""
echo "✅ All migrations baselined successfully!"
echo ""
echo "📦 Now deploying any remaining migrations..."
echo ""

# Deploy any new migrations
npx prisma migrate deploy

echo ""
echo "🎉 Database migration baseline complete!"
echo ""
echo "ℹ️  Future deployments can simply run: npx prisma migrate deploy"
