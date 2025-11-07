/**
 * Application Constants
 * 
 * Centralized constants for the application to avoid magic numbers and strings.
 * Use these constants throughout the codebase for consistency and maintainability.
 */

// ============================================================
// SECURITY CONSTANTS
// ============================================================

export const SECURITY = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  PASSWORD_ERROR_MESSAGE: 'Password must contain uppercase, lowercase, number, and special character',
  
  // Bcrypt configuration
  BCRYPT_ROUNDS: 12,
  
  // Session configuration
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  JWT_ALGORITHM: 'HS256' as const,
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  RATE_LIMIT_STRICT_WINDOW_MS: 1 * 60 * 1000, // 1 minute for sensitive endpoints
  RATE_LIMIT_STRICT_MAX_REQUESTS: 5,
} as const;

// ============================================================
// FILE UPLOAD CONSTANTS
// ============================================================

export const FILE_UPLOAD = {
  // File size limits (in bytes)
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_MB: 10,
  
  // Allowed MIME types
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  
  // Allowed file extensions
  ALLOWED_EXTENSIONS: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.txt',
    '.csv',
  ],
  
  // Image specific
  IMAGE_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
} as const;

// ============================================================
// PAGINATION CONSTANTS
// ============================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 10,
} as const;

// ============================================================
// API CONSTANTS
// ============================================================

export const API = {
  // Timeout settings
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  UPLOAD_TIMEOUT: 60000, // 60 seconds for uploads
  
  // Cache TTL
  CACHE_TTL_SHORT: 5 * 60, // 5 minutes
  CACHE_TTL_MEDIUM: 30 * 60, // 30 minutes
  CACHE_TTL_LONG: 60 * 60, // 1 hour
  
  // Response messages
  UNAUTHORIZED_MESSAGE: 'Unauthorized - Authentication required',
  FORBIDDEN_MESSAGE: 'Forbidden - Insufficient permissions',
  NOT_FOUND_MESSAGE: 'Resource not found',
  VALIDATION_ERROR_MESSAGE: 'Validation error',
  INTERNAL_ERROR_MESSAGE: 'Internal server error',
} as const;

// ============================================================
// DATE/TIME CONSTANTS
// ============================================================

export const DATE_TIME = {
  // Time periods in milliseconds
  ONE_SECOND: 1000,
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  
  // Format strings
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIME_FORMAT: 'HH:mm:ss',
} as const;

// ============================================================
// VALIDATION CONSTANTS
// ============================================================

export const VALIDATION = {
  // String length limits
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  UNIT_NUMBER_MAX_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 500,
  BIO_MAX_LENGTH: 1000,
  MESSAGE_MAX_LENGTH: 5000,
  
  // Numeric limits
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  
  // Email regex
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ============================================================
// PERFORMANCE CONSTANTS
// ============================================================

export const PERFORMANCE = {
  // Debounce/throttle delays
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  
  // Batch sizes
  BATCH_SIZE: 50,
  MAX_BATCH_SIZE: 100,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RETRY_BACKOFF_MULTIPLIER: 2,
} as const;

// ============================================================
// HTTP STATUS CODES
// ============================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================
// FEATURE FLAGS
// ============================================================

export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_REPORTING: true,
  ENABLE_CACHING: true,
} as const;
