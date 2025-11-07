
/**
 * Prefetch Utilities
 * Intelligent prefetching for routes and resources
 */

import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef } from 'react';

/**
 * Prefetch links on hover with debounce
 */
export function usePrefetchOnHover(href: string, delay: number = 100) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      router.prefetch(href);
    }, delay);
  }, [href, delay, router]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };
}

/**
 * Prefetch visible links using Intersection Observer
 */
export function usePrefetchVisible() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
              // Prefetch the route
              import('next/router').then(({ default: Router }) => {
                Router.prefetch(href);
              });
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    // Observe all internal links
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => observer.observe(link));

    return () => observer.disconnect();
  }, []);
}

/**
 * Prefetch likely next routes based on user behavior
 */
export function usePredictivePrefetch(currentPath: string) {
  const router = useRouter();

  useEffect(() => {
    // Define route relationships and probabilities
    const routeProbabilities: Record<string, string[]> = {
      '/dashboard': ['/dashboard/messages', '/dashboard/documents', '/dashboard/tasks'],
      '/dashboard/messages': ['/dashboard/messages', '/dashboard/directory'],
      '/dashboard/documents': ['/dashboard/documents'],
      '/dashboard/directory': ['/dashboard/messages'],
      '/dashboard/tasks': ['/dashboard/tasks', '/dashboard/calendar'],
      '/dashboard/profile': ['/dashboard/household', '/dashboard/payments'],
    };

    const likelyRoutes = routeProbabilities[currentPath] || [];

    // Prefetch likely next routes with a delay
    const timeoutId = setTimeout(() => {
      likelyRoutes.forEach((route) => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentPath, router]);
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'font' | 'image') {
  if (typeof window === 'undefined') return;

  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * Prefetch API data
 */
export async function prefetchAPIData(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Prefetch': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`Prefetch failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('[Prefetch] API prefetch failed:', error);
    return null;
  }
}

/**
 * Priority Hints for resources
 */
export function setPriorityHint(element: HTMLElement, priority: 'high' | 'low' | 'auto') {
  if ('importance' in element) {
    (element as any).importance = priority;
  }
}

/**
 * Intelligent image loading
 */
export interface ImageLoadOptions {
  eager?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function useImageLoad(src: string, options: ImageLoadOptions = {}) {
  const { eager = false, priority = false, onLoad, onError } = options;
  const imageRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    imageRef.current = img;

    img.onload = () => {
      onLoad?.();
    };

    img.onerror = () => {
      onError?.(new Error(`Failed to load image: ${src}`));
    };

    // Set loading attribute
    if (!eager) {
      img.loading = 'lazy';
    }

    // Set priority hint
    if (priority && 'fetchPriority' in img) {
      (img as any).fetchPriority = 'high';
    }

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, eager, priority, onLoad, onError]);

  return imageRef;
}

/**
 * Batch API requests
 */
export class RequestBatcher {
  private queue: Array<{
    endpoint: string;
    resolve: (data: any) => void;
    reject: (error: Error) => void;
  }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchDelay: number;

  constructor(batchDelay: number = 50) {
    this.batchDelay = batchDelay;
  }

  async fetch(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ endpoint, resolve, reject });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.processBatch();
      }, this.batchDelay);
    });
  }

  private async processBatch() {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      // Group requests by base URL
      const grouped = batch.reduce((acc, item) => {
        const url = new URL(item.endpoint, window.location.origin);
        const base = url.pathname.split('/').slice(0, -1).join('/');
        if (!acc[base]) acc[base] = [];
        acc[base]?.push(item);
        return acc;
      }, {} as Record<string, typeof batch>);

      // Process each group
      await Promise.all(
        Object.values(grouped).map(async (group) => {
          try {
            // Make batch request
            const endpoints = group.map(item => item.endpoint);
            const response = await fetch('/api/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoints }),
            });

            if (!response.ok) {
              throw new Error('Batch request failed');
            }

            const results = await response.json();

            // Resolve individual promises
            group.forEach((item, index) => {
              if (results[index].error) {
                item.reject(new Error(results[index].error));
              } else {
                item.resolve(results[index].data);
              }
            });
          } catch (error) {
            // Fallback to individual requests
            await Promise.all(
              group.map(async (item) => {
                try {
                  const response = await fetch(item.endpoint);
                  const data = await response.json();
                  item.resolve(data);
                } catch (err) {
                  item.reject(err as Error);
                }
              })
            );
          }
        })
      );
    } catch (error) {
      batch.forEach(item => item.reject(error as Error));
    }
  }
}

// Global request batcher instance
export const globalBatcher = new RequestBatcher();
