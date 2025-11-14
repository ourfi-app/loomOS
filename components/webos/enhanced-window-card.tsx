
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowManager } from '@/hooks/webos/use-window-manager';
import { WindowDropZones } from './window-drop-zones';
import { detectSnapZone } from '@/lib/window-snapping';

interface EnhancedWindowCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function EnhancedWindowCard({
  id,
  title,
  children,
  icon,
  onClose,
  className,
}: EnhancedWindowCardProps) {
  const {
    getWindowState,
    updateWindowPosition,
    updateWindowSize,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    snapWindowToCursor,
    initializeWindow,
  } = useWindowManager();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, windowX: 0, windowY: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Initialize window on mount
  useEffect(() => {
    initializeWindow(id);
  }, [id, initializeWindow]);

  const windowState = getWindowState(id);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      windowX: windowState.x,
      windowY: windowState.y,
    });
    focusWindow(id);
  }, [windowState, focusWindow, id]);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      updateWindowPosition(
        id,
        dragStart.windowX + deltaX,
        dragStart.windowY + deltaY
      );

      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      
      // Check if we should snap the window
      const zone = detectSnapZone(e.clientX, e.clientY);
      if (zone) {
        snapWindowToCursor(id, e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, id, updateWindowPosition, snapWindowToCursor]);

  // Handle maximize/restore toggle
  const handleMaximizeToggle = useCallback(() => {
    if (windowState.isMaximized || windowState.isSnapped) {
      restoreWindow(id);
    } else {
      maximizeWindow(id);
    }
  }, [windowState.isMaximized, windowState.isSnapped, id, maximizeWindow, restoreWindow]);

  // Handle double-click on title bar to maximize
  const handleTitleBarDoubleClick = useCallback(() => {
    handleMaximizeToggle();
  }, [handleMaximizeToggle]);

  if (!windowState) return null;

  return (
    <>
      {/* Drop zones overlay when dragging */}
      <WindowDropZones
        isDragging={isDragging}
        cursorX={cursorPos.x}
        cursorY={cursorPos.y}
      />

      <motion.div
        ref={windowRef}
        className={cn(
          'fixed bg-white rounded-xl shadow-2xl overflow-hidden',
          'border border-[var(--semantic-border-light)]',
          'flex flex-col',
          isDragging && 'cursor-grabbing',
          className
        )}
        style={{
          left: windowState.x,
          top: windowState.y,
          width: windowState.width,
          height: windowState.height,
          zIndex: windowState.zIndex,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={() => focusWindow(id)}
      >
        {/* Title Bar */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3',
            'bg-gradient-to-b from-gray-50 to-white',
            'border-b border-[var(--semantic-border-light)]',
            'select-none cursor-grab active:cursor-grabbing'
          )}
          onMouseDown={handleDragStart}
          onDoubleClick={handleTitleBarDoubleClick}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h3 className="font-semibold text-[var(--semantic-text-primary)] truncate">{title}</h3>
          </div>

          {/* Window Controls */}
          <div className="window-controls flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => restoreWindow(id)}
              className={cn(
                'p-1.5 rounded-lg hover:bg-[var(--semantic-bg-muted)]',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300'
              )}
              title="Minimize"
            >
              <Minus className="w-4 h-4 text-[var(--semantic-text-secondary)]" />
            </button>

            <button
              onClick={handleMaximizeToggle}
              className={cn(
                'p-1.5 rounded-lg hover:bg-[var(--semantic-bg-muted)]',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300'
              )}
              title={windowState.isMaximized || windowState.isSnapped ? 'Restore' : 'Maximize'}
            >
              {windowState.isMaximized || windowState.isSnapped ? (
                <Minimize2 className="w-4 h-4 text-[var(--semantic-text-secondary)]" />
              ) : (
                <Maximize2 className="w-4 h-4 text-[var(--semantic-text-secondary)]" />
              )}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className={cn(
                  'p-1.5 rounded-lg hover:bg-red-500 hover:text-white',
                  'transition-colors focus:outline-none focus:ring-2 focus:ring-red-300'
                )}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>

        {/* Resize Handle (bottom-right corner) */}
        {!windowState.isMaximized && !windowState.isSnapped && (
          <div
            className={cn(
              'absolute bottom-0 right-0 w-4 h-4',
              'cursor-se-resize',
              'hover:bg-blue-500/20'
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
              focusWindow(id);
            }}
          />
        )}
      </motion.div>
    </>
  );
}
