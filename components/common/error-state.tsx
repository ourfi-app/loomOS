/**
 * @deprecated This component is deprecated. Use UnifiedErrorState from '@/components/common/unified-error-state' instead.
 * This file is kept for backward compatibility but will be removed in a future version.
 * 
 * Migration:
 * ```
 * // Before
 * import { ErrorState } from '@/components/common/error-state';
 * 
 * // After
 * import { ErrorState } from '@/components/common/unified-error-state';
 * // or
 * import { ErrorState } from '@/components/common';
 * ```
 */

'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
}

export function ErrorState({ 
  title = "Something went wrong",
  message = "We encountered an error. Please try again.",
  onRetry,
  fullScreen = false,
  className 
}: ErrorStateProps) {
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
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {message}
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
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
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
