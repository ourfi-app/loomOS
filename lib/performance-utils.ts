
/**
 * Performance Utilities for loomOS
 * 
 * Collection of utilities for optimizing performance:
 * - Lazy loading helpers
 * - Memoization utilities
 * - Performance monitoring
 * - Bundle size optimization
 */

import dynamic from 'next/dynamic';
import { ComponentType, ReactElement } from 'react';

/**
 * Lazy Load Component with Loading State
 * 
 * Wrapper around Next.js dynamic import with custom loading component
 * 
 * @example
 * const HeavyChart = lazyLoad(() => import('./heavy-chart'), {
 *   loading: <LoadingSpinner />
 * });
 */
export function lazyLoad<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: ReactElement;
    ssr?: boolean;
  }
): ComponentType<P> {
  return dynamic(importFunc, {
    loading: () => options?.loading || null,
    ssr: options?.ssr !== undefined ? options.ssr : false,
  });
}

/**
 * Debounce Function
 * 
 * Delays execution until after a specified time has elapsed
 * Useful for search inputs, scroll handlers, resize events
 * 
 * @example
 * const debouncedSearch = debounce(handleSearch, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle Function
 * 
 * Limits execution to once per specified time period
 * Useful for scroll handlers, mouse move events
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Intersection Observer Hook Helper
 * 
 * Efficiently detect when an element enters viewport
 * Useful for lazy loading images, infinite scroll, analytics
 * 
 * @example
 * const observer = createIntersectionObserver(
 *   (entries) => // console.log('Element visible:', entries[0].isIntersecting),
 *   { threshold: 0.5 }
 * );
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

/**
 * Request Idle Callback Wrapper
 * 
 * Schedule non-critical work during browser idle time
 * Useful for analytics, prefetching, background tasks
 * 
 * @example
 * scheduleIdleTask(() => {
 *   // Non-critical work
 * });
 */
export function scheduleIdleTask(
  callback: () => void,
  options?: { timeout?: number }
): number | NodeJS.Timeout {
  if (typeof window === 'undefined') {
    return setTimeout(callback, 0);
  }
  
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  return setTimeout(callback, 1);
}

/**
 * Cancel Idle Callback
 */
export function cancelIdleTask(id: number | NodeJS.Timeout): void {
  if (typeof window === 'undefined') {
    clearTimeout(id as NodeJS.Timeout);
    return;
  }
  
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id as number);
  } else {
    clearTimeout(id as NodeJS.Timeout);
  }
}

/**
 * Performance Mark
 * 
 * Mark performance timing points for measurement
 * 
 * @example
 * performanceMark('component-render-start');
 * // ... render logic
 * performanceMark('component-render-end');
 * const duration = performanceMeasure('component-render', 'component-render-start', 'component-render-end');
 */
export function performanceMark(name: string): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(name);
  }
}

/**
 * Performance Measure
 * 
 * Measure time between two marks
 */
export function performanceMeasure(
  name: string,
  startMark: string,
  endMark: string
): number {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : 0;
    } catch (e) {
      console.warn('Performance measurement failed:', e);
      return 0;
    }
  }
  return 0;
}

/**
 * Memoize Function
 * 
 * Cache function results based on arguments
 * Useful for expensive calculations
 * 
 * @example
 * const expensiveCalculation = memoize((n: number) => {
 *   // Heavy computation
 *   return result;
 * });
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch Updates
 * 
 * Batch multiple state updates to reduce re-renders
 * 
 * @example
 * batchUpdates(() => {
 *   setState1(value1);
 *   setState2(value2);
 *   setState3(value3);
 * });
 */
export function batchUpdates(callback: () => void): void {
  if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
    requestAnimationFrame(callback);
  } else {
    callback();
  }
}

/**
 * Check if element is in viewport
 * 
 * Simple synchronous viewport check
 * Use IntersectionObserver for better performance with multiple elements
 */
export function isInViewport(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Preload Image
 * 
 * Preload an image for faster display
 * 
 * @example
 * preloadImage('/path/to/image.jpg')
 *   .then(() => // console.log('Image loaded'))
 *   .catch(() => // console.log('Image failed'));
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload Multiple Images
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Get Performance Metrics
 * 
 * Get current page performance metrics
 */
export function getPerformanceMetrics(): {
  ttfb?: number; // Time to First Byte
  fcp?: number;  // First Contentful Paint
  lcp?: number;  // Largest Contentful Paint
  fid?: number;  // First Input Delay
  cls?: number;  // Cumulative Layout Shift
} {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return {};
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  return {
    ttfb: navigation ? navigation.responseStart - navigation.requestStart : undefined,
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime,
    // LCP, FID, CLS require web-vitals library for accurate measurement
  };
}
