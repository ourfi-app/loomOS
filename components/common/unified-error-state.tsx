/**
 * Unified Error State Component
 * 
 * Consolidates:
 * - components/common/error-state.tsx
 * - components/common/enhanced-error-state.tsx
 * 
 * This component provides all error state variants with a unified API.
 */

'use client';

import { AlertCircle, RefreshCw, Home, WifiOff, AlertTriangle, XOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UnifiedErrorStateProps {
  type?: 'error' | 'network' | 'notFound' | 'permission';
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
  showHomeButton?: boolean;
  variant?: 'default' | 'enhanced' | 'inline';
}

const errorConfig = {
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    defaultTitle: 'Something went wrong',
    defaultMessage: 'We encountered an error. Please try again.',
  },
  network: {
    icon: WifiOff,
    color: 'text-[var(--semantic-primary)]',
    bgColor: 'bg-[var(--semantic-primary)]/10',
    defaultTitle: 'Connection issue',
    defaultMessage: 'Unable to connect. Please check your internet connection.',
  },
  notFound: {
    icon: AlertTriangle,
    color: 'text-[var(--semantic-warning)]',
    bgColor: 'bg-[var(--semantic-warning)]/10',
    defaultTitle: 'Not found',
    defaultMessage: 'The item you\'re looking for doesn\'t exist.',
  },
  permission: {
    icon: XOctagon,
    color: 'text-[var(--semantic-error)]',
    bgColor: 'bg-[var(--semantic-error)]/10',
    defaultTitle: 'Access denied',
    defaultMessage: 'You don\'t have permission to view this.',
  },
};

export function UnifiedErrorState({
  type = 'error',
  title,
  message,
  onRetry,
  fullScreen = false,
  className,
  showHomeButton = false,
  variant = 'default',
}: UnifiedErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;
  const finalTitle = title || config.defaultTitle;
  const finalMessage = message || config.defaultMessage;

  // Inline variant (compact)
  if (variant === 'inline') {
    return (
      <div className={cn(
        "flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg",
        className
      )}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-foreground">{finalMessage}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="ghost">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Enhanced variant with animations
  if (variant === 'enhanced') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex flex-col items-center justify-center text-center px-6",
          fullScreen ? "min-h-screen" : "py-12",
          className
        )}
      >
        {/* Icon with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
            config.bgColor
          )}
        >
          <Icon className={cn("w-8 h-8", config.color)} />
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-xl font-bold text-foreground mb-3"
        >
          {finalTitle}
        </motion.h3>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="text-sm text-muted-foreground max-w-md mb-8"
        >
          {finalMessage}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex gap-3"
        >
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Default variant
  if (fullScreen) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6 text-center",
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", config.bgColor)}>
          <Icon className={cn("w-8 h-8", config.color)} aria-hidden="true" />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {finalTitle}
        </h3>

        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {finalMessage}
        </p>

        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <Alert variant="destructive" className={className} role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>{finalTitle}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{finalMessage}</span>
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline" className="ml-4">
            <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Aliases for backward compatibility
export const ErrorState = UnifiedErrorState;
export const EnhancedErrorState = (props: Omit<UnifiedErrorStateProps, 'variant'>) => (
  <UnifiedErrorState {...props} variant="enhanced" />
);
export const InlineErrorState = (props: { message: string; onRetry?: () => void; className?: string }) => (
  <UnifiedErrorState {...props} variant="inline" type="error" />
);
