# How to Fix Your Render Deployment (Updated 2025-11-03)

This guide reflects the **current repository structure** after the optimization that moved everything from `nextjs_space/` to the root directory.

## 🚨 Critical Updates Needed

Your Render deployment needs these updates to work with the optimized repository:

### 1. Root Directory Setting
**Old (Wrong):** `nextjs_space`
**New (Correct):** Leave **blank** or set to `.` (root)

### 2. Build Command
**Old:** Uses `nextjs_space/` paths
**New:** See updated command below

### 3. Node Version
**Old:** `20.11.0`
**New:** `20.18.0` (already updated in render.yaml)

---

## 📋 Step-by-Step Fix

### Step 1: Access Your Render Dashboard

1. Go to https://dashboard.render.com
2. Sign in with your account
3. Find your `community-manager` service
4. Click on it to open the service dashboard

### Step 2: Update Service Settings

1. Click **"Settings"** in the left sidebar
2. Scroll to **"Build & Deploy"** section
3. Update these fields:

| Setting | New Value |
|---------|-----------|
| **Root Directory** | Leave **BLANK** (or set to `.`) |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm start` |

4. Click **"Save Changes"**

### Step 3: Verify Environment Variables

1. Click **"Environment"** in the left sidebar
2. Verify these **REQUIRED** variables exist:

```
DATABASE_URL = <your PostgreSQL connection string>
NEXTAUTH_SECRET = <your secret key>
NEXTAUTH_URL = https://YOUR-APP-NAME.onrender.com
NODE_VERSION = 20.18.0
```

3. **Update NODE_VERSION** to `20.18.0` if it shows `20.11.0`

#### Required but Can Use Placeholders

If you see errors about missing AWS or Stripe variables during build, add these with placeholder values:

```
AWS_REGION = placeholder
AWS_BUCKET_NAME = placeholder
AWS_FOLDER_PREFIX = placeholder
STRIPE_SECRET_KEY = placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = placeholder
STRIPE_WEBHOOK_SECRET = placeholder
```

4. Click **"Save Changes"** when done

### Step 4: Trigger Manual Deploy

1. Click **"Manual Deploy"** in the top right
2. Select **"Deploy latest commit"** or choose your branch
3. Click **"Deploy"**
4. Watch the build logs

---

## 🔍 What to Look For in Build Logs

### ✅ Success Indicators

```
==> Installing dependencies
✓ npm install completed

==> Generating Prisma Client
✓ Generated Prisma Client

==> Building application
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

==> Build successful 🎉
==> Uploading build...
==> Starting service...
```

### ❌ Common Errors & Fixes

#### Error: "Cannot find package.json"
**Cause:** Root Directory is still set to `nextjs_space`
**Fix:** Go to Settings → Root Directory → Leave **BLANK** → Save → Redeploy

#### Error: "Out of memory"
**Cause:** Build needs more RAM
**Fix:** Upgrade to **Standard (2 GB)** or **Pro (4 GB)** plan in Settings

#### Error: "P1001: Can't reach database server"
**Cause:** Using wrong DATABASE_URL
**Fix:** Use the **Internal Connection String** from your Render PostgreSQL service

#### Error: "NEXTAUTH_SECRET is not set"
**Cause:** Missing environment variable
**Fix:** Add it in Environment tab (see Step 3)

---

## 🎯 Quick Verification After Deploy

Once the build succeeds and your service is running:

### 1. Test Homepage
```
https://YOUR-APP-NAME.onrender.com
```
**Expected:** Landing/marketing page loads

### 2. Test Login
```
https://YOUR-APP-NAME.onrender.com/auth/login
```
**Expected:** Login form appears

### 3. Test Registration
```
https://YOUR-APP-NAME.onrender.com/auth/register
```
**Expected:** You can create a new account

### 4. Test Dashboard (After Login)
```
https://YOUR-APP-NAME.onrender.com/dashboard
```
**Expected:** Dashboard loads with optimized images (70x faster!)

---

## 🚀 Performance Improvements You'll See

After this fix, you should notice:

- **25MB smaller repository** - Faster clones during build
- **70x faster image loading** - Dashboard background optimized from 22MB → 310KB
- **Cleaner builds** - No more nextjs_space/ confusion
- **Better caching** - Render can cache dependencies more efficiently

---

## 🔧 Render.yaml Blueprint File

Your `render.yaml` has been updated to match these settings. If you want to recreate the service from scratch:

```yaml
services:
  - type: web
    name: community-manager
    runtime: node
    region: oregon
    plan: free
    # Next.js app at root - optimized structure with 25MB+ savings
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 20.18.0
      - key: DATABASE_URL
        sync: false
      # ... (all other env vars listed above)
```

---

## 🛟 Still Having Issues?

### Option 1: Check Render Logs
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Look for red error messages
4. Search this guide for the error text

### Option 2: Shell Access
1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run diagnostic commands:
```bash
# Check if app exists at root
ls -la

# Check if package.json is in root
cat package.json

# Check node version
node --version

# Check if Prisma is generated
ls -la node_modules/.prisma/client
```

### Option 3: Nuclear Option (Recreate Service)
If all else fails:
1. Delete the old service
2. Create a new web service
3. Use the settings from Step 2 above
4. Add all environment variables from Step 3
5. Deploy

---

## 📚 Related Documentation

- **Complete Deployment Guide:** `docs/setup/RENDER_DEPLOYMENT.md` (needs updating)
- **Environment Variables Reference:** `docs/setup/RENDER_ENV_VARIABLES.md`
- **Repository Optimization Details:** `PR_DESCRIPTION.md`

---

## ✅ Final Checklist

- [ ] Root Directory set to blank (not `nextjs_space`)
- [ ] Build command updated (no `--legacy-peer-deps`)
- [ ] NODE_VERSION set to `20.18.0`
- [ ] DATABASE_URL configured (internal connection string)
- [ ] NEXTAUTH_SECRET and NEXTAUTH_URL set
- [ ] Manual deploy triggered
- [ ] Build logs show success
- [ ] Homepage loads
- [ ] Login works
- [ ] Registration works

---

**Last Updated:** 2025-11-03
**Applies to:** Branch `claude/update-render-011CUmiWnWtyUpTtbzGbt18F` and `main` after merge
