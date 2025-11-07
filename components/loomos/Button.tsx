/**
 * loomOS Button Component
 *
 * Built on the loomOS Design System v1.0
 * Uses semantic tokens for easy theming
 *
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="secondary" size="lg">Large Button</Button>
 * <Button variant="ghost" disabled>Disabled</Button>
 */

import React, { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    // Base styles using design tokens
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-sm)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--font-semibold)',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-all-fast)',
      opacity: disabled ? 'var(--semantic-disabled-opacity)' : 1,
      width: fullWidth ? '100%' : 'auto',
      ...style,
    };

    // Size styles
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        fontSize: 'var(--text-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        minHeight: 'calc(var(--touch-target-min) * 0.8)', // 35px
      },
      md: {
        fontSize: 'var(--text-base)',
        padding: 'var(--space-md) var(--space-lg)',
        minHeight: 'var(--touch-target-min)', // 44px
      },
      lg: {
        fontSize: 'var(--text-lg)',
        padding: 'var(--space-lg) var(--space-xl)',
        minHeight: 'calc(var(--touch-target-min) * 1.2)', // 53px
      },
    };

    // Variant styles
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--semantic-btn-primary-bg)',
        color: 'var(--semantic-btn-primary-text)',
      },
      secondary: {
        backgroundColor: 'var(--semantic-btn-secondary-bg)',
        color: 'var(--semantic-btn-secondary-text)',
      },
      ghost: {
        backgroundColor: 'var(--semantic-btn-ghost-bg)',
        color: 'var(--semantic-btn-ghost-text)',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--semantic-primary)',
        border: '2px solid var(--semantic-primary)',
      },
    };

    // Hover styles (applied via onMouseEnter/onMouseLeave)
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      const hoverStyles: Record<string, Partial<CSSStyleDeclaration>> = {
        primary: {
          backgroundColor: 'var(--semantic-btn-primary-hover)',
          transform: 'scale(1.02)',
        },
        secondary: {
          backgroundColor: 'var(--semantic-btn-secondary-hover)',
          transform: 'scale(1.02)',
        },
        ghost: {
          backgroundColor: 'var(--semantic-btn-ghost-hover)',
        },
        outline: {
          backgroundColor: 'var(--semantic-primary-subtle)',
          borderColor: 'var(--semantic-primary-dark)',
        },
      };

      Object.assign(e.currentTarget.style, hoverStyles[variant]);
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      const leaveStyles: Record<string, Partial<CSSStyleDeclaration>> = {
        primary: {
          backgroundColor: 'var(--semantic-btn-primary-bg)',
          transform: 'scale(1)',
        },
        secondary: {
          backgroundColor: 'var(--semantic-btn-secondary-bg)',
          transform: 'scale(1)',
        },
        ghost: {
          backgroundColor: 'var(--semantic-btn-ghost-bg)',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: 'var(--semantic-primary)',
        },
      };

      Object.assign(e.currentTarget.style, leaveStyles[variant]);
      props.onMouseLeave?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      e.currentTarget.style.transform = 'scale(0.98)';
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      e.currentTarget.style.transform = 'scale(1.02)';
      props.onMouseUp?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={className}
        style={{
          ...baseStyles,
          ...sizeStyles[size],
          ...variantStyles[variant],
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      >
        {loading && (
          <span
            style={{
              display: 'inline-block',
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: 'var(--radius-full)',
              animation: 'spin var(--duration-slower) var(--ease-linear) infinite',
            }}
          />
        )}
        {!loading && icon && <span>{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
