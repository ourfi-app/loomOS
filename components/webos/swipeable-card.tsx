
/**
 * Swipeable Card Component
 * 
 * Mobile-optimized card with swipe gestures and haptic feedback
 * Perfect for lists with actions (delete, archive, etc.)
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Trash2, Archive, Star, MoreHorizontal, Check, X } from 'lucide-react';

export interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'destructive';
  onAction: () => void | Promise<void>;
}

export interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;  // Distance to trigger action
  disabled?: boolean;
  className?: string;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const colorMap = {
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  destructive: 'bg-destructive text-destructive-foreground',
};

export function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 80,
  disabled = false,
  className,
  onSwipeStart,
  onSwipeEnd,
}: SwipeableCardProps) {
  const haptic = useHapticFeedback();
  const [isDragging, setIsDragging] = useState(false);
  const [activeAction, setActiveAction] = useState<SwipeAction | null>(null);
  const x = useMotionValue(0);
  const hapticTriggeredRef = useRef<boolean>(false);
  
  // Transform for background action opacity
  const leftOpacity = useTransform(x, [0, threshold], [0, 1]);
  const rightOpacity = useTransform(x, [0, -threshold], [0, 1]);

  const handleDragStart = useCallback(() => {
    if (disabled) return;
    
    setIsDragging(true);
    hapticTriggeredRef.current = false;
    haptic.dragStart();
    onSwipeStart?.();
  }, [disabled, haptic, onSwipeStart]);

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (disabled) return;
    
    const offset = info.offset.x;
    const absOffset = Math.abs(offset);
    
    // Determine active action based on offset
    if (offset > threshold && leftActions.length > 0) {
      const actionIndex = Math.min(
        Math.floor(offset / threshold) - 1,
        leftActions.length - 1
      );
      const action = leftActions[actionIndex];
      setActiveAction(action || null);
      
      if (!hapticTriggeredRef.current) {
        haptic.select();
        hapticTriggeredRef.current = true;
      }
    } else if (offset < -threshold && rightActions.length > 0) {
      const actionIndex = Math.min(
        Math.floor(absOffset / threshold) - 1,
        rightActions.length - 1
      );
      const action = rightActions[actionIndex];
      setActiveAction(action || null);
      
      if (!hapticTriggeredRef.current) {
        haptic.select();
        hapticTriggeredRef.current = true;
      }
    } else {
      setActiveAction(null);
      hapticTriggeredRef.current = false;
    }
  }, [disabled, threshold, leftActions, rightActions, haptic]);

  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    if (disabled) return;
    
    setIsDragging(false);
    const offset = info.offset.x;
    
    // Execute action if threshold is met
    if (activeAction) {
      haptic.cardSnap();
      
      try {
        await activeAction.onAction();
        haptic.success();
      } catch (error) {
        console.error('Action failed:', error);
        haptic.error();
      }
    } else if (Math.abs(offset) > 10) {
      haptic.dragEnd();
    }
    
    // Reset state
    x.set(0);
    setActiveAction(null);
    hapticTriggeredRef.current = false;
    onSwipeEnd?.();
  }, [disabled, activeAction, x, haptic, onSwipeEnd]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left actions background */}
      {leftActions.length > 0 && (
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center gap-2 px-4"
          style={{ opacity: leftOpacity }}
        >
          {leftActions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "flex items-center justify-center",
                "w-12 h-12 rounded-full",
                colorMap[action.color],
                activeAction?.id === action.id && "scale-110 shadow-lg"
              )}
            >
              {action.icon}
            </div>
          ))}
        </motion.div>
      )}

      {/* Right actions background */}
      {rightActions.length > 0 && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center gap-2 px-4"
          style={{ opacity: rightOpacity }}
        >
          {rightActions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "flex items-center justify-center",
                "w-12 h-12 rounded-full",
                colorMap[action.color],
                activeAction?.id === action.id && "scale-110 shadow-lg"
              )}
            >
              {action.icon}
            </div>
          ))}
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        drag={disabled ? false : "x"}
        dragConstraints={{ left: -threshold * rightActions.length, right: threshold * leftActions.length }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          "bg-card cursor-grab active:cursor-grabbing",
          "touch-pan-y", // Allow vertical scrolling
          isDragging && "shadow-lg"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Pre-configured swipeable card for common use cases
 */
export function SwipeableListItem({
  children,
  onDelete,
  onArchive,
  onStar,
  className,
}: {
  children: React.ReactNode;
  onDelete?: () => void | Promise<void>;
  onArchive?: () => void | Promise<void>;
  onStar?: () => void | Promise<void>;
  className?: string;
}) {
  const leftActions: SwipeAction[] = [];
  const rightActions: SwipeAction[] = [];

  if (onStar) {
    leftActions.push({
      id: 'star',
      label: 'Star',
      icon: <Star className="w-5 h-5" />,
      color: 'warning',
      onAction: onStar,
    });
  }

  if (onArchive) {
    rightActions.push({
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="w-5 h-5" />,
      color: 'primary',
      onAction: onArchive,
    });
  }

  if (onDelete) {
    rightActions.push({
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-5 h-5" />,
      color: 'destructive',
      onAction: onDelete,
    });
  }

  return (
    <SwipeableCard
      leftActions={leftActions}
      rightActions={rightActions}
      className={className}
    >
      {children}
    </SwipeableCard>
  );
}
