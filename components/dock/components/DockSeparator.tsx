/**
 * DockSeparator Component
 * 
 * Visual separator between dock sections
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DockSeparatorProps } from '../types';
import { separatorVariants } from '../utils/animations';
import { A11Y_LABELS } from '../utils/constants';

export function DockSeparator({
  orientation,
  className,
}: DockSeparatorProps) {
  const classes = cn(
    'bg-border/50',
    orientation === 'horizontal' ? 'h-10 w-px mx-1' : 'w-10 h-px my-1',
    className
  );

  return (
    <motion.div
      variants={separatorVariants}
      initial="hidden"
      animate="visible"
      className={classes}
      role="separator"
      aria-label={A11Y_LABELS.separator}
    />
  );
}
