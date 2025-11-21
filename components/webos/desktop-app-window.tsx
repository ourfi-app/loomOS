// TODO: Review setTimeout calls for proper cleanup in useEffect return functions

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Maximize2, Minimize2, Minus, 
  Menu, ChevronDown, MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowManager } from '@/hooks/webos/use-window-manager';
import { useCardManager } from '@/lib/card-manager-store';
import { WindowDropZones } from './window-drop-zones';
import { detectSnapZone } from '@/lib/window-snapping';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

export interface MenuItemAction {
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItemAction[];
}

export interface MenuBarItem {
  label: string;
  items: MenuItemAction[];
}

interface DesktopAppWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  menuBar?: MenuBarItem[];
  toolbar?: React.ReactNode;
  statusBar?: React.ReactNode;
  showMenuBar?: boolean;
  gradient?: string;  // App-specific gradient from design system
}

export function DesktopAppWindow({
  id,
  title,
  children,
  icon,
  onClose,
  className,
  menuBar = [],
  toolbar,
  statusBar,
  showMenuBar = true,
  gradient,
}: DesktopAppWindowProps) {
  const {
    getWindowState,
    updateWindowPosition,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    snapWindowToCursor,
    initializeWindow,
  } = useWindowManager();
  
  const { minimizeCard, bringToFront, cards } = useCardManager();
  
  // Get the card data to access zIndex
  const currentCard = cards.find((c) => c.id === id);

  const [isDragging, setIsDragging] = useState(false);
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
    // Don't drag if clicking on controls or menu bar
    const target = e.target as HTMLElement;
    if (
      target.closest('.window-controls') ||
      target.closest('.menu-bar') ||
      target.closest('button')
    ) {
      return;
    }
    
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
      
      // Prevent text selection while dragging
      e.preventDefault();
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      
      // Check if we should snap the window
      const zone = detectSnapZone(e.clientX, e.clientY);
      if (zone) {
        snapWindowToCursor(id, e.clientX, e.clientY);
      }
      
      // Re-enable text selection
      document.body.style.userSelect = '';
    };

    // Disable text selection while dragging
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart, id, updateWindowPosition, snapWindowToCursor]);

  // Handle minimize with animation
  const handleMinimize = useCallback(() => {
    const windowEl = windowRef.current;
    if (!windowEl) return;

    // Get the dock position (bottom center)
    const dockY = window.innerHeight - 80; // Approximate dock position
    const dockX = window.innerWidth / 2;

    // Calculate the window's current position
    const rect = windowEl.getBoundingClientRect();
    const windowCenterX = rect.left + rect.width / 2;
    const windowCenterY = rect.top + rect.height / 2;

    // Calculate transform to dock
    const translateX = dockX - windowCenterX;
    const translateY = dockY - windowCenterY;

    // Apply minimizing animation
    windowEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    windowEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(0)`;
    windowEl.style.opacity = '0';

    // After animation, actually minimize
    setTimeout(() => {
      minimizeCard(id);
      // Navigate to dashboard to show it
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }, 300);
  }, [id, minimizeCard]);

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

  // Render menu item with submenu support
  const renderMenuItem = (item: MenuItemAction, index: number) => {
    if (item.separator) {
      return <DropdownMenuSeparator key={`separator-${index}`} />;
    }

    if (item.submenu && item.submenu.length > 0) {
      return (
        <DropdownMenuSub key={index}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            <span className="flex items-center gap-2">
              {item.icon}
              {item.label && <span>{item.label}</span>}
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.submenu.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        key={index}
        onClick={item.onClick}
        disabled={item.disabled}
      >
        <span className="flex items-center justify-between w-full gap-4">
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label && <span>{item.label}</span>}
          </span>
          {item.shortcut && (
            <kbd className="text-xs text-muted-foreground">{item.shortcut}</kbd>
          )}
        </span>
      </DropdownMenuItem>
    );
  };

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
          'fixed bg-background rounded-lg shadow-2xl overflow-hidden',
          'border border-border',
          'flex flex-col',
          isDragging && 'cursor-grabbing',
          className
        )}
        style={{
          left: windowState.x,
          top: windowState.y,
          width: windowState.width,
          height: windowState.height,
          zIndex: currentCard?.zIndex || windowState.zIndex || 1000,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={() => {
          focusWindow(id);
          bringToFront(id);
        }}
      >
        {/* Title Bar with Windows-style controls */}
        <div
          className={cn(
            'flex flex-col',
            gradient 
              ? `bg-gradient-to-r ${gradient}` 
              : 'bg-gradient-to-b from-muted/50 to-background',
            'border-b',
            gradient ? 'border-white/20' : 'border-border',
            'select-none'
          )}
        >
          {/* Main title bar with window controls */}
          <div
            className={cn(
              'flex items-center justify-between px-3 py-2',
              'cursor-grab active:cursor-grabbing'
            )}
            onMouseDown={handleDragStart}
            onDoubleClick={handleTitleBarDoubleClick}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {icon && <div className={cn('flex-shrink-0', gradient && 'text-white')}>{icon}</div>}
              <h3 className={cn(
                'font-semibold text-sm truncate',
                gradient ? 'text-white' : 'text-foreground'
              )}>{title}</h3>
            </div>

            {/* Window Controls - Windows style (right side) */}
            <div className="window-controls flex items-center flex-shrink-0">
              <button
                onClick={handleMinimize}
                className={cn(
                  'px-4 py-2 transition-colors focus:outline-none',
                  'h-full flex items-center justify-center',
                  gradient ? 'hover:bg-white/20' : 'hover:bg-muted/50'
                )}
                title="Minimize to Dock"
              >
                <Minus className={cn('w-4 h-4', gradient ? 'text-white' : 'text-foreground')} />
              </button>

              <button
                onClick={handleMaximizeToggle}
                className={cn(
                  'px-4 py-2 transition-colors focus:outline-none',
                  'h-full flex items-center justify-center',
                  gradient ? 'hover:bg-white/20' : 'hover:bg-muted/50'
                )}
                title={windowState.isMaximized || windowState.isSnapped ? 'Restore Down' : 'Maximize'}
              >
                {windowState.isMaximized || windowState.isSnapped ? (
                  <Minimize2 className={cn('w-4 h-4', gradient ? 'text-white' : 'text-foreground')} />
                ) : (
                  <Maximize2 className={cn('w-4 h-4', gradient ? 'text-white' : 'text-foreground')} />
                )}
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className={cn(
                    'px-4 py-2 transition-colors focus:outline-none',
                    'h-full flex items-center justify-center',
                    gradient 
                      ? 'hover:bg-[var(--semantic-error)]/80 hover:text-white' 
                      : 'hover:bg-destructive hover:text-destructive-foreground'
                  )}
                  title="Close"
                >
                  <X className={cn('w-4 h-4', gradient && 'text-white')} />
                </button>
              )}
            </div>
          </div>

          {/* Menu Bar */}
          {showMenuBar && menuBar.length > 0 && (
            <div className={cn(
              'menu-bar flex items-center px-2 py-1 gap-1 border-t',
              gradient ? 'border-white/20' : 'border-border/50'
            )}>
              {menuBar.map((menu, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'px-3 py-1.5 text-sm rounded transition-colors',
                        'focus:outline-none focus:ring-2',
                        gradient 
                          ? 'hover:bg-white/20 text-white focus:ring-white/50' 
                          : 'hover:bg-muted focus:ring-ring'
                      )}
                    >
                      {menu.label}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px]">
                    {menu.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          )}

          {/* Toolbar (optional) */}
          {toolbar && (
            <div className="px-3 py-2 border-t border-border/50">
              {toolbar}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>

        {/* Status Bar (optional) */}
        {statusBar && (
          <div className="px-3 py-1.5 border-t border-border bg-muted/30">
            {statusBar}
          </div>
        )}

        {/* Resize Handle (bottom-right corner) */}
        {!windowState.isMaximized && !windowState.isSnapped && (
          <div
            className={cn(
              'absolute bottom-0 right-0 w-4 h-4',
              'cursor-se-resize',
              'hover:bg-primary/20'
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              focusWindow(id);
            }}
          />
        )}
      </motion.div>
    </>
  );
}
