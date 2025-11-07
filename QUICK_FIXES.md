# Quick Fixes - Immediate Action Items

This document provides prioritized, actionable fixes for the code conflicts identified in the loomOS codebase.

## 🔴 CRITICAL - Fix Immediately

### 1. Update Environment Configuration (5 minutes)

**Issue**: Missing service layer configuration variables

**Action**:
1. Copy from `.env.example` to `.env` (if not already done)
2. Add these required variables to your `.env`:

```env
# Service Layer Configuration
EMAIL_PROVIDER=sendgrid
STORAGE_PROVIDER=s3
PAYMENT_PROVIDER=stripe
AI_PROVIDER=anthropic
```

**Why**: Prepares environment for service layer migration

---

### 2. Create Service Registry Config (15 minutes)

**Issue**: No central service registry initialization

**Action**: Create `lib/service-registry-config.ts` with the content from `SERVICE_LAYER_MIGRATION_GUIDE.md`

**Files to create**:
- `lib/service-registry-config.ts` (see migration guide)

**Why**: Required foundation for all service layer migrations

---

## 🟡 HIGH PRIORITY - Fix This Week

### 3. Migrate Email Service (2 hours)

**Files to modify**:
1. `app/api/messages/send/route.ts`
2. `app/api/messages/__tests__/send.test.ts`

**Steps**:
1. Update route to use `getServiceRegistry().getEmailService()`
2. Replace `sendEmail()` calls with `emailService.send()`
3. Update tests to mock service registry
4. Test email sending in development

**Verification**:
```bash
# Test the endpoint
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"recipientEmails":["test@example.com"],"subject":"Test","body":"Test message"}'
```

---

### 4. Migrate Storage Service (3 hours)

**Files to modify** (6 total):
1. `app/api/documents/upload/route.ts`
2. `app/api/documents/process/route.ts`
3. `app/api/documents/[id]/download/route.ts`
4. `app/api/documents/[id]/delete/route.ts`
5. `app/api/profile/avatar/route.ts`
6. `app/api/google-drive/import/route.ts`

**Pattern**:
```typescript
// OLD
import { uploadFile } from '@/lib/s3';
const path = await uploadFile(buffer, fileName, mimeType);

// NEW
import { getServiceRegistry } from '@/lib/service-registry-config';
const services = getServiceRegistry();
const result = await services.getStorageService().upload(fileName, buffer, { contentType: mimeType });
const path = result.key;
```

**Verification**:
- Upload a test file
- Download it
- Delete it
- Check S3 bucket to confirm

---

### 5. Migrate Payment Service (2 hours)

**Files to modify** (2 total):
1. `app/api/payments/create-checkout-session/route.ts`
2. `app/api/payments/webhook/route.ts`

**CRITICAL**: Test webhook handling thoroughly before deploying!

**Verification**:
- Create test checkout session in Stripe sandbox
- Trigger webhook with Stripe CLI
- Verify webhook processing in logs
- Check database for payment records

---

## 🟢 MEDIUM PRIORITY - Fix This Month

### 6. Design System Consolidation (4 hours)

**Issue**: Multiple design systems causing confusion

**Action**:

1. **Audit component usage** (1 hour):
```bash
# Search for design system imports
grep -r "from '@/lib/loomos-design-system'" .
grep -r "from '@/lib/app-design-system'" .
```

2. **Document design system usage** (1 hour):
   - Create `docs/DESIGN_SYSTEM.md`
   - Define when to use each system
   - Document migration path

3. **Consolidate design tokens** (2 hours):
   - Merge common tokens
   - Remove duplicates
   - Update components

**Decision needed**: Which design system is primary?
- **Recommended**: `loomos-design-system.ts` (newer, liberation-focused)

---

### 7. Remove Legacy Service Files (1 hour)

**ONLY AFTER** all migrations are complete and tested!

**Files to remove**:
- `lib/email-service.ts`
- `lib/s3.ts`
- `lib/aws-config.ts`
- `lib/stripe.ts` (if exists)

**Steps**:
1. Verify no imports remain:
```bash
grep -r "from '@/lib/email-service'" .
grep -r "from '@/lib/s3'" .
grep -r "from '@/lib/stripe'" .
```

2. Remove files only if grep returns no results
3. Update any documentation references

---

## 🔵 LOW PRIORITY - Nice to Have

### 8. Optimize Package Dependencies (1 hour)

**Issue**: Duplicate dependencies in root and `@loomos/core`

**Action**:

1. **Move SDK dependencies to core only**:

   Edit `package.json`:
   ```json
   {
     "dependencies": {
       // REMOVE these (they're in @loomos/core):
       // "@aws-sdk/client-s3": "^3.920.0",
       // "@sendgrid/mail": "^8.1.6",
       // "stripe": "^19.1.0",
       // "@anthropic-ai/sdk": "^0.36.1",
       // "openai": "^4.77.3"
     }
   }
   ```

2. **Rebuild**:
```bash
npm install
npm run build
```

**Savings**: ~50MB in node_modules

---

## Testing Checklist

Before considering migrations complete:

### Email Service
- [ ] Send single email works
- [ ] Send to multiple recipients works
- [ ] Email templates render correctly
- [ ] Errors handled gracefully
- [ ] Email validation works

### Storage Service
- [ ] File upload succeeds
- [ ] File download works
- [ ] Signed URLs work and expire
- [ ] File deletion removes from S3
- [ ] Large files (>10MB) upload correctly

### Payment Service
- [ ] Checkout session created
- [ ] Webhook processed correctly
- [ ] Payment recorded in database
- [ ] Stripe dashboard matches database
- [ ] Failed payments handled correctly

---

## Rollback Commands

If something breaks:

### Revert .env changes
```bash
git checkout HEAD -- .env.example
```

### Revert specific API route
```bash
git checkout HEAD -- app/api/messages/send/route.ts
```

### Revert all changes
```bash
git reset --hard HEAD
```

---

## Progress Tracking

Track your migration progress:

```
Email Service Migration:
[ ] Create service registry config
[ ] Migrate send route
[ ] Update tests
[ ] Verify in development
[ ] Deploy to staging
[ ] Monitor for 24 hours
[ ] Mark complete ✓

Storage Service Migration:
[ ] Migrate upload route
[ ] Migrate download route
[ ] Migrate delete route
[ ] Migrate avatar route
[ ] Migrate google-drive route
[ ] Verify all operations
[ ] Deploy to staging
[ ] Monitor for 24 hours
[ ] Mark complete ✓

Payment Service Migration:
[ ] Migrate checkout route
[ ] Migrate webhook route
[ ] Test in Stripe sandbox
[ ] Verify webhook signatures
[ ] Deploy to staging
[ ] Monitor for 48 hours (critical!)
[ ] Mark complete ✓
```

---

## Metrics to Monitor

### Email Service
- **Before**: Email delivery rate, average send time
- **After**: Compare metrics, watch for failures

### Storage Service
- **Before**: Upload success rate, average upload time
- **After**: Compare metrics, watch for failures

### Payment Service (CRITICAL)
- **Before**: Payment success rate, webhook processing time
- **After**: Monitor closely for 48 hours, any drop is critical

---

## Getting Help

If you encounter issues:

1. **Check the docs**:
   - `CODE_CONFLICTS_ANALYSIS.md` - Full analysis
   - `SERVICE_LAYER_MIGRATION_GUIDE.md` - Step-by-step guide
   - `packages/core/README.md` - Service layer docs

2. **Review examples**:
   - Look at test files in `packages/core/src/__tests__/`
   - Check interface definitions

3. **Ask the team**:
   - Create issue with "migration" label
   - Include error messages and stack traces
   - Tag as "help wanted" if blocked

---

## Success Criteria

You'll know the migration is complete when:

✅ All API routes use `getServiceRegistry()`
✅ No imports from `@/lib/email-service`, `@/lib/s3`, `@/lib/stripe`
✅ All tests passing
✅ Production metrics stable
✅ Legacy service files deleted
✅ Documentation updated

---

## Timeline

**Aggressive** (1 week):
- Day 1-2: Email service
- Day 3-4: Storage service
- Day 5: Payment service
- Day 6-7: Testing & cleanup

**Conservative** (3 weeks):
- Week 1: Email service (with monitoring)
- Week 2: Storage service (with monitoring)
- Week 3: Payment service (with extended monitoring)

**Recommended**: Conservative approach for production systems

---

## Final Checklist

Before marking migration complete:

- [ ] All routes migrated
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Documentation updated
- [ ] Legacy files removed
- [ ] Metrics stable for 1 week
- [ ] Team trained on new patterns
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
- [ ] Post-migration retrospective completed

Good luck! 🚀
