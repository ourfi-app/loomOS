/**
 * useDockVisibility Hook
 * 
 * Manages dock visibility (auto-hide, mouse proximity, gestures)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { UseDockVisibilityReturn, DockPosition } from '../types';
import {
  AUTO_HIDE_CONFIG,
  GESTURE_CONFIG,
} from '../utils/constants';
import {
  isDesktopDevice,
  getDistanceFromEdge,
  isValidSwipe,
} from '../utils/dockHelpers';

export function useDockVisibility(
  autoHide: boolean = false,
  enableGestures: boolean = true,
  position: DockPosition = 'bottom',
  cardsLength: number = 0
): UseDockVisibilityReturn {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isDockHovered, setIsDockHovered] = useState(false);

  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHome = pathname === '/' || pathname === '/dashboard';

  /**
   * Clear auto-hide timeout
   */
  const clearAutoHideTimeout = useCallback(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
      autoHideTimeoutRef.current = null;
    }
  }, []);

  /**
   * Schedule auto-hide
   */
  const scheduleAutoHide = useCallback(() => {
    if (!autoHide || isHome || isDockHovered) return;

    clearAutoHideTimeout();
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, AUTO_HIDE_CONFIG.hideDelay);
  }, [autoHide, isHome, isDockHovered, clearAutoHideTimeout]);

  /**
   * Show dock
   */
  const showDock = useCallback(() => {
    setIsVisible(true);
    clearAutoHideTimeout();
  }, [clearAutoHideTimeout]);

  /**
   * Hide dock
   */
  const hideDock = useCallback(() => {
    if (isHome) return; // Never hide on home
    setIsVisible(false);
  }, [isHome]);

  /**
   * Toggle dock visibility
   */
  const toggleDock = useCallback(() => {
    if (isVisible) {
      hideDock();
    } else {
      showDock();
    }
  }, [isVisible, showDock, hideDock]);

  /**
   * Set hovered state
   */
  const setDockHovered = useCallback((hovered: boolean) => {
    setIsDockHovered(hovered);
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Desktop auto-hide: Show dock when mouse approaches edge
   */
  useEffect(() => {
    if (!autoHide) {
      setIsVisible(true);
      return;
    }

    // Always show on home/dashboard
    if (isHome) {
      setIsVisible(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktopDevice()) return;

      const distanceFromEdge = getDistanceFromEdge(e.clientX, e.clientY, position);

      if (distanceFromEdge <= AUTO_HIDE_CONFIG.showThreshold) {
        showDock();
      } else if (!isDockHovered && isVisible) {
        scheduleAutoHide();
      }
    };

    const handleResize = () => {
      if (!isDesktopDevice()) {
        const isInApp = cardsLength > 0 && !isHome;
        setIsVisible(!isInApp);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearAutoHideTimeout();
    };
  }, [
    pathname,
    cardsLength,
    isDockHovered,
    isVisible,
    autoHide,
    isHome,
    position,
    showDock,
    scheduleAutoHide,
    clearAutoHideTimeout,
  ]);

  /**
   * Gesture controls for mobile
   */
  useEffect(() => {
    if (!enableGestures) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger from bottom gesture area (for bottom position)
      if (position !== 'bottom') return;

      const touch = e.touches[0];
      if (!touch || touch.clientY < window.innerHeight - 80) return;

      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();

      const swipe = isValidSwipe(
        touchStartY.current,
        touchEndY,
        touchStartTime.current,
        touchEndTime,
        GESTURE_CONFIG.minSwipeDistance,
        GESTURE_CONFIG.maxSwipeDuration
      );

      if (!swipe.isValid) return;

      // Swipe up to show dock
      if (swipe.direction === 'up' && !isVisible) {
        showDock();
      }
      // Swipe down to hide dock (only if not on home)
      else if (swipe.direction === 'down' && isVisible && !isHome) {
        hideDock();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isVisible, pathname, enableGestures, isHome, position, showDock, hideDock]);

  return {
    isVisible,
    isDockHovered,
    showDock,
    hideDock,
    toggleDock,
    setIsDockHovered: setDockHovered,
  };
}
