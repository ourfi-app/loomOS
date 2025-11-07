/**
 * CSRF Protection Middleware
 * 
 * Implements Cross-Site Request Forgery protection for API routes.
 * Uses double-submit cookie pattern with cryptographically secure tokens.
 * 
 * Usage:
 * ```typescript
 * import { csrf } from '@/lib/csrf-protection';
 * 
 * export async function POST(request: NextRequest) {
 *   await csrf.verify(request);
 *   // Your route handler logic
 * }
 * ```
 */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { HTTP_STATUS } from './constants';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Verify CSRF token from request
 * @throws {Error} If CSRF token is missing or invalid
 */
export async function verifyCsrfToken(request: NextRequest): Promise<void> {
  // Skip CSRF check for GET, HEAD, OPTIONS requests (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return;
  }

  const cookieStore = cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    throw new Error('CSRF token missing');
  }

  // Use constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) {
    throw new Error('CSRF token mismatch');
  }
}

/**
 * Set CSRF token cookie
 */
export function setCsrfCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRY / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Get or create CSRF token
 */
export function getCsrfToken(): string {
  const cookieStore = cookies();
  let token = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!token) {
    token = generateCsrfToken();
    setCsrfCookie(token);
  }

  return token;
}

/**
 * CSRF protection middleware
 */
export const csrf = {
  /**
   * Verify CSRF token from request
   */
  verify: async (request: NextRequest): Promise<void> => {
    try {
      await verifyCsrfToken(request);
    } catch (error) {
      throw new Response(
        JSON.stringify({ 
          error: 'CSRF validation failed',
          message: error instanceof Error ? error.message : 'Invalid CSRF token'
        }),
        { 
          status: HTTP_STATUS.FORBIDDEN,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },

  /**
   * Generate and return a new CSRF token
   */
  generate: (): string => {
    return getCsrfToken();
  },

  /**
   * Set CSRF token cookie
   */
  setCookie: (token: string): void => {
    setCsrfCookie(token);
  },
};

/**
 * Helper function to include CSRF token in API responses
 */
export function includeCsrfToken<T extends Record<string, any>>(data: T): T & { csrfToken: string } {
  return {
    ...data,
    csrfToken: getCsrfToken(),
  };
}
