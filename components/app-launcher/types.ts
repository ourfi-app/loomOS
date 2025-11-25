/**
 * TypeScript interfaces and types for the Unified App Launcher
 */

import { type AppDefinition } from '@/lib/enhanced-app-registry';

// Re-export AppDefinition for convenience
export type { AppDefinition };

// Tab Types
export type TabType = 'all' | 'favorites' | 'recent';

// View Modes
export type ViewMode = 'grid' | 'list';

// Sort Modes
export type SortMode = 'alphabetical' | 'recent' | 'frequent' | 'category';

// App Categories
export type AppCategory = 'essentials' | 'personal' | 'community' | 'productivity' | 'admin' | 'settings';

// App Actions (for context menu and keyboard shortcuts)
export type AppAction = 
  | 'open'
  | 'add-to-favorites'
  | 'remove-from-favorites'
  | 'add-to-dock'
  | 'remove-from-dock'
  | 'view-details';

export interface AppActionEvent {
  app: AppDefinition;
  action: AppAction;
  timestamp: number;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * Main App Launcher Props
 */
export interface AppLauncherProps {
  /** Whether the launcher is open */
  isOpen: boolean;
  /** Callback when launcher should close */
  onClose: () => void;
  /** Optional callback when an app is launched */
  onAppLaunch?: (app: AppDefinition) => void;
  /** Default tab to show on open */
  defaultTab?: TabType;
  /** Default view mode */
  defaultViewMode?: ViewMode;
  /** Default sort mode */
  defaultSortMode?: SortMode;
  /** Whether to show admin apps */
  showAdminApps?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Header Component Props
 */
export interface AppLauncherHeaderProps {
  /** Current search query */
  searchQuery: string;
  /** Callback when search changes */
  onSearchChange: (query: string) => void;
  /** Callback to close launcher */
  onClose: () => void;
  /** Total number of apps */
  totalApps: number;
}

/**
 * Tabs Component Props
 */
export interface AppLauncherTabsProps {
  /** Currently active tab */
  activeTab: TabType;
  /** Callback when tab changes */
  onTabChange: (tab: TabType) => void;
  /** Number of favorite apps */
  favoritesCount: number;
  /** Number of recent apps */
  recentCount: number;
}

/**
 * Toolbar Component Props
 */
export interface AppLauncherToolbarProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Callback when view mode changes */
  onViewModeChange: (mode: ViewMode) => void;
  /** Current sort mode */
  sortMode: SortMode;
  /** Callback when sort mode changes */
  onSortModeChange: (mode: SortMode) => void;
  /** Selected categories for filtering */
  selectedCategories: AppCategory[];
  /** Callback to toggle category selection */
  onCategoryToggle: (category: AppCategory) => void;
}

/**
 * Grid View Component Props
 */
export interface AppLauncherGridProps {
  /** List of apps to display */
  apps: AppDefinition[];
  /** Whether to group apps by category */
  groupByCategory: boolean;
  /** Callback when an app is clicked */
  onAppClick: (app: AppDefinition) => void;
  /** Callback when an app action is performed */
  onAppAction: (app: AppDefinition, action: AppAction) => void;
  /** Path of currently active app */
  activeAppPath?: string;
  /** IDs of apps in the dock */
  dockAppIds: string[];
  /** IDs of favorite apps */
  favoriteAppIds: string[];
}

/**
 * List View Component Props
 */
export interface AppLauncherListProps {
  /** List of apps to display */
  apps: AppDefinition[];
  /** Callback when an app is clicked */
  onAppClick: (app: AppDefinition) => void;
  /** Callback when an app action is performed */
  onAppAction: (app: AppDefinition, action: AppAction) => void;
  /** Path of currently active app */
  activeAppPath?: string;
  /** IDs of apps in the dock */
  dockAppIds: string[];
  /** IDs of favorite apps */
  favoriteAppIds: string[];
}

/**
 * App Card Component Props
 */
export interface AppCardProps {
  /** App definition */
  app: AppDefinition;
  /** Whether the app is currently active */
  isActive: boolean;
  /** Whether the app is in the dock */
  isInDock: boolean;
  /** Whether the app is favorited */
  isFavorite: boolean;
  /** Callback when card is clicked */
  onClick: () => void;
  /** Callback when a context action is performed */
  onContextAction: (action: AppAction) => void;
  /** Index for stagger animations */
  index: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * App List Item Component Props
 */
export interface AppListItemProps {
  /** App definition */
  app: AppDefinition;
  /** Whether the app is currently active */
  isActive: boolean;
  /** Whether the app is in the dock */
  isInDock: boolean;
  /** Whether the app is favorited */
  isFavorite: boolean;
  /** Callback when item is clicked */
  onClick: () => void;
  /** Callback when a context action is performed */
  onContextAction: (action: AppAction) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Context Menu Component Props
 */
export interface AppContextMenuProps {
  /** App definition */
  app: AppDefinition;
  /** Whether the app is in the dock */
  isInDock: boolean;
  /** Whether the app is favorited */
  isFavorite: boolean;
  /** Callback when an action is performed */
  onAction: (action: AppAction) => void;
  /** Child elements (trigger) */
  children: React.ReactNode;
}

/**
 * Empty State Component Props
 */
export interface AppEmptyStateProps {
  /** Type of empty state */
  type: 'search' | 'favorites' | 'recent' | 'category';
  /** Search query if type is 'search' */
  searchQuery?: string;
  /** Callback to clear search */
  onClearSearch?: () => void;
}

/**
 * Category Section Component Props
 */
export interface AppCategorySectionProps {
  /** Category ID */
  category: AppCategory;
  /** Apps in this category */
  apps: AppDefinition[];
  /** Display label for category */
  categoryLabel: string;
  /** Callback when an app is clicked */
  onAppClick: (app: AppDefinition) => void;
  /** Callback when an app action is performed */
  onAppAction: (app: AppDefinition, action: AppAction) => void;
  /** Path of currently active app */
  activeAppPath?: string;
  /** IDs of apps in the dock */
  dockAppIds: string[];
  /** IDs of favorite apps */
  favoriteAppIds: string[];
}

/**
 * Search Bar Component Props
 */
export interface AppSearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Callback to clear search */
  onClear: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to auto-focus on mount */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * useAppLauncher Hook Return Type
 */
export interface UseAppLauncherReturn {
  // State
  isOpen: boolean;
  activeTab: TabType;
  viewMode: ViewMode;
  sortMode: SortMode;
  searchQuery: string;
  selectedCategories: AppCategory[];
  
  // Computed
  filteredApps: AppDefinition[];
  groupedApps: Record<AppCategory, AppDefinition[]>;
  favoritesCount: number;
  recentCount: number;
  
  // Actions
  open: () => void;
  close: () => void;
  setActiveTab: (tab: TabType) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  setSearchQuery: (query: string) => void;
  toggleCategory: (category: AppCategory) => void;
  clearFilters: () => void;
}

/**
 * useAppSearch Hook Return Type
 */
export interface UseAppSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchResults: AppDefinition[];
  hasSearchQuery: boolean;
}

/**
 * useAppActions Hook Return Type
 */
export interface UseAppActionsReturn {
  handleAppClick: (app: AppDefinition) => void;
  handleAddToFavorites: (app: AppDefinition) => void;
  handleRemoveFromFavorites: (app: AppDefinition) => void;
  handleAddToDock: (app: AppDefinition) => void;
  handleRemoveFromDock: (app: AppDefinition) => void;
  handleContextAction: (app: AppDefinition, action: AppAction) => void;
}

/**
 * useKeyboardNavigation Hook Return Type
 */
export interface UseKeyboardNavigationReturn {
  focusedAppId: string | null;
  handleKeyDown: (event: KeyboardEvent) => void;
  focusApp: (appId: string) => void;
  clearFocus: () => void;
}

/**
 * useAppLauncherPreferences Hook Return Type
 */
export interface UseAppLauncherPreferencesReturn {
  dockAppIds: string[];
  favoriteAppIds: string[];
  recentAppIds: string[];
  appUsage: Record<string, { count: number; lastUsed: number }>;
  addToDock: (appId: string) => void;
  removeFromDock: (appId: string) => void;
  toggleFavorite: (appId: string) => void;
  trackAppUsage: (appId: string) => void;
  getRecentApps: (limit: number) => string[];
}
