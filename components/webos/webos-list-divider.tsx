
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface WebOSListDividerProps {
  children: React.ReactNode;
  sticky?: boolean;
  variant?: 'light' | 'dark';
  count?: number;
  className?: string;
}

/**
 * WebOS List Divider
 * 
 * Separator for list sections with text labels, matching WebOS design patterns.
 * Reference: list-items-scrolling.png
 * 
 * @example
 * <WebOSListDivider>Today</WebOSListDivider>
 * <WebOSListDivider sticky>Inbox (5)</WebOSListDivider>
 * <WebOSListDivider variant="dark">Archived</WebOSListDivider>
 */
export function WebOSListDivider({
  children,
  sticky = false,
  variant = 'light',
  count,
  className
}: WebOSListDividerProps) {
  return (
    <div
      className={cn(
        // Base styles
        'px-4 py-2 text-xs font-semibold tracking-wide uppercase',
        'border-b transition-colors',
        
        // Sticky positioning
        sticky && 'sticky top-0 z-10',
        
        // Variant styles
        variant === 'light' && [
          'bg-neutral-100 dark:bg-neutral-800',
          'text-neutral-600 dark:text-neutral-400',
          'border-neutral-200 dark:border-neutral-700'
        ],
        variant === 'dark' && [
          'bg-neutral-200 dark:bg-neutral-900',
          'text-neutral-700 dark:text-neutral-300',
          'border-neutral-300 dark:border-neutral-600'
        ],
        
        className
      )}
      role="separator"
      aria-label={typeof children === 'string' ? children : undefined}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {count !== undefined && (
          <span className={cn(
            'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
            'bg-neutral-200 dark:bg-neutral-700',
            'text-neutral-700 dark:text-neutral-300'
          )}>
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

WebOSListDivider.displayName = 'WebOSListDivider';
