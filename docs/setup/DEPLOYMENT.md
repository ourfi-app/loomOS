# Deployment Guide

This guide covers deploying Community Manager to production after merging changes.

---

## Table of Contents
1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [Manual Deployment Steps](#manual-deployment-steps)
3. [Post-Deployment Verification](#post-deployment-verification)
4. [Rollback Procedures](#rollback-procedures)
5. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying Next.js applications. It provides automatic deployments, preview environments, and excellent performance.

### Initial Setup (One-Time)

If you haven't deployed to Vercel yet:

1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select `ourfi-app/community-manager` repository
   - Choose `nextjs_space` as the root directory
   - Click "Import"

3. **Configure Environment Variables**

   Add these in Vercel Dashboard → Settings → Environment Variables:

   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

   # Authentication
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=https://your-domain.vercel.app

   # AWS S3 (Documents)
   AWS_BUCKET_NAME=your-bucket-name
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key

   # Stripe (Payments)
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # SendGrid (Emails)
   SENDGRID_API_KEY=SG...
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com

   # Optional: Google Calendar
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

4. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `nextjs_space`
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `yarn install`
   - **Node Version**: 18.x

5. **Database Setup**

   For production, use a managed PostgreSQL service:

   **Option A: Vercel Postgres**
   ```bash
   # In Vercel Dashboard
   # Storage → Postgres → Create Database
   # Copy connection string to DATABASE_URL
   ```

   **Option B: External Provider** (Supabase, Railway, Neon, AWS RDS)
   ```bash
   # Get connection string from provider
   # Add to Vercel environment variables as DATABASE_URL
   ```

6. **Run Migrations**

   After first deployment, run migrations:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Run migrations in production
   vercel env pull .env.production.local
   cd nextjs_space
   npx prisma migrate deploy
   ```

---

## Manual Deployment Steps

After merging your PR, follow these steps to deploy changes:

### Step 1: Merge Pull Request

1. Review and approve the PR on GitHub
2. Click "Merge pull request" → "Confirm merge"
3. Delete the feature branch (optional but recommended)

### Step 2: Automatic Deployment (Vercel)

**If you have Vercel connected to your GitHub repository:**

1. Vercel automatically detects the merge to `main`
2. Starts building your application
3. Runs build command: `yarn build`
4. Deploys to production

**Monitor deployment:**
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Click on your project
- View deployment status in real-time

### Step 3: Database Migrations (If Needed)

**For TypeScript and UI changes (this PR):**
- ✅ No database migrations needed
- Deployment will complete automatically

**For future PRs with database changes:**
```bash
# Check if migrations are pending
npx prisma migrate status

# Apply migrations to production
npx prisma migrate deploy
```

### Step 4: Verify Deployment

1. **Check Build Logs**
   - Ensure no TypeScript errors (strict mode now enabled)
   - Verify all dependencies installed correctly

2. **Visit Production URL**
   - Navigate to your live domain
   - Test button styling (gradient and shadows)
   - Verify no visual regressions

3. **Test Key Features**
   - [ ] Login/Authentication works
   - [ ] Buttons render with correct gradient
   - [ ] Shadows display properly
   - [ ] No console errors
   - [ ] Mobile responsiveness intact

---

## Post-Deployment Verification

### Checklist for This PR's Changes

Since this PR includes TypeScript strict mode and UI updates:

#### 1. TypeScript Compilation
```bash
# In your local environment
cd nextjs_space
npm run type-check
```

**Expected:** No type errors (or fix any that appear)

#### 2. Visual Verification

**Primary Buttons:**
- [ ] Display gradient from blue to darker blue
- [ ] Show large shadow with blue tint
- [ ] Border radius is 8px (rounded-md)
- [ ] Hover state reverses gradient smoothly

**Check these pages:**
- Login page
- Dashboard
- Admin panels
- Any CTAs (Call-to-Action buttons)

#### 3. Performance Check

Run Lighthouse audit:
- Performance score should remain high (>90)
- No new accessibility issues
- No console errors

#### 4. Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Rollback Procedures

If issues are detected after deployment:

### Option 1: Instant Rollback (Vercel)

**Via Vercel Dashboard:**
1. Go to Deployments tab
2. Find the previous stable deployment
3. Click "..." menu → "Promote to Production"
4. Confirm promotion

**Via CLI:**
```bash
vercel rollback
```

### Option 2: Revert Git Commit

```bash
# Find the commit hash to revert
git log --oneline

# Revert the merge commit
git revert -m 1 <commit-hash>

# Push to main
git push origin main

# Vercel will auto-deploy the revert
```

### Option 3: Emergency Fix

For critical issues:

```bash
# Create hotfix branch
git checkout -b hotfix/critical-issue main

# Make minimal fix
# ... edit files ...

# Commit and push
git add .
git commit -m "hotfix: resolve critical issue"
git push origin hotfix/critical-issue

# Create and merge PR immediately
# Vercel will deploy within 1-2 minutes
```

---

## Custom Domain Setup

### Add Custom Domain to Vercel

1. **In Vercel Dashboard:**
   - Project Settings → Domains
   - Click "Add Domain"
   - Enter: `yourdomain.com` and `www.yourdomain.com`

2. **Configure DNS:**

   **Option A: Nameservers (Recommended)**
   ```
   Point your domain's nameservers to Vercel:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B: CNAME/A Records**
   ```
   A Record:    @ → 76.76.21.21
   CNAME:       www → cname.vercel-dns.com
   ```

3. **SSL Certificate:**
   - Vercel automatically provisions SSL via Let's Encrypt
   - Wait 24-48 hours for DNS propagation
   - Certificate auto-renews

4. **Update Environment Variables:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

---

## Deployment Checklist

Use this checklist for every production deployment:

### Pre-Deployment
- [ ] All tests passing locally
- [ ] TypeScript type-check passes (`npm run type-check`)
- [ ] Lint check passes (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] Database migrations tested in staging
- [ ] Environment variables verified

### Deployment
- [ ] PR merged to `main` branch
- [ ] Vercel build started automatically
- [ ] Build completed successfully
- [ ] Database migrations applied (if needed)

### Post-Deployment
- [ ] Production site loads correctly
- [ ] Login/authentication works
- [ ] Critical user flows tested
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Mobile responsiveness verified
- [ ] Stakeholders notified

---

## Monitoring & Alerts

### Set Up Monitoring

**Vercel Analytics:**
- Automatically enabled
- View in Vercel Dashboard → Analytics

**Error Tracking (Optional):**

Add Sentry for error monitoring:
```bash
npm install @sentry/nextjs
```

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://www.pingdom.com)
- [Better Uptime](https://betteruptime.com)

---

## Troubleshooting

### Build Fails on Vercel

**TypeScript Errors:**
```bash
# Check locally first
cd nextjs_space
npm run type-check

# Fix errors and push
```

**Dependency Issues:**
```bash
# Clear cache in Vercel
# Project Settings → General → Clear Cache
# Redeploy
```

**Out of Memory:**
```bash
# Increase Node memory in package.json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

### Database Connection Issues

**Connection Pool Exhausted:**
```bash
# Check Prisma connection pool settings
# In schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 5
}
```

**Connection String Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&connection_limit=5&pool_timeout=10
```

### Environment Variables Not Working

1. Check spelling and case sensitivity
2. Restart deployment after adding variables
3. Ensure variables are set for "Production" environment
4. Use `NEXT_PUBLIC_` prefix for client-side variables

### Slow Build Times

```bash
# Use SWC minifier (faster)
# next.config.js
module.exports = {
  swcMinify: true,
}
```

---

## CI/CD Pipeline (Optional)

For automated testing before deployment:

### GitHub Actions Example

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
          cache-dependency-path: nextjs_space/yarn.lock

      - name: Install dependencies
        working-directory: ./nextjs_space
        run: yarn install --frozen-lockfile

      - name: Type check
        working-directory: ./nextjs_space
        run: yarn type-check

      - name: Lint
        working-directory: ./nextjs_space
        run: yarn lint

      - name: Build
        working-directory: ./nextjs_space
        run: yarn build
```

---

## Support

For deployment issues:
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [GitHub Discussions](https://github.com/ourfi-app/community-manager/discussions)
- **Emergency**: Create issue with `deployment` label

---

**Last Updated:** November 2025
**Version:** 1.0.0
