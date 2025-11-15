
'use client';

import { AlertCircle, RefreshCw, Home, WifiOff, AlertTriangle, XOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedErrorStateProps {
  type?: 'error' | 'network' | 'notFound' | 'permission';
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
  showHomeButton?: boolean;
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

export function EnhancedErrorState({ 
  type = 'error',
  title,
  message,
  onRetry,
  fullScreen = false,
  className,
  showHomeButton = true,
}: EnhancedErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

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
        {title || config.defaultTitle}
      </motion.h3>
      
      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="text-sm text-muted-foreground max-w-md mb-8"
      >
        {message || config.defaultMessage}
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

// Compact error state for inline use
export function InlineErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg",
      className
    )}>
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <p className="text-sm text-foreground">{message}</p>
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
