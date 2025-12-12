
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * WebOS Glass Card Component
 * 
 * A reusable glassmorphic card component following WebOS design principles.
 * Features:
 * - Glassmorphism effect with backdrop blur
 * - Configurable blur strength and opacity
 * - Dark mode support
 * - Hover and active states
 * - Customizable border radius
 * 
 * @example
 * <GlassCard>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </GlassCard>
 */

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Blur strength: 'sm' | 'md' | 'lg' | 'xl' */
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  /** Opacity level: 0-100 */
  opacity?: number;
  /** Border radius variant */
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  /** Enable hover effect */
  hoverable?: boolean;
  /** Enable click effect */
  pressable?: boolean;
  /** Elevation level for shadows */
  elevation?: 'sm' | 'md' | 'lg';
  /** Custom border color */
  borderColor?: string;
}

const blurMap = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const roundedMap = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

const elevationMap = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      blur = 'lg',
      opacity = 80,
      rounded = '3xl',
      hoverable = false,
      pressable = false,
      elevation = 'md',
      borderColor,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const backgroundOpacity = opacity / 100;

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          blurMap[blur],
          roundedMap[rounded],
          elevationMap[elevation],
          hoverable && 'hover:shadow-xl hover:scale-[1.02]',
          pressable && 'active:scale-[0.98]',
          className
        )}
        style={{
          backgroundColor: 'var(--glass-white-85)',
          border: borderColor
            ? `1px solid ${borderColor}`
            : '1px solid var(--glass-border-light)',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/**
 * WebOS Glass Card Header
 */
export interface GlassCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  GlassCardHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

GlassCardHeader.displayName = 'GlassCardHeader';

/**
 * WebOS Glass Card Title
 */
export interface GlassCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  GlassCardTitleProps
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-light tracking-tight leading-none',
      'text-text-primary',
      className
    )}
    style={{ color: 'var(--text-primary)' }}
    {...props}
  />
));

GlassCardTitle.displayName = 'GlassCardTitle';

/**
 * WebOS Glass Card Description
 */
export interface GlassCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  GlassCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-light', className)}
    style={{ color: 'var(--text-secondary)' }}
    {...props}
  />
));

GlassCardDescription.displayName = 'GlassCardDescription';

/**
 * WebOS Glass Card Content
 */
export interface GlassCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  GlassCardContentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

GlassCardContent.displayName = 'GlassCardContent';

/**
 * WebOS Glass Card Footer
 */
export interface GlassCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  GlassCardFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));

GlassCardFooter.displayName = 'GlassCardFooter';
