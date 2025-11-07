
'use client';

import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCw, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }

    // Log error to error logging service
    logError(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4 shadow-lg">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
            We encountered an unexpected error while processing your request
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Details */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <FileWarning className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                  Error Details
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 break-words">
                  {error.message || 'An unexpected error occurred'}
                </p>
                {error.digest && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
            <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-2">
              What you can do:
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Try refreshing the page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Go back to the home page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>If the problem persists, contact support</span>
              </li>
            </ul>
          </div>

          {/* Stack Trace (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.stack && (
            <details className="bg-slate-900 rounded-lg p-4 text-xs">
              <summary className="cursor-pointer text-slate-400 hover:text-slate-300 mb-2 font-mono">
                Stack Trace (Development Only)
              </summary>
              <pre className="text-red-400 overflow-x-auto whitespace-pre-wrap break-all">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={reset}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

// Error logging function
function logError(error: Error) {
  try {
    // In production, this would send to a logging service like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    if (process.env.NODE_ENV === 'production') {
      // Send to logging service
      fetch('/api/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silently fail if logging fails
      });
    }
  } catch (loggingError) {
    // Don't let logging errors crash the error boundary
    console.error('Failed to log error:', loggingError);
  }
}

