

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

// Badge styles using webOS Design System tokens
// See /docs/DESIGN_SYSTEM.md for full token documentation
const badgeStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-light)',
    fontSize: 'var(--text-xs)', // 11px
  },
  secondary: {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-light)',
    fontSize: 'var(--text-xs)',
  },
  destructive: {
    backgroundColor: 'var(--status-error-subtle)',
    color: 'var(--status-error)',
    borderColor: 'var(--status-error)',
    fontSize: 'var(--text-xs)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-light)',
    fontSize: 'var(--text-xs)',
  },
  success: {
    backgroundColor: 'var(--status-success-subtle)',
    color: 'var(--status-success)',
    borderColor: 'var(--status-success)',
    fontSize: 'var(--text-xs)',
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
