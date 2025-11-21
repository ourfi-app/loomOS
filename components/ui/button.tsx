
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-light tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-xl hover:opacity-90",
        destructive: "rounded-xl hover:opacity-90",
        outline: "rounded-xl border hover:opacity-90",
        secondary: "rounded-xl hover:opacity-90",
        ghost: "rounded-xl hover:bg-neutral-100",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-12 px-6 py-4 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Inline variant styles
const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  destructive: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#4a4a4a',
    borderColor: '#d0d0d0',
  },
  secondary: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    color: '#4a4a4a',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#4a4a4a',
  },
  link: {
    backgroundColor: 'transparent',
    color: '#4a4a4a',
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles[variant || "default"], ...style }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
