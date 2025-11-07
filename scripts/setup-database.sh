#!/bin/bash

# Database Setup Script for Community Manager
# This script handles the complete database setup including seeding

set -e  # Exit on error

echo "🚀 Community Manager Database Setup"
echo "===================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check for .env file
echo "📋 Step 1: Checking environment configuration..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo ""
    echo "Please create a .env file with your database connection:"
    echo ""
    echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/database_name\""
    echo ""
    echo "Example for local development:"
    echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/community_manager\""
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Step 2: Generate Prisma Client
echo "📦 Step 2: Generating Prisma Client..."
if PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate; then
    echo -e "${GREEN}✅ Prisma Client generated successfully${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Step 3: Run Database Migrations
echo "🔧 Step 3: Running database migrations..."
if npx prisma migrate dev --name init; then
    echo -e "${GREEN}✅ Database migrations completed${NC}"
else
    echo -e "${YELLOW}⚠️  Migrations may have already been applied${NC}"
fi
echo ""

# Step 4: Seed Main Database
echo "🌱 Step 4: Seeding main database with sample data..."
if npx tsx scripts/seed.ts; then
    echo -e "${GREEN}✅ Main database seeded successfully${NC}"
else
    echo -e "${RED}❌ Failed to seed main database${NC}"
    exit 1
fi
echo ""

# Step 5: Seed Marketplace Apps
echo "📱 Step 5: Seeding marketplace apps..."
if npx tsx scripts/seed-marketplace.ts; then
    echo -e "${GREEN}✅ Marketplace apps seeded successfully${NC}"
else
    echo -e "${RED}❌ Failed to seed marketplace apps${NC}"
    exit 1
fi
echo ""

# Success Summary
echo "================================================"
echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo "================================================"
echo ""
echo "📊 What was created:"
echo "   • Demo organization (slug: 'demo')"
echo "   • Test users:"
echo "     - Admin: john@doe.com / johndoe123"
echo "     - Board Member: sarah.board@condoassoc.com / board123"
echo "     - Resident: mike.resident@email.com / resident123"
echo "   • Sample data (payments, announcements, tasks, notes, events)"
echo "   • 5 committees with members"
echo "   • 30+ marketplace apps including:"
echo "     - Organizer (Calendar + Notes + Tasks)"
echo "     - Inbox (Messages + AI Assistant + Email)"
echo "     - Creator Studio (Brandy + App Designer + Marketplace)"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the development server: npm run dev"
echo "   2. Open http://localhost:3000"
echo "   3. Login with one of the test accounts above"
echo "   4. Explore the consolidated apps in the marketplace!"
echo ""
