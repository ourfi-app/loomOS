'use client';

import React, { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * GlassPanel Component - Phase 1: Foundation
 * 
 * Reusable glassmorphic container following the new design system:
 * - Translucent background with backdrop blur
 * - Subtle border with transparency
 * - Multiple blur intensity options
 * - Dark variant support
 * 
 * @example
 * ```tsx
 * // Standard glass panel
 * <GlassPanel>
 *   <p>Content with glassmorphism effect</p>
 * </GlassPanel>
 * 
 * // Strong blur
 * <GlassPanel blur="strong">
 *   <p>More pronounced glass effect</p>
 * </GlassPanel>
 * 
 * // Dark variant
 * <GlassPanel variant="dark">
 *   <p>Dark glass panel</p>
 * </GlassPanel>
 * ```
 */

export interface GlassPanelProps {
  /** Panel content */
  children: ReactNode;
  
  /** Glass variant */
  variant?: 'light' | 'medium' | 'dark';
  
  /** Blur intensity */
  blur?: 'light' | 'medium' | 'strong';
  
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  
  /** Padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Inline styles */
  style?: CSSProperties;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether the panel is interactive */
  interactive?: boolean;
}

export function GlassPanel({
  children,
  variant = 'medium',
  blur = 'medium',
  rounded = '2xl',
  padding = 'lg',
  className,
  style,
  onClick,
  interactive = false,
}: GlassPanelProps) {
  // Variant-specific backgrounds - using design system tokens
  const variantBackgrounds = {
    light: 'var(--glass-bg-light)',
    medium: 'var(--glass-bg)',
    dark: 'var(--glass-bg-dark)',
  };

  // Blur amounts - using design system tokens
  const blurAmounts = {
    light: 'var(--glass-blur-light)',
    medium: 'var(--glass-blur)',
    strong: 'var(--glass-blur-strong)',
  };

  // Border colors - using design system tokens
  const borderColors = {
    light: 'var(--glass-border)',
    medium: 'var(--glass-border-strong)',
    dark: 'var(--glass-border)',
  };

  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Base style
  const baseStyle: CSSProperties = {
    backgroundColor: variantBackgrounds[variant],
    backdropFilter: `blur(${blurAmounts[blur]})`,
    WebkitBackdropFilter: `blur(${blurAmounts[blur]})`,
    border: `1px solid ${borderColors[variant]}`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9)',
    color: variant === 'dark' ? 'var(--semantic-bg-subtle)' : 'var(--semantic-text-primary)',
    ...style,
  };

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        roundedClasses[rounded],
        paddingClasses[padding],
        interactive && 'hover:shadow-glass-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      style={baseStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * GlassCard Component
 * 
 * Pre-configured glass panel optimized for card layouts
 */
export interface GlassCardProps extends Omit<GlassPanelProps, 'rounded' | 'padding'> {
  /** Card header */
  header?: ReactNode;
  
  /** Card footer */
  footer?: ReactNode;
}

export function GlassCard({ children, header, footer, ...props }: GlassCardProps) {
  return (
    <GlassPanel rounded="2xl" padding="lg" {...props}>
      {header && (
        <div className="mb-4 pb-4 border-b border-white/20">
          {header}
        </div>
      )}
      
      <div>{children}</div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-white/20">
          {footer}
        </div>
      )}
    </GlassPanel>
  );
}

/**
 * GlassOverlay Component
 * 
 * Full-screen glass overlay for modals and overlays
 */
export interface GlassOverlayProps {
  /** Overlay content */
  children: ReactNode;
  
  /** Whether the overlay is visible */
  visible: boolean;
  
  /** Close handler */
  onClose?: () => void;
  
  /** Blur intensity for backdrop */
  backdropBlur?: 'light' | 'medium' | 'strong';
  
  /** Additional CSS classes */
  className?: string;
}

export function GlassOverlay({
  children,
  visible,
  onClose,
  backdropBlur = 'medium',
  className,
}: GlassOverlayProps) {
  const blurAmounts = {
    light: '4px',
    medium: '8px',
    strong: '12px',
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-8',
        'transition-all duration-300 ease-out',
        className
      )}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: `blur(${blurAmounts[backdropBlur]})`,
        WebkitBackdropFilter: `blur(${blurAmounts[backdropBlur]})`,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}

/**
 * GlassSearchBar Component
 * 
 * Pre-styled glass search bar matching design system
 */
export interface GlassSearchBarProps {
  /** Search placeholder */
  placeholder?: string;
  
  /** Search value */
  value?: string;
  
  /** Change handler */
  onChange?: (value: string) => void;
  
  /** Focus handler */
  onFocus?: () => void;
  
  /** Blur handler */
  onBlur?: () => void;
  
  /** Additional CSS classes */
  className?: string;
}

export function GlassSearchBar({
  placeholder = 'JUST TYPE',
  value,
  onChange,
  onFocus,
  onBlur,
  className,
}: GlassSearchBarProps) {
  return (
    <GlassPanel
      variant="medium"
      blur="medium"
      rounded="2xl"
      padding="none"
      className={cn('max-w-md', className)}
    >
      <div className="flex items-center px-5 py-2.5">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="flex-1 bg-transparent outline-none text-xs tracking-wide font-light"
          style={{ color: 'var(--semantic-text-primary)' }}
        />
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
      </div>
    </GlassPanel>
  );
}
