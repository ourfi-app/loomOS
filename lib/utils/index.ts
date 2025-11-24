
/**
 * Centralized Utility Functions
 * 
 * This module exports all utility functions from the utils directory.
 * Import from this file to access any utility function.
 * 
 * @example
 * import { formatDate, isValidEmail, cn } from '@/lib/utils';
 */

// Re-export the cn utility from the main utils file
export { cn, formatDuration } from '../utils';

// Export all formatting utilities
export * from './formatting';

// Export all validation utilities
export * from './validation';

// Export all string utilities
export * from './string';
