
/**
 * Bundle Optimization Utilities
 * 
 * Provides utilities for optimizing bundle size and performance
 */

/**
 * Lazy load a module with retry logic
 */
export async function lazyLoadWithRetry<T>(
  importFn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return lazyLoadWithRetry(importFn, retries - 1);
    }
    throw error;
  }
}

/**
 * Preload a module in the background
 */
export function preloadModule(importFn: () => Promise<any>) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch(() => {
        // Silently fail preload attempts
      });
    });
  }
}

/**
 * Check if a feature is supported before loading its module
 */
export function conditionalLoad<T>(
  condition: boolean,
  importFn: () => Promise<T>
): Promise<T | null> {
  if (!condition) {
    return Promise.resolve(null);
  }
  return importFn();
}

/**
 * Create a lazy-loaded component with error boundary
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  return {
    load: () => lazyLoadWithRetry(importFn),
    preload: () => preloadModule(importFn),
  };
}

/**
 * Optimize imports by tree-shaking unused exports
 */
export const optimizedImports = {
  // Only import what you need from lodash
  lodash: {
    debounce: () => import('lodash/debounce'),
    throttle: () => import('lodash/throttle'),
    groupBy: () => import('lodash/groupBy'),
    sortBy: () => import('lodash/sortBy'),
    uniqBy: () => import('lodash/uniqBy'),
  },
  
  // Only import specific date-fns functions
  dateFns: {
    format: () => import('date-fns/format'),
    parseISO: () => import('date-fns/parseISO'),
    addDays: () => import('date-fns/addDays'),
    subDays: () => import('date-fns/subDays'),
    isAfter: () => import('date-fns/isAfter'),
    isBefore: () => import('date-fns/isBefore'),
    differenceInDays: () => import('date-fns/differenceInDays'),
  },
};

/**
 * Bundle size reporting for development
 */
export function reportBundleMetrics() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Use Performance API to measure resource timing
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const resources = window.performance.getEntriesByType('resource');
      const jsResources = resources.filter(r => r.name.includes('.js'));
      
      const totalSize = jsResources.reduce((acc: number, r: any) => {
        return acc + (r.transferSize || 0);
      }, 0);
      
      console.group('📦 Bundle Metrics');
      console.groupEnd();
    }
  }
}
