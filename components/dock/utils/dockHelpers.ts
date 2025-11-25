/**
 * Helper utilities for the Unified Dock
 */

import type { AppDefinition } from '@/lib/enhanced-app-registry';
import type { Card } from '@/lib/card-manager-store';
import type { DockItemStatus, DockOrientation, DockPosition } from '../types';

/**
 * Get app status from card data
 */
export function getAppStatus(
  appId: string,
  pathname: string,
  activeCardId: string | null,
  cards: Card[],
  cardsByAppId: Map<string, Card>,
  runningAppIds: Set<string>,
  pinnedAppIds: string[]
): DockItemStatus {
  const card = cardsByAppId.get(appId);
  const app = cards.find(c => {
    const pathParts = c.path.split('/');
    const id = pathParts[pathParts.length - 1] || 'home';
    return id === appId;
  });

  const isRunning = runningAppIds.has(appId);
  const isMinimized = card?.minimized || false;
  const isActive = !isMinimized && (
    app?.id === activeCardId ||
    pathname.endsWith(`/${appId}`)
  );
  const isPinned = pinnedAppIds.includes(appId);

  return {
    isActive,
    isRunning,
    isMinimized,
    isPinned,
  };
}

/**
 * Extract app ID from path
 * e.g., '/dashboard/messages' -> 'messages'
 */
export function getAppIdFromPath(path: string): string {
  const pathParts = path.split('/');
  return pathParts[pathParts.length - 1] || 'home';
}

/**
 * Build card-to-app mapping
 */
export function buildCardsByAppIdMap(cards: Card[]): Map<string, Card> {
  return new Map(
    cards.map(card => {
      const appId = getAppIdFromPath(card.path);
      return [appId, card];
    })
  );
}

/**
 * Get running app IDs from cards
 */
export function getRunningAppIds(cards: Card[]): Set<string> {
  return new Set(
    cards.map(card => getAppIdFromPath(card.path))
  );
}

/**
 * Filter apps that aren't already pinned
 */
export function getUnpinnedRunningApps(
  runningAppIds: Set<string>,
  pinnedApps: AppDefinition[],
  getAppById: (id: string) => AppDefinition | undefined,
  showAdminFeatures: boolean
): AppDefinition[] {
  return Array.from(runningAppIds)
    .filter(id => !pinnedApps.some(app => app.id === id))
    .map(id => getAppById(id))
    .filter((app): app is AppDefinition =>
      app !== undefined &&
      (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
    );
}

/**
 * Check if dock should be visible based on context
 */
export function shouldShowDock(
  pathname: string,
  isVisible: boolean,
  autoHide: boolean,
  cardsLength: number
): boolean {
  const isHome = pathname === '/' || pathname === '/dashboard';
  
  // Always show on home
  if (isHome) {
    return true;
  }
  
  // If auto-hide is disabled, always show
  if (!autoHide) {
    return true;
  }
  
  // Otherwise, respect visibility state
  return isVisible;
}

/**
 * Calculate dock position classes based on orientation and position
 */
export function getDockPositionClasses(
  orientation: DockOrientation,
  position: DockPosition
): string {
  const baseClasses = 'fixed z-[9999]';
  
  switch (position) {
    case 'bottom':
      return `${baseClasses} bottom-0 left-0 right-0 flex items-center justify-center pb-4 px-4 sm:pb-6 sm:px-6 md:pb-8`;
    case 'top':
      return `${baseClasses} top-0 left-0 right-0 flex items-center justify-center pt-4 px-4 sm:pt-6 sm:px-6 md:pt-8`;
    case 'left':
      return `${baseClasses} left-0 top-0 bottom-0 flex items-center justify-center pl-4 py-4 sm:pl-6 sm:py-6 md:pl-8`;
    case 'right':
      return `${baseClasses} right-0 top-0 bottom-0 flex items-center justify-center pr-4 py-4 sm:pr-6 sm:py-6 md:pr-8`;
    default:
      return `${baseClasses} bottom-0 left-0 right-0 flex items-center justify-center pb-4 px-4 sm:pb-6 sm:px-6 md:pb-8`;
  }
}

/**
 * Calculate dock inner container classes based on orientation
 */
export function getDockInnerClasses(
  orientation: DockOrientation,
  isDragOver: boolean
): string {
  const baseClasses = 'dock flex items-center rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300';
  const orientationClasses = orientation === 'horizontal'
    ? 'flex-row gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5'
    : 'flex-col gap-2 sm:gap-3 py-4 px-3 sm:py-5 sm:px-3.5';
  const dragClasses = isDragOver ? 'drag-over' : '';
  
  return `${baseClasses} ${orientationClasses} ${dragClasses}`.trim();
}

/**
 * Get dock item size classes based on size variant
 */
export function getDockItemSizeClasses(size: 'small' | 'medium' | 'large'): {
  container: string;
  icon: string;
} {
  switch (size) {
    case 'small':
      return {
        container: 'h-12 w-12 sm:h-14 sm:w-14',
        icon: 'h-6 w-6 sm:h-7 sm:w-7',
      };
    case 'medium':
      return {
        container: 'h-14 w-14 sm:h-16 sm:w-16',
        icon: 'h-7 w-7 sm:h-8 sm:w-8',
      };
    case 'large':
      return {
        container: 'h-16 w-16 sm:h-18 sm:w-18',
        icon: 'h-8 w-8 sm:h-9 sm:w-9',
      };
    default:
      return {
        container: 'h-14 w-14 sm:h-16 sm:w-16',
        icon: 'h-7 w-7 sm:h-8 sm:w-8',
      };
  }
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint
}

/**
 * Check if device is desktop
 */
export function isDesktopDevice(): boolean {
  return !isMobileDevice();
}

/**
 * Calculate distance from edge of screen
 */
export function getDistanceFromEdge(
  clientX: number,
  clientY: number,
  position: DockPosition
): number {
  if (typeof window === 'undefined') return Infinity;
  
  switch (position) {
    case 'bottom':
      return window.innerHeight - clientY;
    case 'top':
      return clientY;
    case 'left':
      return clientX;
    case 'right':
      return window.innerWidth - clientX;
    default:
      return window.innerHeight - clientY;
  }
}

/**
 * Validate swipe gesture
 */
export function isValidSwipe(
  startY: number,
  endY: number,
  startTime: number,
  endTime: number,
  minDistance: number,
  maxDuration: number
): { isValid: boolean; direction: 'up' | 'down' | null } {
  const deltaY = startY - endY;
  const deltaTime = endTime - startTime;
  const distance = Math.abs(deltaY);
  
  if (distance < minDistance || deltaTime > maxDuration) {
    return { isValid: false, direction: null };
  }
  
  return {
    isValid: true,
    direction: deltaY > 0 ? 'up' : 'down',
  };
}

/**
 * Check if app can be customized in dock (position < maxPinned)
 */
export function canCustomizeApp(
  isPinned: boolean,
  position: number | undefined,
  maxPinnedApps: number
): boolean {
  return isPinned && position !== undefined && position < maxPinnedApps;
}

/**
 * Get status label for accessibility
 */
export function getStatusLabel(status: DockItemStatus): string {
  if (status.isMinimized) return 'Minimized';
  if (status.isActive) return 'Active';
  if (status.isRunning) return 'Running';
  if (status.isPinned) return 'Pinned';
  return 'Not running';
}

/**
 * Reorder array items (for drag and drop)
 */
export function reorderArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Find app index in array by ID
 */
export function findAppIndex(apps: AppDefinition[], appId: string): number {
  return apps.findIndex(app => app.id === appId);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
