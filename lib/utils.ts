import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class name handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format duration in seconds to HH:MM:SS
 * @deprecated Use formatDuration from '@/lib/utils/formatting' instead
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Re-export centralized utilities for convenience
// Users can import from '@/lib/utils' or '@/lib/utils/[category]'
export * from './utils/formatting';
export * from './utils/validation';
export * from './utils/string';