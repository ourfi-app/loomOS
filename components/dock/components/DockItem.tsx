/**
 * DockItem Component
 * 
 * Individual app icon in the dock with status indicators
 */

'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DockItemContextMenu } from './DockItemContextMenu';
import type { DockItemProps } from '../types';
import {
  dockItemVariants,
  indicatorVariants,
  minimizedBadgeVariants,
} from '../utils/animations';
import {
  A11Y_LABELS,
  INDICATORS,
  DOCK_DEFAULTS,
} from '../utils/constants';
import {
  getDockItemSizeClasses,
  getStatusLabel,
  canCustomizeApp,
} from '../utils/dockHelpers';

export const DockItem = memo(function DockItem({
  app,
  status,
  position,
  isDragging = false,
  isDropTarget = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDragEnd,
  onDrop,
  className,
}: DockItemProps) {
  const Icon = app.icon;
  const sizeClasses = getDockItemSizeClasses(DOCK_DEFAULTS.size);
  const canCustomize = canCustomizeApp(
    status.isPinned,
    position,
    DOCK_DEFAULTS.maxPinnedApps
  );
  const statusLabel = getStatusLabel(status);

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart && status.isPinned) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', app.id);
      onDragStart(app.id);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (status.isPinned) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop && status.isPinned) {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      onDrop(draggedId, app.id);
    }
  };

  return (
    <DockItemContextMenu
      app={app}
      status={status}
      position={position}
      canCustomize={canCustomize}
      onAction={(app, action) => {
        // Actions are handled by the parent through the context menu
        // This is a placeholder to maintain the interface
      }}
    >
      <motion.button
        variants={dockItemVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        animate={isDragging ? 'drag' : 'idle'}
        className={cn(
          'dock-item group relative flex flex-col items-center justify-center',
          sizeClasses.container,
          'rounded-2xl',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          status.isActive && 'ring-2 ring-primary',
          status.isMinimized && 'opacity-75',
          isDropTarget && 'ring-2 ring-primary/50',
          className
        )}
        onClick={() => onClick(app)}
        onMouseEnter={() => onMouseEnter(app.id)}
        onMouseLeave={onMouseLeave}
        draggable={status.isPinned}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-label={A11Y_LABELS.dockItem(app.title, statusLabel)}
      >
        {/* App Icon Container */}
        <div
          className={cn(
            'flex items-center justify-center w-full h-full rounded-2xl',
            'bg-gradient-to-br shadow-lg',
            app.gradient || 'from-gray-500 to-gray-700',
            'group-hover:shadow-2xl transition-shadow'
          )}
        >
          <Icon className={cn(sizeClasses.icon, 'text-white drop-shadow-md')} />
        </div>

        {/* Running/Active/Minimized Indicator */}
        {(status.isRunning || status.isActive || status.isMinimized) && (
          <AnimatePresence>
            <motion.div
              variants={indicatorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'absolute -bottom-2 rounded-full shadow-lg',
                status.isActive
                  ? `${INDICATORS.active.size} ${INDICATORS.active.color} ${INDICATORS.active.animation}`
                  : status.isMinimized
                  ? `${INDICATORS.minimized.size} ${INDICATORS.minimized.color}`
                  : `${INDICATORS.running.size} ${INDICATORS.running.color}`
              )}
            />
          </AnimatePresence>
        )}

        {/* Minimized Overlay Badge */}
        {status.isMinimized && (
          <AnimatePresence>
            <motion.div
              variants={minimizedBadgeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--semantic-warning)] border-2 border-background flex items-center justify-center"
            >
              <Minimize2 className="w-3 h-3 text-white" />
            </motion.div>
          </AnimatePresence>
        )}
      </motion.button>
    </DockItemContextMenu>
  );
});

DockItem.displayName = 'DockItem';
