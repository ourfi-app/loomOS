/**
 * loomOS Badge Component
 *
 * Built on the loomOS Design System v1.0
 * Uses semantic tokens for easy theming
 *
 * @example
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Error</Badge>
 */

import React, { forwardRef, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Add dot indicator */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      dot = false,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--semantic-primary-subtle)',
        color: 'var(--semantic-primary-dark)',
      },
      secondary: {
        backgroundColor: 'var(--semantic-bg-muted)',
        color: 'var(--semantic-text-secondary)',
      },
      success: {
        backgroundColor: 'var(--semantic-success-bg)',
        color: 'var(--semantic-success-text)',
      },
      error: {
        backgroundColor: 'var(--semantic-error-bg)',
        color: 'var(--semantic-error-text)',
      },
      warning: {
        backgroundColor: 'var(--semantic-warning-bg)',
        color: 'var(--semantic-warning-text)',
      },
      info: {
        backgroundColor: 'var(--semantic-info-bg)',
        color: 'var(--semantic-info-text)',
      },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        fontSize: 'var(--text-xs)',
        padding: 'var(--space-xs) var(--space-sm)',
      },
      md: {
        fontSize: 'var(--text-sm)',
        padding: 'var(--space-sm) var(--space-md)',
      },
      lg: {
        fontSize: 'var(--text-base)',
        padding: 'var(--space-md) var(--space-lg)',
      },
    };

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-xs)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--font-semibold)',
      borderRadius: 'var(--radius-full)',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };

    return (
      <span ref={ref} className={className} style={baseStyles} {...props}>
        {dot && (
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'currentColor',
            }}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
