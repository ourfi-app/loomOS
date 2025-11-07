
'use client';

import { useCardManager } from '@/lib/card-manager-store';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Grid3x3, X, ChevronUp, ChevronLeft, ChevronRight,
  Palette, Plus, Layout, Settings, Camera, Maximize2, 
  Minimize2, FileText, MessageSquare, CheckSquare,
  Grid3X3, Layers, Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useIsMobile } from '@/hooks/use-responsive';
import { useDesktopWidgets } from '@/lib/desktop-widget-store';
import { useDesktopShortcuts } from '@/lib/desktop-shortcuts-store';

const GESTURE_AREA_HEIGHT = {
  mobile: 56,      // h-14 = 3.5rem = 56px
  tablet: 64,      // h-16 = 4rem = 64px
  desktop: 72,     // h-18 = 4.5rem = 72px (custom)
} as const;

interface DesktopMenuProps {
  onOpenCustomization?: () => void;
  onOpenQuickSettings?: () => void;
}

export function GestureArea({ 
  onOpenCustomization = () => {}, 
  onOpenQuickSettings = () => {} 
}: DesktopMenuProps = {}) {
  const { 
    isMultitaskingView, 
    toggleMultitaskingView, 
    cards,
    activeCardId,
    setActiveCard,
  } = useCardManager();
  
  const { addWidget } = useDesktopWidgets();
  const { executeShortcut } = useDesktopShortcuts();
  const haptic = useHapticFeedback();
  const isMobile = useIsMobile();
  
  const [isActive, setIsActive] = useState(false);
  const [gestureType, setGestureType] = useState<'swipe-up' | 'swipe-left' | 'swipe-right' | null>(null);
  const [gestureProgress, setGestureProgress] = useState(0);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  
  const gestureAreaRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const hapticTriggeredRef = useRef<boolean>(false);
  const menuHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -100], [0, 1]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!gestureAreaRef.current?.contains(e.target as Node)) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    
    hapticTriggeredRef.current = false;
    setIsActive(true);
    
    // Light haptic feedback on touch start
    haptic.dragStart();
  }, [haptic]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || !gestureAreaRef.current?.contains(e.target as Node)) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine gesture type based on direction
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -20) {
      // Swipe up
      setGestureType('swipe-up');
      const progress = Math.min(Math.abs(deltaY) / 150, 1);
      setGestureProgress(progress);
      y.set(deltaY);
      
      // Trigger haptic at 60% threshold
      if (progress > 0.6 && !hapticTriggeredRef.current) {
        haptic.select();
        hapticTriggeredRef.current = true;
      }
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && cards.length > 1) {
      // Horizontal swipe to switch apps
      if (deltaX > 30) {
        setGestureType('swipe-right');
        const progress = Math.min(Math.abs(deltaX) / 150, 1);
        setGestureProgress(progress);
        
        // Trigger haptic at 60% threshold
        if (progress > 0.6 && !hapticTriggeredRef.current) {
          haptic.select();
          hapticTriggeredRef.current = true;
        }
      } else if (deltaX < -30) {
        setGestureType('swipe-left');
        const progress = Math.min(Math.abs(deltaX) / 150, 1);
        setGestureProgress(progress);
        
        // Trigger haptic at 60% threshold
        if (progress > 0.6 && !hapticTriggeredRef.current) {
          haptic.select();
          hapticTriggeredRef.current = true;
        }
      }
    }
  }, [cards.length, y, haptic]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    
    // Execute gesture action based on progress
    if (gestureProgress > 0.6) {
      switch (gestureType) {
        case 'swipe-up':
          // Show multitasking view OR quick launch dock
          if (cards.length > 0) {
            haptic.cardOpen();
            toggleMultitaskingView();
          } else {
            // If no cards, just show the Quick Launch dock by dispatching a custom event
            haptic.select();
            window.dispatchEvent(new CustomEvent('show-quick-launch'));
          }
          break;
        case 'swipe-left':
          // Switch to next app
          if (cards.length > 1 && activeCardId) {
            const currentIndex = cards.findIndex(c => c.id === activeCardId);
            const nextIndex = (currentIndex + 1) % cards.length;
            const nextCard = cards[nextIndex];
            if (nextCard) {
              haptic.switch();
              setActiveCard(nextCard.id);
            }
          }
          break;
        case 'swipe-right':
          // Switch to previous app
          if (cards.length > 1 && activeCardId) {
            const currentIndex = cards.findIndex(c => c.id === activeCardId);
            const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
            const prevCard = cards[prevIndex];
            if (prevCard) {
              haptic.switch();
              setActiveCard(prevCard.id);
            }
          }
          break;
      }
    } else if (gestureProgress > 0) {
      // Gesture was started but not completed
      haptic.dragEnd();
    }
    
    // Reset state
    setIsActive(false);
    setGestureType(null);
    setGestureProgress(0);
    touchStartRef.current = null;
    hapticTriggeredRef.current = false;
    y.set(0);
  }, [gestureProgress, gestureType, cards, activeCardId, toggleMultitaskingView, setActiveCard, y, haptic]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const handleClick = () => {
    if (cards.length > 0) {
      haptic.tap();
      toggleMultitaskingView();
    }
  };

  // Desktop menu hover handlers
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    
    // Clear any existing timeout
    if (menuHoverTimeoutRef.current) {
      clearTimeout(menuHoverTimeoutRef.current);
    }
    
    // Show menu after a brief delay to prevent accidental triggers
    menuHoverTimeoutRef.current = setTimeout(() => {
      setIsMenuHovered(true);
    }, 150);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    
    // Clear timeout if user leaves before delay completes
    if (menuHoverTimeoutRef.current) {
      clearTimeout(menuHoverTimeoutRef.current);
    }
    
    // Hide menu after a brief delay to allow moving to the menu
    menuHoverTimeoutRef.current = setTimeout(() => {
      setIsMenuHovered(false);
    }, 300);
  }, [isMobile]);

  // Context menu handler (right-click)
  useEffect(() => {
    if (isMobile) return;

    const handleContextMenu = (e: MouseEvent) => {
      // Only handle if clicking on the gesture area or desktop
      const target = e.target as HTMLElement;
      const isDesktopClick = 
        target.classList.contains('desktop-background') ||
        target.classList.contains('desktop-area') ||
        target.id === 'desktop-main' ||
        gestureAreaRef.current?.contains(target);
      
      if (isDesktopClick) {
        e.preventDefault();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleClick = () => setContextMenuPosition(null);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenuPosition(null);
    };
    
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (menuHoverTimeoutRef.current) {
        clearTimeout(menuHoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMenuAction = useCallback((action: () => void) => {
    action();
    setContextMenuPosition(null);
    setIsMenuHovered(false);
  }, []);

  // Define menu items
  const menuItems = [
    {
      label: 'Customize Desktop',
      icon: Palette,
      action: () => handleMenuAction(onOpenCustomization),
    },
    { type: 'divider' as const },
    {
      label: 'New Task',
      icon: CheckSquare,
      action: () => handleMenuAction(() => executeShortcut('new-task')),
      kbd: 'Ctrl+T',
    },
    {
      label: 'New Note',
      icon: FileText,
      action: () => handleMenuAction(() => executeShortcut('new-note')),
      kbd: 'Ctrl+N',
    },
    {
      label: 'Send Message',
      icon: MessageSquare,
      action: () => handleMenuAction(() => executeShortcut('new-message')),
      kbd: 'Ctrl+M',
    },
    { type: 'divider' as const },
    {
      label: 'Add Tasks Widget',
      icon: Grid3X3,
      action: () => handleMenuAction(() => addWidget('tasks')),
    },
    {
      label: 'Add Notes Widget',
      icon: FileText,
      action: () => handleMenuAction(() => addWidget('notes')),
    },
    { type: 'divider' as const },
    {
      label: 'Show All Windows',
      icon: Maximize2,
      action: () => handleMenuAction(() => executeShortcut('show-all-windows')),
      kbd: 'Ctrl+Shift+A',
    },
    {
      label: 'Desktop Settings',
      icon: Settings,
      action: () => handleMenuAction(onOpenQuickSettings),
      kbd: 'Ctrl+,',
    },
  ];

  // Render gesture hint icon based on type
  const renderGestureHint = () => {
    if (!isActive || !gestureType) return null;
    
    const Icon = gestureType === 'swipe-up' ? ChevronUp :
                 gestureType === 'swipe-left' ? ChevronLeft : ChevronRight;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: gestureProgress, scale: 0.8 + (gestureProgress * 0.4) }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className={cn(
          "rounded-full p-3 backdrop-blur-lg",
          "bg-primary/20 border border-primary/40"
        )}>
          <Icon className={cn(
            "w-8 h-8 text-primary transition-all",
            gestureProgress > 0.6 && "text-primary-foreground"
          )} />
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Gesture capture area - responsive height, always visible */}
      <div 
        ref={gestureAreaRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-10",
          "h-14 sm:h-16 md:h-18",  // Responsive: 56px -> 64px -> 72px (better desktop integration)
          "pointer-events-auto touch-none",
          "bg-gradient-to-t from-background/10 via-transparent to-transparent",
          "backdrop-blur-[2px]",
          isActive && "bg-primary/10 backdrop-blur-md",
          isMenuHovered && "bg-background/40 backdrop-blur-md"
        )}
      >
        {/* Gesture progress indicator */}
        <AnimatePresence>
          {isActive && gestureProgress > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: gestureProgress }}
              exit={{ scaleX: 0 }}
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 origin-left",
                "bg-gradient-to-r from-primary/60 via-primary to-primary/60",
                gestureProgress > 0.6 && "bg-gradient-to-r from-primary via-accent to-primary"
              )}
            />
          )}
        </AnimatePresence>

        {/* Gesture hint icon */}
        {renderGestureHint()}

        {/* Multitasking button (desktop/tablet) - always visible */}
        {cards.length > 0 && (
          <button
            onClick={handleClick}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 bottom-3 md:bottom-4",
              "w-12 h-12 md:w-14 md:h-14 rounded-xl",
              "flex items-center justify-center",
              "backdrop-blur-xl border-2 border-border/60",
              "transition-all duration-300 ease-out",
              "hover:scale-110 hover:bg-primary/15 hover:border-primary/70",
              "active:scale-95",
              isMultitaskingView 
                ? "bg-primary/30 border-primary/80 shadow-xl shadow-primary/20" 
                : "bg-card/90 hover:border-primary/50 shadow-lg",
              "ring-4 ring-background/20"
            )}
            title={isMultitaskingView ? "Close multitasking" : "Show all apps"}
            aria-label={isMultitaskingView ? "Close multitasking view" : "Open multitasking view"}
          >
            <AnimatePresence mode="wait">
              {isMultitaskingView ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-foreground" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Grid3x3 className="w-5 h-5 md:w-6 md:h-6 text-foreground" strokeWidth={2.5} />
                  {cards.length > 1 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5",
                        "min-w-[18px] h-[18px] md:min-w-[20px] md:h-5 px-1",
                        "flex items-center justify-center",
                        "rounded-full text-[10px] md:text-xs font-bold",
                        "bg-primary text-primary-foreground",
                        "border-2 border-card shadow-lg"
                      )}
                    >
                      {cards.length}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}

        {/* Visual indicator bar - more prominent on desktop */}
        <div className={cn(
          "absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2",
          "w-28 md:w-32 h-0.5 md:h-1 rounded-full",
          "bg-foreground/15 dark:bg-foreground/20",
          "transition-all duration-300",
          "shadow-sm",
          isActive && "bg-primary/60 scale-105"
        )} />

        {/* Desktop Hover Menu - appears on hover (desktop only) */}
        {!isMobile && (
          <AnimatePresence>
            {isMenuHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
              >
                <div className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-2xl min-w-[220px] py-2 overflow-hidden">
                  {menuItems.map((item, index) => {
                    if ('type' in item && item.type === 'divider') {
                      return <div key={index} className="h-px bg-border mx-2 my-1" />;
                    }
                    
                    const ItemIcon = item.icon;
                    
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.action) {
                            item.action();
                          }
                        }}
                        className="w-full px-3 py-2 text-sm flex items-center gap-3 hover:bg-accent/50 transition-colors text-left group"
                      >
                        {ItemIcon && <ItemIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />}
                        <span className="flex-1">{item.label}</span>
                        {item.kbd && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {item.kbd}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Context Menu (right-click) - desktop only */}
      {!isMobile && (
        <AnimatePresence>
          {contextMenuPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[999]"
              style={{
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
              }}
            >
              <div className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-2xl min-w-[220px] py-2 overflow-hidden">
                {menuItems.map((item, index) => {
                  if ('type' in item && item.type === 'divider') {
                    return <div key={index} className="h-px bg-border mx-2 my-1" />;
                  }
                  
                  const ItemIcon = item.icon;
                  
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.action) {
                          item.action();
                        }
                      }}
                      className="w-full px-3 py-2 text-sm flex items-center gap-3 hover:bg-accent/50 transition-colors text-left group"
                    >
                      {ItemIcon && <ItemIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />}
                      <span className="flex-1">{item.label}</span>
                      {item.kbd && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {item.kbd}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Gesture instructions overlay (first-time hint) */}
      {cards.length > 0 && !isActive && !isMultitaskingView && !isMenuHovered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden md:block"
        >
          <div className="bg-card/80 backdrop-blur-md rounded-full px-4 py-2 border border-border/50 shadow-lg">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <ChevronUp className="w-3 h-3" />
              <span>Swipe up to view all apps</span>
              {cards.length > 1 && (
                <>
                  <span className="text-border">•</span>
                  <ChevronLeft className="w-3 h-3" />
                  <ChevronRight className="w-3 h-3" />
                  <span>Swipe to switch</span>
                </>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
