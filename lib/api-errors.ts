/**
 * Standardized API Error Handling
 *
 * Provides consistent error responses across all API routes with:
 * - Standard error codes
 * - User-friendly messages
 * - Detailed error information for debugging
 * - Type-safe error creation
 *
 * Usage:
 *   throw new ApiError(404, 'NOT_FOUND', 'User not found');
 *   throw ApiError.notFound('User not found');
 *   throw ApiError.unauthorized();
 */

import { NextResponse } from 'next/server';

/**
 * Standard error codes used across the API
 */
export enum ErrorCode {
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Custom Business Logic Errors
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
}

/**
 * Error details for additional context
 */
export interface ErrorDetails {
  [key: string]: unknown;
}

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: string; // Error code
  message: string; // User-friendly message
  details?: ErrorDetails; // Additional error information
  statusCode: number; // HTTP status code
  timestamp: string; // ISO timestamp
  path?: string; // Request path (optional)
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode | string;
  public readonly details?: ErrorDetails;
  public readonly isOperational: boolean; // Marks errors that are expected

  constructor(
    statusCode: number,
    code: ErrorCode | string,
    message: string,
    details?: ErrorDetails,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8 engines
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON response
   */
  toResponse(path?: string): NextResponse {
    const response: ApiErrorResponse = {
      error: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: new Date().toISOString(),
    };

    if (this.details) {
      response.details = this.details;
    }

    if (path) {
      response.path = path;
    }

    return NextResponse.json(response, { status: this.statusCode });
  }

  // ============================================================
  // Static factory methods for common errors
  // ============================================================

  /**
   * 400 Bad Request
   */
  static badRequest(message = 'Bad request', details?: ErrorDetails): ApiError {
    return new ApiError(400, ErrorCode.BAD_REQUEST, message, details);
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(message = 'You must be logged in to access this resource'): ApiError {
    return new ApiError(401, ErrorCode.UNAUTHORIZED, message);
  }

  /**
   * 403 Forbidden
   */
  static forbidden(message = 'You do not have permission to access this resource'): ApiError {
    return new ApiError(403, ErrorCode.FORBIDDEN, message);
  }

  /**
   * 404 Not Found
   */
  static notFound(resource = 'Resource', details?: ErrorDetails): ApiError {
    return new ApiError(404, ErrorCode.NOT_FOUND, `${resource} not found`, details);
  }

  /**
   * 409 Conflict
   */
  static conflict(message = 'Resource already exists', details?: ErrorDetails): ApiError {
    return new ApiError(409, ErrorCode.CONFLICT, message, details);
  }

  /**
   * 422 Validation Error
   */
  static validation(message = 'Validation failed', details?: ErrorDetails): ApiError {
    return new ApiError(422, ErrorCode.VALIDATION_ERROR, message, details);
  }

  /**
   * 429 Rate Limit Exceeded
   */
  static rateLimit(message = 'Too many requests. Please try again later.'): ApiError {
    return new ApiError(429, ErrorCode.RATE_LIMIT_EXCEEDED, message);
  }

  /**
   * 500 Internal Server Error
   */
  static internal(
    message = 'An unexpected error occurred. Please try again later.',
    details?: ErrorDetails
  ): ApiError {
    return new ApiError(500, ErrorCode.INTERNAL_SERVER_ERROR, message, details, false);
  }

  /**
   * 503 Service Unavailable
   */
  static serviceUnavailable(
    message = 'Service temporarily unavailable. Please try again later.'
  ): ApiError {
    return new ApiError(503, ErrorCode.SERVICE_UNAVAILABLE, message, undefined, false);
  }

  /**
   * Database Error
   */
  static database(message = 'Database operation failed', details?: ErrorDetails): ApiError {
    return new ApiError(500, ErrorCode.DATABASE_ERROR, message, details, false);
  }

  /**
   * Payment Failed
   */
  static paymentFailed(message = 'Payment processing failed', details?: ErrorDetails): ApiError {
    return new ApiError(402, ErrorCode.PAYMENT_FAILED, message, details);
  }

  /**
   * Insufficient Permissions
   */
  static insufficientPermissions(
    message = 'You do not have sufficient permissions for this action'
  ): ApiError {
    return new ApiError(403, ErrorCode.INSUFFICIENT_PERMISSIONS, message);
  }

  /**
   * Resource Locked
   */
  static resourceLocked(
    message = 'This resource is currently locked and cannot be modified'
  ): ApiError {
    return new ApiError(423, ErrorCode.RESOURCE_LOCKED, message);
  }

  /**
   * Duplicate Entry
   */
  static duplicate(resource = 'Resource', details?: ErrorDetails): ApiError {
    return new ApiError(409, ErrorCode.DUPLICATE_ENTRY, `${resource} already exists`, details);
  }
}

/**
 * Handle errors in API routes
 * Converts known errors to ApiError and unknown errors to 500
 */
export function handleApiError(error: unknown, path?: string): NextResponse {
  // Already an ApiError
  if (error instanceof ApiError) {
    // Log operational errors at info level, non-operational at error level
    if (error.isOperational) {
    } else {
      console.error(`API Error [${error.code}]:`, error.message, error.stack, error.details);
    }
    return error.toResponse(path);
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: Record<string, unknown> };

    // Handle common Prisma errors
    switch (prismaError.code) {
      case 'P2002':
        return ApiError.duplicate('Resource', { constraint: prismaError.meta }).toResponse(path);
      case 'P2025':
        return ApiError.notFound('Resource').toResponse(path);
      case 'P2003':
        return ApiError.badRequest('Invalid reference to related resource').toResponse(path);
      default:
        console.error('Prisma error:', error);
        return ApiError.database('Database operation failed').toResponse(path);
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    console.error('Unhandled error:', error.message, error.stack);
    return ApiError.internal(error.message).toResponse(path);
  }

  // Unknown error type
  console.error('Unknown error type:', error);
  return ApiError.internal().toResponse(path);
}

/**
 * Wrap an async API handler with automatic error handling
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  path?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, path);
    }
  }) as T;
}
