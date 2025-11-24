/**
 * loomOS Unified Button Component
 * 
 * Consolidated from multiple button implementations:
 * - components/ui/button.tsx (shadcn/ui base)
 * - components/core/buttons/Button.tsx (webOS design system)
 * - components/loomos/Button.tsx (loomOS design system)
 * - components/webos/shared/webos-button.tsx (webOS-specific)
 * 
 * Features:
 * - Multiple variants (primary, secondary, destructive, ghost, outline, link, glass, dark)
 * - Multiple sizes (sm, md, lg, icon)
 * - Loading state with spinner
 * - Icon support (leading and trailing)
 * - Full width option
 * - Composition via asChild (Radix Slot)
 * - Design token integration
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary">Sign In</Button>
 * 
 * // With icon
 * <Button variant="secondary" icon={<Icon />}>Save</Button>
 * 
 * // Loading state
 * <Button variant="primary" loading>Saving...</Button>
 * 
 * // Glass effect (webOS style)
 * <Button variant="glass">Glass Button</Button>
 * ```
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-light tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary brand button (loomOS orange)
        primary: "rounded-xl shadow-sm hover:opacity-90",
        
        // Secondary button (neutral/accent)
        secondary: "rounded-xl shadow-sm hover:opacity-90",
        
        // Destructive/error actions
        destructive: "rounded-xl shadow-sm hover:opacity-90",
        
        // Ghost button (transparent with hover)
        ghost: "rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800",
        
        // Outline button
        outline: "rounded-xl border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800",
        
        // Link style button
        link: "underline-offset-4 hover:underline",
        
        // Glass morphism (webOS style)
        glass: "rounded-xl backdrop-blur-lg hover:backdrop-blur-xl shadow-md border hover:shadow-lg",
        
        // Dark button (for light backgrounds)
        dark: "rounded-xl shadow-sm hover:opacity-90",
        
        // Light button (for dark backgrounds)
        light: "rounded-xl shadow-sm border hover:bg-neutral-50",
        
        // Navigation button (for docks/app launchers)
        navigation: "flex-col rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-1",
      },
      size: {
        sm: "h-9 px-3 py-1.5 text-xs",
        md: "h-11 px-5 py-3 text-sm",
        lg: "h-12 px-6 py-4 text-base",
        icon: "h-10 w-10 p-0 rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

// Variant color styles using design tokens
const variantColorStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--semantic-btn-primary-bg)',
    color: 'var(--semantic-btn-primary-text)',
  },
  secondary: {
    backgroundColor: 'var(--semantic-btn-secondary-bg)',
    color: 'var(--semantic-btn-secondary-text)',
  },
  destructive: {
    backgroundColor: 'var(--semantic-error)',
    color: 'var(--semantic-text-inverse)',
  },
  ghost: {
    backgroundColor: 'var(--semantic-btn-ghost-bg)',
    color: 'var(--semantic-btn-ghost-text)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--semantic-primary)',
    borderColor: 'var(--semantic-primary)',
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--semantic-text-link)',
  },
  glass: {
    backgroundColor: 'var(--glass-white-80)',
    color: 'var(--semantic-text-primary)',
    borderColor: 'var(--glass-border-light)',
    backdropFilter: 'blur(var(--blur-xl))',
  },
  dark: {
    backgroundColor: 'var(--chrome-dark)',
    color: 'var(--chrome-text)',
  },
  light: {
    backgroundColor: 'var(--semantic-surface-base)',
    color: 'var(--semantic-text-primary)',
    borderColor: 'var(--semantic-border-light)',
  },
  navigation: {
    backgroundColor: 'transparent',
    color: 'var(--semantic-text-secondary)',
    fontSize: 'var(--text-xs)',
  },
}

// Loading spinner component
const LoadingSpinner = () => (
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
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component (using Radix Slot) */
  asChild?: boolean
  /** Show loading state with spinner */
  loading?: boolean
  /** Icon to display before text */
  icon?: React.ReactNode
  /** Icon to display after text */
  iconRight?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size,
      fullWidth,
      asChild = false,
      loading = false,
      icon,
      iconRight,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    
    // Merge styles
    const mergedStyle = {
      ...variantColorStyles[variant || "primary"],
      ...style,
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        style={mergedStyle}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && icon && <span className="inline-flex">{icon}</span>}
        {children}
        {!loading && iconRight && <span className="inline-flex">{iconRight}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
