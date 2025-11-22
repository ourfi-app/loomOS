
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * WebOS Loading Spinner Component
 * 
 * A reusable loading spinner following WebOS design principles.
 * Features:
 * - Multiple sizes
 * - Customizable colors
 * - Smooth animation
 * - Dark mode support
 * 
 * @example
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" color="blue" />
 */

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Spinner color */
  color?: 'blue' | 'gray' | 'white' | 'black';
  /** Loading text */
  text?: string;
}

const sizeMap = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const colorMap = {
  blue: 'border-accent-blue border-t-transparent',
  gray: 'border-neutral-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  black: 'border-black border-t-transparent',
};

export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  LoadingSpinnerProps
>(
  (
    { className, size = 'md', color = 'blue', text, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full',
            sizeMap[size],
            colorMap[color]
          )}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p
            className="text-sm font-light"
            style={{ color: 'var(--text-secondary)' }}
          >
            {text}
          </p>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';
