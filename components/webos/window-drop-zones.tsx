
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectSnapZone, type SnapZone } from '@/lib/window-snapping';
import { cn } from '@/lib/utils';

interface WindowDropZonesProps {
  isDragging: boolean;
  cursorX: number;
  cursorY: number;
}

export function WindowDropZones({ isDragging, cursorX, cursorY }: WindowDropZonesProps) {
  const [activeZone, setActiveZone] = useState<SnapZone | null>(null);

  useEffect(() => {
    if (isDragging) {
      const zone = detectSnapZone(cursorX, cursorY);
      setActiveZone(zone);
    } else {
      setActiveZone(null);
    }
  }, [isDragging, cursorX, cursorY]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none">
      {/* Hint overlays - show faint zones when dragging */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
      >
        {/* Edge hints */}
        <div className="absolute left-0 top-[28px] w-20 bottom-[72px] border-r border-blue-300/50" />
        <div className="absolute right-0 top-[28px] w-20 bottom-[72px] border-l border-blue-300/50" />
        <div className="absolute top-[28px] left-0 right-0 h-20 border-b border-blue-300/50" />
      </motion.div>

      {/* Active zone highlight */}
      <AnimatePresence>
        {activeZone && (
          <motion.div
            key={activeZone.position}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute rounded-lg border-4 border-blue-500',
              'bg-blue-500/30 backdrop-blur-sm',
              'shadow-2xl'
            )}
            style={{
              left: activeZone.x,
              top: activeZone.y,
              width: activeZone.width,
              height: activeZone.height,
            }}
          >
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-blue-400/60 rounded-md pointer-events-none" />
            
            {/* Position label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-2xl"
            >
              {getPositionLabel(activeZone.position)}
            </motion.div>

            {/* Animated border pulse */}
            <motion.div
              className="absolute inset-0 rounded-lg border-4 border-blue-400"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getPositionLabel(position: string): string {
  const labels: Record<string, string> = {
    'left-half': 'Left Half',
    'right-half': 'Right Half',
    'top-half': 'Top Half',
    'bottom-half': 'Bottom Half',
    'top-left-quarter': 'Top Left',
    'top-right-quarter': 'Top Right',
    'bottom-left-quarter': 'Bottom Left',
    'bottom-right-quarter': 'Bottom Right',
    'maximize': 'Maximize',
    'center': 'Center',
  };
  return labels[position] || position;
}
