
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SwipeView {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface WebOSSwipeNavigationProps {
  views: SwipeView[];
  defaultView?: string;
  onViewChange?: (viewId: string) => void;
  className?: string;
  showIndicators?: boolean;
  showTabs?: boolean;
}

/**
 * WebOS Swipe Navigation
 * 
 * Swipe between views at the same level with visual indicators.
 * Reference: navigating-at-the-same-level-2.png, navigating-at-the-same-level-3.png
 * 
 * @example
 * <WebOSSwipeNavigation 
 *   views={[
 *     { id: "day", label: "Day", content: <DayView /> },
 *     { id: "week", label: "Week", content: <WeekView /> },
 *     { id: "month", label: "Month", content: <MonthView /> }
 *   ]}
 *   defaultView="week"
 *   showTabs
 * />
 */
export function WebOSSwipeNavigation({
  views,
  defaultView,
  onViewChange,
  className,
  showIndicators = true,
  showTabs = false
}: WebOSSwipeNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (defaultView) {
      const index = views.findIndex(v => v.id === defaultView);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const containerRef = useRef<HTMLDivElement>(null);

  const currentView = views[currentIndex];

  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView?.id || '');
    }
  }, [currentIndex, currentView, onViewChange]);

  const handleSwipe = (offset: number, velocity: number) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > velocityThreshold) {
      if (offset > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        setDirection('right');
        setCurrentIndex(currentIndex - 1);
      } else if (offset < 0 && currentIndex < views.length - 1) {
        // Swipe left - go to next
        setDirection('left');
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    handleSwipe(info.offset.x, info.velocity.x);
  };

  const goToView = (index: number) => {
    setDirection(index > currentIndex ? 'left' : 'right');
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0
    })
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Tabs */}
      {showTabs && (
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          {views.map((view, index) => (
            <button
              key={view.id}
              onClick={() => goToView(index)}
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
                index === currentIndex
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              {view.label}
              
              {/* Active indicator */}
              {index === currentIndex && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentView?.id || 'empty'}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 overflow-y-auto"
          >
            {currentView?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      {showIndicators && views.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-neutral-900">
          {views.map((view, index) => (
            <button
              key={view.id}
              onClick={() => goToView(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-blue-500 w-6'
                  : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
              )}
              aria-label={`Go to ${view.label}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

WebOSSwipeNavigation.displayName = 'WebOSSwipeNavigation';
