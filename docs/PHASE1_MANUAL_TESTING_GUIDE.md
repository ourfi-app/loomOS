# Phase 1 Manual Testing Guide

**Quick reference for testing multi-tenancy features in a running application**

---

## Prerequisites

Before testing, ensure:
- [ ] App is running (`npm run dev` or deployed)
- [ ] Database migration applied
- [ ] SUPER_ADMIN user created
- [ ] Environment variable set: `NEXT_PUBLIC_APP_DOMAIN` (default: `loomos.com`)

---

## Test 1: View Existing Organizations with Domains

**Endpoint:** GET `/api/super-admin/domains`

```bash
# Using curl
curl -X GET http://localhost:3000/api/super-admin/domains \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Using browser
# 1. Login as SUPER_ADMIN
# 2. Navigate to: http://localhost:3000/dashboard/super-admin/domains
```

**Expected Response:**
```json
[
  {
    "organizationId": "org_123",
    "organizationName": "Montrecott Towers",
    "subdomain": "montrecott",
    "customDomain": null,
    "verified": false,
    "createdAt": "2025-11-08T00:00:00.000Z"
  }
]
```

---

## Test 2: Create Organization with Subdomain

**Endpoint:** POST `/api/super-admin/organizations`

```bash
curl -X POST http://localhost:3000/api/super-admin/organizations \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "Test Organization",
    "slug": "testorg",
    "subdomain": "testorg",
    "type": "CONDO_ASSOCIATION"
  }'
```

**Validation Checks:**
- ✅ Subdomain is lowercase
- ✅ Subdomain is 3-63 characters
- ✅ Subdomain is not reserved (www, api, admin, etc.)
- ✅ Subdomain is unique

**Expected Response:**
```json
{
  "id": "org_new",
  "name": "Test Organization",
  "subdomain": "testorg",
  "customDomain": null,
  ...
}
```

---

## Test 3: Add Custom Domain

**Endpoint:** PUT `/api/super-admin/domains/{organizationId}`

```bash
curl -X PUT http://localhost:3000/api/super-admin/domains/org_123 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "customDomain": "testorg.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "organization": {
    "id": "org_123",
    "subdomain": "testorg",
    "customDomain": "testorg.com",
    "domainVerified": false,
    "domainVerificationToken": "loomos-verify-abc123xyz789"
  }
}
```

**Save the `domainVerificationToken` for the next test!**

---

## Test 4: DNS Verification

### Step 1: Add DNS TXT Record

Add a TXT record to your domain:
```
Type: TXT
Name: @ (or your domain name)
Value: loomos-verify-abc123xyz789  (from previous step)
TTL: 300
```

Wait for DNS propagation (can take 5 minutes to 48 hours).

### Step 2: Verify DNS Record

```bash
# Check if TXT record is published
dig TXT testorg.com

# Or
nslookup -type=TXT testorg.com
```

### Step 3: Verify Domain in App

**Endpoint:** POST `/api/super-admin/domains/verify`

```bash
curl -X POST http://localhost:3000/api/super-admin/domains/verify \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "organizationId": "org_123"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "verified": true,
  "message": "Domain verified successfully"
}
```

**Expected Response (Not Ready):**
```json
{
  "success": false,
  "verified": false,
  "message": "TXT record not found. Please add the TXT record: loomos-verify-abc123xyz789",
  "txtRecords": []
}
```

---

## Test 5: Update Subdomain

**Endpoint:** PUT `/api/super-admin/domains/{organizationId}`

```bash
curl -X PUT http://localhost:3000/api/super-admin/domains/org_123 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "subdomain": "newsubdomain"
  }'
```

**Validation Checks:**
- ✅ New subdomain is not already taken
- ✅ New subdomain follows format rules
- ✅ Existing custom domain is preserved

---

## Test 6: Remove Custom Domain

**Endpoint:** DELETE `/api/super-admin/domains/{organizationId}`

```bash
curl -X DELETE http://localhost:3000/api/super-admin/domains/org_123 \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Custom domain removed successfully"
}
```

**Verify:**
- ✅ `customDomain` is now null
- ✅ `domainVerified` is now false
- ✅ `subdomain` is still set

---

## Test 7: Tenant Isolation (Critical!)

### Setup:
1. Create two organizations: Org A and Org B
2. Create users in each organization
3. Create some data (payments, messages, etc.) in each

### Test Steps:

**Step 1: Login as User from Org A**
```bash
# Login and get session
POST /api/auth/login
{
  "email": "user-a@orga.com",
  "password": "..."
}
```

**Step 2: Fetch Organization-Scoped Data**
```bash
GET /api/payments
```

**Expected:**
- ✅ Only see payments from Org A
- ❌ Should NOT see payments from Org B

**Step 3: Attempt Cross-Tenant Access**
```bash
# Try to access Org B's payment directly
GET /api/payments/{payment_id_from_org_b}
```

**Expected:**
- ❌ Should return 404 or 403
- ❌ Should NOT return payment data

**Step 4: Verify in Database**
```sql
-- Check that middleware is working
SELECT "organizationId", COUNT(*)
FROM payments
GROUP BY "organizationId";

-- Should show payments separated by organization
```

---

## Test 8: SUPER_ADMIN Access

**Step 1: Login as SUPER_ADMIN**

**Step 2: Access Any Organization**
```bash
# Access Org A's data
GET /api/super-admin/organizations/org_a_id

# Access Org B's data
GET /api/super-admin/organizations/org_b_id
```

**Expected:**
- ✅ SUPER_ADMIN can access ALL organizations
- ✅ Can view/edit any organization's data

**Step 3: Organization Switching**
```bash
# Switch context to specific organization
GET /api/some-endpoint?orgId=org_a_id
```

**Expected:**
- ✅ Data scoped to Org A
- ✅ SUPER_ADMIN can switch between orgs

---

## Test 9: Subdomain Routing (Requires DNS Setup)

### Setup:
Configure DNS with wildcard subdomain:
```
A record: *.loomos.com → your-server-ip
```

### Test Steps:

**Step 1: Access via Subdomain**
```bash
# Visit in browser
http://testorg.loomos.com/dashboard

# Or curl
curl http://testorg.loomos.com/dashboard
```

**Expected:**
- ✅ App loads
- ✅ Organization context is automatically set
- ✅ User only sees data from "testorg"

**Step 2: Verify Tenant Context**
```javascript
// In browser console
console.log(window.location.hostname);
// Should output: testorg.loomos.com

// If using React context
const { organization } = useTenant();
console.log(organization.subdomain);
// Should output: testorg
```

---

## Test 10: Domain Validation Edge Cases

### Test Invalid Subdomains:

```bash
# Too short
PUT /api/super-admin/domains/org_123
{"subdomain": "ab"}
# Expected: 400 error

# Reserved word
PUT /api/super-admin/domains/org_123
{"subdomain": "www"}
# Expected: 400 error

# Uppercase
PUT /api/super-admin/domains/org_123
{"subdomain": "TestOrg"}
# Expected: 400 error

# Special characters
PUT /api/super-admin/domains/org_123
{"subdomain": "test_org"}
# Expected: 400 error
```

### Test Invalid Custom Domains:

```bash
# App domain
PUT /api/super-admin/domains/org_123
{"customDomain": "montrecott.loomos.com"}
# Expected: 400 error

# Invalid format
PUT /api/super-admin/domains/org_123
{"customDomain": "invalid"}
# Expected: 400 error
```

---

## Common Issues & Troubleshooting

### Issue 1: "Organization not found"
**Cause:** Subdomain doesn't match any organization
**Fix:** Check organization has valid subdomain in database

### Issue 2: "Domain verification failed"
**Cause:** DNS TXT record not published or propagated
**Fix:**
- Wait for DNS propagation (up to 48 hours)
- Verify TXT record with `dig TXT yourdomain.com`
- Check token matches exactly

### Issue 3: Can see other organization's data
**Cause:** Tenant isolation middleware not applied
**Fix:**
- Verify Prisma middleware is initialized
- Check API route uses `withTenantAuth()`
- Enable validation middleware in development

### Issue 4: Subdomain routing not working
**Cause:** DNS not configured or Next.js middleware not updated
**Fix:**
- Configure wildcard DNS: `*.loomos.com`
- Update `middleware.ts` to use tenant routing
- Verify `NEXT_PUBLIC_APP_DOMAIN` environment variable

---

## Success Criteria

Phase 1 is working correctly if:

- ✅ Can create organizations with subdomains
- ✅ Can add and verify custom domains
- ✅ Users only see data from their organization
- ✅ SUPER_ADMIN can access all organizations
- ✅ Domain validation prevents invalid inputs
- ✅ DNS verification works correctly
- ✅ No cross-tenant data leaks
- ✅ API endpoints properly protected

---

## Test Data Cleanup

After testing, clean up test data:

```sql
-- Remove test organizations
DELETE FROM organizations WHERE slug LIKE 'test%';

-- This will cascade delete all related data due to foreign keys
```

Or via API:
```bash
DELETE /api/super-admin/organizations/{test_org_id}
```

---

## Next Steps

After manual testing is complete:
1. ✅ Verify all tests passed
2. 📝 Document any issues found
3. 🚀 Deploy to production
4. 📊 Monitor tenant isolation
5. ➡️ Proceed to Phase 2 (Billing & Subscriptions)

---

**Last Updated:** November 8, 2025
**Version:** Phase 1.0
