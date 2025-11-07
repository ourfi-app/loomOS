
'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedLoadingStateProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  className?: string;
  showProgress?: boolean;
  progress?: number;
}

export function EnhancedLoadingState({ 
  message = "Loading...", 
  submessage,
  fullScreen = false,
  className,
  showProgress = false,
  progress = 0,
}: EnhancedLoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullScreen ? "min-h-screen" : "py-12",
      className
    )}>
      {/* Animated loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        
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

// Inline loading spinner for buttons and inline use
export function InlineLoader({ 
  size = 'default',
  className 
}: { 
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-current',
        sizeClasses[size],
        className
      )} 
    />
  );
}
