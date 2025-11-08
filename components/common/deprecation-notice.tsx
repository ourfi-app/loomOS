'use client';

import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { APP_REGISTRY, type AppDefinition } from '@/lib/enhanced-app-registry';

interface DeprecationNoticeProps {
  /**
   * The app definition for the deprecated app
   */
  app: AppDefinition;

  /**
   * If true, shows a more prominent warning banner
   */
  prominent?: boolean;

  /**
   * If true, the notice cannot be dismissed
   */
  permanent?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;
}

/**
 * Deprecation Notice Component
 *
 * Displays a warning banner for deprecated apps that have been consolidated
 * into newer unified hub apps. Provides a link to the new app and explains
 * the deprecation.
 *
 * Usage:
 * ```tsx
 * <DeprecationNotice app={APP_REGISTRY['calendar-app']} />
 * ```
 */
export function DeprecationNotice({
  app,
  prominent = false,
  permanent = false,
  className = ''
}: DeprecationNoticeProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if not deprecated or if dismissed
  if (!app.isDeprecated || (!permanent && dismissed)) {
    return null;
  }

  // Get the replacement app
  const replacementApp = app.deprecatedBy ? APP_REGISTRY[app.deprecatedBy] : null;

  const handleNavigate = () => {
    if (replacementApp) {
      router.push(replacementApp.path);
    }
  };

  const handleDismiss = () => {
    if (!permanent) {
      setDismissed(true);
    }
  };

  return (
    <div className={className}>
      <Alert
        className={`
          border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800
          ${prominent ? 'py-4' : 'py-3'}
        `}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />

          <div className="flex-1 space-y-2">
            <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold">
                    This app has been consolidated
                  </p>
                  <p className="text-amber-800 dark:text-amber-200">
                    {app.deprecationMessage ||
                      `This standalone ${app.title} app is being phased out. ${
                        replacementApp
                          ? `Use the ${replacementApp.title} app instead for a unified experience.`
                          : 'Please use the new consolidated app instead.'
                      }`
                    }
                  </p>
                </div>

                {!permanent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="flex-shrink-0 h-6 w-6 p-0 hover:bg-amber-100 dark:hover:bg-amber-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </AlertDescription>

            {replacementApp && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleNavigate}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
                >
                  Switch to {replacementApp.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {app.deprecationDate && (
                  <span className="text-xs text-amber-700 dark:text-amber-300">
                    Deprecated since {new Date(app.deprecationDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}

/**
 * Helper function to check if an app is deprecated
 */
export function isAppDeprecated(appId: string): boolean {
  const app = APP_REGISTRY[appId];
  return app?.isDeprecated === true;
}

/**
 * Helper function to get the replacement app for a deprecated app
 */
export function getReplacementApp(appId: string): AppDefinition | null {
  const app = APP_REGISTRY[appId];
  if (app?.isDeprecated && app.deprecatedBy) {
    return APP_REGISTRY[app.deprecatedBy] || null;
  }
  return null;
}
