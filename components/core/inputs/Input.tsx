'use client';

import React, { InputHTMLAttributes, CSSProperties, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component - Phase 1: Foundation
 * 
 * Input component following the new design system:
 * - Glass effect with backdrop blur
 * - Neutral borders and backgrounds
 * - Light font weight
 * - Rounded corners (xl = 16px)
 * 
 * @example
 * ```tsx
 * // Text input
 * <Input
 *   type="text"
 *   placeholder="Enter username"
 *   label="USERNAME"
 * />
 * 
 * // Search input
 * <SearchInput
 *   placeholder="JUST TYPE"
 * />
 * 
 * // Glass input
 * <Input
 *   variant="glass"
 *   placeholder="Search..."
 * />
 * ```
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input variant */
  variant?: 'default' | 'glass';
  
  /** Label for the input */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Icon to display before input */
  startIcon?: ReactNode;
  
  /** Icon to display after input */
  endIcon?: ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Container class name */
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    // Variant styles - using design system tokens
    const variantStyles: Record<string, CSSProperties> = {
      default: {
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--color-neutral-300)',
        color: 'var(--color-neutral-700)',
      },
      glass: {
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        color: 'var(--color-neutral-700)',
      },
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            className="block text-xs font-light tracking-wider mb-2 uppercase"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl outline-none text-sm font-light',
              'transition-all duration-200 ease-out',
              'placeholder:text-muted',
              'focus:ring-2 focus:ring-neutral-400',
              error && 'border-red-500 focus:ring-red-500',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              className
            )}
            style={variantStyles[variant]}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs font-light" style={{ color: '#dc3545' }}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * SearchInput Component
 * 
 * Specialized input for search functionality with icon
 */
export interface SearchInputProps extends Omit<InputProps, 'startIcon' | 'type'> {
  /** Callback when search is triggered */
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, className, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(e.currentTarget.value);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        variant="glass"
        startIcon={
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--semantic-text-tertiary)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
        onKeyDown={handleKeyDown}
        className={cn('', className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

/**
 * Textarea Component
 * 
 * Multi-line text input
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label for the textarea */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Container class name */
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            className="block text-xs font-light tracking-wider mb-2 uppercase"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl outline-none text-sm font-light',
            'transition-all duration-200 ease-out',
            'placeholder:text-muted',
            'focus:ring-2 focus:ring-neutral-400',
            'resize-none',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          style={{
            backgroundColor: 'var(--glass-white-60)',
            border: '1px solid #d0d0d0',
            color: 'var(--semantic-text-primary)',
          }}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-xs font-light" style={{ color: '#dc3545' }}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
