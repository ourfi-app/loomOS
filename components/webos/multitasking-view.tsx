// TODO: Review setTimeout calls for proper cleanup in useEffect return functions

'use client';

import { useCardManager } from '@/lib/card-manager-store';
import { useRouter, usePathname } from 'next/navigation';
import { X, Minimize2, Maximize2, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useWindowManager } from '@/hooks/webos/use-window-manager';

interface MultitaskingViewProps {
  children: React.ReactNode;
}

interface DraggableCardProps {
  card: any;
  isActive: boolean;
  windowState: any;
  onFocus: () => void;
  onClose: (e: React.MouseEvent) => void;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: (e: React.MouseEvent) => void;
  onDrag: (x: number, y: number) => void;
  onResize: (width: number, height: number, x?: number, y?: number) => void;
  children: React.ReactNode;
}

function DraggableCard({
  card,
  isActive,
  windowState,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDrag,
  onResize,
  children,
}: DraggableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cardX: 0, cardY: 0 });
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, y: 0, width: 0, height: 0, cardX: 0, cardY: 0, direction: '' 
  });

  // Dragging logic
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // Only drag from header, not from buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      cardX: windowState.x,
      cardY: windowState.y,
    });
    onFocus();
    e.preventDefault();
  }, [windowState, onFocus]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    onDrag(dragStart.cardX + deltaX, dragStart.cardY + deltaY);
  }, [isDragging, dragStart, onDrag]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Resizing logic
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowState.width,
      height: windowState.height,
      cardX: windowState.x,
      cardY: windowState.y,
      direction,
    });
    onFocus();
  }, [windowState, onFocus]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = resizeStart.cardX;
    let newY = resizeStart.cardY;

    const minWidth = 400;
    const minHeight = 300;

    if (resizeStart.direction.includes('e')) {
      newWidth = Math.max(minWidth, resizeStart.width + deltaX);
    }
    if (resizeStart.direction.includes('w')) {
      const widthDelta = Math.min(deltaX, resizeStart.width - minWidth);
      newWidth = resizeStart.width - widthDelta;
      newX = resizeStart.cardX + widthDelta;
    }
    if (resizeStart.direction.includes('s')) {
      newHeight = Math.max(minHeight, resizeStart.height + deltaY);
    }
    if (resizeStart.direction.includes('n')) {
      const heightDelta = Math.min(deltaY, resizeStart.height - minHeight);
      newHeight = resizeStart.height - heightDelta;
      newY = resizeStart.cardY + heightDelta;
    }

    onResize(newWidth, newHeight, newX, newY);
  }, [isResizing, resizeStart, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Handle minimize with animation
  const handleMinimizeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimizing(true);
    // Wait for animation to complete, then minimize and hide
    setTimeout(() => {
      setIsHidden(false); // Don't hide permanently, let the parent handle visibility
      onMinimize(e);
    }, 300); // Match animation duration
  }, [onMinimize]);

  // Show card when it becomes active again
  useEffect(() => {
    if (isActive && isHidden) {
      setIsHidden(false);
      setIsMinimizing(false);
    }
  }, [isActive, isHidden]);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
    return undefined;
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
    return undefined;
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Calculate style based on window state
  const STATUS_BAR_HEIGHT = 48; // h-12 = 48px (matches StatusBar height)
  const DOCK_HEIGHT = 96; // ~6rem (dock + gesture area + padding)
  
  const cardStyle: React.CSSProperties = windowState.isMaximized
    ? {
        position: 'fixed',
        left: '0',
        top: `${STATUS_BAR_HEIGHT}px`,
        width: '100vw',
        height: `calc(100vh - ${STATUS_BAR_HEIGHT}px - ${DOCK_HEIGHT}px)`,
        transform: 'none',
        zIndex: 90, // Above regular windows (50-89) but below status bar (100)
        borderRadius: '0', // Remove rounded corners when maximized
        maxWidth: 'none',
      }
    : {
        '--window-x': `${windowState.x}px`,
        '--window-y': `${windowState.y}px`,
        '--window-width': `${windowState.width}px`,
        '--window-height': `${windowState.height}px`,
        zIndex: windowState.zIndex,
      } as React.CSSProperties;

  // Don't render if card is minimized
  if (card.minimized) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "webos-app-card webos-app-card-draggable",
        isActive && "webos-app-card-active",
        (isDragging || isResizing) && "webos-app-card-dragging",
        isMinimizing && "webos-minimize-left-draggable",
        windowState.isMaximized && "webos-card-maximized"
      )}
      style={cardStyle}
      onMouseDown={onFocus}
    >
      {/* Card Header - Drag Handle */}
      <div
        className={cn(
          "webos-app-card-header",
          `bg-gradient-to-r ${card.color}`,
          "cursor-move"
        )}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="webos-app-card-icon">
            <div className="w-5 h-5 rounded-full bg-white/30" />
          </div>
          <span className="webos-app-card-title truncate">
            {card.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimizeClick}
            className="webos-app-card-control"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onMaximize}
            className="webos-app-card-control"
            title={windowState.isMaximized ? "Restore" : "Maximize"}
          >
            {windowState.isMaximized ? (
              <Square className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="webos-app-card-control webos-app-card-close"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="webos-app-card-body">
        <div className="webos-app-card-content">
          {children}
        </div>
      </div>

      {/* Resize Handles */}
      {!windowState.isMaximized && (
        <>
          <div 
            className="webos-resize-handle webos-resize-n" 
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div 
            className="webos-resize-handle webos-resize-s" 
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div 
            className="webos-resize-handle webos-resize-e" 
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          <div 
            className="webos-resize-handle webos-resize-w" 
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div 
            className="webos-resize-handle webos-resize-ne" 
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div 
            className="webos-resize-handle webos-resize-nw" 
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div 
            className="webos-resize-handle webos-resize-se" 
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <div 
            className="webos-resize-handle webos-resize-sw" 
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
        </>
      )}
    </div>
  );
}

export function MultitaskingView({ children }: MultitaskingViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    cards, 
    activeCardId, 
    isMultitaskingView, 
    closeCard, 
    setActiveCard,
    toggleMultitaskingView,
    minimizeCard,
  } = useCardManager();

  const {
    getWindowState,
    updateWindowPosition,
    updateWindowSize,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    initializeWindow,
    removeWindow,
  } = useWindowManager();

  const [centerIndex, setCenterIndex] = useState(0);

  // Initialize windows for all cards
  useEffect(() => {
    cards.forEach(card => {
      initializeWindow(card.id);
    });
  }, [cards, initializeWindow]);

  // Find active card index
  useEffect(() => {
    if (activeCardId) {
      const index = cards.findIndex(c => c.id === activeCardId);
      if (index !== -1) {
        setCenterIndex(index);
      }
    }
  }, [activeCardId, cards]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + W to close active card
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (activeCardId) {
          closeCard(activeCardId);
          removeWindow(activeCardId);
          router.push('/dashboard');
        }
      }
      
      // Ctrl/Cmd + Tab to toggle multitasking view
      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
        e.preventDefault();
        if (cards.length > 0) {
          toggleMultitaskingView();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardId, cards.length, closeCard, router, toggleMultitaskingView, removeWindow]);

  const handleCardClick = (cardId: string, cardPath: string) => {
    setActiveCard(cardId);
    focusWindow(cardId);
    router.push(cardPath);
  };

  const handleCloseCard = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    closeCard(cardId);
    removeWindow(cardId);
    if (activeCardId === cardId) {
      router.push('/dashboard');
    }
  };

  const handleFocus = (cardId: string) => {
    setActiveCard(cardId);
    focusWindow(cardId);
  };

  const handleMaximize = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    const windowState = getWindowState(cardId);
    if (windowState.isMaximized) {
      restoreWindow(cardId);
    } else {
      maximizeWindow(cardId);
    }
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - centerIndex;
    const isActive = cards[index]?.id === activeCardId;
    
    if (isMultitaskingView) {
      // Multitasking view - show all cards in carousel
      const horizontalOffset = diff * 100;
      const depth = -Math.abs(diff) * 100;
      const rotation = diff * -15;
      const scale = isActive ? 1 : 0.85;
      
      return {
        transform: `
          translateX(${horizontalOffset}%)
          translateZ(${depth}px)
          rotateY(${rotation}deg)
          scale(${scale})
        `,
        opacity: 1,
        zIndex: isActive ? 10 : 10 - Math.abs(diff),
        pointerEvents: 'auto' as const,
      };
    }
    
    return {}; // Not used in desktop mode
  };

  // If no cards are active (on dashboard home), show the regular content
  if (cards.length === 0 || pathname === '/dashboard') {
    return <>{children}</>;
  }

  // Get non-minimized cards for display
  const visibleCards = cards.filter(c => !c.minimized);

  return (
    <div className="webos-multitasking-container">
      {isMultitaskingView ? (
        // Multitasking carousel view
        <div className="webos-cards-stage webos-cards-stage-multitasking">
          {visibleCards.map((card, index) => {
            const isActive = card.id === activeCardId;
            const style = getCardStyle(index);
            
            return (
              <div
                key={card.id}
                className={cn(
                  "webos-app-card",
                  isActive && "webos-app-card-active"
                )}
                style={style}
                onClick={() => !isActive && handleCardClick(card.id, card.path)}
              >
                <div className={cn(
                  "webos-app-card-header",
                  `bg-gradient-to-r ${card.color}`
                )}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="webos-app-card-icon">
                      <div className="w-5 h-5 rounded-full bg-white/30" />
                    </div>
                    <span className="webos-app-card-title truncate">
                      {card.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        minimizeCard(card.id);
                        // If this was the only visible card, exit multitasking view
                        if (visibleCards.length === 1) {
                          toggleMultitaskingView();
                        }
                      }}
                      className="webos-app-card-control"
                      title="Minimize"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleCloseCard(e, card.id)}
                      className="webos-app-card-control webos-app-card-close"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="webos-app-card-body">
                  <div className="webos-app-card-preview">
                    <div className={cn(
                      "webos-app-card-preview-overlay",
                      `bg-gradient-to-br ${card.color}`
                    )}>
                      <div className="text-center text-white">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                          <div className="w-8 h-8 rounded-full bg-white/30" />
                        </div>
                        <p className="font-semibold text-lg mb-1">{card.title}</p>
                        <p className="text-xs text-white/70">Tap to open</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Multitasking indicator */}
          {visibleCards.length > 1 && (
            <div className="webos-multitasking-indicator">
              <p className="text-sm text-muted-foreground">
                {visibleCards.length} app{visibleCards.length !== 1 ? 's' : ''} open
              </p>
              <div className="flex gap-1 mt-2">
                {visibleCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id, card.path)}
                    className={cn(
                      "webos-multitasking-dot",
                      card.id === activeCardId && "webos-multitasking-dot-active"
                    )}
                    title={card.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Desktop mode - render the current page content
        // Note: Due to Next.js routing, only one app page can be rendered at a time
        // The DesktopAppWrapper on each app page creates the window chrome
        <div className="relative w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}
