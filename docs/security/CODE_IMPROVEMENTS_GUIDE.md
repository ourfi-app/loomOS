# Code Improvements Guide

This document outlines the recent code quality and security improvements made to the Community Manager application. These changes enhance reliability, security, maintainability, and testability of the codebase.

## 📋 Table of Contents

1. [Environment Variable Validation](#environment-variable-validation)
2. [Authentication Security Improvements](#authentication-security-improvements)
3. [API Middleware & Error Handling](#api-middleware--error-handling)
4. [Request Validation](#request-validation)
5. [Logging Infrastructure](#logging-infrastructure)
6. [Testing Infrastructure](#testing-infrastructure)
7. [Migration Guide](#migration-guide)
8. [Best Practices](#best-practices)

---

## 🔐 Environment Variable Validation

### What Changed

Added comprehensive environment variable validation using Zod to catch configuration errors at startup.

### New File

`lib/env.ts` - Centralized environment variable validation

### Features

- ✅ Validates all required environment variables at application startup
- ✅ Prevents deployment with invalid configuration
- ✅ Blocks placeholder credentials in production
- ✅ Provides clear error messages for missing/invalid variables
- ✅ Type-safe environment variable access

### Usage

```typescript
// Before (unsafe)
const dbUrl = process.env.DATABASE_URL;

// After (safe and type-checked)
import { env } from '@/lib/env';
const dbUrl = env.DATABASE_URL; // TypeScript knows this is always defined
```

### Helper Functions

```typescript
import { hasStripeConfigured, hasAwsConfigured } from '@/lib/env';

if (hasStripeConfigured()) {
  // Stripe is configured and ready to use
  processPayment();
}
```

### Configuration

Update your `.env` file to match the schema defined in `lib/env.ts`. The application will fail fast with clear error messages if configuration is invalid.

---

## 🔒 Authentication Security Improvements

### What Changed

Fixed critical security vulnerabilities in OAuth configuration and improved type safety.

### Changes to `lib/auth.ts`

1. **Removed Placeholder Credentials**
   - OAuth providers are now only enabled if properly configured
   - Prevents accidental deployment with placeholder values

2. **Fixed Dangerous Email Account Linking**
   - `allowDangerousEmailAccountLinking` now disabled by default
   - Only enabled in development environment
   - Prevents account takeover vulnerabilities

3. **Improved Type Safety**
   - Added proper TypeScript imports
   - Uses validated environment variables from `lib/env.ts`

### Before

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
  allowDangerousEmailAccountLinking: true, // ❌ DANGEROUS
})
```

### After

```typescript
// Only adds provider if properly configured
if (hasGoogleOAuthConfigured()) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!, // ✅ Validated
      allowDangerousEmailAccountLinking: env.NODE_ENV === 'development', // ✅ Safe
    })
  );
}
```

---

## 🛠️ API Middleware & Error Handling

### What Changed

Added reusable middleware functions and standardized error handling across all API routes.

### New Files

- `lib/api-middleware.ts` - Reusable API middleware
- `lib/api-errors.ts` - Standardized error handling

### API Middleware Features

#### Available Middleware

1. **`withAuth`** - Requires authentication
2. **`withAdmin`** - Requires admin access
3. **`withBoardAccess`** - Requires board member access
4. **`withSuperAdmin`** - Requires super admin access
5. **`withTenant`** - Adds organization context
6. **`withAdminTenant`** - Admin access + organization context

#### Usage Example

```typescript
// Before
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... handler code
}

// After
export const GET = withAuth(async (req, session) => {
  // session is guaranteed to exist and is properly typed
  // ... handler code
});

// With admin check and tenant context
export const POST = withAdminTenant(async (req, session, organizationId) => {
  // Guaranteed admin access and organization context
  // ... handler code
});
```

### Standardized Error Handling

#### Using ApiError Class

```typescript
import { ApiError, handleApiError } from '@/lib/api-errors';

export const POST = withAuth(async (req, session) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw ApiError.notFound('User');
    }

    if (user.organizationId !== session.user.organizationId) {
      throw ApiError.forbidden('Cannot access users from other organizations');
    }

    // ... rest of handler

  } catch (error) {
    return handleApiError(error, '/api/users');
  }
});
```

#### Available Error Factories

```typescript
ApiError.badRequest('Invalid input');
ApiError.unauthorized();
ApiError.forbidden('Admin access required');
ApiError.notFound('User');
ApiError.conflict('Email already exists');
ApiError.validation('Invalid fields', { fields: ['email'] });
ApiError.internal();
ApiError.duplicate('Committee', { name: 'Board' });
```

#### Error Response Format

All errors now return consistent JSON responses:

```json
{
  "error": "NOT_FOUND",
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2025-01-01T12:00:00.000Z",
  "path": "/api/users/123",
  "details": {
    "userId": "123"
  }
}
```

---

## ✅ Request Validation

### What Changed

Added Zod schemas for validating API request bodies across all routes.

### New File

`lib/validation-schemas.ts` - Centralized validation schemas

### Available Schemas

- **Committees**: `createCommitteeSchema`, `updateCommitteeSchema`, `addCommitteeMemberSchema`
- **Users**: `createUserSchema`, `updateUserSchema`, `changePasswordSchema`
- **Payments**: `createPaymentSchema`, `updatePaymentSchema`
- **Tasks**: `createTaskSchema`, `updateTaskSchema`
- **Messages**: `createMessageSchema`, `updateMessageSchema`
- **Notes**: `createNoteSchema`, `updateNoteSchema`
- **Households**: `createPetSchema`, `createChildSchema`, `createAdditionalResidentSchema`
- **Properties**: `createPropertyUnitSchema`, `updatePropertyUnitSchema`

### Usage Example

```typescript
import { withAdminTenant, validateRequestBody } from '@/lib/api-middleware';
import { createCommitteeSchema } from '@/lib/validation-schemas';
import { handleApiError, ApiError } from '@/lib/api-errors';

export const POST = withAdminTenant(async (req, session, organizationId) => {
  try {
    // Validate request body
    const validation = await validateRequestBody(req, createCommitteeSchema);
    if (!validation.success) {
      return validation.error; // Returns formatted validation error
    }

    const { name, description, type } = validation.data; // Fully typed!

    // ... create committee

  } catch (error) {
    return handleApiError(error);
  }
});
```

### Benefits

- ✅ Type-safe request handling
- ✅ Automatic validation error responses
- ✅ Clear validation messages
- ✅ Prevents invalid data from reaching your database

---

## 📝 Logging Infrastructure

### What Changed

Added structured logging to replace console.log/warn/error statements throughout the application.

### New File

`lib/logger.ts` - Application-wide logger

### Features

- ✅ Structured logging with metadata
- ✅ Log levels (DEBUG, INFO, WARN, ERROR)
- ✅ Pretty formatting in development
- ✅ JSON output in production (for log aggregation)
- ✅ Performance timing utilities
- ✅ Domain-specific loggers with context

### Usage

#### Basic Logging

```typescript
import { logger } from '@/lib/logger';

// Replace console.log
logger.info('User logged in', { userId: user.id });

// Replace console.warn
logger.warn('Rate limit approaching', { requests: 95, limit: 100 });

// Replace console.error
logger.error('Failed to process payment', error, { userId, amount });

// Debug logging (hidden in production)
logger.debug('Processing request', { requestId, body });
```

#### Domain-Specific Loggers

```typescript
import { createLogger } from '@/lib/logger';

// Create logger with default context
const authLogger = createLogger({ domain: 'auth' });
const apiLogger = createLogger({ domain: 'api', version: 'v1' });

// All logs from this logger will include the default context
authLogger.info('User logged in', { userId });
// Output: { domain: 'auth', userId: '123', message: 'User logged in' }
```

#### Performance Timing

```typescript
// Sync function
const result = logger.time('Database query', () => {
  return prisma.user.findMany();
});

// Async function
const result = await logger.timeAsync('API call', async () => {
  return fetch('/api/data');
});
```

### Migration

Replace all `console.*` statements:

```typescript
// Before
console.log('User created:', user);
console.error('Error:', error);
console.warn('Deprecation warning');

// After
logger.info('User created', { userId: user.id, email: user.email });
logger.error('Failed to create user', error, { email });
logger.warn('Using deprecated API endpoint', { endpoint: '/old-api' });
```

---

## 🧪 Testing Infrastructure

### What Changed

Added Jest testing framework with example tests for critical business logic.

### New Files

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup
- `lib/__tests__/auth.test.ts` - Auth helper tests
- `lib/__tests__/api-errors.test.ts` - Error handling tests

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage

# Type check
yarn type-check
```

### Writing Tests

#### Example: Testing a Utility Function

```typescript
// lib/__tests__/my-utility.test.ts
import { myFunction } from '../my-utility';

describe('myFunction', () => {
  it('should return correct result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('');
    expect(myFunction(null)).toBe(null);
  });
});
```

#### Example: Testing API Routes

```typescript
// app/api/users/__tests__/route.test.ts
import { GET } from '../route';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db');

describe('GET /api/users', () => {
  it('should return list of users', async () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const request = new Request('http://localhost:3000/api/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users).toEqual(mockUsers);
  });
});
```

### Coverage Goals

- **Critical paths** (auth, payments): 80%+ coverage
- **Business logic**: 70%+ coverage
- **UI components**: 60%+ coverage
- **Overall**: 50%+ coverage (gradually increase)

---

## 🚀 Migration Guide

### Step 1: Update Imports

Replace old imports with new utilities:

```typescript
// Old
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// New (add these)
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { withAuth, withAdmin } from '@/lib/api-middleware';
import { ApiError, handleApiError } from '@/lib/api-errors';
import { validateRequestBody } from '@/lib/api-middleware';
import { createUserSchema } from '@/lib/validation-schemas';
```

### Step 2: Refactor API Routes

Use the new middleware pattern for cleaner, more secure code:

```typescript
// Before
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // ... validation logic
    // ... business logic

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// After
export const POST = withAuth(async (req, session) => {
  try {
    const validation = await validateRequestBody(req, mySchema);
    if (!validation.success) return validation.error;

    const data = validation.data;
    // ... business logic

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, req.url);
  }
});
```

### Step 3: Add Validation Schemas

Create Zod schemas for your data:

```typescript
// lib/validation-schemas.ts
export const createMyResourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  age: z.number().int().positive().optional(),
});
```

### Step 4: Replace Console Statements

```typescript
// Before
console.log('Processing payment:', payment);
console.error('Payment failed:', error);

// After
logger.info('Processing payment', { paymentId: payment.id, amount: payment.amount });
logger.error('Payment failed', error, { paymentId: payment.id });
```

### Step 5: Write Tests

Add tests for new features and critical paths:

```typescript
// __tests__/my-feature.test.ts
describe('My Feature', () => {
  it('should work correctly', () => {
    // ... test implementation
  });
});
```

---

## 📚 Best Practices

### 1. Environment Variables

- ✅ Always use `env` from `lib/env.ts`
- ✅ Add validation for new variables
- ❌ Never access `process.env` directly in application code

### 2. API Routes

- ✅ Use middleware functions (`withAuth`, `withAdmin`, etc.)
- ✅ Validate all request bodies with Zod
- ✅ Use `ApiError` for throwing errors
- ✅ Use `handleApiError` in catch blocks
- ❌ Don't return raw `NextResponse.json({ error: ... })`

### 3. Error Handling

- ✅ Use specific error types (`ApiError.notFound`, `ApiError.forbidden`)
- ✅ Include helpful error messages for users
- ✅ Add metadata/details for debugging
- ❌ Don't expose internal error details to users

### 4. Logging

- ✅ Use structured logging with metadata
- ✅ Use appropriate log levels
- ✅ Include context (userId, requestId, etc.)
- ❌ Don't log sensitive data (passwords, tokens)

### 5. Validation

- ✅ Validate at API boundaries
- ✅ Provide clear validation messages
- ✅ Use type-safe schemas
- ❌ Don't trust client data

### 6. Testing

- ✅ Test critical business logic
- ✅ Test error cases
- ✅ Use descriptive test names
- ✅ Aim for meaningful coverage, not just high percentages
- ❌ Don't skip edge cases

---

## 🔄 Example: Complete API Route

Here's a complete example showing all best practices:

```typescript
/**
 * Users API Route
 * GET /api/users - List users
 * POST /api/users - Create user (Admin only)
 */

import { NextResponse } from 'next/server';
import { withTenant, withAdminTenant, validateRequestBody } from '@/lib/api-middleware';
import { createUserSchema } from '@/lib/validation-schemas';
import { handleApiError, ApiError } from '@/lib/api-errors';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/db';

const usersLogger = logger.child({ domain: 'api/users' });

export const GET = withTenant(async (req, session, organizationId) => {
  try {
    usersLogger.info('Listing users', { requestedBy: session.user.id });

    const users = await prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        unitNumber: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return handleApiError(error, '/api/users');
  }
});

export const POST = withAdminTenant(async (req, session, organizationId) => {
  try {
    // Validate request
    const validation = await validateRequestBody(req, createUserSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { email, firstName, lastName, role } = validation.data;

    // Check for duplicates
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.duplicate('User', { email });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        organizationId,
        email,
        firstName,
        lastName,
        role,
      },
    });

    usersLogger.info('User created', {
      userId: user.id,
      email: user.email,
      createdBy: session.user.id,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleApiError(error, '/api/users');
  }
});
```

---

## 📞 Support

For questions or issues with these improvements:

1. Check this documentation
2. Review the example code in `lib/__tests__/`
3. Check the individual module documentation in code comments
4. Open a GitHub issue

---

**Updated**: January 2025
**Version**: 1.0.0
