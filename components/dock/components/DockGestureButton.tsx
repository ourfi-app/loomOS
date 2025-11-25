/**
 * DockGestureButton Component
 * 
 * Visual indicator and button to show hidden dock via gesture
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DockGestureButtonProps } from '../types';
import { gestureButtonVariants } from '../utils/animations';
import { A11Y_LABELS } from '../utils/constants';

export function DockGestureButton({
  isDockVisible,
  isHomePage,
  onShowDock,
  className,
}: DockGestureButtonProps) {
  // Only show gesture button when dock is hidden and not on home page
  if (isDockVisible || isHomePage) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.button
        variants={gestureButtonVariants}
        initial="hidden"
        animate="pulse"
        exit="hidden"
        onClick={onShowDock}
        className={cn(
          'fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998]',
          'flex items-center justify-center',
          'w-12 h-1.5 rounded-full',
          'bg-primary/30 backdrop-blur-sm shadow-lg',
          'hover:bg-primary/50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          className
        )}
        aria-label={A11Y_LABELS.gestureButton}
      >
        <ArrowUp className="w-4 h-4 text-white opacity-0" />
      </motion.button>
    </AnimatePresence>
  );
}
