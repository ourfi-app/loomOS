// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * API Utilities for Consistent Error Handling and Response Formatting
 * Phase 8C: API Route Enhancement
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { csrf } from './csrf-protection';
import { rateLimit, strictRateLimit } from './rate-limit';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    count?: number;
    page?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID'
  | 'AUTH_EXPIRED'
  | 'PERMISSION_DENIED'
  | 'VALIDATION_ERROR'
  | 'MISSING_FIELD'
  | 'INVALID_FORMAT'
  | 'DUPLICATE_ENTRY'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

// ============================================================================
// Response Creators
// ============================================================================

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<ApiSuccessResponse['meta']>
): NextResponse<ApiSuccessResponse<T>> {
  const requestId = randomUUID();
  
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      ...meta,
    },
  });
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  code: ErrorCode = 'INTERNAL_ERROR',
  details?: any
): NextResponse<ApiErrorResponse> {
  const requestId = randomUUID();
  
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    },
    { status: statusCode }
  );
}

// ============================================================================
// Error Handlers
// ============================================================================

/**
 * Centralized API error handler
 * Logs the error and returns a consistent error response
 */
export function handleApiError(
  error: any,
  context: string = 'API Error',
  req?: Request
): NextResponse<ApiErrorResponse> {
  // Log the error
  logApiError(error, {
    context,
    route: req?.url,
    method: req?.method,
  });

  // Determine error type and status code
  const { code, statusCode, message } = categorizeError(error);

  // Return formatted error response
  return createErrorResponse(message, statusCode, code);
}

/**
 * Categorize error and determine appropriate status code and error code
 */
function categorizeError(error: any): {
  code: ErrorCode;
  statusCode: number;
  message: string;
} {
  // Prisma errors
  if (error?.code === 'P2002') {
    return {
      code: 'DUPLICATE_ENTRY',
      statusCode: 409,
      message: 'A record with this data already exists',
    };
  }
  
  if (error?.code === 'P2025') {
    return {
      code: 'NOT_FOUND',
      statusCode: 404,
      message: 'The requested resource was not found',
    };
  }

  if (error?.code?.startsWith('P')) {
    return {
      code: 'DATABASE_ERROR',
      statusCode: 500,
      message: 'A database error occurred',
    };
  }

  // Validation errors
  if (error?.name === 'ValidationError' || error?.message?.includes('validation')) {
    return {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      message: error?.message || 'Invalid input data',
    };
  }

  // Authorization errors
  if (error?.message?.includes('Unauthorized') || error?.message?.includes('not authorized')) {
    return {
      code: 'AUTH_REQUIRED',
      statusCode: 401,
      message: 'Authentication required',
    };
  }

  if (error?.message?.includes('Permission') || error?.message?.includes('forbidden')) {
    return {
      code: 'PERMISSION_DENIED',
      statusCode: 403,
      message: 'You do not have permission to perform this action',
    };
  }

  // Network/External service errors
  if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
    return {
      code: 'EXTERNAL_SERVICE_ERROR',
      statusCode: 503,
      message: 'External service unavailable',
    };
  }

  // Generic fallback
  return {
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    message: error?.message || 'An unexpected error occurred',
  };
}

/**
 * Get user-friendly error message from error object
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return getErrorMessage(error.error);
  return 'An unexpected error occurred';
}

// ============================================================================
// Logging Functions
// ============================================================================

/**
 * Log API request
 */
export function logApiRequest(
  method: string,
  route: string,
  context?: {
    userId?: string;
    headers?: Record<string, string>;
    body?: any;
  }
) {
  const log = {
    level: 'INFO' as LogLevel,
    timestamp: new Date().toISOString(),
    type: 'API_REQUEST',
    method,
    route,
    userId: context?.userId,
    // Don't log sensitive headers
    headers: sanitizeHeaders(context?.headers),
    // Don't log sensitive body data
    body: sanitizeBody(context?.body),
  };

}

/**
 * Log API error
 */
export function logApiError(
  error: any,
  context?: {
    context?: string;
    route?: string;
    method?: string;
    userId?: string;
  }
) {
  const level = determineLogLevel(error);
  
  const log = {
    level,
    timestamp: new Date().toISOString(),
    type: 'API_ERROR',
    context: context?.context,
    route: context?.route,
    method: context?.method,
    userId: context?.userId,
    error: {
      message: getErrorMessage(error),
      name: error?.name,
      code: error?.code,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    },
  };

  if (level === 'CRITICAL' || level === 'ERROR') {
    console.error(JSON.stringify(log));
  } else {
    console.warn(JSON.stringify(log));
  }
}

/**
 * Determine log level based on error severity
 */
function determineLogLevel(error: any): LogLevel {
  // Critical errors that require immediate attention
  if (error?.code === 'ECONNREFUSED' || error?.message?.includes('CRITICAL')) {
    return 'CRITICAL';
  }

  // Server errors
  if (error?.code?.startsWith('P') || error?.statusCode >= 500) {
    return 'ERROR';
  }

  // Client errors (validation, auth, etc.)
  if (error?.statusCode >= 400 && error?.statusCode < 500) {
    return 'WARN';
  }

  // Default to ERROR for unknown errors
  return 'ERROR';
}

/**
 * Sanitize headers by removing sensitive data
 */
function sanitizeHeaders(headers?: Record<string, string>): Record<string, string> | undefined {
  if (!headers) return undefined;

  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize body by removing sensitive data
 */
function sanitizeBody(body?: any): any {
  if (!body) return undefined;
  if (typeof body !== 'object') return body;

  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
  const sanitized: any = Array.isArray(body) ? [] : {};

  for (const [key, value] of Object.entries(body)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate request authentication
 * Returns session if authenticated, throws error otherwise
 */
export async function validateAuth(req?: Request): Promise<any> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error('Authentication required');
  }

  return session;
}

/**
 * Validate admin permissions
 */
export async function validateAdmin(req?: Request): Promise<any> {
  const session = await validateAuth(req);

  if (session.user.role !== 'ADMIN') {
    const error: any = new Error('Admin permission required');
    error.statusCode = 403;
    throw error;
  }

  return session;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse request body safely
 */
export async function parseRequestBody(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Extract query parameters from request URL
 */
export function getQueryParams(req: Request): URLSearchParams {
  const url = new URL(req.url);
  return url.searchParams;
}

/**
 * Create paginated response metadata
 */
export function createPaginationMeta(
  totalCount: number,
  page: number,
  limit: number
) {
  return {
    count: totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

// ============================================================================
// API Error Class
// ============================================================================

/**
 * Custom API Error class for throwing specific HTTP errors
 */
export class ApiError extends Error {
  statusCode: number;
  code?: ErrorCode;

  constructor(message: string, statusCode: number = 500, code?: ErrorCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// ============================================================================
// Enhanced Wrapper Functions
// ============================================================================

/**
 * Enhanced success response with message support
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode?: number
): NextResponse {
  const requestId = randomUUID();
  
  const response: any = {
    success: true,
    data,
    message: message || 'Success',
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
  
  return NextResponse.json(response, { status: statusCode || 200 });
}

/**
 * Enhanced error response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  details?: any
): NextResponse {
  const requestId = randomUUID();
  const code = getErrorCodeFromStatus(statusCode);
  
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    },
    { status: statusCode }
  );
}

/**
 * Map status code to error code
 */
function getErrorCodeFromStatus(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 400: return 'VALIDATION_ERROR';
    case 401: return 'AUTH_REQUIRED';
    case 403: return 'PERMISSION_DENIED';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 500:
    default: return 'INTERNAL_ERROR';
  }
}

/**
 * Enhanced logging with detailed parameters
 */
export function logApiCall(
  method: string,
  route: string,
  statusCode: number,
  duration: number,
  userId?: string,
  errorMessage?: string
): void {
  const log = {
    level: (statusCode >= 400 ? 'ERROR' : 'INFO') as LogLevel,
    timestamp: new Date().toISOString(),
    method,
    route,
    statusCode,
    duration: `${duration}ms`,
    userId,
    errorMessage,
  };

  // Format log message
  const logMessage = errorMessage
    ? `[${log.level}] ${method} ${route} - ${statusCode} (${duration}ms) - ${errorMessage}`
    : `[${log.level}] ${method} ${route} - ${statusCode} (${duration}ms)`;

  // Log to console
  if (log.level === 'ERROR') {
    console.error(logMessage, log);
  } else {
  }
}

// ============================================================================
// Security Middleware
// ============================================================================

/**
 * Apply CSRF protection to a request
 * Automatically skips GET, HEAD, OPTIONS requests
 */
export async function applyCsrfProtection(request: Request): Promise<void> {
  await csrf.verify(request as any);
}

/**
 * Apply rate limiting to a request
 */
export async function applyRateLimit(request: Request): Promise<void> {
  await rateLimit(request as any);
}

/**
 * Apply strict rate limiting to a request (for sensitive endpoints)
 */
export async function applyStrictRateLimit(request: Request): Promise<void> {
  await strictRateLimit(request as any);
}

/**
 * Comprehensive security middleware for API routes
 * Applies CSRF protection and rate limiting
 * 
 * @param request - The incoming request
 * @param options - Security options
 * @returns The authenticated session
 * 
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const session = await withSecurity(request);
 *   // Your route handler logic
 * }
 * ```
 */
export async function withSecurity(
  request: Request,
  options: {
    skipCsrf?: boolean;
    skipRateLimit?: boolean;
    strictRateLimit?: boolean;
    requireAuth?: boolean;
    requireAdmin?: boolean;
  } = {}
): Promise<any> {
  const {
    skipCsrf = false,
    skipRateLimit = false,
    strictRateLimit: useStrictRateLimit = false,
    requireAuth = true,
    requireAdmin = false,
  } = options;

  try {
    // Apply rate limiting first (to prevent abuse before processing)
    if (!skipRateLimit) {
      if (useStrictRateLimit) {
        await applyStrictRateLimit(request);
      } else {
        await applyRateLimit(request);
      }
    }

    // Apply CSRF protection for state-changing methods
    if (!skipCsrf) {
      await applyCsrfProtection(request);
    }

    // Validate authentication if required
    if (requireAuth) {
      const session = requireAdmin 
        ? await validateAdmin(request)
        : await validateAuth(request);
      return session;
    }

    return null;
  } catch (error) {
    // Re-throw security errors
    throw error;
  }
}

// ============================================================================
// Export Aliases for Convenience
// ============================================================================

export const validateAdminAuth = validateAdmin;
export const validateAuthentication = validateAuth;
export const validateAdminRole = validateAdmin;
