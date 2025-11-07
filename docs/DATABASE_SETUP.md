# Database Setup Guide

This guide explains how to set up the database for the Community Manager application, including seeding the consolidated apps.

## Quick Start

For a fully automated setup, run:

```bash
npm run db:setup
```

This single command will:
- ✅ Check for `.env` file
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Seed main database with sample data
- ✅ Seed marketplace apps (including consolidated apps)

## Prerequisites

Before running the setup, ensure you have:

1. **PostgreSQL** installed and running
2. **Node.js** and npm installed
3. Project dependencies installed: `npm install`

## Step 1: Configure Environment

Create a `.env` file in the project root with your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### Example for Local Development

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/community_manager"
```

## Step 2: Run Database Setup

Run the automated setup script:

```bash
npm run db:setup
```

This will create:

### Demo Organization
- **Name**: Demo Condo Association
- **Slug**: `demo`
- **Subdomain**: `demo`

### Test User Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | john@doe.com | johndoe123 |
| Board Member | sarah.board@condoassoc.com | board123 |
| Resident | mike.resident@email.com | resident123 |

### Sample Data

- ✅ 3 resident users with payment history
- ✅ 5 committees (Board, Architectural, Welcoming, Water, Social)
- ✅ Committee members assigned
- ✅ Sample announcements
- ✅ 6 tasks with various statuses
- ✅ 6 notes across categories
- ✅ 9 calendar events
- ✅ Payment records (current, past, overdue)
- ✅ Dues settings

### Marketplace Apps (30+ apps)

Including the new **consolidated apps**:

#### 1. **Organizer** (`/dashboard/organizer`)
Unified productivity suite combining:
- 📅 Calendar - Event management
- 📝 Notes - Note-taking
- ✓ Tasks - Task management

Category: Productivity

#### 2. **Inbox** (`/dashboard/inbox`)
Unified communications center combining:
- 💬 Messages - Resident communications
- 🤖 AI Assistant - Instant help
- 📧 Email - Email client (coming soon)

Category: Essentials

#### 3. **Creator Studio** (`/dashboard/creator-studio`)
Platform development tools combining:
- 🎨 Brandy - Logo & brand designer
- 🛠️ App Designer - Visual app builder
- 🏪 Marketplace - App management

Category: Settings (Admin only)

Plus all other apps:
- Home, Profile, Payments, Documents, Directory
- Admin Panel, Accounting, Budgeting
- Help & Support, and more...

## Manual Setup (Step-by-Step)

If you prefer manual control, run each step individually:

### 1. Generate Prisma Client

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### 2. Run Migrations

```bash
npx prisma migrate dev
```

### 3. Seed Main Database

```bash
npm run db:seed
```

or

```bash
npx tsx scripts/seed.ts
```

### 4. Seed Marketplace Apps

```bash
npm run db:seed:marketplace
```

or

```bash
npx tsx scripts/seed-marketplace.ts
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Full Setup | `npm run db:setup` | Complete database setup |
| Main Seed | `npm run db:seed` | Seed main database only |
| Marketplace Seed | `npm run db:seed:marketplace` | Seed marketplace apps only |
| Reset Database | `npm run db:reset` | Reset and re-setup database |

## Verifying the Setup

After setup, you can verify everything is working:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000
   ```

3. **Login with a test account:**
   - Email: `john@doe.com`
   - Password: `johndoe123`

4. **Check the marketplace:**
   - Navigate to the App Store/Marketplace
   - You should see 30+ apps including the consolidated apps
   - Install Organizer, Inbox, or Creator Studio to test them

## Troubleshooting

### Error: `.env` file not found

Create a `.env` file in the project root with your `DATABASE_URL`.

### Error: Cannot connect to database

1. Ensure PostgreSQL is running
2. Verify database credentials in `.env`
3. Check if the database exists: `createdb community_manager`

### Error: Prisma Client generation failed

Try with the checksum ignore flag:

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Error: Migration failed

If migrations are already applied, you can skip this error. Otherwise:

```bash
npx prisma migrate reset
npm run db:setup
```

### Apps not showing in marketplace

Re-run the marketplace seed:

```bash
npm run db:seed:marketplace
```

## Resetting the Database

To completely reset and re-setup the database:

```bash
npm run db:reset
```

⚠️ **Warning:** This will delete ALL data and re-seed from scratch.

## Next Steps

After successful setup:

1. ✅ Explore the consolidated apps
2. ✅ Test user permissions (admin vs resident)
3. ✅ Customize the demo organization
4. ✅ Add your own data
5. ✅ Configure external services (Stripe, SendGrid, etc.)

## Support

For issues or questions:
- Check the main [README.md](../README.md)
- Review [CONTRIBUTING.md](../CONTRIBUTING.md)
- Open an issue on GitHub
