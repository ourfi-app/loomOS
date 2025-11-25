/**
 * useDockItems Hook
 * 
 * Manages dock items (pinned apps, running apps, and their status)
 */

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { getAppById, type AppDefinition } from '@/lib/enhanced-app-registry';
import type { UseDockItemsReturn, DockItemStatus } from '../types';
import {
  getAppStatus,
  buildCardsByAppIdMap,
  getRunningAppIds,
  getUnpinnedRunningApps,
} from '../utils/dockHelpers';

export function useDockItems(
  showAdminFeatures: boolean,
  showRunningApps: boolean = true,
  maxPinnedApps: number = 5
): UseDockItemsReturn {
  const pathname = usePathname();
  const { cards, activeCardId } = useCardManager();
  const { dockAppIds } = useAppPreferences();

  // Build derived data structures
  const cardsByAppId = useMemo(
    () => buildCardsByAppIdMap(cards),
    [cards]
  );

  const runningAppIds = useMemo(
    () => getRunningAppIds(cards),
    [cards]
  );

  // Get pinned apps (up to maxPinnedApps)
  const pinnedApps = useMemo(() => {
    return dockAppIds
      .map(id => getAppById(id))
      .filter((app): app is AppDefinition =>
        app !== undefined &&
        (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
      )
      .slice(0, maxPinnedApps);
  }, [dockAppIds, showAdminFeatures, maxPinnedApps]);

  // Get running apps that aren't pinned
  const runningApps = useMemo(() => {
    if (!showRunningApps) return [];

    return getUnpinnedRunningApps(
      runningAppIds,
      pinnedApps,
      getAppById,
      showAdminFeatures
    );
  }, [runningAppIds, pinnedApps, showAdminFeatures, showRunningApps]);

  // Combine pinned and running apps
  const dockApps = useMemo(
    () => [...pinnedApps, ...runningApps],
    [pinnedApps, runningApps]
  );

  // Get app status function
  const getAppStatusFn = (appId: string): DockItemStatus => {
    return getAppStatus(
      appId,
      pathname,
      activeCardId,
      cards,
      cardsByAppId,
      runningAppIds,
      dockAppIds
    );
  };

  return {
    pinnedApps,
    runningApps,
    dockApps,
    cardsByAppId,
    runningAppIds,
    getAppStatus: getAppStatusFn,
  };
}
