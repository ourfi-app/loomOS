'use client';

import { Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loom } from '@/lib/loom-store';

/**
 * LoomIcon Component
 *
 * Special dock icon for pinned looms
 * Features gradient background and stores activity context
 */

interface LoomIconProps {
  loom: Loom;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function LoomIcon({ loom, onClick, onContextMenu }: LoomIconProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.2, y: -8 }}
      whileTap={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'dock-icon loom-icon group relative flex flex-col items-center justify-center',
        'h-14 w-14 sm:h-16 sm:w-16 rounded-2xl',
        'focus:outline-none focus:ring-2 focus:ring-primary/50'
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-label={`Loom: ${loom.title}`}
      title={loom.title}
    >
      <div
        className={cn(
          'flex items-center justify-center w-full h-full rounded-2xl',
          'bg-gradient-to-br shadow-lg',
          'from-purple-500 via-purple-600 to-pink-600',
          'group-hover:shadow-2xl transition-shadow'
        )}
        style={{
          boxShadow: '0 5px 15px rgba(118, 75, 162, 0.4)',
        }}
      >
        <Archive className="h-7 w-7 sm:h-8 sm:w-8 text-white drop-shadow-md" />
      </div>

      {/* Loom indicator badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -bottom-2 w-2 h-2 bg-purple-400 rounded-full shadow-lg animate-pulse"
      />
    </motion.button>
  );
}
