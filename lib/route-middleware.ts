/**
 * Route Middleware Helpers
 * Provides easy-to-use wrappers for common route patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, validateAdmin, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { z } from 'zod';

export type RouteHandler<T = any> = (
  req: NextRequest,
  context: { params?: any; session?: any }
) => Promise<NextResponse<T>>;

/**
 * Wrap a route handler with authentication
 */
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: any) => {
    try {
      const session = await validateAuth(req);
      return await handler(req, { ...context, session });
    } catch (error) {
      console.error('[Auth Error]:', error);
      if (error instanceof Error) {
        return createErrorResponse(error.message, 401, 'AUTH_REQUIRED');
      }
      return createErrorResponse('Authentication required', 401, 'AUTH_REQUIRED');
    }
  };
}

/**
 * Wrap a route handler with admin authentication
 */
export function withAdmin(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: any) => {
    try {
      const session = await validateAdmin(req);
      return await handler(req, { ...context, session });
    } catch (error) {
      console.error('[Admin Auth Error]:', error);
      if (error instanceof Error) {
        return createErrorResponse(error.message, 403, 'PERMISSION_DENIED');
      }
      return createErrorResponse('Admin access required', 403, 'PERMISSION_DENIED');
    }
  };
}

/**
 * Wrap a route handler with input validation
 */
export function withValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, context: { params?: any; session?: any; body: z.infer<T> }) => Promise<NextResponse>
): RouteHandler {
  return async (req: NextRequest, context: any) => {
    try {
      const body = await req.json();
      const validatedBody = schema.parse(body);
      return await handler(req, { ...context, body: validatedBody });
    } catch (error) {
      console.error('[Validation Error]:', error);
      if (error instanceof z.ZodError) {
        return createErrorResponse(
          'Validation failed: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          400,
          'VALIDATION_ERROR',
          error.errors
        );
      }
      if (error instanceof Error) {
        return createErrorResponse(error.message, 400, 'VALIDATION_ERROR');
      }
      return createErrorResponse('Invalid request body', 400, 'VALIDATION_ERROR');
    }
  };
}

/**
 * Wrap a route handler with error handling
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('[Route Error]:', error);
      
      if (error instanceof z.ZodError) {
        return createErrorResponse(
          'Validation failed: ' + error.errors.map(e => e.message).join(', '),
          400,
          'VALIDATION_ERROR',
          error.errors
        );
      }
      
      if (error instanceof Error) {
        // Don't expose internal error messages in production
        const message = process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message;
        return createErrorResponse(message, 500, 'INTERNAL_ERROR');
      }
      
      return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
    }
  };
}

/**
 * Compose multiple middleware functions
 */
export function compose(...middlewares: ((handler: RouteHandler) => RouteHandler)[]): (handler: RouteHandler) => RouteHandler {
  return (handler: RouteHandler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

/**
 * Common middleware combinations
 */
export const withAuthAndErrors = compose(withErrorHandling, withAuth);
export const withAdminAndErrors = compose(withErrorHandling, withAdmin);

/**
 * Full middleware stack with auth, validation, and error handling
 */
export function withFullStack<T extends z.ZodSchema>(schema: T) {
  return compose(withErrorHandling, withAuth, withValidation(schema));
}

/**
 * Admin middleware stack with validation and error handling
 */
export function withAdminStack<T extends z.ZodSchema>(schema: T) {
  return compose(withErrorHandling, withAdmin, withValidation(schema));
}
