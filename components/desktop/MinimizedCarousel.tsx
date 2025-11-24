'use client';

import { useState } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/lib/store/appStore';
import { cn } from '@/lib/utils';

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 500;

export function MinimizedCarousel() {
  const { getMinimizedApps, restoreApp, closeApp } = useAppStore();
  const minimizedApps = getMinimizedApps();
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  if (minimizedApps.length === 0) return null;

  const handleDragEnd = (appId: string, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Check if swipe up is significant enough to dismiss
    if (
      offset.y < -SWIPE_THRESHOLD ||
      velocity.y < -SWIPE_VELOCITY_THRESHOLD
    ) {
      // Dismiss (close) the app
      setDismissingId(appId);
      setTimeout(() => {
        closeApp(appId);
        setDismissingId(null);
      }, 300);
    }
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 z-30 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide justify-center pointer-events-auto">
          <AnimatePresence mode="popLayout">
            {minimizedApps.map((app, index) => (
              <MinimizedCard
                key={app.id}
                app={app}
                index={index}
                isDismissing={dismissingId === app.id}
                onRestore={() => restoreApp(app.id)}
                onClose={() => closeApp(app.id)}
                onDragEnd={(info) => handleDragEnd(app.id, info)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MinimizedCard({
  app,
  index,
  isDismissing,
  onRestore,
  onClose,
  onDragEnd,
}: {
  app: any;
  index: number;
  isDismissing: boolean;
  onRestore: () => void;
  onClose: () => void;
  onDragEnd: (info: PanInfo) => void;
}) {
  const Icon = app.appDef.icon;
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{
        opacity: isDismissing ? 0 : 1,
        scale: isDismissing ? 0.8 : 1,
        y: isDismissing ? -100 : 0,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      drag="y"
      dragConstraints={{ top: -50, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDragEnd(info);
      }}
      className={cn(
        'relative w-64 h-40 rounded-2xl bg-bg-surface shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden',
        'border border-border-light',
        isDragging && 'scale-105'
      )}
      style={{
        transformOrigin: 'center bottom',
      }}
    >
      {/* Swipe Up Indicator */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-text-secondary flex items-center gap-1"
        >
          <span>⬆️</span>
          <span>Swipe up to close</span>
        </motion.div>
      )}

      {/* App Content Preview */}
      <div
        className="h-full w-full p-4 flex flex-col"
        onClick={onRestore}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shadow-md',
                'bg-gradient-to-br',
                app.appDef.gradient || 'from-gray-500 to-gray-700'
              )}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-text-primary text-sm">
              {app.appDef.title}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-error transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Placeholder for app preview */}
        <div className="flex-1 rounded-lg bg-bg-secondary flex items-center justify-center text-text-tertiary">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {app.appDef.iconKey === 'Calendar' && '📅'}
              {app.appDef.iconKey === 'Mail' && '📧'}
              {app.appDef.iconKey === 'Users' && '👥'}
              {app.appDef.iconKey === 'FileText' && '📄'}
              {!['Calendar', 'Mail', 'Users', 'FileText'].includes(app.appDef.iconKey) && '📱'}
            </div>
            <div className="text-xs">Tap to restore</div>
          </div>
        </div>
      </div>

      {/* Drag Handle Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-text-tertiary/30" />
    </motion.div>
  );
}
