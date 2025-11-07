
'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  fullScreen = false,
  className
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "min-h-screen" : "py-12",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingSpinner({ size = "default", className }: { size?: "sm" | "default" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
      role="status"
    />
  );
}
