

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-light transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "border",
        secondary: "border",
        destructive: "border",
        outline: "border bg-white",
        success: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Badge styles using Phase 1C component tokens
const badgeStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--badge-default-bg)',
    color: 'var(--badge-default-text)',
    borderColor: 'var(--semantic-border-medium)',
    fontSize: 'var(--badge-font-size)',
  },
  secondary: {
    backgroundColor: 'var(--semantic-bg-muted)',
    color: 'var(--semantic-text-secondary)',
    borderColor: 'var(--semantic-border-medium)',
    fontSize: 'var(--badge-font-size)',
  },
  destructive: {
    backgroundColor: 'var(--badge-error-bg)',
    color: 'var(--badge-error-text)',
    borderColor: 'var(--semantic-error)',
    fontSize: 'var(--badge-font-size)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--semantic-text-primary)',
    borderColor: 'var(--semantic-border-medium)',
    fontSize: 'var(--badge-font-size)',
  },
  success: {
    backgroundColor: 'var(--badge-success-bg)',
    color: 'var(--badge-success-text)',
    borderColor: 'var(--semantic-success)',
    fontSize: 'var(--badge-font-size)',
  },
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = "default", style, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={{ ...badgeStyles[variant || "default"], ...style }}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
