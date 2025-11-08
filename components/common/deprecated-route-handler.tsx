'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_REGISTRY, type AppDefinition } from '@/lib/enhanced-app-registry';

interface DeprecatedRouteHandlerProps {
  /**
   * The app definition for the deprecated route
   */
  app: AppDefinition;

  /**
   * Tab to activate in the consolidated app (for apps like Organizer, Inbox)
   * Example: 'calendar', 'notes', 'tasks' for Organizer
   */
  defaultTab?: string;

  /**
   * Additional query parameters to pass to the new route
   */
  queryParams?: Record<string, string>;
}

/**
 * Deprecated Route Handler Component
 *
 * Handles automatic redirects for deprecated routes to their consolidated
 * replacements. This component checks if auto-redirect is enabled in the
 * app registry and redirects accordingly.
 *
 * USAGE (Phase 2 - when redirectToNew is enabled):
 * ```tsx
 * // In /dashboard/apps/calendar/page.tsx
 * export default function CalendarPage() {
 *   return (
 *     <DeprecatedRouteHandler
 *       app={APP_REGISTRY['calendarApp']}
 *       defaultTab="calendar"
 *     />
 *   );
 * }
 * ```
 *
 * PHASE 1 (Current): No auto-redirects, only warnings
 * PHASE 2 (Future): Auto-redirects enabled via redirectToNew flag
 * PHASE 3 (Future): Routes completely removed
 */
export function DeprecatedRouteHandler({
  app,
  defaultTab,
  queryParams = {}
}: DeprecatedRouteHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if app is deprecated AND auto-redirect is enabled
    if (app.isDeprecated && app.redirectToNew && app.deprecatedBy) {
      const replacementApp = APP_REGISTRY[app.deprecatedBy];

      if (replacementApp) {
        // Build the new URL
        let newUrl = replacementApp.path;

        // Add tab parameter if specified
        const allParams: Record<string, string> = { ...queryParams };
        if (defaultTab) {
          allParams.tab = defaultTab;
        }

        // Add query parameters
        const queryString = new URLSearchParams(allParams).toString();
        if (queryString) {
          newUrl += `?${queryString}`;
        }

        // Redirect to the new consolidated app
        console.log(`[Deprecation] Redirecting from ${app.path} to ${newUrl}`);
        router.replace(newUrl);
      }
    }
  }, [app, defaultTab, queryParams, router]);

  // If redirectToNew is false (Phase 1), return null and let the page render normally with warnings
  // If redirectToNew is true (Phase 2+), return a loading state while redirecting
  if (app.isDeprecated && app.redirectToNew) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">Redirecting...</p>
            <p className="text-sm text-muted-foreground">
              This app has moved to a new location
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Helper to get the consolidated app tab parameter for deprecated apps
 *
 * Maps deprecated app IDs to their corresponding tab in the consolidated app
 */
export const DEPRECATED_APP_TAB_MAP: Record<string, string> = {
  'calendarApp': 'calendar',
  'notesApp': 'notes',
  'tasksApp': 'tasks',
  'emailApp': 'email',
  'assistant': 'chat',
  'messages': 'messages',
};

/**
 * Get the tab parameter for a deprecated app
 */
export function getTabForDeprecatedApp(appId: string): string | undefined {
  return DEPRECATED_APP_TAB_MAP[appId];
}
