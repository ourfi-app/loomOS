/**
 * Constants and configuration for the App Launcher
 */

import type { AppCategory, TabType, ViewMode, SortMode } from '../types';

/**
 * Category labels for display
 */
export const CATEGORY_LABELS: Record<AppCategory, string> = {
  essentials: 'Essentials',
  personal: 'Personal',
  community: 'Community',
  productivity: 'Productivity',
  admin: 'Administration',
  settings: 'Settings',
};

/**
 * Category display order
 */
export const CATEGORY_ORDER: AppCategory[] = [
  'essentials',
  'personal',
  'community',
  'productivity',
  'admin',
  'settings',
];

/**
 * Tab configuration
 */
export const TABS: Array<{
  id: TabType;
  label: string;
  icon: string;
}> = [
  { id: 'all', label: 'All Apps', icon: 'Grid3x3' },
  { id: 'favorites', label: 'Favorites', icon: 'Star' },
  { id: 'recent', label: 'Recent', icon: 'Clock' },
];

/**
 * View mode labels
 */
export const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  grid: 'Grid View',
  list: 'List View',
};

/**
 * Sort mode labels
 */
export const SORT_MODE_LABELS: Record<SortMode, string> = {
  alphabetical: 'A-Z',
  recent: 'Recent',
  frequent: 'Frequent',
  category: 'Category',
};

/**
 * Grid columns by breakpoint
 */
export const GRID_COLUMNS = {
  mobile: 3,
  tablet: 4,
  desktop: 5,
  desktopLarge: 6,
  desktopXL: 8,
};

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
  backdrop: 200,
  stagger: 20, // Delay between each app card
};

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  close: 'Escape',
  search: ['Cmd+F', 'Ctrl+F'],
  tabAll: ['Cmd+1', 'Ctrl+1'],
  tabFavorites: ['Cmd+2', 'Ctrl+2'],
  tabRecent: ['Cmd+3', 'Ctrl+3'],
  toggleView: ['Cmd+G', 'Ctrl+G'],
  launchApp: 'Enter',
  navigateUp: 'ArrowUp',
  navigateDown: 'ArrowDown',
  navigateLeft: 'ArrowLeft',
  navigateRight: 'ArrowRight',
};

/**
 * Search configuration
 */
export const SEARCH_CONFIG = {
  minLength: 1,
  debounceMs: 300,
  placeholder: 'Search apps...',
};

/**
 * Recent apps configuration
 */
export const RECENT_APPS_CONFIG = {
  maxItems: 20,
  expiryDays: 30,
};

/**
 * Empty state messages
 */
export const EMPTY_STATE_MESSAGES = {
  search: {
    title: 'No apps found',
    description: 'Try adjusting your search query',
  },
  favorites: {
    title: 'No favorites yet',
    description: 'Star your favorite apps for quick access',
  },
  recent: {
    title: 'No recent apps',
    description: 'Apps you open will appear here',
  },
  category: {
    title: 'No apps in this category',
    description: 'Try selecting a different category',
  },
};

/**
 * Accessibility labels
 */
export const A11Y_LABELS = {
  launcher: 'Application Launcher',
  closeButton: 'Close launcher',
  searchInput: 'Search applications',
  clearSearch: 'Clear search',
  tabButton: (label: string) => `${label} tab`,
  viewModeButton: (mode: ViewMode) => `Switch to ${VIEW_MODE_LABELS[mode]}`,
  sortModeButton: (mode: SortMode) => `Sort by ${SORT_MODE_LABELS[mode]}`,
  categoryButton: (category: string) => `Filter by ${category}`,
  appCard: (title: string) => `Launch ${title}`,
  contextMenu: (title: string) => `${title} actions`,
  favoriteButton: (isFavorite: boolean) => isFavorite ? 'Remove from favorites' : 'Add to favorites',
  dockButton: (isInDock: boolean) => isInDock ? 'Remove from dock' : 'Add to dock',
};

/**
 * Toast messages
 */
export const TOAST_MESSAGES = {
  addedToFavorites: (appTitle: string) => ({
    title: 'Added to Favorites',
    description: `${appTitle} has been added to your favorites`,
  }),
  removedFromFavorites: (appTitle: string) => ({
    title: 'Removed from Favorites',
    description: `${appTitle} has been removed from your favorites`,
  }),
  addedToDock: (appTitle: string) => ({
    title: 'Added to Dock',
    description: `${appTitle} has been added to your dock`,
  }),
  removedFromDock: (appTitle: string) => ({
    title: 'Removed from Dock',
    description: `${appTitle} has been removed from your dock`,
  }),
  launchError: (appTitle: string) => ({
    title: 'Launch Failed',
    description: `Failed to launch ${appTitle}. Please try again.`,
  }),
};

/**
 * Default values
 */
export const DEFAULTS = {
  tab: 'all' as TabType,
  viewMode: 'grid' as ViewMode,
  sortMode: 'alphabetical' as SortMode,
  selectedCategories: [] as AppCategory[],
};
