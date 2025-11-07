# Render Deployment Guide (Updated)

Complete guide for deploying the Community Manager application on Render, incorporating fixes for common build and runtime errors.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Variables](#environment-variables)
4. [Build & Deploy Settings](#build--deploy-settings)
5. [Database Configuration](#database-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)
8. [Performance Optimization](#performance-optimization)
9. [Maintenance](#maintenance)

---

## Prerequisites

### Required Accounts
- ✅ GitHub account with repository access
- ✅ Render account (https://render.com)
- ✅ A PostgreSQL Database (e.g., a Render Postgres service)

### Repository Requirements
- ✅ Branch merged to `main`
- ✅ All commits pushed to remote
- ✅ `render.yaml` present in repository root
- ✅ `nextjs_space/` contains the Next.js application

---

## Initial Setup

### 1. Create a Database (If you don't have one)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Give it a name (e.g., `community-manager-db`) and select a plan.
4. Wait for it to be created.
5. **CRITICAL:** Go to the database's "Info" page and copy the **Internal Connection String**. You will need this for your web service.

### 2. Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `ourfi-app/community-manager`
4. Configure as follows:

| Setting | Value |
|---------|-------|
| **Name** | `community-manager` (or your choice) |
| **Region** | Oregon (or closest to your users) |
| **Branch** | `main` |
| **Root Directory** | `nextjs_space` |
| **Runtime** | `Node` |
| **Build Command** | See [Build & Deploy Settings](#build--deploy-settings) |
| **Start Command** | `npm start` |

### 3. Recommended Instance Type

| User Base | Plan | RAM | CPU | Monthly Cost |
|-----------|------|-----|-----|--------------|
| Testing (Fails Build) | Starter | 512 MB | 0.5 | $7 |
| **Recommended Start** | **Pro** | **4 GB** | **2** | **$85** |
| High Traffic | Pro Plus | 8 GB | 4 | $200 |
| Max Build | Pro Max | 16 GB | 8 | $300 |

**Warning:** The "Standard" (2 GB) plan will likely **fail to build** this project due to high memory usage during type-checking.
**Start with the "Pro" (4 GB) plan** or see the [Out of Memory Troubleshooting](#error-out-of-memory) section for an optimization that may allow you to use a smaller plan.

---

## Environment Variables

### Required Variables

Add these in Render Dashboard → Your Service → Environment:

#### Database
**IMPORTANT:** Do NOT use an external URL if your database is on Render. Use the **Internal Connection String** from your Render Database service to avoid firewall errors.

```env
# Get this from your Render Database service dashboard (under "Info")
DATABASE_URL=postgresql://role_...
````

#### Authentication

```env
NEXTAUTH_SECRET="+315B1Eum4OwO8eFHP9ZvfG3wUY8BoliJl7JcmTxU8Q="
NEXTAUTH_URL=https://YOUR_APP_NAME.onrender.com
```

**⚠️ Replace `YOUR_APP_NAME` with your actual Render service name (e.g., `community-manager-4`)**

#### AbacusAI

```env
ABACUSAI_API_KEY=UA48fbmZtIX9ODzFaLAOn8HQr4DCn9i3
```

#### Node Configuration

```env
NODE_VERSION=20.11.0

# See OOM Troubleshooting for this
# NODE_OPTIONS="max-old-space-size=4096" 
```

### Optional Variables (Required for Features)

#### AWS S3 (for file uploads)

Your build will fail if these are not present. If you don't use S3, set them all to `placeholder`.

```env
AWS_REGION=placeholder
AWS_BUCKET_NAME=placeholder
AWS_FOLDER_PREFIX=placeholder
AWS_ACCESS_KEY_ID=placeholder
AWS_SECRET_ACCESS_KEY=placeholder
```

#### Stripe (for Payments)

Your build will fail if these are not present.

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### OAuth Providers

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_TENANT_ID=your-microsoft-tenant-id
```

#### Mapbox (for Property Map)

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

#### SendGrid (for Email)

```env
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Community Manager
```

-----

## Build & Deploy Settings

### Build Command

This command is critical. It includes the database migration step (`npx prisma db push`) which is required for login to work.

```bash
npm install --legacy-peer-deps && npx prisma db push && npx prisma generate && npm run build
```

**Breakdown:**

  - `npm install --legacy-peer-deps` - Install dependencies.
  - `npx prisma db push` - **(CRITICAL)** Syncs the database schema. Fixes login/register errors.
  - `npx prisma generate` - Generate Prisma client.
  - `npm run build` - Build Next.js production bundle.

### Start Command

```bash
npm start
```

### Auto-Deploy

  - ✅ **Enabled** - Deploy automatically on push to `main`
  - Branch: `main`

-----

## Database Configuration

### PostgreSQL Connection

You **must** use the **Internal Connection String** from your Render Database service in your `DATABASE_URL` environment variable.

The external connection string (e.g., `db-....hosteddb.reai.io`) will be **blocked by the firewall** during the build process and will cause a `P1001` error.

### Running Migrations

The build command we set up (`... && npx prisma db push && ...`) handles this automatically on every deploy.

If you ever need to run a migration manually:

1.  Go to your service dashboard
2.  Click **Shell** tab
3.  Run:

<!-- end list -->

```bash
cd nextjs_space
npx prisma db push
```

-----

## Post-Deployment Verification

### 1\. Check Build Logs

Look for these success indicators:

```
✓ Generated Prisma Client
✓ Your database is now in sync with your schema.
✓ Compiled successfully
✓ Skipping validation of types  <-- (This is OK, see OOM fix)
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
==> Build successful 🎉
```

### 2\. Test Endpoints

#### Homepage

```
https://YOUR_APP_NAME.onrender.com
```

**Expected:** Landing page loads.

#### Login / Register

```
https://YOUR_APP_[NAME.onrender.com/auth/login](https://NAME.onrender.com/auth/login)
https://YOUR_APP_[NAME.onrender.com/auth/register](https://NAME.onrender.com/auth/register)
```

**Expected:** You should be able to **create a new account** and then log in with it.

-----

## Troubleshooting

### Build Failures

#### Error: "Out of memory"

**Cause:** This project's build process, especially TypeScript checking, uses more than 2GB of RAM.
**Solution 1 (Recommended):**

1.  Upgrade to the **Pro (4 GB)** plan in Render's "Settings" tab.
2.  Go to the "Environment" tab and add this variable:
      * **Key:** `NODE_OPTIONS`
      * **Value:** `max-old-space-size=4096`

**Solution 2 (The 2GB Fix):**
If you must use the "Standard (2GB)" plan, you can skip the memory-intensive type checking.

1.  **Warning:** This will allow you to deploy code *even if it has type errors*.
2.  In your code editor, open `nextjs_space/next.config.js`.
3.  Find the `typescript: { ... }` block and change `ignoreBuildErrors` to `true`.
    ```javascript
    typescript: {
      // !! WARN !!
      // This skips type-checking to save memory.
      // Run "npx tsc --noEmit" locally before pushing!
      ignoreBuildErrors: true,
    },
    ```
4.  Commit and push this change.

#### Error: P1001: Can't reach database server

**Cause:** The firewall is blocking the connection. You are using an *external* database URL.
**Solution:**

1.  Go to your Render **Database** service.
2.  Copy the **Internal Connection String**.
3.  Go to your Render **Web Service**.
4.  Go to the "Environment" tab and paste the internal string as the value for `DATABASE_URL`.
5.  Redeploy.

#### Error: "AWS\_BUCKET\_NAME environment variable is not set"

**Cause:** Your code requires AWS S3 variables to be present during the build.
**Solution:**

1.  Add all 5 `AWS_...` environment variables.
2.  If you don't use S3, just set the value for all of them to `placeholder`.

#### Error: `ReferenceError: self is not defined`

**Cause:** The `/onboarding` page contains browser-only code (like confetti) that can't be pre-rendered during the build.
**Solution:**

1.  Open `nextjs_space/app/onboarding/page.tsx`.
2.  Add this as the very first line: `export const dynamic = 'force-dynamic';`
3.  Commit and push this change.

### Runtime Failures

#### Error: 401 (Unauthorized) or 500 on /api/auth/...

**Cause:** Login/register is failing. This is almost always because the `User` table does not exist in your database.
**Solution:**

1.  Ensure your **Build Command** includes `npx prisma db push` (or `npx prisma migrate deploy`).
2.  Trigger a new deploy.
3.  Check the new build log to ensure the `prisma db push` step completed successfully.

<!-- end list -->

```
```
