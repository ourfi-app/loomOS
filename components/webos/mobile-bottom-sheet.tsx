
/**
 * Mobile Bottom Sheet Component
 * 
 * A mobile-optimized bottom sheet for actions, forms, and content
 * Follows WebOS design principles with haptic feedback
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, GripVertical } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useIsMobile } from '@/hooks/use-responsive';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  snapPoints?: number[]; // Snap points as percentages of screen height
  initialSnap?: number;  // Index of initial snap point
  dismissible?: boolean;  // Can be dismissed by dragging down
  showHandle?: boolean;   // Show drag handle
  fullScreen?: boolean;   // Allow full screen mode
  className?: string;
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  dismissible = true,
  showHandle = true,
  fullScreen = false,
  className,
}: BottomSheetProps) {
  const isMobile = useIsMobile();
  const haptic = useHapticFeedback();
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  // Calculate snap point heights
  const getSnapHeight = useCallback((snapIndex: number) => {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight * (fullScreen && snapIndex === snapPoints.length - 1 ? 1 : (snapPoints[snapIndex] || 0.5));
  }, [snapPoints, fullScreen]);

  // Handle drag
  const handleDrag = useCallback((event: any, info: PanInfo) => {
    setIsDragging(true);
    
    // Trigger subtle haptic feedback during drag
    if (Math.abs(info.velocity.y) > 500) {
      haptic.scroll();
    }
  }, [haptic]);

  // Handle drag end - snap to nearest point or dismiss
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const threshold = 100;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Dismiss if dragged down significantly
    if (dismissible && (offset > threshold || velocity > 500)) {
      haptic.swipe();
      onClose();
      return;
    }

    // Find nearest snap point
    const currentHeight = getSnapHeight(currentSnap);
    const newHeight = currentHeight - offset;
    
    let nearestSnap = currentSnap;
    let minDiff = Infinity;
    
    snapPoints.forEach((snap, index) => {
      const snapHeight = getSnapHeight(index);
      const diff = Math.abs(newHeight - snapHeight);
      if (diff < minDiff) {
        minDiff = diff;
        nearestSnap = index;
      }
    });

    // Snap to nearest point
    if (nearestSnap !== currentSnap) {
      haptic.cardSnap();
      setCurrentSnap(nearestSnap);
    } else {
      haptic.cardSnap();
    }

    y.set(0);
  }, [currentSnap, dismissible, getSnapHeight, haptic, onClose, snapPoints, y]);

  // Reset snap point when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(initialSnap);
      y.set(0);
    }
  }, [isOpen, initialSnap, y]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [isOpen]);

  // Don't render on desktop (use regular modal instead)
  if (!isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={dismissible ? onClose : undefined}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ 
              y: 0,
              height: getSnapHeight(currentSnap),
            }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 300 }}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ y, opacity }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-card rounded-t-3xl shadow-2xl",
              "flex flex-col",
              "will-change-transform",
              className
            )}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div className="flex items-center justify-center pt-3 pb-2 px-4">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-border/50">
                <div className="flex-1">
                  {title && (
                    <h3 className="text-lg font-semibold text-foreground">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {description}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    haptic.tap();
                    onClose();
                  }}
                  className={cn(
                    "ml-4 p-2 rounded-full",
                    "hover:bg-muted active:scale-95",
                    "transition-all duration-200"
                  )}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              {children}
            </div>

            {/* Snap Point Indicator */}
            {snapPoints.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 py-3 border-t border-border/50">
                {snapPoints.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      haptic.tap();
                      setCurrentSnap(index);
                    }}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-200",
                      currentSnap === index
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Snap to point ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to control bottom sheet
 */
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const haptic = useHapticFeedback();

  const open = useCallback(() => {
    haptic.cardOpen();
    setIsOpen(true);
  }, [haptic]);

  const close = useCallback(() => {
    haptic.cardClose();
    setIsOpen(false);
  }, [haptic]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
