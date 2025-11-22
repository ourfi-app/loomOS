
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * WebOS Section Header Component
 * 
 * A consistent section header following WebOS design principles.
 * Features:
 * - Uppercase, tracked typography
 * - Tertiary text color
 * - Optional divider
 * - Optional action button
 * 
 * @example
 * <SectionHeader>Settings</SectionHeader>
 * <SectionHeader divider>Account Information</SectionHeader>
 */

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Show bottom divider */
  divider?: boolean;
  /** Action button or element */
  action?: React.ReactNode;
  /** Subtitle text */
  subtitle?: string;
}

export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  SectionHeaderProps
>(
  (
    { className, divider = false, action, subtitle, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between',
          divider && 'border-b pb-3',
          className
        )}
        style={{
          borderColor: divider ? 'var(--border-light)' : undefined,
        }}
        {...props}
      >
        <div className="flex flex-col gap-1">
          <h3
            className="text-xs font-light tracking-wider uppercase"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {children}
          </h3>
          {subtitle && (
            <p
              className="text-sm font-light normal-case"
              style={{ color: 'var(--text-secondary)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
