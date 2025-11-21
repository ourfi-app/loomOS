
'use client';

import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCw, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          background: 'var(--webos-bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--webos-border-glass)',
          boxShadow: 'var(--webos-shadow-xl)'
        }}
      >
        {/* Header */}
        <div className="text-center p-8 pb-4">
          <div 
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: 'var(--webos-shadow-md)'
            }}
          >
            <AlertCircle className="w-10 h-10" style={{ color: 'var(--webos-text-white)' }} />
          </div>
          <h1 
            className="text-3xl font-light tracking-tight mb-2"
            style={{ color: 'var(--webos-text-primary)' }}
          >
            Oops! Something went wrong
          </h1>
          <p 
            className="text-base font-light"
            style={{ color: 'var(--webos-text-secondary)' }}
          >
            We encountered an unexpected error while processing your request
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 px-8 pb-6">
          {/* Error Details */}
          <div 
            className="rounded-2xl p-4"
            style={{
              background: 'var(--webos-bg-secondary)',
              border: '1px solid var(--webos-border-primary)'
            }}
          >
            <div className="flex items-start gap-3">
              <FileWarning 
                className="w-5 h-5 flex-shrink-0 mt-0.5" 
                style={{ color: '#ef4444' }}
              />
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-light text-sm mb-1 tracking-wide"
                  style={{ color: 'var(--webos-text-primary)' }}
                >
                  ERROR DETAILS
                </h3>
                <p 
                  className="text-sm font-light break-words"
                  style={{ color: 'var(--webos-text-secondary)' }}
                >
                  {error.message || 'An unexpected error occurred'}
                </p>
                {error.digest && (
                  <p 
                    className="text-xs font-light mt-2"
                    style={{ color: 'var(--webos-text-muted)' }}
                  >
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div 
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(122, 158, 181, 0.1)',
              border: '1px solid rgba(122, 158, 181, 0.3)'
            }}
          >
            <h3 
              className="font-light text-sm mb-2 tracking-wide uppercase"
              style={{ color: 'var(--webos-app-blue)' }}
            >
              What you can do:
            </h3>
            <ul className="space-y-1 text-sm font-light" style={{ color: 'var(--webos-text-tertiary)' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--webos-app-blue)' }}>•</span>
                <span>Try refreshing the page</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--webos-app-blue)' }}>•</span>
                <span>Go back to the home page</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--webos-app-blue)' }}>•</span>
                <span>If the problem persists, contact support</span>
              </li>
            </ul>
          </div>

          {/* Stack Trace (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.stack && (
            <details 
              className="rounded-2xl p-4 text-xs"
              style={{
                background: 'var(--webos-ui-dark)',
                border: '1px solid var(--webos-border-secondary)'
              }}
            >
              <summary 
                className="cursor-pointer font-light mb-2 font-mono hover:opacity-80 transition-opacity"
                style={{ color: 'var(--webos-text-secondary)' }}
              >
                Stack Trace (Development Only)
              </summary>
              <pre 
                className="overflow-x-auto whitespace-pre-wrap break-all font-light"
                style={{ color: '#ef4444' }}
              >
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-8 pt-4">
          <button
            onClick={reset}
            className="flex-1 rounded-xl py-3 px-6 flex items-center justify-center text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
            style={{
              background: 'var(--webos-ui-dark)',
              color: 'var(--webos-text-white)',
              boxShadow: 'var(--webos-shadow-md)'
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          <Link href="/dashboard" className="flex-1">
            <button
              className="w-full rounded-xl py-3 px-6 flex items-center justify-center text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid var(--webos-border-secondary)',
                color: 'var(--webos-text-primary)',
                boxShadow: 'var(--webos-shadow-sm)'
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </Link>
        </div>
      </div>
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

