
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "",
        info: "",
        success: "",
        warning: "",
        error: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Alert styles using Phase 1C component tokens
const alertStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--semantic-bg-subtle)',
    borderColor: 'var(--semantic-border-medium)',
    color: 'var(--semantic-text-primary)',
    padding: 'var(--alert-padding)',
    borderRadius: 'var(--radius-lg)',
    borderWidth: 'var(--alert-border-width)',
  },
  info: {
    backgroundColor: 'var(--alert-info-bg)',
    borderColor: 'var(--alert-info-border)',
    color: 'var(--alert-info-text)',
    padding: 'var(--alert-padding)',
    borderRadius: 'var(--radius-lg)',
    borderWidth: 'var(--alert-border-width)',
  },
  success: {
    backgroundColor: 'var(--alert-success-bg)',
    borderColor: 'var(--alert-success-border)',
    color: 'var(--alert-success-text)',
    padding: 'var(--alert-padding)',
    borderRadius: 'var(--radius-lg)',
    borderWidth: 'var(--alert-border-width)',
  },
  warning: {
    backgroundColor: 'var(--alert-warning-bg)',
    borderColor: 'var(--alert-warning-border)',
    color: 'var(--alert-warning-text)',
    padding: 'var(--alert-padding)',
    borderRadius: 'var(--radius-lg)',
    borderWidth: 'var(--alert-border-width)',
  },
  error: {
    backgroundColor: 'var(--alert-error-bg)',
    borderColor: 'var(--alert-error-border)',
    color: 'var(--alert-error-text)',
    padding: 'var(--alert-padding)',
    borderRadius: 'var(--radius-lg)',
    borderWidth: 'var(--alert-border-width)',
  },
  destructive: {
    backgroundColor: 'var(--alert-error-bg)',
    borderColor: 'var(--alert-error-border)',
    color: 'var(--alert-error-text)',
    padding: 'var(--alert-padding)',
    borderRadius: 'var(--radius-lg)',
    borderWidth: 'var(--alert-border-width)',
  },
}

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = "default", style, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    style={{ ...alertStyles[variant || "default"], ...style }}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

export { Alert, AlertDescription, AlertTitle }
