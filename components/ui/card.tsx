/**
 * loomOS Unified Card Component
 * 
 * Consolidated from multiple card implementations:
 * - components/ui/card.tsx (shadcn/ui base)
 * - components/loomos/Card.tsx (loomOS design system)
 * - components/core/cards/Card.tsx (webOS design system)
 * 
 * Features:
 * - Multiple variants (default, glass, elevated, outline, flat)
 * - Padding size options (none, sm, md, lg)
 * - Hover and click effects
 * - Interactive states
 * - Design token integration
 * - Compound components (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
 * 
 * Note: Specialized cards (SwipeableCard, RefinedCard, etc.) should wrap this base component
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 * </Card>
 * 
 * // Interactive card with hover effect
 * <Card hoverable clickable onClick={handleClick}>
 *   <CardContent>Interactive content</CardContent>
 * </Card>
 * 
 * // Glass morphism card
 * <Card variant="glass">
 *   <CardContent>Glass effect</CardContent>
 * </Card>
 * ```
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-2xl transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        // Default card with shadow
        default: "shadow-card",
        
        // Glass morphism effect (webOS style)
        glass: "backdrop-blur-lg border shadow-glass",
        
        // Elevated surface with stronger shadow
        elevated: "shadow-lg",
        
        // Outline style with border
        outline: "border-2 shadow-none",
        
        // Flat card with no shadow
        flat: "shadow-none",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "lg",
    },
  }
)

// Variant color styles using Phase 1C component tokens
const variantColorStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    color: 'var(--semantic-text-primary)',
  },
  glass: {
    backgroundColor: 'var(--glass-white-80)',
    borderColor: 'var(--glass-border-light)',
    color: 'var(--semantic-text-primary)',
    backdropFilter: 'blur(var(--blur-xl))',
  },
  elevated: {
    backgroundColor: 'var(--semantic-surface-elevated)',
    border: '1px solid var(--card-border)',
    color: 'var(--semantic-text-primary)',
  },
  outline: {
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--semantic-border-medium)',
    color: 'var(--semantic-text-primary)',
  },
  flat: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    color: 'var(--semantic-text-primary)',
  },
}

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Adds hover effect (lift and shadow) */
  hoverable?: boolean
  /** Adds click effect and cursor pointer */
  clickable?: boolean
  /** Makes card interactive (hoverable + clickable) */
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding,
      hoverable = false,
      clickable = false,
      interactive = false,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)
    
    // Interactive implies both hoverable and clickable
    const isHoverable = hoverable || interactive
    const isClickable = clickable || interactive

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isHoverable) {
        setIsHovered(true)
      }
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isHoverable) {
        setIsHovered(false)
        setIsPressed(false)
      }
      onMouseLeave?.(e)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isClickable) {
        setIsPressed(true)
      }
      onMouseDown?.(e)
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isClickable) {
        setIsPressed(false)
      }
      onMouseUp?.(e)
    }

    // Dynamic styles for interactive states
    const interactiveStyles: React.CSSProperties = {}
    
    if (isHoverable && isHovered) {
      interactiveStyles.transform = 'translateY(-2px)'
      interactiveStyles.boxShadow = 'var(--card-shadow-hover)'
    }
    
    if (isClickable) {
      interactiveStyles.cursor = 'pointer'
      if (isPressed) {
        interactiveStyles.transform = 'translateY(0) scale(0.98)'
      }
    }

    const mergedStyle = {
      ...variantColorStyles[variant || "default"],
      ...interactiveStyles,
      ...style,
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    style={{ color: 'var(--semantic-text-primary)' }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-light leading-relaxed", className)}
    style={{ color: 'var(--semantic-text-secondary)' }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
