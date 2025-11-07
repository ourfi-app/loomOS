/**
 * Testing Utilities
 *
 * Common utilities and helpers for testing
 */

// Type declarations for testing globals (only available in test environment)
declare const jest: any;
declare const expect: any;
declare const beforeEach: any;
declare const afterEach: any;

import { NextRequest } from 'next/server';

/**
 * Create a mock NextRequest with common defaults
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
  } = {}
): NextRequest {
  const {
    method = 'GET',
    body,
    headers = {},
    cookies = {},
  } = options;

  const requestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  } as const;

  const requestOptions: any = {
    ...requestInit,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const request = new NextRequest(url, requestOptions);

  // Mock cookies
  if (Object.keys(cookies).length > 0) {
    const cookieHeader = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    request.headers.set('cookie', cookieHeader);
  }

  return request;
}

/**
 * Create a mock session object for testing
 */
export function createMockSession(overrides: any = {}) {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'RESIDENT',
      ...overrides.user,
    },
    expires: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    ...overrides,
  };
}

/**
 * Create a mock admin session
 */
export function createMockAdminSession(overrides: any = {}) {
  return createMockSession({
    user: {
      role: 'SUPER_ADMIN',
      ...overrides.user,
    },
    ...overrides,
  });
}

/**
 * Create mock Prisma data
 */
export const mockPrismaData = {
  user: {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    role: 'RESIDENT',
    organizationId: 'org-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  organization: {
    id: 'org-1',
    name: 'Test Organization',
    type: 'CONDO',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  message: {
    id: 'message-1',
    subject: 'Test Message',
    body: 'Test message body',
    senderId: 'user-1',
    organizationId: 'org-1',
    status: 'SENT' as const,
    priority: 'NORMAL' as const,
    sentAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  file: {
    id: 'file-1',
    name: 'test-file.pdf',
    originalName: 'test-file.pdf',
    mimeType: 'application/pdf',
    size: 1024,
    url: 'https://example.com/test-file.pdf',
    folder: 'documents',
    uploadedById: 'user-1',
    organizationId: 'org-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Extract JSON from Response object
 */
export async function getResponseJson(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { error: 'Invalid JSON response', text };
  }
}

/**
 * Wait for async operations (useful in tests)
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a mock file for upload testing
 */
export function createMockFile(
  name = 'test.pdf',
  type = 'application/pdf',
  size = 1024
): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

/**
 * Mock FormData for file upload testing
 */
export function createMockFormData(files: Record<string, File>, data: Record<string, string> = {}): FormData {
  const formData = new FormData();

  Object.entries(files).forEach(([key, file]) => {
    formData.append(key, file);
  });

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

/**
 * Assert response status and return JSON
 */
export async function expectSuccessResponse(response: Response, expectedStatus = 200) {
  expect(response.status).toBe(expectedStatus);
  return getResponseJson(response);
}

/**
 * Assert error response
 */
export async function expectErrorResponse(response: Response, expectedStatus: number, errorMessage?: string) {
  expect(response.status).toBe(expectedStatus);
  const json = await getResponseJson(response);

  if (errorMessage) {
    expect(json.error || json.message).toContain(errorMessage);
  }

  return json;
}

/**
 * Setup common mocks for API testing
 */
export function setupApiMocks() {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
}

/**
 * Mock Prisma client factory
 */
export function createMockPrismaClient() {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    message: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    file: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    announcement: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    note: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}
