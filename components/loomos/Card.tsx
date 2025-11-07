'use client';

import React, { ReactNode } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { loomOSTheme, animations, cardStates, gestures } from '@/lib/loomos-design-system';
import { cn } from '@/lib/utils';

export interface LoomOSCardProps {
  id: string;
  title: string;
  appIcon?: ReactNode;
  appColor?: string;
  children: ReactNode;
  isActive?: boolean;
  isMinimized?: boolean;
  showLivePreview?: boolean;
  className?: string;

  // Event handlers
  onMaximize?: (id: string) => void;
  onMinimize?: (id: string) => void;
  onClose?: (id: string) => void;
  onClick?: (id: string) => void;
}

/**
 * LoomOSCard
 *
 * The signature loomOS card component featuring:
 * - Live preview content (not static screenshots)
 * - Physics-based animations
 * - Gesture support for natural interactions
 * - Smooth state transitions
 *
 * Cards are the primary interface element in loomOS, representing
 * active applications and activities that the user can interact with.
 */
export function LoomOSCard({
  id,
  title,
  appIcon,
  appColor = loomOSTheme.colors.accent,
  children,
  isActive = false,
  isMinimized = false,
  showLivePreview = true,
  className,
  onMaximize,
  onMinimize,
  onClose,
  onClick,
}: LoomOSCardProps) {
  // Motion values for drag interactions
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(y, [-200, 0, 200], [0.9, 1, 0.9]);

  // Handle drag end - dismiss if velocity threshold exceeded
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { velocity } = info;

    // If user flicks down fast enough, close the card
    if (velocity.y > gestures.swipeDismiss.velocity) {
      onClose?.(id);
    } else if (velocity.y < -gestures.swipeDismiss.velocity) {
      // Flick up - maximize
      onMaximize?.(id);
    } else {
      // Reset position
      y.set(0);
    }
  };

  // Determine card state for animations
  const getCardState = () => {
    if (isMinimized) return cardStates.minimized;
    if (isActive) return cardStates.active;
    return cardStates.default;
  };

  const cardState = getCardState();

  return (
    <motion.div
      layoutId={`loomos-card-${id}`}
      className={cn(
        'loomos-card',
        'relative rounded-lg overflow-hidden bg-white',
        'select-none cursor-pointer',
        className
      )}
      style={{
        y,
        opacity,
        scale,
        boxShadow: cardState.shadow,
      }}
      initial={animations.card.initial}
      animate={{
        scale: cardState.scale,
        opacity: cardState.opacity,
        transition: animations.card.transition,
      }}
      exit={animations.card.exit}
      drag={isMinimized ? 'y' : false}
      dragElastic={gestures.drag.elastic}
      dragConstraints={{ top: -100, bottom: 100 }}
      onDragEnd={handleDragEnd}
      whileHover={!isMinimized ? { scale: cardStates.hover.scale } : undefined}
      onClick={() => onClick?.(id)}
    >
      {/* Card Header */}
      <div
        className="loomos-card-header flex items-center gap-3 px-4 py-3 border-b border-gray-200"
        style={{ backgroundColor: isActive ? appColor : loomOSTheme.colors.surface }}
      >
        {/* App Icon */}
        {appIcon && (
          <div className="loomos-card-icon w-8 h-8 flex items-center justify-center">
            {appIcon}
          </div>
        )}

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'loomos-card-title font-semibold text-sm truncate',
              isActive ? 'text-white' : 'text-gray-900'
            )}
          >
            {title}
          </h3>
        </div>

        {/* Card Actions */}
        <div className="loomos-card-actions flex items-center gap-2">
          {/* Minimize Button */}
          {onMinimize && !isMinimized && (
            <motion.button
              className={cn(
                'p-1 rounded hover:bg-gray-200 transition-colors',
                isActive && 'hover:bg-white/20'
              )}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize(id);
              }}
              aria-label="Minimize"
            >
              <svg
                className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-600')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          )}

          {/* Maximize Button */}
          {onMaximize && isMinimized && (
            <motion.button
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onMaximize(id);
              }}
              aria-label="Maximize"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          )}

          {/* Close Button */}
          {onClose && (
            <motion.button
              className={cn(
                'p-1 rounded hover:bg-gray-200 transition-colors',
                isActive && 'hover:bg-white/20'
              )}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
              aria-label="Close"
            >
              <svg
                className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-600')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Card Content - Live Preview */}
      {showLivePreview && !isMinimized && (
        <div className="loomos-card-content relative overflow-hidden">
          {/* Live preview content that updates in real-time */}
          <div className="w-full h-full">{children}</div>
        </div>
      )}

      {/* Minimized Preview */}
      {isMinimized && (
        <div className="loomos-card-preview-mini h-24 overflow-hidden opacity-75">
          <div className="transform scale-50 origin-top-left pointer-events-none">
            {children}
          </div>
        </div>
      )}

      {/* Swipe Indicator (when dragging) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        style={{
          opacity: useTransform(y, [-100, 0, 100], [0, 0, 1]),
        }}
      />
    </motion.div>
  );
}

/**
 * LoomOSCardGrid
 *
 * Container for displaying multiple cards in a responsive grid layout
 */
export interface LoomOSCardGridProps {
  children: ReactNode;
  className?: string;
}

export function LoomOSCardGrid({ children, className }: LoomOSCardGridProps) {
  return (
    <motion.div
      className={cn(
        'loomos-card-grid',
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        'p-4',
        className
      )}
      variants={animations.staggerChildren}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

/**
 * LoomOSCardStack
 *
 * Stacked card view for multitasking visualization
 */
export interface LoomOSCardStackProps {
  children: ReactNode;
  className?: string;
}

export function LoomOSCardStack({ children, className }: LoomOSCardStackProps) {
  return (
    <div className={cn('loomos-card-stack', 'relative', className)}>
      {React.Children.map(children, (child, index) => (
        <div
          className="absolute inset-0"
          style={{
            zIndex: loomOSTheme.zIndex.card + index,
            transform: `translateY(${index * 20}px) scale(${1 - index * 0.05})`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
