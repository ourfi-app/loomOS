/**
 * Hook for handling app actions (launch, favorite, dock, etc.)
 */

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { toast } from 'sonner';
import type { AppDefinition, AppAction, UseAppActionsReturn } from '../types';
import { TOAST_MESSAGES } from '../utils/constants';

export function useAppActions(
  onClose?: () => void,
  onAppLaunch?: (app: AppDefinition) => void
): UseAppActionsReturn {
  const router = useRouter();
  const { launchApp } = useCardManager();
  const { addToDock, removeFromDock, toggleFavorite, trackAppUsage } = useAppPreferences();

  const handleAppClick = useCallback((app: AppDefinition) => {
    // Track app usage
    trackAppUsage(app.id);

    // If custom handler provided, use it
    if (onAppLaunch) {
      onAppLaunch(app);
      onClose?.();
      return;
    }

    // Special handling for Dashboard and Onboarding - navigate to full page
    if (app.path === '/dashboard' || app.path === '/onboarding') {
      router.push(app.path);
    } else {
      // Launch as card
      launchApp({
        id: app.id,
        title: app.title,
        path: app.path,
        color: app.gradient,
        icon: app.id,
      });
      router.push(app.path);
    }

    onClose?.();
  }, [router, launchApp, trackAppUsage, onAppLaunch, onClose]);

  const handleAddToFavorites = useCallback((app: AppDefinition) => {
    toggleFavorite(app.id);
    const message = TOAST_MESSAGES.addedToFavorites(app.title);
    toast.success(message.title, { description: message.description });
  }, [toggleFavorite]);

  const handleRemoveFromFavorites = useCallback((app: AppDefinition) => {
    toggleFavorite(app.id);
    const message = TOAST_MESSAGES.removedFromFavorites(app.title);
    toast.success(message.title, { description: message.description });
  }, [toggleFavorite]);

  const handleAddToDock = useCallback((app: AppDefinition) => {
    addToDock(app.id);
    const message = TOAST_MESSAGES.addedToDock(app.title);
    toast.success(message.title, { description: message.description });
  }, [addToDock]);

  const handleRemoveFromDock = useCallback((app: AppDefinition) => {
    removeFromDock(app.id);
    const message = TOAST_MESSAGES.removedFromDock(app.title);
    toast.success(message.title, { description: message.description });
  }, [removeFromDock]);

  const handleContextAction = useCallback((app: AppDefinition, action: AppAction) => {
    switch (action) {
      case 'open':
        handleAppClick(app);
        break;
      case 'add-to-favorites':
        handleAddToFavorites(app);
        break;
      case 'remove-from-favorites':
        handleRemoveFromFavorites(app);
        break;
      case 'add-to-dock':
        handleAddToDock(app);
        break;
      case 'remove-from-dock':
        handleRemoveFromDock(app);
        break;
      case 'view-details':
        // TODO: Implement app details view
        console.log('View details for:', app.title);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }, [handleAppClick, handleAddToFavorites, handleRemoveFromFavorites, handleAddToDock, handleRemoveFromDock]);

  return {
    handleAppClick,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleAddToDock,
    handleRemoveFromDock,
    handleContextAction,
  };
}
