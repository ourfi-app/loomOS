/**
 * Rate Limiting Middleware
 * 
 * Implements rate limiting for API routes using in-memory storage.
 * For production, consider using Redis for distributed rate limiting.
 * 
 * Usage:
 * ```typescript
 * import { rateLimit } from '@/lib/rate-limit';
 * 
 * export async function POST(request: NextRequest) {
 *   await rateLimit(request);
 *   // Your route handler logic
 * }
 * 
 * // For strict rate limiting (e.g., auth endpoints)
 * export async function POST(request: NextRequest) {
 *   await rateLimit(request, { windowMs: 60000, max: 5 });
 *   // Your route handler logic
 * }
 * ```
 */

import { NextRequest } from 'next/server';
import { HTTP_STATUS, SECURITY } from './constants';

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// For production, use Redis or another distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default key generator - uses IP address and user agent
 */
function defaultKeyGenerator(request: NextRequest): string {
  const ip = request.ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Rate limit middleware
 * @param request - Next.js request object
 * @param options - Rate limit options
 * @throws {Response} If rate limit is exceeded
 */
export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): Promise<void> {
  const {
    windowMs = SECURITY.RATE_LIMIT_WINDOW_MS,
    max = SECURITY.RATE_LIMIT_MAX_REQUESTS,
    keyGenerator = defaultKeyGenerator,
  } = options;

  const key = keyGenerator(request);
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);
    return;
  }

  if (entry.count >= max) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    
    throw new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      }),
      {
        status: HTTP_STATUS.TOO_MANY_REQUESTS,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
}

/**
 * Strict rate limiter for sensitive endpoints (auth, password reset, etc.)
 */
export async function strictRateLimit(request: NextRequest): Promise<void> {
  return rateLimit(request, {
    windowMs: SECURITY.RATE_LIMIT_STRICT_WINDOW_MS,
    max: SECURITY.RATE_LIMIT_STRICT_MAX_REQUESTS,
  });
}

/**
 * Rate limiter that uses user ID instead of IP
 * Useful for authenticated endpoints
 */
export function createUserRateLimit(userId: string) {
  return (request: NextRequest) => rateLimit(request, {
    keyGenerator: () => `user-${userId}`,
  });
}

/**
 * Rate limiter for API endpoints grouped by path
 */
export function createPathRateLimit(options: RateLimitOptions = {}) {
  return (request: NextRequest) => rateLimit(request, {
    ...options,
    keyGenerator: (req) => {
      const ip = defaultKeyGenerator(req);
      const path = new URL(req.url).pathname;
      return `${ip}-${path}`;
    },
  });
}

/**
 * Get current rate limit status for a request
 */
export function getRateLimitStatus(
  request: NextRequest,
  options: RateLimitOptions = {}
): {
  limit: number;
  remaining: number;
  reset: number;
} {
  const {
    max = SECURITY.RATE_LIMIT_MAX_REQUESTS,
    keyGenerator = defaultKeyGenerator,
  } = options;

  const key = keyGenerator(request);
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < Date.now()) {
    return {
      limit: max,
      remaining: max,
      reset: Date.now() + (options.windowMs || SECURITY.RATE_LIMIT_WINDOW_MS),
    };
  }

  return {
    limit: max,
    remaining: Math.max(0, max - entry.count),
    reset: entry.resetTime,
  };
}
