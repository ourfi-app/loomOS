/**
 * Unified Dock Component
 * 
 * A comprehensive, accessible dock component that consolidates all previous implementations.
 * 
 * Features:
 * - Horizontal and vertical orientation support
 * - App pinning/unpinning functionality
 * - Running app indicators (visual feedback for active apps)
 * - Drag-and-drop reordering of dock items
 * - Context menus (right-click options)
 * - Hover effects and tooltips
 * - Keyboard navigation
 * - Responsive design
 * - Accessibility (ARIA labels, focus management, screen reader support)
 * - Auto-hide functionality
 * - Gesture controls for mobile
 * - Loom support (pinned activity contexts)
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Grid3x3, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminMode } from '@/lib/admin-mode-store';
import { useCardManager } from '@/lib/card-manager-store';
import { useLoomStore } from '@/lib/loom-store';
import { AppLauncher } from '@/components/app-launcher';
import { LoomIcon } from '@/components/webos/loom-icon';
import { LoomContextMenu, LoomAIModal } from '@/components/webos/loom-context-menu';
import { toast } from 'sonner';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { DockProps } from './types';
import {
  useDockItems,
  useDockActions,
  useDockVisibility,
  useDragAndDrop,
} from './hooks';
import {
  DockItem,
  DockSeparator,
  DockGestureButton,
} from './components';
import {
  dockContainerVariants,
  dockInnerVariants,
  dockItemVariants,
  appLauncherVariants,
} from './utils/animations';
import {
  DOCK_DEFAULTS,
  A11Y_LABELS,
  TOAST_MESSAGES,
  DOCK_THEMES,
  DEFAULT_THEME,
} from './utils/constants';
import {
  getDockPositionClasses,
  getDockInnerClasses,
} from './utils/dockHelpers';

export function Dock({
  orientation = DOCK_DEFAULTS.orientation,
  position = DOCK_DEFAULTS.position,
  size = DOCK_DEFAULTS.size,
  showRunningApps = DOCK_DEFAULTS.showRunningApps,
  showLooms = DOCK_DEFAULTS.showLooms,
  showAppLauncher = DOCK_DEFAULTS.showAppLauncher,
  maxPinnedApps = DOCK_DEFAULTS.maxPinnedApps,
  autoHide = DOCK_DEFAULTS.autoHide,
  enableGestures = DOCK_DEFAULTS.enableGestures,
  enableDragAndDrop = DOCK_DEFAULTS.enableDragAndDrop,
  enableKeyboard = DOCK_DEFAULTS.enableKeyboard,
  onAppLaunch,
  onLoomRestore,
  className,
}: DockProps) {
  // ============================================================================
  // Session & Permissions
  // ============================================================================
  const { data: session } = useSession() || {};
  const { isAdminMode } = useAdminMode();
  const pathname = usePathname();

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const showAdminFeatures = isSuperAdmin || (isAdmin && isAdminMode);

  // ============================================================================
  // State
  // ============================================================================
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [loomContextMenu, setLoomContextMenu] = useState<{
    loomId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [aiModal, setAiModal] = useState<{
    title: string;
    content: string;
    isLoading: boolean;
  } | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // Hooks
  // ============================================================================
  const { cards } = useCardManager();
  const { looms, unpinLoom, restoreLoom, getLoom } = useLoomStore();

  // Get dock items and status
  const { dockApps, cardsByAppId, pinnedApps, getAppStatus } = useDockItems(
    showAdminFeatures,
    showRunningApps,
    maxPinnedApps
  );

  // Get dock actions
  const {
    handleAppLaunch: baseHandleAppLaunch,
    handleCloseApp,
    handlePinApp,
    handleUnpinApp,
    handleReplaceInDock,
    handleContextAction,
  } = useDockActions(cardsByAppId, maxPinnedApps);

  // Visibility management
  const {
    isVisible,
    isDockHovered,
    showDock,
    setIsDockHovered,
  } = useDockVisibility(autoHide, enableGestures, position, cards.length);

  // Drag and drop
  const {
    isDragOver,
    draggedItemId,
    handleDragStart,
    handleDragEnd,
    handleDockDragOver,
    handleDockDragLeave,
    handleDockDrop,
    handleItemDrop,
  } = useDragAndDrop(dockApps, enableDragAndDrop);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleAppLaunchWrapper = useCallback(
    (app: any) => {
      if (onAppLaunch) {
        onAppLaunch(app);
      } else {
        baseHandleAppLaunch(app);
      }
    },
    [onAppLaunch, baseHandleAppLaunch]
  );

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

  const handleOpenAppGrid = useCallback(() => {
    setIsGridOpen(true);
  }, []);

  // Loom AI action handlers
  const handleAnalyzeLoom = useCallback(
    async (loomId: string) => {
      const loom = getLoom(loomId);
      if (!loom) return;

      setAiModal({ title: '✨ Analyzing Loom...', content: '', isLoading: true });

      setTimeout(() => {
        const analysis = `# Loom Analysis: ${loom.title}\n\n## Summary\nThis loom contains activity related to ${loom.title}.\n\n## Key Points\n- Created: ${new Date(loom.createdAt).toLocaleString()}\n- Cards: ${loom.cardIds.length}\n\n## Context\n${loom.context}`;
        setAiModal({ title: `✨ Analysis: ${loom.title}`, content: analysis, isLoading: false });
      }, 1500);
    },
    [getLoom]
  );

  const handleCreateTaskList = useCallback(
    async (loomId: string) => {
      const loom = getLoom(loomId);
      if (!loom) return;

      setAiModal({ title: '📝 Creating Task List...', content: '', isLoading: true });

      setTimeout(() => {
        const taskList = `# Task List: ${loom.title}\n\n- Review context from all cards\n- Identify action items\n- Prioritize tasks\n- Set deadlines\n- Assign responsibilities`;
        setAiModal({ title: `📝 Task List: ${loom.title}`, content: taskList, isLoading: false });
      }, 1500);
    },
    [getLoom]
  );

  const handleDraftEmail = useCallback(
    async (loomId: string) => {
      const loom = getLoom(loomId);
      if (!loom) return;

      setAiModal({ title: '✉️ Drafting Summary Email...', content: '', isLoading: true });

      setTimeout(() => {
        const email = `Subject: Update on ${loom.title}\n\nHi Team,\n\nI wanted to provide a quick update on ${loom.title}.\n\n[Summary based on context]\n\nBest regards`;
        setAiModal({ title: `✉️ Email: ${loom.title}`, content: email, isLoading: false });
      }, 1500);
    },
    [getLoom]
  );

  const handleRestoreLoom = useCallback(
    (loomId: string) => {
      if (onLoomRestore) {
        onLoomRestore(loomId);
      } else {
        restoreLoom(loomId);
        unpinLoom(loomId);
        const loom = getLoom(loomId);
        toast.success(
          TOAST_MESSAGES.loomRestored(loom?.title || 'Loom').title,
          {
            description: TOAST_MESSAGES.loomRestored(loom?.title || 'Loom').description,
          }
        );
      }
    },
    [onLoomRestore, restoreLoom, unpinLoom, getLoom]
  );

  const handleUnpinLoom = useCallback(
    (loomId: string) => {
      const loom = getLoom(loomId);
      unpinLoom(loomId);
      toast.info(
        TOAST_MESSAGES.loomUnpinned(loom?.title || 'Loom').title,
        {
          description: TOAST_MESSAGES.loomUnpinned(loom?.title || 'Loom').description,
        }
      );
    },
    [getLoom, unpinLoom]
  );

  // ============================================================================
  // Render
  // ============================================================================

  const theme = DOCK_THEMES[DEFAULT_THEME];
  const isHome = pathname === '/' || pathname === '/dashboard';
  const pinnedLooms = looms.filter(loom => loom.isPinned);

  return (
    <>
      {/* Gesture Button */}
      <DockGestureButton
        isDockVisible={isVisible}
        isHomePage={isHome}
        onShowDock={showDock}
      />

      {/* Dock Container */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={dockContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'dock-container pointer-events-none',
              getDockPositionClasses(orientation, position),
              className
            )}
            data-tutorial="unified-dock"
            role="navigation"
            aria-label={A11Y_LABELS.dock}
          >
            {/* Dock Inner Container */}
            <motion.div
              variants={dockInnerVariants}
              initial="normal"
              animate={isDragOver ? 'dragOver' : 'normal'}
              className={getDockInnerClasses(orientation, isDragOver)}
              style={{
                background: theme.background,
                backdropFilter: theme.backdropFilter,
                WebkitBackdropFilter: theme.backdropFilter,
                border: isDragOver ? '2px solid var(--color-primary-500)' : theme.border,
                boxShadow: isDragOver ? 'var(--shadow-glow)' : theme.shadow,
              }}
              onDragOver={handleDockDragOver}
              onDragLeave={handleDockDragLeave}
              onDrop={handleDockDrop}
              onMouseEnter={() => setIsDockHovered(true)}
              onMouseLeave={() => setIsDockHovered(false)}
            >
              {/* Dock Apps */}
              {dockApps.map((app, index) => {
                const isPinned = pinnedApps.some(p => p.id === app.id);
                const pinnedIndex = isPinned ? pinnedApps.findIndex(p => p.id === app.id) : undefined;
                const status = getAppStatus(app.id);

                return (
                  <DockItem
                    key={app.id}
                    app={app}
                    status={status}
                    position={pinnedIndex}
                    isDragging={draggedItemId === app.id}
                    isDropTarget={false}
                    onClick={handleAppLaunchWrapper}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrop={handleItemDrop}
                  />
                );
              })}

              {/* Loom Icons - Pinned activities */}
              {showLooms && pinnedLooms.length > 0 && (
                <>
                  <DockSeparator orientation={orientation} />
                  {pinnedLooms.map(loom => (
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
                </>
              )}

              {/* Separator before app launcher */}
              {showAppLauncher && (
                <DockSeparator orientation={orientation} />
              )}

              {/* App Grid Launcher */}
              {showAppLauncher && (
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <motion.button
                      variants={dockItemVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleOpenAppGrid}
                      className={cn(
                        'dock-item group relative flex flex-col items-center justify-center',
                        'h-14 w-14 sm:h-16 sm:w-16 rounded-2xl',
                        'focus:outline-none focus:ring-2 focus:ring-primary/50'
                      )}
                      aria-label={A11Y_LABELS.appLauncher}
                      data-tutorial="app-grid-launcher"
                    >
                      <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:shadow-2xl transition-shadow">
                        <motion.div
                          variants={appLauncherVariants}
                          animate={isGridOpen ? 'open' : 'closed'}
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Grid Launcher Modal */}
      <AppLauncher
        isOpen={isGridOpen}
        onClose={() => setIsGridOpen(false)}
        onAppLaunch={(app) => {
          handleAppLaunchWrapper(app);
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
