
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoomOSGroupBoxProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * LoomOS Group Box
 * 
 * Container for related form fields or list items with optional title and description.
 * Reference: list-items-group-boxes.png, forms-setting-values-3.png
 * 
 * @example
 * <LoomOSGroupBox title="Email Address">
 *   <LoomOSTextField placeholder="user@example.com" />
 * </LoomOSGroupBox>
 * 
 * <LoomOSGroupBox 
 *   title="Network Settings"
 *   description="Configure your connection"
 *   variant="dark"
 * >
 *   {children}
 * </LoomOSGroupBox>
 */
export function LoomOSGroupBox({
  title,
  description,
  children,
  variant = 'light',
  className,
  titleClassName,
  descriptionClassName
}: LoomOSGroupBoxProps) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg border p-4 mb-4 transition-colors',
        
        // Variant styles
        variant === 'light' && [
          'bg-white dark:bg-neutral-900',
          'border-neutral-200 dark:border-neutral-700'
        ],
        variant === 'dark' && [
          'bg-neutral-50 dark:bg-neutral-800',
          'border-neutral-300 dark:border-neutral-600'
        ],
        
        className
      )}
      role="group"
      aria-label={title}
    >
      {title && (
        <div className="mb-3">
          <h3 className={cn(
            'text-sm font-semibold text-neutral-900 dark:text-neutral-100',
            titleClassName
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              'mt-1 text-xs text-neutral-600 dark:text-neutral-400',
              descriptionClassName
            )}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

LoomOSGroupBox.displayName = 'LoomOSGroupBox';
