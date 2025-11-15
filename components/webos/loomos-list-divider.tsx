
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoomOSListDividerProps {
  children: React.ReactNode;
  sticky?: boolean;
  variant?: 'light' | 'dark';
  count?: number;
  className?: string;
}

/**
 * LoomOS List Divider
 * 
 * Separator for list sections with text labels, matching LoomOS design patterns.
 * Reference: list-items-scrolling.png
 * 
 * @example
 * <LoomOSListDivider>Today</LoomOSListDivider>
 * <LoomOSListDivider sticky>Inbox (5)</LoomOSListDivider>
 * <LoomOSListDivider variant="dark">Archived</LoomOSListDivider>
 */
export function LoomOSListDivider({
  children,
  sticky = false,
  variant = 'light',
  count,
  className
}: LoomOSListDividerProps) {
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
          'bg-[var(--semantic-surface-hover)] dark:bg-neutral-800',
          'text-[var(--semantic-text-secondary)] dark:text-neutral-400',
          'border-[var(--semantic-border-light)] dark:border-neutral-700'
        ],
        variant === 'dark' && [
          'bg-[var(--semantic-bg-muted)] dark:bg-neutral-900',
          'text-[var(--semantic-text-secondary)] dark:text-neutral-300',
          'border-[var(--semantic-border-medium)] dark:border-neutral-600'
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
            'bg-[var(--semantic-bg-muted)] dark:bg-neutral-700',
            'text-[var(--semantic-text-secondary)] dark:text-neutral-300'
          )}>
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

LoomOSListDivider.displayName = 'LoomOSListDivider';
