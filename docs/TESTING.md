# Testing Guide

## Overview

This project uses **Jest**, **@edge-runtime/jest-environment**, and **React Testing Library** for comprehensive testing coverage including:
- Unit tests for utilities and libraries
- Integration tests for API routes (using edge-runtime for Web API support)
- Component tests for UI elements (using jsdom for DOM APIs)
- E2E tests (planned)

**Current Test Status:**
- ✅ **152 tests passing** (98% pass rate)
- ⚠️ 3 tests with timeout issues (rate-limit, messages)
- 📊 **Success Rate:** 98% (152/155)
- 🎯 **Target Coverage:** 50%+

---

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="Button"
```

---

## Test Environment Configuration

The project uses **two different Jest environments** based on test type:

- **API Route Tests:** `@edge-runtime/jest-environment` (default)
  - Provides Web API support (Request, Response, Headers, etc.)
  - Required for Next.js API route testing
  - Default environment in jest.config.js

- **Component Tests:** `jest-environment-jsdom`
  - Provides DOM APIs for React component testing
  - Specified via `@jest-environment jsdom` docblock in test files

## Test Structure

```
nextjs_space/
├── app/
│   └── api/
│       ├── __tests__/          # API route integration tests (edge-runtime)
│       │   └── signup.test.ts ✅ (15 tests passing)
│       ├── users/
│       │   └── __tests__/
│       │       └── residents.test.ts ✅ (10 tests passing)
│       ├── documents/
│       │   └── __tests__/
│       │       └── documents.test.ts ✅ (11 tests passing)
│       └── messages/
│           └── __tests__/
│               └── send.test.ts ⚠️ (timeout issues)
├── components/
│   └── ui/
│       └── __tests__/          # Component unit tests (jsdom)
│           └── button.test.tsx ✅ (26 tests passing)
└── lib/
    ├── test-utils.ts           # Testing utilities (shared across tests)
    └── __tests__/              # Utility and library tests (edge-runtime)
        ├── csrf-protection.test.ts ✅ (9 tests passing)
        ├── rate-limit.test.ts ⚠️ (timeout issues)
        ├── api-security.test.ts ✅ (22 tests passing)
        ├── api-errors.test.ts ✅ (20 tests passing)
        └── auth.test.ts ✅ (43 tests passing)
```

---

## Writing Tests

### API Route Tests

Use the testing utilities to create comprehensive API route tests:

```typescript
import { createMockRequest, expectSuccessResponse, expectErrorResponse } from '@/lib/__tests__/test-utils';

describe('POST /api/example', () => {
  it('should require authentication', async () => {
    mockValidateAuth.mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/example');
    const response = await POST(request);

    await expectErrorResponse(response, 401, 'Unauthorized');
  });

  it('should process request successfully', async () => {
    const mockSession = createMockSession();
    mockValidateAuth.mockResolvedValue(mockSession as any);

    const request = createMockRequest('http://localhost:3000/api/example', {
      method: 'POST',
      body: { field: 'value' },
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data.success).toBe(true);
  });
});
```

### Component Tests

Use React Testing Library for component tests:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Utilities

The `lib/__tests__/test-utils.ts` file provides helpful utilities:

#### Create Mock Requests

```typescript
const request = createMockRequest('http://localhost:3000/api/endpoint', {
  method: 'POST',
  body: { data: 'value' },
  headers: { 'Authorization': 'Bearer token' },
  cookies: { sessionId: 'abc123' },
});
```

#### Create Mock Sessions

```typescript
// Regular user session
const userSession = createMockSession({
  user: {
    id: 'user-123',
    email: 'user@example.com',
    role: 'RESIDENT',
  },
});

// Admin session
const adminSession = createMockAdminSession();
```

#### Mock Prisma Data

```typescript
import { mockPrismaData } from '@/lib/__tests__/test-utils';

mockPrismaUserFindUnique.mockResolvedValue(mockPrismaData.user);
```

#### Response Assertions

```typescript
// Assert successful response
const data = await expectSuccessResponse(response, 200);

// Assert error response
await expectErrorResponse(response, 400, 'Bad Request');
```

---

## Test Coverage

### Current Coverage

Run `npm run test:coverage` to see current coverage statistics.

### Coverage Thresholds

The project enforces minimum coverage thresholds:

```json
{
  "coverageThreshold": {
    "global": {
      "statements": 50,
      "branches": 50,
      "functions": 50,
      "lines": 50
    }
  }
}
```

Tests will fail if coverage drops below these thresholds.

### Viewing Coverage Reports

After running `npm run test:coverage`, open `coverage/lcov-report/index.html` in your browser for a detailed visual report.

---

## Mocking

### Mock Prisma Database

```typescript
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrismaUserFindMany = prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>;
mockPrismaUserFindMany.mockResolvedValue([/* mock data */]);
```

### Mock API Utilities

```typescript
jest.mock('@/lib/api-utils', () => ({
  validateAuth: jest.fn(),
  errorResponse: jest.fn(),
  createSuccessResponse: jest.fn(),
}));
```

### Mock External Services

```typescript
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));
```

---

## Common Testing Patterns

### Testing Authentication

```typescript
it('should require authentication', async () => {
  mockValidateAuth.mockResolvedValue(null);

  const request = createMockRequest('http://localhost:3000/api/protected');
  const response = await GET(request);

  await expectErrorResponse(response, 401);
});
```

### Testing Authorization (Role-Based)

```typescript
it('should allow access for admin users', async () => {
  const adminSession = createMockAdminSession();
  mockValidateAuth.mockResolvedValue(adminSession as any);

  const request = createMockRequest('http://localhost:3000/api/admin/action');
  const response = await POST(request);

  await expectSuccessResponse(response, 200);
});

it('should deny access for regular users', async () => {
  const userSession = createMockSession({ user: { role: 'RESIDENT' } });
  mockValidateAuth.mockResolvedValue(userSession as any);

  const request = createMockRequest('http://localhost:3000/api/admin/action');
  const response = await POST(request);

  await expectErrorResponse(response, 403);
});
```

### Testing Input Validation

```typescript
it('should validate required fields', async () => {
  const request = createMockRequest('http://localhost:3000/api/endpoint', {
    method: 'POST',
    body: { /* missing required fields */ },
  });

  const response = await POST(request);
  await expectErrorResponse(response, 400, 'Missing required fields');
});
```

### Testing Error Handling

```typescript
it('should handle database errors gracefully', async () => {
  mockPrismaUserFindMany.mockRejectedValue(new Error('Database connection error'));

  const request = createMockRequest('http://localhost:3000/api/users');
  const response = await GET(request);

  await expectErrorResponse(response, 500);
});
```

---

## Debugging Tests

### Run Tests in Debug Mode

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand path/to/test.test.ts
```

### Use VSCode Debugger

Add this configuration to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Jest: Debug Current File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "${fileBasenameNoExtension}",
        "--runInBand",
        "--no-cache"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Verbose Output

```bash
npm test -- --verbose
```

---

## Best Practices

### 1. Test Behavior, Not Implementation

✅ **Good:**
```typescript
it('should display user name after login', async () => {
  render(<Header />);
  await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));

  expect(await screen.findByText('Welcome, User')).toBeInTheDocument();
});
```

❌ **Bad:**
```typescript
it('should call setUserName with correct value', () => {
  const mockSetUserName = jest.fn();
  render(<Header setUserName={mockSetUserName} />);

  // Testing implementation details
  expect(mockSetUserName).toHaveBeenCalled();
});
```

### 2. Use Descriptive Test Names

✅ **Good:**
```typescript
it('should return 401 when user is not authenticated')
it('should create new user with hashed password')
it('should filter documents based on user role')
```

❌ **Bad:**
```typescript
it('works')
it('test 1')
it('should return error')
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('should create a user successfully', async () => {
  // Arrange: Set up test data and mocks
  mockPrismaUserFindUnique.mockResolvedValue(null);
  const userData = { email: 'test@example.com', password: 'password123' };

  // Act: Execute the code being tested
  const request = createMockRequest('http://localhost:3000/api/signup', {
    method: 'POST',
    body: userData,
  });
  const response = await POST(request);

  // Assert: Verify the results
  await expectSuccessResponse(response, 201);
  expect(mockPrismaUserCreate).toHaveBeenCalled();
});
```

### 4. One Assertion Per Test (When Possible)

Each test should focus on testing one specific behavior.

### 5. Clean Up After Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests with coverage
        run: npm run test:coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v2
```

---

## Troubleshooting

### Tests Timeout

If tests are timing out, increase the Jest timeout:

```typescript
jest.setTimeout(10000); // 10 seconds
```

### Module Not Found Errors

Ensure all dependencies are installed:

```bash
npm install --legacy-peer-deps
```

### Mock Not Working

Make sure to clear mocks between tests:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Type Errors in Tests

Install missing type definitions:

```bash
npm install --save-dev @types/jest
```

---

## Next Steps

### Increase Coverage

Priority areas for additional tests:
1. ~~User management APIs~~ ✅
2. ~~Document management APIs~~ ✅
3. ~~Authentication flows~~ ✅
4. Calendar APIs
5. Payment APIs
6. Announcement APIs
7. Complex UI components
8. Custom hooks
9. Utility functions

### E2E Testing

Install Playwright for end-to-end testing:

```bash
npm install --save-dev @playwright/test
```

Create your first E2E test:

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

## Summary

- **Run tests:** `npm test`
- **Watch mode:** `npm run test:watch`
- **Coverage:** `npm run test:coverage`
- **Target:** 50%+ coverage
- **Focus:** API routes, critical components, security features
- **Pattern:** Arrange-Act-Assert
- **Best Practice:** Test behavior, not implementation

Happy testing! 🚀
