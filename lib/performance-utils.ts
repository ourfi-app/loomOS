
/**
 * Performance Optimization Utilities
 * Provides helpers for lazy loading, memoization, and component optimization
 */

import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Creates a lazy-loaded component with automatic retry logic
 * Useful for handling network failures during code splitting
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  interval = 1000
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attemptImport = (attemptsLeft: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft === 1) {
              reject(error);
              return;
            }
            
            console.warn(
              `Failed to load component. Retrying... (${retries - attemptsLeft + 1}/${retries})`,
              error
            );
            
            setTimeout(() => {
              attemptImport(attemptsLeft - 1);
            }, interval);
          });
      };
      
      attemptImport(retries);
    });
  });
}

/**
 * Debounces a function to prevent excessive calls
 * Useful for search inputs, window resize handlers, etc.
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
 * Throttles a function to limit execution frequency
 * Useful for scroll handlers, mouse move handlers, etc.
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

/**
 * Checks if two objects are shallowly equal
 * Useful for React.memo comparison functions
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

/**
 * Creates a comparison function for React.memo that ignores specific props
 * Useful when you want to memoize a component but allow certain props to change
 */
export function createPropsComparator<T extends Record<string, any>>(
  ignoreProps: (keyof T)[]
) {
  return (prevProps: T, nextProps: T): boolean => {
    const prevFiltered = { ...prevProps };
    const nextFiltered = { ...nextProps };
    
    ignoreProps.forEach((prop) => {
      delete prevFiltered[prop];
      delete nextFiltered[prop];
    });
    
    return shallowEqual(prevFiltered, nextFiltered);
  };
}

/**
 * Preloads an image to prevent layout shifts
 * Returns a promise that resolves when the image is loaded
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
 * Batch multiple state updates together for better performance
 * Uses requestAnimationFrame to batch updates
 */
export function batchUpdates(updates: Array<() => void>): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Measures component render time (development only)
 */
export function measureRender(
  componentName: string,
  callback: () => void
): void {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`[Render Time] ${componentName}: ${(end - start).toFixed(2)}ms`);
  } else {
    callback();
  }
}

/**
 * Creates a virtual scroll container data
 * Calculates which items should be rendered in a virtualized list
 */
export interface VirtualScrollData {
  visibleStartIndex: number;
  visibleEndIndex: number;
  offsetY: number;
  totalHeight: number;
}

export function calculateVirtualScroll(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): VirtualScrollData {
  const visibleStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEndIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return {
    visibleStartIndex,
    visibleEndIndex,
    offsetY: visibleStartIndex * itemHeight,
    totalHeight: totalItems * itemHeight,
  };
}

/**
 * Intersection Observer hook helper
 * Returns whether an element is in viewport
 */
export function createIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    }
  );
}

/**
 * Efficient array chunking for rendering large lists
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Memory-efficient map for large datasets
 * Uses WeakMap to allow garbage collection
 */
export class OptimizedCache<K extends object, V> {
  private cache = new WeakMap<K, V>();
  
  get(key: K): V | undefined {
    return this.cache.get(key);
  }
  
  set(key: K, value: V): void {
    this.cache.set(key, value);
  }
  
  has(key: K): boolean {
    return this.cache.has(key);
  }
}
