
/**
 * Centralized Formatting Utilities
 * 
 * Consolidates all formatting functions across the codebase:
 * - Date and time formatting
 * - Currency formatting
 * - File size formatting
 * - Number formatting
 */

import { format, formatDistanceToNow } from 'date-fns';

// ==================== Date & Time Formatting ====================

/**
 * Format a date to a human-readable string
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a time to a human-readable string
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: 'h:mm a')
 */
export function formatTime(date: string | Date, formatStr: string = 'h:mm a'): string {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
}

/**
 * Format a date and time to a human-readable string
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: 'MMM dd, yyyy \'at\' h:mm a')
 */
export function formatDateTime(date: string | Date, formatStr: string = "MMM dd, yyyy 'at' h:mm a"): string {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid datetime';
  }
}

/**
 * Format a date as a relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @param options - Options for formatDistanceToNow
 */
export function formatRelativeTime(date: string | Date, options?: { addSuffix?: boolean }): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, ...options });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}

/**
 * Format a message date intelligently (e.g., "Today at 3:45 PM", "Yesterday at 2:30 PM", "Jan 15")
 */
export function formatMessageDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayInMs = 24 * 60 * 60 * 1000;

    if (diff < dayInMs && now.getDate() === date.getDate()) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (diff < 2 * dayInMs && now.getDate() - date.getDate() === 1) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (diff < 7 * dayInMs) {
      return format(date, 'EEEE \'at\' h:mm a');
    } else {
      return format(date, 'MMM d \'at\' h:mm a');
    }
  } catch (error) {
    console.error('Error formatting message date:', error);
    return 'Invalid date';
  }
}

/**
 * Format duration in seconds to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ==================== Currency Formatting ====================

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format a number as currency with cents
 */
export function formatCurrencyWithCents(amount: number): string {
  return formatCurrency(amount, 'USD', 'en-US');
}

/**
 * Format a number as currency without cents (rounded)
 */
export function formatCurrencyNoCents(amount: number): string {
  return formatCurrency(Math.round(amount), 'USD', 'en-US').replace(/\.00$/, '');
}

// ==================== File Size Formatting ====================

/**
 * Format file size in bytes to human-readable format
 * @param bytes - File size in bytes (number or string)
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatFileSize(bytes: number | string, decimals: number = 2): string {
  const bytesNum = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;

  if (isNaN(bytesNum) || bytesNum === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytesNum) / Math.log(k));

  return `${parseFloat((bytesNum / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// ==================== Number Formatting ====================

/**
 * Format a number with thousands separators
 * @param num - Number to format
 * @param locale - Locale string (default: 'en-US')
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
}

/**
 * Format a number as a percentage
 * @param num - Number to format (0-1 range)
 * @param decimals - Number of decimal places (default: 0)
 */
export function formatPercentage(num: number, decimals: number = 0): string {
  try {
    return `${(num * 100).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0%';
  }
}

/**
 * Format a number with compact notation (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(num: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  } catch (error) {
    console.error('Error formatting compact number:', error);
    return formatNumber(num);
  }
}

// ==================== String Formatting ====================

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to title case
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

/**
 * Format a phone number (US format)
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Format a count with pluralized word (e.g., "3 items")
 */
export function formatCount(count: number, singular: string, plural?: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}
