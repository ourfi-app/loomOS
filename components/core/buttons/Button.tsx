'use client';

import React, { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * @deprecated This button component is deprecated. Please use @/components/ui/button instead.
 * 
 * Migration Guide:
 * - Replace: import { Button } from '@/components/core/buttons/Button'
 * - With: import { Button } from '@/components/ui/button'
 * 
 * Variant Mapping:
 * - 'primary' → 'primary'
 * - 'secondary' → 'secondary'
 * - 'ghost' → 'ghost'
 * - 'icon' → size="icon"
 * - 'navigation' → variant="navigation"
 * 
 * This file will be removed in a future release.
 * 
 * Button Component - webOS Design System
 * 
 * Button component using the webOS design system tokens:
 * - Primary: Dark (neutral-900) with white text
 * - Secondary: Light neutral (neutral-100) with dark text
 * - Icon: Minimal styling for icon-only buttons
 * - Navigation: For dock and app launcher
 * - Ghost: Transparent with hover effect
 * 
 * Uses design system color and spacing tokens for consistency.
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary">SIGN IN</Button>
 * 
 * // Secondary button
 * <Button variant="secondary">CANCEL</Button>
 * 
 * // Icon button
 * <Button variant="icon" size="sm">
 *   <SearchIcon />
 * </Button>
 * 
 * // Navigation button
 * <Button variant="navigation">
 *   <MailIcon />
 *   <span>Mail</span>
 * </Button>
 * ```
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'navigation';
  
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Inline styles */
  style?: CSSProperties;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  style,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  // Deprecation warning
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[DEPRECATED] components/core/buttons/Button is deprecated. ' +
      'Please use @/components/ui/button instead. ' +
      'See component documentation for migration guide.'
    );
  }
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  // Variant styles - using design system tokens
  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-neutral-900)',
      color: 'var(--color-neutral-0)',
    },
    secondary: {
      backgroundColor: 'var(--color-neutral-100)',
      color: 'var(--color-neutral-700)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-neutral-700)',
      border: '1px solid transparent',
    },
    icon: {
      backgroundColor: 'transparent',
      color: 'var(--color-neutral-500)',
      padding: 'var(--spacing-2)',
    },
    navigation: {
      backgroundColor: 'transparent',
      color: 'var(--color-neutral-700)',
    },
  };

  // Base button classes
  const baseClasses = cn(
    'font-light tracking-wide transition-all duration-200 ease-out',
    'rounded-xl',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    !disabled && variant !== 'icon' && 'hover:opacity-90',
    variant === 'icon' && 'hover:bg-neutral-100',
    variant === 'navigation' && 'hover:bg-neutral-100',
    fullWidth && 'w-full',
    loading && 'opacity-75 cursor-wait',
    sizeClasses[size],
    className
  );

  // Combine styles
  const finalStyle = {
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      className={baseClasses}
      style={finalStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4 mr-2"
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
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * IconButton Component
 * 
 * Specialized button for icon-only interactions
 */
export interface IconButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Icon element */
  icon: ReactNode;
  
  /** Accessible label for screen readers */
  ariaLabel: string;
}

export function IconButton({
  icon,
  ariaLabel,
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center rounded-full',
        'transition-all duration-200 ease-out',
        'hover:bg-neutral-100',
        iconSizes[size],
        className
      )}
      aria-label={ariaLabel}
      style={{ color: 'var(--color-neutral-500)' }}
      {...props}
    >
      {icon}
    </button>
  );
}

/**
 * NavigationButton Component
 * 
 * Button for navigation elements (dock, app launcher)
 */
export interface NavigationButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Icon element */
  icon: ReactNode;
  
  /** Button label */
  label?: string;
  
  /** Whether this button is active */
  active?: boolean;
}

export function NavigationButton({
  icon,
  label,
  active = false,
  className,
  ...props
}: NavigationButtonProps) {
  return (
    <button
      className={cn(
        'flex flex-col items-center justify-center',
        'px-3 py-2 rounded-lg',
        'transition-all duration-200 ease-out',
        'hover:bg-neutral-100',
        active && 'bg-neutral-200',
        className
      )}
      style={{ color: 'var(--color-neutral-700)' }}
      {...props}
    >
      <div className="w-6 h-6 mb-1">{icon}</div>
      {label && (
        <span className="text-xs font-light" style={{ color: 'var(--color-neutral-600)' }}>
          {label}
        </span>
      )}
    </button>
  );
}
