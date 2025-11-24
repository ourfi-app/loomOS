/**
 * @deprecated This card component is deprecated. Please use @/components/ui/card instead.
 * 
 * Migration Guide:
 * - Replace: import { Card } from '@/components/loomos/Card'
 * - With: import { Card } from '@/components/ui/card'
 * 
 * Feature Mapping:
 * - hoverable → hoverable
 * - clickable → clickable
 * - padding → padding (same values)
 * 
 * All features are supported in the unified component.
 * This file will be removed in a future release.
 * 
 * loomOS Card Component
 *
 * Built on the loomOS Design System v1.0
 * Uses semantic tokens for easy theming
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Content goes here
 *   </CardContent>
 *   <CardFooter>
 *     Footer content
 *   </CardFooter>
 * </Card>
 */

import React, { forwardRef, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover effect */
  hoverable?: boolean;
  /** Adds click effect */
  clickable?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      hoverable = false,
      clickable = false,
      padding = 'lg',
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    // Deprecation warning
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[DEPRECATED] components/loomos/Card is deprecated. ' +
        'Please use @/components/ui/card instead. ' +
        'All features are supported in the unified component.'
      );
    }
    
    const paddingMap = {
      none: '0',
      sm: 'var(--card-padding-sm)',
      md: 'var(--card-padding)',
      lg: 'var(--card-padding-lg)',
    };

    const baseStyles: React.CSSProperties = {
      backgroundColor: 'var(--semantic-card-bg)',
      border: '1px solid var(--semantic-card-border)',
      borderRadius: 'var(--radius-xl)',
      padding: paddingMap[padding],
      boxShadow: 'var(--semantic-card-shadow)',
      transition: 'var(--transition-all-normal)',
      cursor: clickable ? 'pointer' : 'default',
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverable || clickable) {
        e.currentTarget.style.boxShadow = 'var(--semantic-card-shadow-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverable || clickable) {
        e.currentTarget.style.boxShadow = 'var(--semantic-card-shadow)';
        e.currentTarget.style.transform = 'translateY(0)';
      }
      props.onMouseLeave?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (clickable) {
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (clickable) {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
      }
      props.onMouseUp?.(e);
    };

    return (
      <div
        ref={ref}
        className={className}
        style={baseStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// CardHeader, CardTitle, CardDescription, CardContent, CardFooter components
// (Implementation continues below)

export default Card;
