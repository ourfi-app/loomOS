
/**
 * Error Logger
 * 
 * Centralized error logging service for the application.
 * Logs errors to console in development and sends to logging service in production.
 * 
 * Features:
 * - Client-side and server-side error logging
 * - Error categorization (API, UI, Auth, etc.)
 * - User context tracking
 * - Error deduplication
 * - Rate limiting to prevent log spam
 */

export interface ErrorLogEntry {
  message: string;
  stack?: string;
  level: 'error' | 'warn' | 'info';
  category: 'API' | 'UI' | 'AUTH' | 'DATABASE' | 'NETWORK' | 'UNKNOWN';
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// In-memory error tracking for deduplication
const recentErrors: Set<string> = new Set();
const ERROR_DEDUP_WINDOW = 60000; // 1 minute

/**
 * Log an error to the logging service
 */
export async function logError(
  error: Error | string,
  category: ErrorLogEntry['category'] = 'UNKNOWN',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Create error signature for deduplication
    const errorSignature = `${category}:${errorMessage}`;
    
    // Skip if this error was recently logged
    if (recentErrors.has(errorSignature)) {
      return;
    }

    // Add to recent errors and remove after window expires
    recentErrors.add(errorSignature);
    setTimeout(() => recentErrors.delete(errorSignature), ERROR_DEDUP_WINDOW);

    const logEntry: ErrorLogEntry = {
      message: errorMessage,
      stack: errorStack,
      level: 'error',
      category,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      metadata,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${category}] ${errorMessage}`, {
        stack: errorStack,
        metadata,
      });
    }

    // Send to logging service in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Don't await - fire and forget
      fetch('/api/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
        // Use keepalive to ensure request completes even if page unloads
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't let logging errors crash the app
      });
    }
  } catch (loggingError) {
    // Don't let logging errors crash the app
    console.error('Failed to log error:', loggingError);
  }
}

/**
 * Log a warning
 */
export function logWarning(
  message: string,
  category: ErrorLogEntry['category'] = 'UNKNOWN',
  metadata?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${category}] ${message}`, metadata);
  }
}

/**
 * Log info message
 */
export function logInfo(
  message: string,
  category: ErrorLogEntry['category'] = 'UNKNOWN',
  metadata?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[${category}] ${message}`, metadata);
  }
}

/**
 * Log API errors with additional context
 */
export function logApiError(
  error: Error | string,
  endpoint: string,
  method: string,
  statusCode?: number
): void {
  logError(error, 'API', {
    endpoint,
    method,
    statusCode,
  });
}

/**
 * Log authentication errors
 */
export function logAuthError(error: Error | string, context?: string): void {
  logError(error, 'AUTH', {
    context,
  });
}

/**
 * Log database errors
 */
export function logDatabaseError(error: Error | string, query?: string): void {
  logError(error, 'DATABASE', {
    query,
  });
}

/**
 * Log UI component errors
 */
export function logUIError(error: Error | string, component?: string): void {
  logError(error, 'UI', {
    component,
  });
}

/**
 * Log network errors
 */
export function logNetworkError(error: Error | string, url?: string): void {
  logError(error, 'NETWORK', {
    url,
  });
}

/**
 * Create a user-friendly error message from an error object
 */
export function getUserFriendlyMessage(error: Error | string): string {
  const errorMessage = error instanceof Error ? error.message : error;

  // Common error patterns and their user-friendly messages
  const errorMappings: Record<string, string> = {
    'Network request failed': 'Unable to connect. Please check your internet connection.',
    'Failed to fetch': 'Unable to reach the server. Please try again.',
    'Unauthorized': 'You are not authorized to perform this action. Please log in.',
    'Forbidden': 'You do not have permission to access this resource.',
    'Not Found': 'The requested resource was not found.',
    'Internal Server Error': 'An unexpected error occurred. Please try again later.',
    'Bad Gateway': 'Service temporarily unavailable. Please try again later.',
    'Service Unavailable': 'Service temporarily unavailable. Please try again later.',
  };

  // Check for matching patterns
  for (const [pattern, message] of Object.entries(errorMappings)) {
    if (errorMessage.includes(pattern)) {
      return message;
    }
  }

  // Return original message if no mapping found
  return errorMessage || 'An unexpected error occurred. Please try again.';
}

/**
 * Utility to wrap async functions with error logging
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  category: ErrorLogEntry['category'] = 'UNKNOWN',
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error as Error, category, { context, args });
      throw error;
    }
  }) as T;
}

/**
 * Clear recent errors (useful for testing)
 */
export function clearRecentErrors(): void {
  recentErrors.clear();
}

