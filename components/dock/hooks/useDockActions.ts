/**
 * useDockActions Hook
 * 
 * Handles all dock actions (launch, close, pin, unpin, etc.)
 */

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { getAppById, type AppDefinition } from '@/lib/enhanced-app-registry';
import { toast } from 'sonner';
import type { UseDockActionsReturn, DockAction } from '../types';
import { TOAST_MESSAGES, ACTION_LABELS } from '../utils/constants';

export function useDockActions(
  cardsByAppId: Map<string, any>,
  maxPinnedApps: number = 5
): UseDockActionsReturn {
  const router = useRouter();
  const { openSearch } = useUniversalSearch();
  const { closeCard, closeAllCards, restoreCard } = useCardManager();
  const { addToDock, removeFromDock, dockAppIds, trackAppUsage } = useAppPreferences();

  /**
   * Launch or restore an app
   */
  const handleAppLaunch = useCallback(
    (app: AppDefinition) => {
      trackAppUsage(app.id);

      // Special handling for AI Assistant - open Universal Search instead
      if (app.id === 'ai-assistant' || app.id === 'assistant') {
        openSearch();
        return;
      }

      // Check if app is minimized - if so, restore it
      const card = cardsByAppId.get(app.id);
      if (card && card.minimized) {
        toast.success(
          TOAST_MESSAGES.appRestored(app.title).title,
          {
            description: TOAST_MESSAGES.appRestored(app.title).description,
            duration: 2000,
          }
        );

        restoreCard(card.id);
        router.push(app.path);
        return;
      }

      // Special handling for Home button - close all cards
      if (app.id === 'home' || app.path === '/dashboard') {
        closeAllCards();
        router.push(app.path);
      } else {
        router.push(app.path);
      }
    },
    [router, trackAppUsage, openSearch, cardsByAppId, restoreCard, closeAllCards]
  );

  /**
   * Close/quit an app
   */
  const handleCloseApp = useCallback(
    (appId: string) => {
      const app = getAppById(appId);
      if (!app) return;

      const card = Array.from(cardsByAppId.values()).find(
        c => c.path === app.path
      );

      if (card) {
        closeCard(card.id);
        toast.success(
          TOAST_MESSAGES.appClosed(app.title).title,
          {
            description: TOAST_MESSAGES.appClosed(app.title).description,
          }
        );
      }
    },
    [cardsByAppId, closeCard]
  );

  /**
   * Pin app to dock
   */
  const handlePinApp = useCallback(
    (appId: string, position?: number) => {
      // Check if dock is full
      if (dockAppIds.length >= maxPinnedApps && position === undefined) {
        toast.error(
          TOAST_MESSAGES.maxAppsReached(maxPinnedApps).title,
          {
            description: TOAST_MESSAGES.maxAppsReached(maxPinnedApps).description,
          }
        );
        return;
      }

      addToDock(appId, position);

      const app = getAppById(appId);
      const finalPosition = position ?? dockAppIds.length;

      toast.success(
        TOAST_MESSAGES.appPinned(app?.title || appId, finalPosition).title,
        {
          description: TOAST_MESSAGES.appPinned(app?.title || appId, finalPosition).description,
        }
      );
    },
    [addToDock, dockAppIds, maxPinnedApps]
  );

  /**
   * Unpin app from dock
   */
  const handleUnpinApp = useCallback(
    (appId: string) => {
      removeFromDock(appId);

      const app = getAppById(appId);
      toast.info(
        TOAST_MESSAGES.appUnpinned(app?.title || appId).title,
        {
          description: TOAST_MESSAGES.appUnpinned(app?.title || appId).description,
        }
      );
    },
    [removeFromDock]
  );

  /**
   * Replace app in dock at specific position
   */
  const handleReplaceInDock = useCallback(
    (appId: string, position: number) => {
      addToDock(appId, position);

      const app = getAppById(appId);
      toast.success(
        TOAST_MESSAGES.appPinned(app?.title || appId, position).title,
        {
          description: TOAST_MESSAGES.appPinned(app?.title || appId, position).description,
        }
      );
    },
    [addToDock]
  );

  /**
   * Handle context menu actions
   */
  const handleContextAction = useCallback(
    (app: AppDefinition, action: DockAction) => {
      switch (action) {
        case 'open':
          handleAppLaunch(app);
          break;
        case 'close':
        case 'quit':
          handleCloseApp(app.id);
          break;
        case 'restore':
          handleAppLaunch(app);
          break;
        case 'pin':
          handlePinApp(app.id);
          break;
        case 'unpin':
        case 'remove':
          handleUnpinApp(app.id);
          break;
        case 'replace':
          toast.info(
            TOAST_MESSAGES.replacePrompt().title,
            {
              description: TOAST_MESSAGES.replacePrompt().description,
            }
          );
          break;
        case 'info':
          // TODO: Implement app info modal
          toast.info('App Info', {
            description: `${app.title} - ${app.description}`,
          });
          break;
        default:
          console.warn(`Unknown dock action: ${action}`);
      }
    },
    [handleAppLaunch, handleCloseApp, handlePinApp, handleUnpinApp]
  );

  return {
    handleAppLaunch,
    handleCloseApp,
    handlePinApp,
    handleUnpinApp,
    handleReplaceInDock,
    handleContextAction,
  };
}
