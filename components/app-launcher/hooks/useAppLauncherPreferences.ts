/**
 * Hook for integrating with app preferences store
 */

import { useAppPreferences } from '@/lib/app-preferences-store';
import type { UseAppLauncherPreferencesReturn } from '../types';

export function useAppLauncherPreferences(): UseAppLauncherPreferencesReturn {
  const {
    dockAppIds,
    addToDock,
    removeFromDock,
    favoriteAppIds,
    toggleFavorite,
    trackAppUsage,
    getRecentApps,
    appUsage,
  } = useAppPreferences();

  // Get recent app IDs
  const recentAppIds = getRecentApps(20);

  return {
    dockAppIds,
    favoriteAppIds,
    recentAppIds,
    appUsage,
    addToDock,
    removeFromDock,
    toggleFavorite,
    trackAppUsage,
    getRecentApps,
  };
}
