

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

const badgeStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'rgba(74, 74, 74, 0.1)',
    color: '#4a4a4a',
    borderColor: 'rgba(74, 74, 74, 0.2)',
  },
  secondary: {
    backgroundColor: '#e8e8e8',
    color: '#4a4a4a',
    borderColor: '#d0d0d0',
  },
  destructive: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    color: '#dc3545',
    borderColor: 'rgba(220, 53, 69, 0.2)',
  },
  outline: {
    backgroundColor: 'white',
    color: '#6a6a6a',
    borderColor: '#d0d0d0',
  },
  success: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    color: '#28a745',
    borderColor: 'rgba(40, 167, 69, 0.2)',
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
