
/**
 * Route Preloader
 * 
 * Utilities for preloading routes and resources to improve navigation performance
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Preload routes that are likely to be visited
 */
export function useRoutePreloader(routes: string[]) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use requestIdleCallback to preload routes during idle time
    const preloadRoutes = () => {
      routes.forEach(route => {
        router.prefetch(route);
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRoutes);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadRoutes, 2000);
    }
  }, [routes, router]);
}

/**
 * Preload critical dashboard routes
 */
export const CRITICAL_ROUTES = [
  '/dashboard',
  '/dashboard/messages',
  '/dashboard/documents',
  '/dashboard/directory',
  '/dashboard/notifications',
  '/dashboard/profile',
];

/**
 * Preload admin routes
 */
export const ADMIN_ROUTES = [
  '/dashboard/admin',
  '/dashboard/admin/users',
  '/dashboard/admin/announcements',
  '/dashboard/accounting',
  '/dashboard/budgeting',
];

/**
 * Preload app routes
 */
export const APP_ROUTES = [
  '/dashboard/apps/tasks',
  '/dashboard/apps/notes',
  '/dashboard/apps/calendar',
  '/dashboard/apps/email',
];

/**
 * Hook to preload routes based on user role
 */
export function useRoleBasedPreloader(role?: string) {
  const routes = [
    ...CRITICAL_ROUTES,
    ...(role === 'ADMIN' || role === 'SUPER_ADMIN' ? ADMIN_ROUTES : []),
    ...APP_ROUTES,
  ];

  useRoutePreloader(routes);
}

/**
 * Preload a specific route on hover
 */
export function preloadOnHover(route: string) {
  return {
    onMouseEnter: () => {
      if (typeof window !== 'undefined') {
        const router = require('next/navigation').useRouter();
        router.prefetch(route);
      }
    },
  };
}

/**
 * Preload resources (images, fonts, etc.)
 */
export function preloadResources(resources: Array<{ href: string; as: string; type?: string }>) {
  if (typeof window === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
    }
    document.head.appendChild(link);
  });
}

/**
 * Critical resources to preload
 */
export const CRITICAL_RESOURCES = [
  { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
  { href: '/icons/icon-192x192.png', as: 'image' },
];
