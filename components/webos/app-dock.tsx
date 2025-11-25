// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types


'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { useCardManager } from '@/lib/card-manager-store';
import { useAssistant } from '@/hooks/webos/use-assistant';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLauncher } from '@/components/app-launcher';
import { APP_REGISTRY, CATEGORIES, getAppsByCategory, type AppDefinition, getAppById } from '@/lib/enhanced-app-registry';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { Maximize2, Minimize2, X, ExternalLink, Info, Pin, PinOff, PlayCircle, ArrowUp, Settings, Replace, Grid3x3 } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';
import { useLoomStore } from '@/lib/loom-store';
import { LoomIcon } from './loom-icon';
import { LoomContextMenu, LoomAIModal } from './loom-context-menu';
import { GestureButton } from './gesture-button';

/**
 * LoomOS-style Quick Launch Dock
 * 
 * Features:
 * - 6 icons total: 5 customizable app positions + 1 fixed app grid launcher
 * - Always visible when not in an app
 * - Can be brought up from within an app by swiping up on gesture area
 * - First 5 positions are customizable (long-press or right-click to replace)
 * - 6th position (app grid) is fixed and cannot be changed
 * - Default apps: Home, Browser, Mail, Calendar, Settings + App Launcher
 */

// Performance optimization: Memoized dock item component with webOS Wave animations
const DockItem = memo(({ 
  app, 
  isActive,
  isRunning,
  isMinimized,
  position,
  isInDock,
  onLaunch, 
  onMouseEnter, 
  onMouseLeave,
  onReplaceInDock,
  onRemoveFromDock,
  onCloseApp
}: {
  app: AppDefinition;
  isActive: boolean;
  isRunning?: boolean;
  isMinimized?: boolean;
  position?: number;
  isInDock: boolean;
  onLaunch: (app: AppDefinition) => void;
  onMouseEnter: (appId: string) => void;
  onMouseLeave: () => void;
  onReplaceInDock?: (appId: string, position: number) => void;
  onRemoveFromDock?: (appId: string) => void;
  onCloseApp?: (appId: string) => void;
}) => {
  const Icon = app.icon;
  const canCustomize = isInDock && position !== undefined && position < 5;
  
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.2, y: -8 }}
          whileTap={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'dock-item group relative flex flex-col items-center justify-center',
            'h-14 w-14 sm:h-16 sm:w-16 rounded-2xl',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            isActive && 'ring-2 ring-primary',
            isMinimized && 'opacity-75'
          )}
          onClick={() => onLaunch(app)}
          onMouseEnter={() => onMouseEnter(app.id)}
          onMouseLeave={onMouseLeave}
          aria-label={isMinimized ? `Restore ${app.title}` : `Launch ${app.title}`}
        >
          <div className={cn(
            'flex items-center justify-center w-full h-full rounded-2xl',
            'bg-gradient-to-br shadow-lg',
            app.gradient || 'from-gray-500 to-gray-700',
            'group-hover:shadow-2xl transition-shadow'
          )}>
            <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white drop-shadow-md" />
          </div>
          {/* Running/Active/Minimized indicator */}
          {(isRunning || isActive || isMinimized) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "absolute -bottom-2 rounded-full shadow-lg",
                isActive ? "w-2 h-2 bg-white animate-pulse" : 
                isMinimized ? "w-2.5 h-2.5 bg-[var(--semantic-warning)]" : 
                "w-1.5 h-1.5 bg-white/60"
              )} 
            />
          )}
          {/* Minimized overlay badge */}
          {isMinimized && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--semantic-warning)] border-2 border-background flex items-center justify-center"
            >
              <Minimize2 className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onLaunch(app)}>
          {isMinimized ? (
            <>
              <Maximize2 className="mr-2 h-4 w-4" />
              <span>Restore {app.title}</span>
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              <span>Open {app.title}</span>
            </>
          )}
        </ContextMenuItem>
        
        {(isRunning || isMinimized) && onCloseApp && (
          <ContextMenuItem onClick={() => onCloseApp(app.id)}>
            <X className="mr-2 h-4 w-4" />
            <span>Quit {app.title}</span>
          </ContextMenuItem>
        )}
        
        <ContextMenuSeparator />
        
        {canCustomize && onReplaceInDock && (
          <>
            <ContextMenuItem onClick={() => {
              // This will be triggered from app grid
              toast.info('Select an app from the App Grid to replace this one', {
                description: 'Open the app grid and right-click on any app to add it to this position',
              });
            }}>
              <Replace className="mr-2 h-4 w-4" />
              <span>Replace in Quick Launch</span>
            </ContextMenuItem>
            {onRemoveFromDock && (
              <ContextMenuItem onClick={() => onRemoveFromDock(app.id)}>
                <PinOff className="mr-2 h-4 w-4" />
                <span>Unpin from Quick Launch</span>
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
          </>
        )}
        
        <ContextMenuItem>
          <Info className="mr-2 h-4 w-4" />
          <span>App Info</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

DockItem.displayName = 'DockItem';

export function AppDock() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const { launchApp, cards, toggleMultitaskingView, closeAllCards, closeCard, activeCardId, getMinimizedApps, restoreCard } = useCardManager();
  const { toggleAssistant } = useAssistant();
  const { dockAppIds, trackAppUsage, removeFromDock, addToDock } = useAppPreferences();
  const { openSearch } = useUniversalSearch();
  const { looms, createLoom, unpinLoom, restoreLoom, getLoom } = useLoomStore();
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDockHovered, setIsDockHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loomContextMenu, setLoomContextMenu] = useState<{ loomId: string; position: { x: number; y: number } } | null>(null);
  const [aiModal, setAiModal] = useState<{ title: string; content: string; isLoading: boolean } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  // Super admins always see admin features, regular admins need to toggle admin mode
  const showAdminFeatures = isSuperAdmin || (isAdmin && isAdminMode);

  // Get pinned dock apps (5 customizable positions)
  const pinnedApps = dockAppIds
    .map(id => getAppById(id))
    .filter((app): app is AppDefinition => 
      app !== undefined && 
      (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
    )
    .slice(0, 5); // Ensure exactly 5 apps max
  
  // Get minimized apps from card manager
  const minimizedCards = getMinimizedApps();
  
  // Get all running apps from card manager (including minimized)
  const runningAppIds = new Set(
    cards.map(card => {
      // Extract app ID from path (e.g., '/dashboard/messages' -> 'messages')
      const pathParts = card.path.split('/');
      return pathParts[pathParts.length - 1] || 'home';
    })
  );
  
  // Create a map of app ID to card for quick lookup
  const cardsByAppId = new Map(
    cards.map(card => {
      const pathParts = card.path.split('/');
      const appId = pathParts[pathParts.length - 1] || 'home';
      return [appId, card];
    })
  );
  
  // Get running apps that aren't already pinned (to show after pinned apps)
  const runningApps = Array.from(runningAppIds)
    .filter(id => !pinnedApps.some(app => app.id === id))
    .map(id => getAppById(id))
    .filter((app): app is AppDefinition => 
      app !== undefined && 
      (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
    );
  
  // Combine pinned and running apps
  const dockApps = [...pinnedApps, ...runningApps];

  // Desktop auto-hide: Show dock when mouse approaches bottom edge
  useEffect(() => {
    const isHome = pathname === '/' || pathname === '/dashboard';
    
    // Always show on home/dashboard
    if (isHome) {
      setIsVisible(true);
      return;
    }

    // Check if we're on desktop
    const isDesktop = () => window.innerWidth >= 768; // md breakpoint
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktop()) return;
      
      const bottomThreshold = 100; // Show dock when within 100px of bottom
      const distanceFromBottom = window.innerHeight - e.clientY;
      
      if (distanceFromBottom <= bottomThreshold) {
        setIsVisible(true);
        // Clear any pending auto-hide
        if (autoHideTimeoutRef.current) {
          clearTimeout(autoHideTimeoutRef.current);
          autoHideTimeoutRef.current = null;
        }
      } else if (!isDockHovered && isVisible) {
        // Mouse moved away from bottom - schedule auto-hide
        if (autoHideTimeoutRef.current) {
          clearTimeout(autoHideTimeoutRef.current);
        }
        autoHideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 1000); // Hide after 1 second delay
      }
    };

    // On mobile, hide dock when in an app
    const handleResize = () => {
      if (!isDesktop()) {
        const isInApp = cards.length > 0 && !isHome;
        setIsVisible(!isInApp);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [pathname, cards.length, isDockHovered, isVisible]);

  // Performance optimization: useCallback for event handlers
  const handleAppLaunch = useCallback((app: AppDefinition) => {
    trackAppUsage(app.id);
    
    // Special handling for AI Assistant - open Universal Search instead
    if (app.id === 'ai-assistant' || app.id === 'assistant') {
      openSearch();
      return;
    }
    
    // Check if app is minimized - if so, restore it with animation
    const card = cardsByAppId.get(app.id);
    if (card && card.minimized) {
      // Show a toast to indicate restoration
      toast.success(`Restoring ${app.title}`, {
        description: 'Opening from dock...',
        duration: 2000,
      });
      
      // Restore the card state
      restoreCard(card.id);
      
      // Navigate to the app
      router.push(app.path);
      return;
    }
    
    // Special handling for Home button - close all cards to return to dashboard
    if (app.id === 'home' || app.path === '/dashboard') {
      closeAllCards();
      router.push(app.path);
    } else {
      router.push(app.path);
    }
    
    // Hide dock after launching app
    setIsVisible(false);
  }, [router, trackAppUsage, closeAllCards, openSearch, cardsByAppId, restoreCard]);

  const handleMouseEnter = useCallback((appId: string) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAppId(appId);
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredAppId(null);
  }, []);

  const handleReplaceInDock = useCallback((appId: string, position: number) => {
    addToDock(appId, position);
    toast.success('Quick Launch updated', {
      description: `${getAppById(appId)?.title} added to position ${position + 1}`,
    });
  }, [addToDock]);

  const handleRemoveFromDock = useCallback((appId: string) => {
    removeFromDock(appId);
    toast.info('Removed from Quick Launch', {
      description: `${getAppById(appId)?.title} removed from Quick Launch bar`,
    });
  }, [removeFromDock]);

  const handleCloseApp = useCallback((appId: string) => {
    // Find the card by app path and close it
    const appToClose = getAppById(appId);
    if (appToClose) {
      const cardToClose = cards.find(c => c.path === appToClose.path);
      if (cardToClose) {
        closeCard(cardToClose.id);
        toast.success('App closed', {
          description: `${appToClose.title} has been closed`,
        });
      }
    }
  }, [cards, closeCard]);

  const handleOpenAppGrid = useCallback(() => {
    setIsGridOpen(true);
    trackAppUsage('app-grid');
  }, [trackAppUsage]);

  // Loom drag-and-drop handlers
  const handleDockDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDockDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDockDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const cardId = e.dataTransfer.getData('text/plain');
    const context = e.dataTransfer.getData('application/loom-context');
    const title = e.dataTransfer.getData('application/loom-title');

    if (cardId && context && title) {
      // Check if this card is already in a loom
      if (looms.some(loom => loom.cardIds.includes(cardId))) {
        toast.info('This card is already pinned as a loom');
        return;
      }

      // Create the loom
      const loomId = createLoom([cardId], context, title);

      toast.success('Loom created!', {
        description: `"${title}" has been pinned to the dock`,
      });
    }
  }, [looms, createLoom]);

  // Loom AI action handlers
  const handleAnalyzeLoom = useCallback(async (loomId: string) => {
    const loom = getLoom(loomId);
    if (!loom) return;

    setAiModal({ title: '✨ Analyzing Loom...', content: '', isLoading: true });

    // Simulate AI analysis (replace with actual AI call)
    setTimeout(() => {
      const analysis = `# Loom Analysis: ${loom.title}\n\n## Summary\nThis loom contains activity related to ${loom.title}.\n\n## Key Points\n- Created: ${new Date(loom.createdAt).toLocaleString()}\n- Cards: ${loom.cardIds.length}\n\n## Context\n${loom.context}`;

      setAiModal({ title: `✨ Analysis: ${loom.title}`, content: analysis, isLoading: false });
    }, 1500);
  }, [getLoom]);

  const handleCreateTaskList = useCallback(async (loomId: string) => {
    const loom = getLoom(loomId);
    if (!loom) return;

    setAiModal({ title: '📝 Creating Task List...', content: '', isLoading: true });

    // Simulate AI task generation (replace with actual AI call)
    setTimeout(() => {
      const taskList = `# Task List: ${loom.title}\n\n- Review context from all cards\n- Identify action items\n- Prioritize tasks\n- Set deadlines\n- Assign responsibilities`;

      setAiModal({ title: `📝 Task List: ${loom.title}`, content: taskList, isLoading: false });
    }, 1500);
  }, [getLoom]);

  const handleDraftEmail = useCallback(async (loomId: string) => {
    const loom = getLoom(loomId);
    if (!loom) return;

    setAiModal({ title: '✉️ Drafting Summary Email...', content: '', isLoading: true });

    // Simulate AI email generation (replace with actual AI call)
    setTimeout(() => {
      const email = `Subject: Update on ${loom.title}\n\nHi Team,\n\nI wanted to provide a quick update on ${loom.title}.\n\n[Summary based on context]\n\nBest regards`;

      setAiModal({ title: `✉️ Email: ${loom.title}`, content: email, isLoading: false });
    }, 1500);
  }, [getLoom]);

  const handleRestoreLoom = useCallback((loomId: string) => {
    restoreLoom(loomId);
    unpinLoom(loomId);
    toast.success('Loom restored', {
      description: 'The loom has been unpinned and restored',
    });
  }, [restoreLoom, unpinLoom]);

  const handleUnpinLoom = useCallback((loomId: string) => {
    const loom = getLoom(loomId);
    unpinLoom(loomId);
    toast.info('Loom unpinned', {
      description: `"${loom?.title}" has been removed from the dock`,
    });
  }, [getLoom, unpinLoom]);

  // Keyboard shortcut for app grid (Cmd/Ctrl+Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsGridOpen(prev => !prev);
      }
      // ESC to close app grid
      if (e.key === 'Escape' && isGridOpen) {
        setIsGridOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGridOpen]);

  // Gesture to show/hide dock from within apps
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger from bottom gesture area
      const touch = e.touches[0];
      if (!touch || touch.clientY < window.innerHeight - 80) return;
      
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const touchEndY = touch.clientY;
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = Date.now() - touchStartTime.current;
      
      // Swipe up to show dock (minimum 50px movement, max 500ms duration)
      if (deltaY > 50 && deltaTime < 500 && !isVisible) {
        setIsVisible(true);
      }
      // Swipe down to hide dock
      else if (deltaY < -50 && deltaTime < 500 && isVisible && pathname !== '/' && pathname !== '/dashboard') {
        setIsVisible(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isVisible, pathname]);

  return (
    <>
      {/* Gesture Button - Shows when dock is hidden */}
      <GestureButton
        isDockVisible={isVisible}
        onShowDock={() => setIsVisible(true)}
        isHomePage={pathname === '/' || pathname === '/dashboard'}
      />

      <motion.div
        ref={dockRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'dock-container fixed bottom-0 left-0 right-0 z-[9999]',
          'flex items-center justify-center',
          'pb-4 px-4 sm:pb-6 sm:px-6 md:pb-8',
          'pointer-events-none'
        )}
        data-tutorial="quick-launch-dock"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: isDragOver ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
          className={cn(
            'dock flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5',
            'rounded-2xl shadow-2xl',
            'pointer-events-auto',
            'transition-all duration-300',
            isDragOver && 'drag-over'
          )}
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: isDragOver ? '2px solid var(--color-primary-500)' : '1px solid var(--glass-border)',
            boxShadow: isDragOver ? 'var(--shadow-glow)' : 'var(--shadow-lg)',
          }}
          onDragOver={handleDockDragOver}
          onDragLeave={handleDockDragLeave}
          onDrop={handleDockDrop}
          onMouseEnter={() => {
            setIsDockHovered(true);
            // Cancel any pending auto-hide when hovering dock
            if (autoHideTimeoutRef.current) {
              clearTimeout(autoHideTimeoutRef.current);
              autoHideTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            setIsDockHovered(false);
            // Schedule auto-hide when leaving dock (only on desktop and not on home)
            const isHome = pathname === '/' || pathname === '/dashboard';
            const isDesktop = window.innerWidth >= 768;
            if (isDesktop && !isHome) {
              if (autoHideTimeoutRef.current) {
                clearTimeout(autoHideTimeoutRef.current);
              }
              autoHideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
              }, 1000);
            }
          }}
        >
          {/* Quick Launch Apps (pinned + running apps) */}
          {dockApps.map((app, index) => {
            const isPinned = pinnedApps.some(p => p.id === app.id);
            const pinnedIndex = isPinned ? pinnedApps.findIndex(p => p.id === app.id) : undefined;
            const isRunning = runningAppIds.has(app.id);
            const card = cardsByAppId.get(app.id);
            const isMinimized = card?.minimized || false;
            const isActive = !isMinimized && (pathname === app.path || cards.some(c => c.path === app.path && c.id === activeCardId));
            
            return (
              <DockItem
                key={app.id}
                app={app}
                isActive={isActive}
                isRunning={isRunning}
                isMinimized={isMinimized}
                position={pinnedIndex}
                isInDock={isPinned}
                onLaunch={handleAppLaunch}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onReplaceInDock={handleReplaceInDock}
                onRemoveFromDock={handleRemoveFromDock}
                onCloseApp={handleCloseApp}
              />
            );
          })}

          {/* Loom Icons - Pinned activities */}
          {looms.filter(loom => loom.isPinned).map((loom) => (
            <LoomIcon
              key={loom.id}
              loom={loom}
              onClick={() => handleRestoreLoom(loom.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setLoomContextMenu({
                  loomId: loom.id,
                  position: { x: e.clientX, y: e.clientY },
                });
              }}
            />
          ))}

          {/* Separator before app grid launcher */}
          {looms.filter(loom => loom.isPinned).length > 0 && (
            <div className="h-10 w-px bg-border/50 mx-1" />
          )}
          <div className="h-10 w-px bg-border/50 mx-1" />

          {/* App Grid Launcher (Fixed 5th position - cannot be changed) - webOS Wave style */}
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.2, y: -8 }}
                whileTap={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                onClick={handleOpenAppGrid}
                className={cn(
                  'dock-item group relative flex flex-col items-center justify-center',
                  'h-14 w-14 sm:h-16 sm:w-16 rounded-2xl',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50'
                )}
                aria-label="App Grid - View all apps"
                data-tutorial="app-grid-launcher"
              >
                <div className={cn(
                  "flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:shadow-2xl transition-shadow"
                )}>
                  <motion.div
                    animate={{ rotate: isGridOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ArrowUp className="h-7 w-7 sm:h-8 sm:w-8 text-white drop-shadow-md" />
                  </motion.div>
                </div>
              </motion.button>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuItem onClick={handleOpenAppGrid}>
                <Grid3x3 className="mr-2 h-4 w-4" />
                <span>Open App Grid</span>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem disabled>
                <Info className="mr-2 h-4 w-4" />
                <span>This position cannot be changed</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </motion.div>
        
        {/* Subtle indicator when hidden - desktop only */}
        {!isVisible && pathname !== '/' && pathname !== '/dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex items-center gap-1"
          >
            <div className="animate-pulse">
              <div className="w-16 h-1 rounded-full bg-primary/30 backdrop-blur-sm shadow-lg" />
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* App Grid Launcher - Rendered at root level */}
      <AppLauncher
        isOpen={isGridOpen}
        onClose={() => setIsGridOpen(false)}
        onAppLaunch={(app) => {
          handleAppLaunch(app);
          setIsGridOpen(false);
        }}
      />

      {/* Loom Context Menu */}
      {loomContextMenu && (
        <LoomContextMenu
          loom={getLoom(loomContextMenu.loomId) || null}
          position={loomContextMenu.position}
          isOpen={!!loomContextMenu}
          onClose={() => setLoomContextMenu(null)}
          onRestore={() => handleRestoreLoom(loomContextMenu.loomId)}
          onUnpin={() => handleUnpinLoom(loomContextMenu.loomId)}
          onAnalyze={() => handleAnalyzeLoom(loomContextMenu.loomId)}
          onCreateTaskList={() => handleCreateTaskList(loomContextMenu.loomId)}
          onDraftEmail={() => handleDraftEmail(loomContextMenu.loomId)}
        />
      )}

      {/* Loom AI Modal */}
      {aiModal && (
        <LoomAIModal
          title={aiModal.title}
          content={aiModal.content}
          isOpen={!!aiModal}
          isLoading={aiModal.isLoading}
          onClose={() => setAiModal(null)}
        />
      )}
    </>
  );
}

