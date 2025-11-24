/**
 * Unified Loading State Component
 * 
 * Consolidates:
 * - components/common/loading-state.tsx
 * - components/common/enhanced-loading-state.tsx
 * - components/webos/loomos-loading-state.tsx
 * - components/webos/shared/loading-spinner.tsx
 * 
 * This component provides all loading state variants with a unified API.
 */

'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ==================== Main Loading State ====================

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  variant?: 'default' | 'enhanced' | 'loomos';
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  message = "Loading...",
  submessage,
  fullScreen = false,
  className,
  showProgress = false,
  progress = 0,
  variant = 'default',
  size = 'md',
}: LoadingStateProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  // Enhanced variant with animations
  if (variant === 'enhanced') {
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
        {/* Animated loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Loader2 className={cn("text-primary animate-spin", sizeClasses[size])} />
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-6 text-center space-y-2"
        >
          <p className="text-sm font-medium text-foreground">{message}</p>
          {submessage && (
            <p className="text-xs text-muted-foreground">{submessage}</p>
          )}
        </motion.div>

        {/* Progress bar */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '200px' }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mt-6 h-1 bg-muted rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </div>
    );
  }

  // LoomOS variant
  if (variant === 'loomos') {
    return (
      <div className={cn('loomos-loading-state', className)}>
        <div className={cn("loomos-spinner border-4", sizeClasses[size])} />
        {message && <div className="mt-3 text-sm text-muted-foreground">{message}</div>}
      </div>
    );
  }

  // Default variant
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
      <Loader2 className={cn("text-primary animate-spin mb-3", sizeClasses[size])} aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {submessage && (
        <p className="text-xs text-muted-foreground mt-1">{submessage}</p>
      )}
    </div>
  );
}

// ==================== Loading Spinner ====================

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'blue' | 'gray' | 'white' | 'black';
  text?: string;
}

const spinnerSizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  default: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const spinnerColorMap = {
  primary: 'text-primary',
  blue: 'border-accent-blue border-t-transparent',
  gray: 'border-neutral-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  black: 'border-black border-t-transparent',
};

export function LoadingSpinner({ 
  size = 'default',
  className,
  color = 'primary',
  text,
}: LoadingSpinnerProps) {
  const useBorderStyle = color !== 'primary';

  if (text) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div
          className={cn(
            'animate-spin rounded-full',
            spinnerSizeMap[size],
            useBorderStyle ? 'border-2 ' + spinnerColorMap[color] : ''
          )}
          role="status"
          aria-label="Loading"
        >
          {!useBorderStyle && <Loader2 className={cn('animate-spin', spinnerSizeMap[size], spinnerColorMap[color])} />}
        </div>
        <p className="text-sm font-light text-muted-foreground">{text}</p>
      </div>
    );
  }

  if (useBorderStyle) {
    return (
      <div
        className={cn(
          'animate-spin rounded-full border-2',
          spinnerSizeMap[size],
          spinnerColorMap[color],
          className
        )}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <Loader2
      className={cn(
        'animate-spin',
        spinnerSizeMap[size],
        spinnerColorMap[color],
        className
      )}
      aria-hidden="true"
      role="status"
    />
  );
}

// Alias for backward compatibility
export const InlineLoader = LoadingSpinner;

// ==================== LoomOS Skeletons ====================

interface LoomOSSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function LoomOSSkeleton({ className, width, height }: LoomOSSkeletonProps) {
  return (
    <div
      className={cn('loomos-skeleton', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function LoomOSListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="loomos-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="loomos-list-item">
          <LoomOSSkeleton width={40} height={40} className="rounded-full mr-3" />
          <div className="flex-1 space-y-2">
            <LoomOSSkeleton width="60%" height={16} />
            <LoomOSSkeleton width="80%" height={14} />
          </div>
          <LoomOSSkeleton width={60} height={12} />
        </div>
      ))}
    </div>
  );
}
