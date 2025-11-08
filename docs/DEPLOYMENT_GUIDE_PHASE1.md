# Phase 1 Production Deployment Guide

**Multi-Tenancy Infrastructure Deployment**

---

## 🎯 **Deployment Overview**

This guide walks you through deploying Phase 1 multi-tenancy infrastructure to production on Render.

**What's Being Deployed:**
- Multi-tenancy routing (subdomain & custom domain support)
- Tenant isolation middleware
- Domain verification system
- Tenant context throughout the app
- API route protection

---

## ✅ **Pre-Deployment Checklist**

Before starting deployment, ensure:

- [ ] All Phase 1 code is on branch: `claude/plan-superadmin-features-011CUuWXa4TLeSCMYsSpZ2zA`
- [ ] All tests passing (53/53)
- [ ] Git commits are pushed to GitHub
- [ ] You have access to Render dashboard
- [ ] You have access to your domain DNS settings
- [ ] Database backup is recent (within 24 hours)

---

## 📋 **Step 1: Merge to Main Branch**

### Option A: Create Pull Request (Recommended)
```bash
# On GitHub
# 1. Go to: https://github.com/ourfi-app/loomOS
# 2. Create PR from: claude/plan-superadmin-features-011CUuWXa4TLeSCMYsSpZ2zA → main
# 3. Review changes
# 4. Merge when ready
```

### Option B: Direct Merge (Fast Track)
```bash
# Checkout main
git checkout main

# Merge Phase 1 branch
git merge claude/plan-superadmin-features-011CUuWXa4TLeSCMYsSpZ2zA

# Push to GitHub
git push origin main
```

---

## 🗄️ **Step 2: Database Migration**

### Access Render Shell

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Navigate to your `community-manager` service
3. Click **"Shell"** in the left sidebar

### Run Migration

```bash
# In Render Shell, run:
npx prisma migrate deploy

# Expected output:
# ✓ Migration applied: 20251108_add_domain_verification_fields
```

### Verify Migration

```bash
# Check new fields exist
npx prisma studio
# Or run SQL query:
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'organizations' AND column_name LIKE 'domain%';"
```

**Expected columns:**
- `domainVerificationToken`
- `domainVerified`
- `domainVerifiedAt`
- `sslCertificateStatus`
- `sslCertificateExpiry`

---

## ⚙️ **Step 3: Environment Variables**

### On Render Dashboard

1. Go to your service → **Environment** tab
2. Add/Update these variables:

```env
# Required for Phase 1
NEXT_PUBLIC_APP_DOMAIN=yourdomain.com

# Example:
NEXT_PUBLIC_APP_DOMAIN=loomos.com
# or
NEXT_PUBLIC_APP_DOMAIN=trellis.com
```

3. Click **"Save Changes"**
4. Wait for automatic redeployment

---

## 🌐 **Step 4: DNS Configuration**

### For Subdomain Support (*.yourdomain.com)

#### Option A: Using Cloudflare (Recommended)
1. Log into Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Add these records:

```
Type: A
Name: *
Content: [Your Render IP or use CNAME]
Proxy: Enabled (orange cloud)
TTL: Auto

Type: A
Name: @
Content: [Your Render IP]
Proxy: Enabled
TTL: Auto
```

#### Option B: Using Your DNS Provider
```
Type: A
Name: *
Value: [Your Render IP]
TTL: 300

Type: A
Name: @
Value: [Your Render IP]
TTL: 300
```

**To find your Render IP:**
```bash
# In Render Shell or locally:
dig +short your-app.onrender.com
```

### Verify DNS Propagation

```bash
# Check wildcard DNS
dig test.yourdomain.com

# Should resolve to your Render IP
# Wait up to 24-48 hours for full propagation
```

---

## 🔒 **Step 5: SSL Certificate Setup**

### Option A: Cloudflare SSL (Easiest)

If using Cloudflare:
1. Go to **SSL/TLS** → **Overview**
2. Set mode to: **Full (strict)** or **Full**
3. Cloudflare handles wildcard SSL automatically ✅

### Option B: Let's Encrypt on Render

Render provides SSL automatically for:
- Main domain (`yourdomain.com`)
- www subdomain (`www.yourdomain.com`)

For wildcard subdomains:
1. Contact Render support
2. Or use Cloudflare proxy (recommended)

### Option C: Custom SSL Certificate

If you have a wildcard certificate:
1. Go to Render Dashboard → Settings → Custom Domains
2. Upload certificate for `*.yourdomain.com`

---

## 🚀 **Step 6: Deploy to Production**

### Automatic Deployment (if auto-deploy enabled)

Once you merge to `main`, Render will automatically:
1. Pull latest code
2. Install dependencies
3. Run build
4. Deploy new version

**Monitor deployment:**
- Render Dashboard → **Logs** tab
- Watch for "Build succeeded" and "Deploy live"

### Manual Deployment

If auto-deploy is disabled:
1. Go to Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Monitor logs for completion

---

## ✅ **Step 7: Post-Deployment Verification**

### 7.1: Test Main Domain

```bash
# Visit your main domain
https://yourdomain.com

# Should load normally
# Check browser console for errors
```

### 7.2: Test Subdomain Routing

First, create a test organization with subdomain:

**Via Render Shell:**
```bash
# Access Render Shell
# Create test org with subdomain
npx prisma studio
# Or use SQL:
psql $DATABASE_URL
```

```sql
-- Create test organization
INSERT INTO organizations (
  id, name, slug, subdomain,
  "isActive", "createdAt", "updatedAt"
)
VALUES (
  'org_test_' || substr(md5(random()::text), 1, 10),
  'Test Organization',
  'testorg',
  'testorg',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
RETURNING id, subdomain;
```

**Test subdomain access:**
```bash
# Visit subdomain
https://testorg.yourdomain.com

# Should work after DNS propagates
# Check browser console for tenant context
```

### 7.3: Verify Tenant Context

In browser console:
```javascript
// On testorg.yourdomain.com
console.log(window.location.hostname);
// Should output: testorg.yourdomain.com

// Check headers (in Network tab)
// Look for: x-tenant-subdomain: testorg
```

### 7.4: Test API Endpoints

```bash
# Test domains API (as SUPER_ADMIN)
curl https://yourdomain.com/api/super-admin/domains \
  -H "Cookie: your-session-cookie"

# Should return list of organizations with domains
```

### 7.5: Test Tenant Isolation

**Critical Security Test:**

1. Create 2 test organizations (Org A, Org B)
2. Create users in each
3. Create test data (payments, messages)
4. Login as user from Org A
5. Verify can ONLY see Org A data
6. Attempt to access Org B data → should fail

**Example test:**
```bash
# As Org A user
GET https://yourdomain.com/api/payments
# Should only return Org A payments

# Try to access Org B payment directly
GET https://yourdomain.com/api/payments/[org-b-payment-id]
# Should return 404 or 403
```

---

## 📊 **Step 8: Monitoring Setup**

### Enable Application Monitoring

**Check Render Metrics:**
1. Render Dashboard → **Metrics** tab
2. Monitor:
   - Response times
   - Error rates
   - Memory usage
   - CPU usage

### Application Logs

**Watch for issues:**
```bash
# In Render Dashboard → Logs tab
# Filter for:
- "Tenant isolation violation"
- "Organization not found"
- "Domain verification"
- Error messages
```

### Set Up Alerts

**On Render:**
1. Settings → **Notifications**
2. Enable alerts for:
   - Deployment failures
   - High error rates
   - Downtime

### Database Monitoring

```bash
# Check database size growth
# In Render Shell:
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

# Check table sizes
psql $DATABASE_URL -c "SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;"
```

---

## 🐛 **Troubleshooting**

### Issue: Migration Failed

**Error:** `Cannot find Prisma engines`

**Solution:**
```bash
# In Render Shell
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate deploy
```

### Issue: Subdomain Not Working

**Possible causes:**
1. DNS not propagated → Wait 24-48 hours
2. Wildcard DNS not configured → Check DNS records
3. SSL certificate issue → Use Cloudflare

**Check DNS:**
```bash
dig testorg.yourdomain.com
nslookup testorg.yourdomain.com
```

### Issue: Tenant Context Not Available

**Check:**
1. Environment variable set: `NEXT_PUBLIC_APP_DOMAIN`
2. Middleware is running (check logs)
3. TenantProviderWrapper is in providers.tsx
4. Organization exists in database

**Debug in browser console:**
```javascript
// Check if context is available
import { useTenant } from '@/lib/tenant/context';
const { organization } = useTenant();
console.log(organization);
```

### Issue: Cross-Tenant Data Visible

**CRITICAL SECURITY ISSUE**

1. **Immediately roll back deployment**
2. Check Prisma middleware is applied
3. Verify API routes use `withTenantAuth`
4. Enable validation middleware

```typescript
// In lib/prisma/tenant-middleware.ts
applyTenantMiddleware(prisma, organizationId, { validate: true });
```

---

## 🔄 **Rollback Plan**

If issues occur, rollback immediately:

### Quick Rollback

**On Render:**
1. Dashboard → **Manual Deploy**
2. Select previous deployment from list
3. Click **"Redeploy"**

### Via Git

```bash
# Find last good commit
git log

# Revert to previous version
git revert HEAD

# Push to trigger redeploy
git push origin main
```

### Database Rollback

```bash
# Only if migration caused issues
# In Render Shell:
npx prisma migrate resolve --rolled-back 20251108_add_domain_verification_fields
```

---

## ✅ **Deployment Checklist Summary**

Before marking deployment complete, verify:

- [ ] Code merged to main branch
- [ ] Database migration successful
- [ ] Environment variables set
- [ ] DNS configured (wildcard subdomain)
- [ ] SSL certificates working
- [ ] Deployment successful (no errors in logs)
- [ ] Main domain accessible
- [ ] Subdomain routing working
- [ ] Tenant context available
- [ ] API endpoints responding
- [ ] Tenant isolation verified
- [ ] No cross-tenant data leaks
- [ ] Monitoring set up
- [ ] Team notified of deployment

---

## 📞 **Support & Resources**

### Documentation
- Implementation Summary: `docs/PHASE1_IMPLEMENTATION_SUMMARY.md`
- Testing Report: `docs/PHASE1_TESTING_REPORT.md`
- Manual Testing Guide: `docs/PHASE1_MANUAL_TESTING_GUIDE.md`

### Helpful Commands

```bash
# Check current deployment
git log -1

# View migration status
npx prisma migrate status

# Check environment variables
env | grep NEXT_PUBLIC

# Test subdomain locally
# Add to /etc/hosts:
# 127.0.0.1 testorg.localhost

# Restart Render service
# Dashboard → Settings → Restart Service
```

---

## 🎉 **Post-Deployment Steps**

Once deployment is successful:

1. **Notify Team**
   - Send deployment notification
   - Share testing instructions
   - Document any issues encountered

2. **Update Organizations**
   - Add subdomains to existing organizations
   - Test with each organization
   - Verify tenant isolation

3. **Monitor for 24 Hours**
   - Watch error logs
   - Monitor performance
   - Track user feedback

4. **Plan Next Phase**
   - Phase 2: Billing & Subscriptions
   - Or additional Phase 1 improvements

---

## 📝 **Deployment Log Template**

```
DEPLOYMENT LOG - Phase 1: Multi-Tenancy
Date: [Date]
Deployed by: [Name]
Branch: claude/plan-superadmin-features-011CUuWXa4TLeSCMYsSpZ2zA
Commit: 6ee0255

PRE-DEPLOYMENT:
[ ] All tests passing
[ ] Code reviewed
[ ] Database backup verified

DEPLOYMENT:
[ ] Code merged to main
[ ] Database migration: [SUCCESS/FAILED]
[ ] Environment variables set
[ ] DNS configured
[ ] SSL verified
[ ] Deployment: [SUCCESS/FAILED]

POST-DEPLOYMENT:
[ ] Main domain working: [YES/NO]
[ ] Subdomain routing: [YES/NO]
[ ] Tenant context: [YES/NO]
[ ] Tenant isolation: [YES/NO]
[ ] Performance: [GOOD/ISSUES]

ISSUES ENCOUNTERED:
[List any issues]

ROLLBACK NEEDED:
[YES/NO - If yes, explain]

NOTES:
[Additional notes]
```

---

**Ready to proceed with deployment?** Start with Step 1! 🚀
