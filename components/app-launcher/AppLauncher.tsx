'use client';

/**
 * Unified App Launcher Component
 * 
 * A comprehensive, accessible, and feature-rich application launcher that consolidates
 * all previous implementations into a single, modular system.
 * 
 * Features:
 * - Grid and list view modes
 * - Search/filter functionality
 * - Tabs (All Apps, Favorites, Recent)
 * - Category grouping
 * - Pin/favorite functionality
 * - Keyboard navigation
 * - Responsive design
 * - Accessibility support
 */

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminMode } from '@/lib/admin-mode-store';
import { getAllApps } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';
import type { AppLauncherProps, TabType, ViewMode, SortMode, AppAction, AppDefinition } from './types';
import {
  AppLauncherHeader,
  AppLauncherTabs,
  AppLauncherGrid,
  AppLauncherList,
  AppEmptyState,
} from './components';
import {
  useAppSearch,
  useAppActions,
  useAppLauncherPreferences,
  useKeyboardNavigation,
} from './hooks';
import {
  filterAppsByAdmin,
  sortApps,
  getFavoriteApps,
  getRecentApps,
} from './utils/appFilters';
import { backdropVariants, launcherVariants } from './utils/animations';
import { DEFAULTS, A11Y_LABELS, GRID_COLUMNS } from './utils/constants';

export function AppLauncher({
  isOpen,
  onClose,
  onAppLaunch,
  defaultTab = DEFAULTS.tab,
  defaultViewMode = DEFAULTS.viewMode,
  defaultSortMode = DEFAULTS.sortMode,
  showAdminApps,
  className,
}: AppLauncherProps) {
  // ============================================================================
  // Session & Permissions
  // ============================================================================
  const { data: session } = useSession() || {};
  const { isAdminMode } = useAdminMode();
  const pathname = usePathname();

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const showAdminFeatures = showAdminApps ?? (isSuperAdmin || (isAdmin && isAdminMode));

  // ============================================================================
  // State
  // ============================================================================
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [sortMode, setSortMode] = useState<SortMode>(defaultSortMode);

  // ============================================================================
  // Hooks
  // ============================================================================
  const {
    dockAppIds,
    favoriteAppIds,
    recentAppIds,
    appUsage,
  } = useAppLauncherPreferences();

  // Get all apps
  const allApps = useMemo(() => {
    return filterAppsByAdmin(getAllApps(), showAdminFeatures);
  }, [showAdminFeatures]);

  const { searchQuery, setSearchQuery, clearSearch, searchResults, hasSearchQuery } = useAppSearch(
    allApps,
    showAdminFeatures
  );

  const { handleAppClick, handleContextAction } = useAppActions(onClose, onAppLaunch);

  // ============================================================================
  // Computed Values
  // ============================================================================

  // Get apps based on active tab
  const tabApps = useMemo(() => {
    if (hasSearchQuery) {
      return searchResults;
    }

    switch (activeTab) {
      case 'favorites':
        return getFavoriteApps(favoriteAppIds, showAdminFeatures);
      case 'recent':
        return getRecentApps(recentAppIds, showAdminFeatures);
      case 'all':
      default:
        return allApps;
    }
  }, [activeTab, allApps, searchResults, hasSearchQuery, favoriteAppIds, recentAppIds, showAdminFeatures]);

  // Sort apps
  const sortedApps = useMemo(() => {
    return sortApps(tabApps, sortMode, appUsage);
  }, [tabApps, sortMode, appUsage]);

  // Whether to group by category (only in "All Apps" tab without search)
  const shouldGroupByCategory = activeTab === 'all' && !hasSearchQuery;

  // Counts
  const favoritesCount = favoriteAppIds.length;
  const recentCount = recentAppIds.length;
  const totalApps = allApps.length;

  // ============================================================================
  // Keyboard Navigation
  // ============================================================================
  const gridColumns = GRID_COLUMNS.desktop; // Could be responsive
  const { focusedAppId } = useKeyboardNavigation(
    sortedApps,
    isOpen,
    onClose,
    handleAppClick,
    gridColumns
  );

  // ============================================================================
  // Effects
  // ============================================================================

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    }
  }, [isOpen]);

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    clearSearch(); // Clear search when switching tabs
  };

  const handleAppAction = (app: AppDefinition, action: AppAction) => {
    handleContextAction(app, action);
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (!isOpen) return null;

  // Determine empty state type
  const getEmptyStateType = () => {
    if (hasSearchQuery) return 'search';
    if (activeTab === 'favorites') return 'favorites';
    if (activeTab === 'recent') return 'recent';
    return 'category';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
          }}
          className={cn(
            'fixed inset-0 z-50',
            'flex items-center justify-center',
            'p-4 sm:p-6 md:p-8'
          )}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={A11Y_LABELS.launcher}
        >
          <motion.div
            variants={launcherVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
            className={cn(
              'relative',
              'w-full max-w-7xl',
              'rounded-2xl border',
              'p-4 sm:p-6',
              'flex flex-col',
              'max-h-[85vh]',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <AppLauncherHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={onClose}
              totalApps={totalApps}
            />

            {/* Tabs Navigation (hide when searching) */}
            {!hasSearchQuery && (
              <AppLauncherTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                favoritesCount={favoritesCount}
                recentCount={recentCount}
              />
            )}

            {/* App Content */}
            <div 
              className="flex-1 overflow-y-auto scrollbar-hide min-h-0"
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {sortedApps.length === 0 ? (
                <AppEmptyState
                  type={getEmptyStateType()}
                  searchQuery={hasSearchQuery ? searchQuery : undefined}
                  onClearSearch={clearSearch}
                />
              ) : viewMode === 'grid' ? (
                <AppLauncherGrid
                  apps={sortedApps}
                  groupByCategory={shouldGroupByCategory}
                  onAppClick={handleAppClick}
                  onAppAction={handleAppAction}
                  activeAppPath={pathname}
                  dockAppIds={dockAppIds}
                  favoriteAppIds={favoriteAppIds}
                />
              ) : (
                <AppLauncherList
                  apps={sortedApps}
                  onAppClick={handleAppClick}
                  onAppAction={handleAppAction}
                  activeAppPath={pathname}
                  dockAppIds={dockAppIds}
                  favoriteAppIds={favoriteAppIds}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
