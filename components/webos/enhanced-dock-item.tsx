
'use client';

import { memo, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AppDefinition } from '@/lib/enhanced-app-registry';
import { 
  PlayCircle, 
  Pin, 
  PinOff, 
  Info,
  X,
  Maximize2,
  Settings
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface EnhancedDockItemProps {
  app: AppDefinition;
  isActive: boolean;
  isPinned: boolean;
  isMinimized?: boolean;
  isDragging?: boolean;
  isEditMode?: boolean;
  onLaunch: (app: AppDefinition) => void;
  onPin: (appId: string) => void;
  onUnpin: (appId: string) => void;
  onInfo: (appId: string) => void;
  onRemove?: (appId: string) => void;
  onDragStart?: () => void;
  onDragEnd?: (appId: string, newIndex: number) => void;
  onSwipeAction?: (appId: string, direction: 'left' | 'right') => void;
  onLongPress?: (appId: string) => void;
  onToggleEditMode?: () => void;
  index: number;
}

export const EnhancedDockItem = memo(({
  app,
  isActive,
  isPinned,
  isMinimized = false,
  isDragging = false,
  isEditMode = false,
  onLaunch,
  onPin,
  onUnpin,
  onInfo,
  onRemove,
  onDragStart,
  onDragEnd,
  onSwipeAction,
  onLongPress,
  onToggleEditMode,
  index,
}: EnhancedDockItemProps) => {
  const Icon = app.icon;
  
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Motion values for drag interactions
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useTransform(y, [-80, 0], [1.3, 1]);
  const iconScale = useTransform(x, [-100, 0, 100], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-100, 0, 100], [-8, 0, 8]);
  const opacity = useTransform(
    x,
    [-120, -80, 0, 80, 120],
    [0.3, 1, 1, 1, 0.3]
  );

  const handlePanStart = () => {
    if (isEditMode && onDragStart) {
      onDragStart();
    }
    
    // Long press timer for entering edit mode
    if (!isEditMode && onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress(app.id);
      }, 500);
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    // Cancel long press if moving
    if (longPressTimer.current && Math.abs(info.offset.x) > 10) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Horizontal swipe for quick actions
    if (!isEditMode && Math.abs(info.offset.x) > 50) {
      setShowQuickActions(true);
    }
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Handle swipe actions
    if (!isEditMode && Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      if (onSwipeAction) {
        onSwipeAction(app.id, direction);
      }
    }

    // Reset position with spring animation
    x.set(0);
    y.set(0);
    setShowQuickActions(false);
  };

  const handleTap = () => {
    if (!isEditMode && !showQuickActions) {
      onLaunch(app);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            delay: index * 0.05,
          }}
        >
          {/* Quick action indicators (left/right swipe) */}
          <AnimatePresence>
            {showQuickActions && (
              <>
                {/* Left action (pin/unpin) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-2 z-10"
                >
                  <div className="bg-[var(--semantic-primary)] rounded-full p-2 shadow-lg">
                    {isPinned ? (
                      <PinOff className="w-5 h-5 text-white" />
                    ) : (
                      <Pin className="w-5 h-5 text-white" />
                    )}
                  </div>
                </motion.div>

                {/* Right action (info) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 z-10"
                >
                  <div className="bg-[var(--semantic-accent)] rounded-full p-2 shadow-lg">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main dock item */}
          <motion.button
            style={{ 
              x: isEditMode ? 0 : x, 
              y: isEditMode ? y : 0,
              scale: isEditMode ? scale : 1,
              opacity 
            }}
            drag={isEditMode}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
            onTap={handleTap}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={!isEditMode ? { scale: 1.1, y: -8 } : {}}
            whileTap={!isEditMode ? { scale: 0.95 } : {}}
            className={cn(
              'dock-item group relative flex flex-col items-center justify-center',
              'h-11 w-11 sm:h-12 sm:w-12',
              'rounded-xl transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              isActive && 'ring-2 ring-primary',
              isEditMode && 'cursor-move',
              isDragging && 'opacity-50'
            )}
            aria-label={`Launch ${app.title}`}
          >
            {/* Icon container with gradient */}
            <motion.div 
              style={{ scale: iconScale, rotate }}
              className={cn(
                'flex items-center justify-center w-full h-full rounded-xl',
                'bg-gradient-to-br shadow-lg relative overflow-hidden',
                app.gradient || 'from-gray-500 to-gray-700',
                'group-hover:shadow-2xl transition-all duration-300',
                isMinimized && 'opacity-60 group-hover:opacity-100'
              )}
            >
              {/* Shimmer effect on hover */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                transition={{ 
                  duration: 0.8, 
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 1 
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              
              {/* Ripple effect on tap */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-white rounded-xl"
                  />
                )}
              </AnimatePresence>

              <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
            </motion.div>
            
            {/* Active/Running indicator with spring animation */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  layoutId={`active-indicator-${app.id}`}
                  className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-lg"
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 10 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* Minimized indicator with pulse */}
            <AnimatePresence>
              {isMinimized && (
                <motion.div 
                  className="absolute -bottom-1.5 w-2 h-2 rounded-full bg-[var(--semantic-primary)] shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  exit={{ scale: 0 }}
                  transition={{
                    scale: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    },
                    opacity: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }
                  }}
                />
              )}
            </AnimatePresence>

            {/* Edit mode indicators */}
            <AnimatePresence>
              {isEditMode && (
                <>
                  {/* Wobble animation */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      rotate: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />

                  {/* Remove button */}
                  {onRemove && (
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(app.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--semantic-error)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--semantic-error)] transition-colors z-20"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Tooltip on hover */}
            <AnimatePresence>
              {isHovered && !isEditMode && !showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                >
                  <div className="bg-background/95 backdrop-blur-md border rounded-lg px-3 py-1.5 shadow-xl">
                    <p className="text-sm font-medium whitespace-nowrap">
                      {app.title}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-r border-b rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onLaunch(app)}>
          <PlayCircle className="mr-2 h-4 w-4" />
          <span>Open {app.title}</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {app.canPinToDock && (
          <>
            {isPinned ? (
              <ContextMenuItem onClick={() => onUnpin(app.id)}>
                <PinOff className="mr-2 h-4 w-4" />
                <span>Unpin from Dock</span>
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={() => onPin(app.id)}>
                <Pin className="mr-2 h-4 w-4" />
                <span>Pin to Dock</span>
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
          </>
        )}
        
        {onToggleEditMode && (
          <>
            <ContextMenuItem onClick={onToggleEditMode}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{isEditMode ? 'Done Editing' : 'Reorder Apps'}</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        
        <ContextMenuItem onClick={() => onInfo(app.id)}>
          <Info className="mr-2 h-4 w-4" />
          <span>App Info</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

EnhancedDockItem.displayName = 'EnhancedDockItem';
