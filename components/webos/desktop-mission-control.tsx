
'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardManager } from '@/lib/card-manager-store';
import { useWindowManager } from '@/hooks/webos/use-window-manager';
import { useRouter } from 'next/navigation';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

interface DesktopMissionControlProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopMissionControl({ isOpen, onClose }: DesktopMissionControlProps) {
  const { cards, activeCardId, setActiveCard, closeCard } = useCardManager();
  const { windows, maximizeWindow, focusWindow, removeWindow } = useWindowManager();
  const router = useRouter();
  const [hoveredWindowId, setHoveredWindowId] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle clicking on a window thumbnail
  const handleWindowClick = useCallback((cardId: string, cardPath: string) => {
    setActiveCard(cardId);
    focusWindow(cardId);
    router.push(cardPath);
    onClose();
  }, [setActiveCard, focusWindow, router, onClose]);

  // Handle closing a window
  const handleCloseWindow = useCallback((e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    closeCard(cardId);
    removeWindow(cardId);
    if (activeCardId === cardId && cards.length === 1) {
      router.push('/dashboard');
      onClose();
    }
  }, [closeCard, removeWindow, activeCardId, cards.length, router, onClose]);

  // Handle maximizing a window
  const handleMaximizeWindow = useCallback((e: React.MouseEvent, cardId: string, cardPath: string) => {
    e.stopPropagation();
    maximizeWindow(cardId);
    setActiveCard(cardId);
    focusWindow(cardId);
    router.push(cardPath);
    onClose();
  }, [maximizeWindow, setActiveCard, focusWindow, router, onClose]);

  // Get app icon from registry
  const getAppIcon = (cardPath: string): React.ReactNode => {
    const appEntry = Object.values(APP_REGISTRY).find(app => app.path === cardPath);
    if (appEntry?.icon) {
      const Icon = appEntry.icon;
      return <Icon className="w-10 h-10" />;
    }
    return <LayoutGrid className="w-10 h-10" />;
  };

  // Get non-minimized cards
  const visibleCards = cards.filter(c => !c.minimized);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Mission Control Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="bg-background/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-border">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Mission Control</h2>
                <span className="text-sm text-muted-foreground ml-2">
                  {visibleCards.length} window{visibleCards.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Windows Grid */}
          {visibleCards.length > 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={cn(
                "grid gap-6 w-full max-w-7xl",
                visibleCards.length === 1 && "grid-cols-1 max-w-3xl",
                visibleCards.length === 2 && "grid-cols-2",
                visibleCards.length === 3 && "grid-cols-3",
                visibleCards.length === 4 && "grid-cols-2",
                visibleCards.length >= 5 && "grid-cols-3"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {visibleCards.map((card, index) => {
                const windowState = windows[card.id];
                const isActive = card.id === activeCardId;
                const isHovered = hoveredWindowId === card.id;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={cn(
                      "relative group cursor-pointer rounded-xl overflow-hidden",
                      "bg-background border-2 transition-all duration-200",
                      isActive ? "border-primary shadow-2xl shadow-primary/20" : "border-border hover:border-primary/50",
                      isHovered && "scale-105 shadow-2xl"
                    )}
                    style={{
                      aspectRatio: "16 / 10",
                    }}
                    onClick={() => handleWindowClick(card.id, card.path)}
                    onMouseEnter={() => setHoveredWindowId(card.id)}
                    onMouseLeave={() => setHoveredWindowId(null)}
                  >
                    {/* Window Preview Background */}
                    <div className={cn(
                      "absolute inset-0",
                      `bg-gradient-to-br ${card.color}`,
                      "opacity-10 group-hover:opacity-20 transition-opacity"
                    )} />

                    {/* Window Controls Overlay */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-3 right-3 z-10 flex gap-2"
                        >
                          <button
                            onClick={(e) => handleMaximizeWindow(e, card.id, card.path)}
                            className={cn(
                              "p-2 rounded-lg bg-background/90 backdrop-blur-sm",
                              "border border-border hover:bg-primary hover:text-primary-foreground",
                              "transition-all shadow-lg"
                            )}
                            title="Maximize"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleCloseWindow(e, card.id)}
                            className={cn(
                              "p-2 rounded-lg bg-background/90 backdrop-blur-sm",
                              "border border-border hover:bg-destructive hover:text-destructive-foreground",
                              "transition-all shadow-lg"
                            )}
                            title="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Window Content Preview */}
                    <div className="relative w-full h-full p-6 flex flex-col items-center justify-center">
                      {/* App Icon */}
                      <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center mb-4",
                        `bg-gradient-to-br ${card.color}`,
                        "shadow-xl group-hover:scale-110 transition-transform"
                      )}>
                        <div className="text-white">
                          {getAppIcon(card.path)}
                        </div>
                      </div>

                      {/* App Title */}
                      <h3 className="text-xl font-semibold text-center mb-2">
                        {card.title}
                      </h3>

                      {/* Window State Badge */}
                      {windowState?.isMaximized && (
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Maximized
                        </span>
                      )}
                      {windowState?.isSnapped && (
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          Snapped
                        </span>
                      )}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-window-indicator"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-background/90 backdrop-blur-xl rounded-2xl p-12 border border-border shadow-2xl">
                <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-semibold mb-2">No Open Windows</h3>
                <p className="text-muted-foreground">
                  Launch an app from the dock to get started
                </p>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="bg-background/70 backdrop-blur-xl rounded-full px-6 py-2 shadow-xl border border-border">
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-2 py-0.5 text-xs bg-muted rounded border border-border font-mono">Esc</kbd> or click outside to close
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
