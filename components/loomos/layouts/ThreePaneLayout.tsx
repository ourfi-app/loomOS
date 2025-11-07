'use client';

import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// loomOS Spring Physics
const loomOSSpring = {
  stiffness: 300,
  damping: 25,
  mass: 1,
};

interface ThreePaneLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  leftWidth?: number;
  centerWidth?: number;
  collapsible?: ('left' | 'center' | 'right')[];
  className?: string;
}

export function ThreePaneLayout({
  left,
  center,
  right,
  leftWidth = 200,
  centerWidth = 280,
  collapsible = [],
  className,
}: ThreePaneLayoutProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [centerCollapsed, setCenterCollapsed] = useState(false);

  const canCollapseLeft = collapsible.includes('left');
  const canCollapseCenter = collapsible.includes('center');

  return (
    <div className={cn('flex h-full overflow-hidden bg-gray-50 dark:bg-gray-900', className)}>
      {/* Left Pane */}
      <motion.div
        initial={false}
        animate={{
          width: leftCollapsed ? 48 : leftWidth,
        }}
        transition={{ type: 'spring', ...loomOSSpring }}
        className="relative flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
      >
        <div className="h-full overflow-hidden">
          {leftCollapsed ? (
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Peeking content - show icons only */}
            </div>
          ) : (
            left
          )}
        </div>

        {canCollapseLeft && (
          <button
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
                     w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200
                     dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow
                     flex items-center justify-center"
            aria-label={leftCollapsed ? 'Expand left pane' : 'Collapse left pane'}
          >
            {leftCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        )}
      </motion.div>

      {/* Center Pane */}
      <motion.div
        initial={false}
        animate={{
          width: centerCollapsed ? 48 : centerWidth,
        }}
        transition={{ type: 'spring', ...loomOSSpring }}
        className="relative flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
      >
        <div className="h-full overflow-hidden">
          {centerCollapsed ? (
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Peeking content */}
            </div>
          ) : (
            center
          )}
        </div>

        {canCollapseCenter && (
          <button
            onClick={() => setCenterCollapsed(!centerCollapsed)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
                     w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200
                     dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow
                     flex items-center justify-center"
            aria-label={centerCollapsed ? 'Expand center pane' : 'Collapse center pane'}
          >
            {centerCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        )}
      </motion.div>

      {/* Right Pane (Detail) - Takes remaining space */}
      <div className="flex-1 overflow-hidden">
        {right}
      </div>
    </div>
  );
}
