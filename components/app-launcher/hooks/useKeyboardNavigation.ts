/**
 * Hook for keyboard navigation in the app launcher
 */

import { useState, useEffect, useCallback } from 'react';
import type { AppDefinition, UseKeyboardNavigationReturn } from '../types';

export function useKeyboardNavigation(
  apps: AppDefinition[],
  isOpen: boolean,
  onClose: () => void,
  onAppLaunch: (app: AppDefinition) => void,
  gridColumns: number = 5
): UseKeyboardNavigationReturn {
  const [focusedAppId, setFocusedAppId] = useState<string | null>(null);

  const focusApp = useCallback((appId: string) => {
    setFocusedAppId(appId);
  }, []);

  const clearFocus = useCallback(() => {
    setFocusedAppId(null);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen || apps.length === 0) return;

    const currentIndex = focusedAppId
      ? apps.findIndex((app) => app.id === focusedAppId)
      : -1;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;

      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < apps.length - 1 ? currentIndex + 1 : 0;
        break;

      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : apps.length - 1;
        break;

      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex + gridColumns;
        if (nextIndex >= apps.length) {
          nextIndex = currentIndex % gridColumns;
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex - gridColumns;
        if (nextIndex < 0) {
          // Go to the last row in the same column
          const column = currentIndex % gridColumns;
          const lastRowIndex = Math.floor((apps.length - 1) / gridColumns) * gridColumns + column;
          nextIndex = lastRowIndex < apps.length ? lastRowIndex : apps.length - 1;
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (focusedAppId) {
          const app = apps.find((a) => a.id === focusedAppId);
          if (app) {
            onAppLaunch(app);
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = apps.length - 1;
        break;

      default:
        return;
    }

    if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < apps.length) {
      setFocusedAppId(apps[nextIndex]!.id);
    }
  }, [isOpen, apps, focusedAppId, gridColumns, onClose, onAppLaunch]);

  // Set up keyboard event listener
  useEffect(() => {
    if (!isOpen) {
      clearFocus();
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown, clearFocus]);

  return {
    focusedAppId,
    handleKeyDown,
    focusApp,
    clearFocus,
  };
}
