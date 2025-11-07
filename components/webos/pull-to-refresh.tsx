
/**
 * Pull to Refresh Component
 * 
 * Mobile-native pull-to-refresh interaction with haptic feedback
 * Follows LoomOS design principles
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;  // Pull distance to trigger refresh
  maxPull?: number;    // Maximum pull distance
  disabled?: boolean;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPull = 120,
  disabled = false,
  className,
}: PullToRefreshProps) {
  const haptic = useHapticFeedback();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ y: number; scrollTop: number } | null>(null);
  const hapticTriggeredRef = useRef<boolean>(false);
  
  const pullDistance = useMotionValue(0);
  const rotate = useTransform(pullDistance, [0, maxPull], [0, 360]);
  const scale = useTransform(pullDistance, [0, threshold, maxPull], [0.5, 1, 1.2]);
  const opacity = useTransform(pullDistance, [0, threshold], [0, 1]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    // Only allow pull-to-refresh when at the top
    if (container.scrollTop === 0) {
      touchStartRef.current = {
        y: touch.clientY,
        scrollTop: container.scrollTop,
      };
      hapticTriggeredRef.current = false;
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing || !touchStartRef.current) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      touchStartRef.current = null;
      return;
    }
    
    const touch = e.touches[0];
    if (!touch || !touchStartRef.current) return;
    
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Only pull down
    if (deltaY > 0) {
      e.preventDefault();
      
      // Apply elastic resistance
      const resistance = 0.5;
      const adjustedDelta = Math.min(deltaY * resistance, maxPull);
      
      pullDistance.set(adjustedDelta);
      setIsPulling(true);
      
      // Trigger haptic at threshold
      if (adjustedDelta >= threshold && !hapticTriggeredRef.current) {
        haptic.select();
        hapticTriggeredRef.current = true;
      }
    }
  }, [disabled, isRefreshing, threshold, maxPull, pullDistance, haptic]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !touchStartRef.current) return;
    
    const distance = pullDistance.get();
    
    // Trigger refresh if threshold is met
    if (distance >= threshold) {
      setIsRefreshing(true);
      haptic.notification();
      
      try {
        await onRefresh();
        haptic.success();
      } catch (error) {
        console.error('Refresh failed:', error);
        haptic.error();
      } finally {
        setIsRefreshing(false);
      }
    } else if (distance > 0) {
      haptic.dragEnd();
    }
    
    // Reset state
    pullDistance.set(0);
    setIsPulling(false);
    touchStartRef.current = null;
    hapticTriggeredRef.current = false;
  }, [disabled, isRefreshing, threshold, pullDistance, onRefresh, haptic]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative h-full overflow-y-auto overscroll-contain",
        className
      )}
    >
      {/* Pull indicator */}
      <motion.div
        className={cn(
          "absolute top-0 left-0 right-0 z-10",
          "flex items-center justify-center",
          "pointer-events-none"
        )}
        style={{ 
          height: pullDistance,
          opacity,
        }}
      >
        <motion.div
          className={cn(
            "flex items-center justify-center",
            "w-10 h-10 rounded-full",
            "bg-primary/20 backdrop-blur-md border border-primary/30"
          )}
          style={{ scale, rotate }}
        >
          <AnimatePresence mode="wait">
            {isRefreshing ? (
              <motion.div
                key="refreshing"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" }
                }}
              >
                <RefreshCw className="w-5 h-5 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="pulling"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    pullDistance.get() >= threshold
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Content with pull offset */}
      <motion.div
        style={{ 
          y: isRefreshing ? threshold : pullDistance,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
