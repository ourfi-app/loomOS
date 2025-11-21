'use client';

import React, { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Button Component - Phase 1: Foundation
 * 
 * Button component following the new design system:
 * - Primary: Dark (#1a1a1a) with white text
 * - Secondary: Light neutral with dark text
 * - Icon: Minimal styling for icon-only buttons
 * - Navigation: For dock and app launcher
 * - Ghost: Transparent with hover effect
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
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  // Variant styles
  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: 'rgba(200, 200, 200, 0.5)',
      color: '#4a4a4a',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#4a4a4a',
      border: '1px solid transparent',
    },
    icon: {
      backgroundColor: 'transparent',
      color: '#8a8a8a',
      padding: '8px',
    },
    navigation: {
      backgroundColor: 'transparent',
      color: '#4a4a4a',
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
      style={{ color: '#8a8a8a' }}
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
      style={{ color: '#4a4a4a' }}
      {...props}
    >
      <div className="w-6 h-6 mb-1">{icon}</div>
      {label && (
        <span className="text-xs font-light" style={{ color: '#6a6a6a' }}>
          {label}
        </span>
      )}
    </button>
  );
}
