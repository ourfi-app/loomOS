// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
// TODO: Review setInterval calls for proper cleanup in useEffect return functions
// TODO: Review addEventListener calls for proper cleanup in useEffect return functions

'use client';

/**
 * Performance Initializer
 * Initializes Web Vitals monitoring and enhanced service worker
 */

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';
import { registerServiceWorker } from '@/lib/pwa-utils';
import { initDevUtils } from '@/lib/dev-utils';

export function PerformanceInitializer() {
  useEffect(() => {
    let updateInterval: NodeJS.Timeout | null = null;
    let longTaskObserver: PerformanceObserver | null = null;
    const loadHandlers: Array<() => void> = [];

    // Initialize development utilities (development only)
    if (process.env.NODE_ENV === 'development') {
      initDevUtils();
    }
    
    // Initialize Web Vitals monitoring (production only)
    if (process.env.NODE_ENV === 'production') {
      initWebVitals((metric) => {
        // Send to analytics in production
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      });
    }

    // Register service worker ONLY in production
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator
    ) {
      // Wait for page load to avoid interfering with development
      const swLoadHandler = () => {
        registerServiceWorker()
          .then((registration) => {
            if (registration) {
              // Check for updates periodically
              updateInterval = setInterval(() => {
                registration.update();
              }, 60 * 60 * 1000); // Check every hour
            }
          })
          .catch((error) => {
            console.warn('[SW] Registration failed:', error);
          });
      };
      
      loadHandlers.push(swLoadHandler);
      window.addEventListener('load', swLoadHandler);
    }

    // Prefetch critical routes
    if (typeof window !== 'undefined') {
      const criticalRoutes = [
        '/dashboard',
        '/dashboard/messages',
        '/dashboard/documents',
        '/dashboard/tasks',
      ];

      const prefetchRoutes = () => {
        criticalRoutes.forEach((route) => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        });
      };

      // Prefetch after page load
      if (document.readyState === 'complete') {
        prefetchRoutes();
      } else {
        const prefetchLoadHandler = () => {
          prefetchRoutes();
        };
        loadHandlers.push(prefetchLoadHandler);
        window.addEventListener('load', prefetchLoadHandler);
      }
    }

    // Monitor performance
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor long tasks
      try {
        longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.log({
                duration: entry.duration,
                startTime: entry.startTime,
              });
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }
    }

    // Cleanup function
    return () => {
      // Clear update interval
      if (updateInterval) {
        clearInterval(updateInterval);
      }

      // Disconnect performance observer
      if (longTaskObserver) {
        longTaskObserver.disconnect();
      }

      // Remove event listeners
      if (typeof window !== 'undefined' && loadHandlers.length > 0) {
        loadHandlers.forEach((handler) => {
          window.removeEventListener('load', handler);
        });
      }
    };
  }, []);

  return null;
}
