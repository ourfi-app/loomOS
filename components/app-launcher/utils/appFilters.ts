/**
 * Utility functions for filtering, sorting, and searching apps
 */

import type { AppDefinition, AppCategory, SortMode } from '../types';
import { searchApps, getAllApps, getAppById } from '@/lib/enhanced-app-registry';

/**
 * Filter apps by search query
 */
export function filterAppsBySearch(
  apps: AppDefinition[],
  query: string
): AppDefinition[] {
  if (!query || query.trim() === '') {
    return apps;
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return apps.filter((app) => {
    // Search in title
    if (app.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in description
    if (app.description?.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in keywords
    if (app.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery))) {
      return true;
    }
    
    // Search in category
    if (app.category.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Filter apps by categories
 */
export function filterAppsByCategories(
  apps: AppDefinition[],
  categories: AppCategory[]
): AppDefinition[] {
  if (categories.length === 0) {
    return apps;
  }
  
  return apps.filter((app) => categories.includes(app.category));
}

/**
 * Filter apps by admin requirements
 */
export function filterAppsByAdmin(
  apps: AppDefinition[],
  showAdminApps: boolean
): AppDefinition[] {
  if (showAdminApps) {
    return apps;
  }
  
  return apps.filter((app) => !app.requiresAdmin);
}

/**
 * Get favorite apps
 */
export function getFavoriteApps(
  favoriteIds: string[],
  showAdminApps: boolean
): AppDefinition[] {
  return favoriteIds
    .map((id) => getAppById(id))
    .filter((app): app is AppDefinition => {
      if (!app) return false;
      if (app.requiresAdmin && !showAdminApps) return false;
      return true;
    });
}

/**
 * Get recent apps
 */
export function getRecentApps(
  recentIds: string[],
  showAdminApps: boolean,
  limit: number = 20
): AppDefinition[] {
  return recentIds
    .slice(0, limit)
    .map((id) => getAppById(id))
    .filter((app): app is AppDefinition => {
      if (!app) return false;
      if (app.requiresAdmin && !showAdminApps) return false;
      return true;
    });
}

/**
 * Sort apps by mode
 */
export function sortApps(
  apps: AppDefinition[],
  sortMode: SortMode,
  appUsage?: Record<string, { count: number; lastUsed: number }>
): AppDefinition[] {
  const sortedApps = [...apps];
  
  switch (sortMode) {
    case 'alphabetical':
      return sortedApps.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'recent':
      if (!appUsage) return sortedApps;
      return sortedApps.sort((a, b) => {
        const aUsage = appUsage[a.id];
        const bUsage = appUsage[b.id];
        
        if (!aUsage && !bUsage) return 0;
        if (!aUsage) return 1;
        if (!bUsage) return -1;
        
        return bUsage.lastUsed - aUsage.lastUsed;
      });
    
    case 'frequent':
      if (!appUsage) return sortedApps;
      return sortedApps.sort((a, b) => {
        const aUsage = appUsage[a.id];
        const bUsage = appUsage[b.id];
        
        if (!aUsage && !bUsage) return 0;
        if (!aUsage) return 1;
        if (!bUsage) return -1;
        
        return bUsage.count - aUsage.count;
      });
    
    case 'category':
      // Sort by category, then alphabetically within category
      return sortedApps.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
    
    default:
      return sortedApps;
  }
}

/**
 * Group apps by category
 */
export function groupAppsByCategory(
  apps: AppDefinition[]
): Record<AppCategory, AppDefinition[]> {
  const groups: Record<string, AppDefinition[]> = {};
  
  apps.forEach((app) => {
    if (!groups[app.category]) {
      groups[app.category] = [];
    }
    groups[app.category]!.push(app);
  });
  
  return groups as Record<AppCategory, AppDefinition[]>;
}

/**
 * Get app status flags
 */
export function getAppStatus(
  app: AppDefinition,
  dockAppIds: string[],
  favoriteAppIds: string[],
  activeAppPath?: string
) {
  return {
    isInDock: dockAppIds.includes(app.id),
    isFavorite: favoriteAppIds.includes(app.id),
    isActive: activeAppPath ? (
      app.path === '/dashboard' 
        ? activeAppPath === '/dashboard'
        : activeAppPath.startsWith(app.path)
    ) : false,
    isNew: app.isNew || false,
    isBeta: app.isBeta || false,
    requiresAdmin: app.requiresAdmin || false,
  };
}
