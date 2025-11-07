
/**
 * React Hooks for Responsive Design
 * 
 * Provides runtime responsive utilities for React components
 */

import { useEffect, useState, useMemo } from 'react';
import { getCurrentBreakpoint, isTouchDevice, type Breakpoint } from '@/lib/responsive-system';

/**
 * Hook to get current breakpoint
 * Updates when window is resized
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    // Set initial breakpoint
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint(getCurrentBreakpoint(width));
    };

    updateBreakpoint();

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if device is mobile
 */
export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile' || breakpoint === 'mobileLandscape';
}

/**
 * Hook to check if device is tablet
 */
export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'tablet';
}

/**
 * Hook to check if device is desktop
 */
export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop' || breakpoint === 'desktopLarge' || breakpoint === 'desktopXL';
}

/**
 * Hook to detect touch capability
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  return isTouch;
}

/**
 * Hook to get window dimensions
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to check if screen matches media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook for responsive value selection
 * Returns different values based on current breakpoint
 */
export function useResponsiveValue<T>(values: {
  mobile?: T;
  mobileLandscape?: T;
  tablet?: T;
  desktop?: T;
  desktopLarge?: T;
  desktopXL?: T;
  default: T;
}): T {
  const breakpoint = useBreakpoint();

  return useMemo(() => {
    switch (breakpoint) {
      case 'mobile':
        return values.mobile ?? values.default;
      case 'mobileLandscape':
        return values.mobileLandscape ?? values.mobile ?? values.default;
      case 'tablet':
        return values.tablet ?? values.mobileLandscape ?? values.mobile ?? values.default;
      case 'desktop':
        return values.desktop ?? values.tablet ?? values.default;
      case 'desktopLarge':
        return values.desktopLarge ?? values.desktop ?? values.default;
      case 'desktopXL':
        return values.desktopXL ?? values.desktopLarge ?? values.desktop ?? values.default;
      default:
        return values.default;
    }
  }, [breakpoint, values]);
}

/**
 * Hook to get columns for responsive grid
 */
export function useGridColumns(config: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  default?: number;
}): number {
  return useResponsiveValue({
    mobile: config.mobile,
    tablet: config.tablet,
    desktop: config.desktop,
    default: config.default || 1,
  });
}

/**
 * Hook to detect orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return orientation;
}

/**
 * Hook to get safe area insets (for notched devices)
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    // Get CSS environment variables for safe area
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    setInsets({
      top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
      right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
    });
  }, []);

  return insets;
}

/**
 * Export all hooks
 */
export default {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouchDevice,
  useWindowSize,
  useMediaQuery,
  useResponsiveValue,
  useGridColumns,
  useOrientation,
  useSafeAreaInsets,
};
