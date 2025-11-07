/**
 * Application Logger
 *
 * Structured logging utility that replaces console.log/warn/error statements.
 * Provides consistent logging across the application with proper formatting,
 * log levels, and production-ready output.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Failed to fetch data', { error, endpoint: '/api/users' });
 *   logger.debug('Processing request', { requestId });
 *
 * Replace:
 *   console.log() → logger.info() or logger.debug()
 *   console.warn() → logger.warn()
 *   console.error() → logger.error()
 */

import { env } from './env';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log level labels for output
 */
const LOG_LEVEL_LABELS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Color mapping for log levels
 */
const LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: COLORS.dim,
  [LogLevel.INFO]: COLORS.blue,
  [LogLevel.WARN]: COLORS.yellow,
  [LogLevel.ERROR]: COLORS.red,
};

/**
 * Log metadata interface
 */
export interface LogMetadata {
  [key: string]: unknown;
}

/**
 * Determine current log level based on environment
 */
function getCurrentLogLevel(): LogLevel {
  if (env.NODE_ENV === 'production') {
    return LogLevel.INFO; // Hide debug logs in production
  }
  return LogLevel.DEBUG; // Show all logs in development
}

/**
 * Format timestamp for log output
 */
function formatTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format metadata for readable output
 */
function formatMetadata(metadata?: LogMetadata): string {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }

  try {
    // Handle error objects specially
    const formatted = { ...metadata };
    Object.keys(formatted).forEach((key) => {
      if (formatted[key] instanceof Error) {
        const error = formatted[key] as Error;
        formatted[key] = {
          message: error.message,
          stack: error.stack,
          name: error.name,
        };
      }
    });

    return JSON.stringify(formatted, null, env.NODE_ENV === 'development' ? 2 : 0);
  } catch (error) {
    return '[Unable to stringify metadata]';
  }
}

/**
 * Core logging function
 */
function log(
  level: LogLevel,
  message: string,
  metadata?: LogMetadata,
  error?: Error
): void {
  // Skip if log level is below current threshold
  if (level < getCurrentLogLevel()) {
    return;
  }

  const timestamp = formatTimestamp();
  const levelLabel = LOG_LEVEL_LABELS[level];
  const color = LEVEL_COLORS[level];

  if (env.NODE_ENV === 'development') {
    // Pretty formatted output for development
    const prefix = `${color}[${levelLabel}]${COLORS.reset}`;
    const time = `${COLORS.dim}${timestamp}${COLORS.reset}`;

    console.log(`${prefix} ${time} ${message}`);

    if (metadata && Object.keys(metadata).length > 0) {
      console.log(`${COLORS.cyan}Metadata:${COLORS.reset}`, metadata);
    }

    if (error) {
      console.log(`${COLORS.red}Error:${COLORS.reset}`, error);
      if (error.stack) {
        console.log(`${COLORS.dim}${error.stack}${COLORS.reset}`);
      }
    }
  } else {
    // JSON output for production (easier for log aggregation services)
    const logEntry = {
      timestamp,
      level: levelLabel,
      message,
      ...(metadata && { metadata }),
      ...(error && {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      }),
    };

    // Use appropriate console method
    const consoleMethod = level === LogLevel.ERROR ? console.error :
                         level === LogLevel.WARN ? console.warn :
                         console.log;

    consoleMethod(JSON.stringify(logEntry));
  }
}

/**
 * Logger class with fluent API
 */
class Logger {
  /**
   * Debug level logging
   * Use for detailed diagnostic information
   */
  debug(message: string, metadata?: LogMetadata): void {
    log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Info level logging
   * Use for general informational messages
   */
  info(message: string, metadata?: LogMetadata): void {
    log(LogLevel.INFO, message, metadata);
  }

  /**
   * Warning level logging
   * Use for potentially harmful situations
   */
  warn(message: string, metadata?: LogMetadata): void {
    log(LogLevel.WARN, message, metadata);
  }

  /**
   * Error level logging
   * Use for error events
   */
  error(message: string, errorOrMetadata?: Error | LogMetadata, metadata?: LogMetadata): void {
    if (errorOrMetadata instanceof Error) {
      log(LogLevel.ERROR, message, metadata, errorOrMetadata);
    } else {
      log(LogLevel.ERROR, message, errorOrMetadata);
    }
  }

  /**
   * Create a child logger with default metadata
   * Useful for adding context to all logs in a module
   */
  child(defaultMetadata: LogMetadata): Logger {
    const childLogger = new Logger();

    // Override methods to include default metadata
    const originalMethods = {
      debug: childLogger.debug.bind(childLogger),
      info: childLogger.info.bind(childLogger),
      warn: childLogger.warn.bind(childLogger),
      error: childLogger.error.bind(childLogger),
    };

    childLogger.debug = (message: string, metadata?: LogMetadata) => {
      originalMethods.debug(message, { ...defaultMetadata, ...metadata });
    };

    childLogger.info = (message: string, metadata?: LogMetadata) => {
      originalMethods.info(message, { ...defaultMetadata, ...metadata });
    };

    childLogger.warn = (message: string, metadata?: LogMetadata) => {
      originalMethods.warn(message, { ...defaultMetadata, ...metadata });
    };

    childLogger.error = (message: string, errorOrMetadata?: Error | LogMetadata, metadata?: LogMetadata) => {
      if (errorOrMetadata instanceof Error) {
        originalMethods.error(message, errorOrMetadata, { ...defaultMetadata, ...metadata });
      } else {
        originalMethods.error(message, { ...defaultMetadata, ...errorOrMetadata });
      }
    };

    return childLogger;
  }

  /**
   * Time a function execution
   */
  time<T>(label: string, fn: () => T): T {
    const start = Date.now();
    try {
      const result = fn();
      const duration = Date.now() - start;
      this.debug(`${label} completed`, { duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${label} failed`, error as Error, { duration: `${duration}ms` });
      throw error;
    }
  }

  /**
   * Time an async function execution
   */
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.debug(`${label} completed`, { duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${label} failed`, error as Error, { duration: `${duration}ms` });
      throw error;
    }
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create domain-specific loggers with default context
 *
 * Examples:
 *   const authLogger = createLogger({ domain: 'auth' });
 *   const apiLogger = createLogger({ domain: 'api', version: 'v1' });
 */
export function createLogger(defaultMetadata: LogMetadata): Logger {
  return logger.child(defaultMetadata);
}

/**
 * Export for backward compatibility with existing error-logger
 */
export { logError, logWarning, logInfo } from './error-logger';
