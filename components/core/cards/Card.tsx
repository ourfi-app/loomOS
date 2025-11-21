'use client';

import React, { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card Component - Phase 1: Foundation
 * 
 * Base card component with glassmorphism support, following the new design system:
 * - Neutral color palette (#f5f5f5, #e8e8e8, #d8d8d8)
 * - Glassmorphism effects with backdrop blur
 * - Consistent border radius (24px for cards)
 * - Modern shadows
 * - Light font weights (Helvetica Neue)
 * 
 * @example
 * ```tsx
 * // Default card
 * <Card>
 *   <h3 className="text-xs font-light tracking-wider uppercase text-tertiary">TITLE</h3>
 *   <p className="text-sm font-light text-primary">Content goes here</p>
 * </Card>
 * 
 * // Glass card with blur
 * <Card variant="glass">
 *   <p>Glass morphism content</p>
 * </Card>
 * 
 * // Elevated card (more shadow)
 * <Card variant="elevated">
 *   <p>Important content</p>
 * </Card>
 * ```
 */

export interface CardProps {
  /** Card content */
  children: ReactNode;
  
  /** Visual variant of the card */
  variant?: 'default' | 'glass' | 'elevated' | 'flat';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Inline styles */
  style?: CSSProperties;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether the card is interactive (clickable/hoverable) */
  interactive?: boolean;
  
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  className,
  style,
  onClick,
  interactive = false,
  padding = 'lg',
}: CardProps) {
  // Base styles for the card
  const baseStyle: CSSProperties = {
    borderRadius: '24px',
    ...style,
  };

  // Variant-specific styles
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: '#f5f5f5',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    },
    elevated: {
      backgroundColor: '#f5f5f5',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    },
    flat: {
      backgroundColor: '#f5f5f5',
      border: '1px solid #e0e0e0',
      boxShadow: 'none',
    },
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Combine all styles
  const finalStyle = {
    ...baseStyle,
    ...variantStyles[variant],
  };

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        paddingClasses[padding],
        interactive && 'cursor-pointer hover:opacity-90',
        onClick && 'cursor-pointer',
        className
      )}
      style={finalStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader Component
 * 
 * Header section for cards with consistent styling
 */
export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
}

/**
 * CardTitle Component
 * 
 * Title for cards with consistent styling
 */
export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-xs font-light tracking-wider uppercase',
        className
      )}
      style={{ color: '#8a8a8a' }}
    >
      {children}
    </h3>
  );
}

/**
 * CardContent Component
 * 
 * Content section for cards
 */
export interface CardContentProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function CardContent({ children, className, scrollable = false }: CardContentProps) {
  return (
    <div
      className={cn(
        scrollable && 'overflow-y-auto',
        className
      )}
      style={scrollable ? { maxHeight: '300px' } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * CardFooter Component
 * 
 * Footer section for cards
 */
export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-6', className)}>
      {children}
    </div>
  );
}
