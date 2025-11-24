
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

/**
 * @deprecated This button component is deprecated. Please use @/components/ui/button instead.
 * 
 * Migration Guide:
 * - Replace: import { WebOSButton } from '@/components/webos/shared/webos-button'
 * - With: import { Button } from '@/components/ui/button'
 * 
 * Variant Mapping:
 * - 'dark' → variant="dark"
 * - 'light' → variant="light"
 * - 'glass' → variant="glass"
 * - 'outline' → variant="outline"
 * - 'ghost' → variant="ghost"
 * 
 * All features (loading, icons) are supported in the unified component.
 * This file will be removed in a future release.
 * 
 * WebOS Button Component
 * 
 * A button component following WebOS design principles.
 * Features:
 * - WebOS-styled variants (glass, dark, light, outline)
 * - Smooth animations and transitions
 * - Loading states
 * - Icon support
 * - Dark mode support
 * 
 * @example
 * <WebOSButton variant="dark">Click me</WebOSButton>
 * <WebOSButton variant="glass" loading>Loading...</WebOSButton>
 */

export interface WebOSButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'dark' | 'light' | 'glass' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  /** Show loading state */
  loading?: boolean;
  /** Render as child component */
  asChild?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Icon to display after text */
  iconRight?: React.ReactNode;
}

const variantStyles = {
  dark: {
    className:
      'bg-chrome-darkest text-white hover:opacity-90 shadow-sm border border-transparent',
    style: {
      backgroundColor: 'var(--chrome-darkest)',
      color: 'var(--text-inverse)',
    },
  },
  light: {
    className:
      'bg-white text-text-primary hover:bg-neutral-50 shadow-sm border border-border-light',
    style: {
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-light)',
    },
  },
  glass: {
    className:
      'backdrop-blur-lg hover:backdrop-blur-xl shadow-md border hover:shadow-lg',
    style: {
      backgroundColor: 'var(--glass-white-80)',
      borderColor: 'var(--glass-border-light)',
      color: 'var(--text-primary)',
    },
  },
  outline: {
    className:
      'bg-transparent border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800',
    style: {
      borderColor: 'var(--border-medium)',
      color: 'var(--text-primary)',
    },
  },
  ghost: {
    className:
      'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 border-transparent',
    style: {
      color: 'var(--text-primary)',
    },
  },
};

const sizeStyles = {
  sm: 'h-9 px-3 py-1.5 text-xs',
  md: 'h-11 px-5 py-3 text-sm',
  lg: 'h-12 px-6 py-4 text-base',
  icon: 'h-10 w-10 p-0',
};

export const WebOSButton = React.forwardRef<
  HTMLButtonElement,
  WebOSButtonProps
>(
  (
    {
      className,
      variant = 'dark',
      size = 'md',
      loading = false,
      asChild = false,
      icon,
      iconRight,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    // Deprecation warning
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[DEPRECATED] components/webos/shared/webos-button is deprecated. ' +
        'Please use @/components/ui/button instead. ' +
        'All webOS variants (glass, dark, light) are supported.'
      );
    }
    
    const Comp = asChild ? Slot : 'button';
    const variantStyle = variantStyles[variant];

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-xl font-light tracking-wide',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-95',
          variantStyle.className,
          sizeStyles[size],
          className
        )}
        style={{ ...variantStyle.style, ...style }}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && <span className="inline-flex">{icon}</span>}
        {children}
        {!loading && iconRight && (
          <span className="inline-flex">{iconRight}</span>
        )}
      </Comp>
    );
  }
);

WebOSButton.displayName = 'WebOSButton';
