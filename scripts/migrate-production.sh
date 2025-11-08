#!/bin/bash

# Production Database Migration Script for Phase 1
# Run this in Render Shell or production environment

set -e  # Exit on error

echo "🗄️  Phase 1 Database Migration"
echo "=============================="
echo ""
echo "⚠️  WARNING: This will modify your production database"
echo "Make sure you have a recent backup!"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set!"
    echo "This script should be run in the production environment (Render Shell)"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    echo "Make sure you're in the project root directory"
    exit 1
fi

echo "✅ In project root directory"
echo ""

# Check if Prisma is available
if ! command -v npx &> /dev/null; then
    echo "❌ ERROR: npx not found!"
    echo "Make sure Node.js is installed"
    exit 1
fi

echo "✅ npx is available"
echo ""

# Show current migration status
echo "📊 Current migration status:"
echo "============================"
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate status || true
echo ""

# Ask for confirmation
read -p "Proceed with migration? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Migration cancelled"
    exit 1
fi

echo ""
echo "🚀 Running migration..."
echo "======================="
echo ""

# Run migration with checksum ignore (needed on Render)
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate deploy

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""

    # Verify new columns exist
    echo "🔍 Verifying new columns..."
    echo "============================"

    # This command checks if the new columns exist
    psql $DATABASE_URL -c "SELECT column_name, data_type
                          FROM information_schema.columns
                          WHERE table_name = 'organizations'
                          AND column_name IN (
                            'domainVerificationToken',
                            'domainVerified',
                            'domainVerifiedAt',
                            'sslCertificateStatus',
                            'sslCertificateExpiry'
                          );" || echo "⚠️  Could not verify columns (this is OK if psql is not available)"

    echo ""
    echo "✅ Phase 1 database migration complete!"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Verify application is working"
    echo "  2. Test subdomain routing"
    echo "  3. Check logs for errors"
    echo ""
else
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check database connection"
    echo "  2. Verify DATABASE_URL is correct"
    echo "  3. Check if migration was already applied"
    echo "  4. Review error messages above"
    echo ""
    exit 1
fi
