
/**
 * Development Utilities
 * Utilities to improve the development experience
 */

/**
 * Filter console errors in development to suppress benign Next.js warnings
 * These warnings are normal part of the Next.js development workflow
 */
export function initDevErrorFilter() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // List of patterns to suppress
  const suppressPatterns = [
    /GET.*\/_next\/static\/chunks\/app\/not-found\.js.*404/,
    /GET.*\/_next\/static\/chunks\/app\/error\.js.*404/,
    /Failed to load.*not-found\.js/,
    /Failed to load.*error\.js/,
  ];

  // Override console.error
  console.error = function (...args) {
    const message = args.join(' ');
    
    // Check if message matches any suppress pattern
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalError.apply(console, args);
    } else {
      // Log a friendlier message instead
      if (message.includes('not-found') || message.includes('error')) {
        console.log(
          '%c[Next.js Dev]%c Compiling error/not-found pages (this is normal)',
          'color: #0070f3; font-weight: bold',
          'color: inherit'
        );
      }
    }
  };

  // Override console.warn
  console.warn = function (...args) {
    const message = args.join(' ');
    
    // Check if message matches any suppress pattern
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  console.log(
    '%c[Dev Utils]%c Development error filtering enabled',
    'color: #10b981; font-weight: bold',
    'color: inherit'
  );
}

/**
 * Initialize development utilities
 */
export function initDevUtils() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  // Enable error filtering
  initDevErrorFilter();

  // Add development helpers to window
  (window as any).__DEV__ = {
    version: '1.0.0',
    utils: {
      clearCache: () => {
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
          });
          console.log('✅ Caches cleared');
        }
      },
      unregisterSW: () => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => registration.unregister());
          });
          console.log('✅ Service workers unregistered');
        }
      },
      reload: () => {
        window.location.reload();
      },
    },
    help: () => {
      console.log(`
%cCommunity Manager - Development Utils%c

Available commands:
  __DEV__.utils.clearCache()     - Clear all caches
  __DEV__.utils.unregisterSW()   - Unregister service workers
  __DEV__.utils.reload()         - Reload the page
  __DEV__.help()                 - Show this help message

Note: 404 errors for error.js and not-found.js are normal during development.
They occur during Next.js hot module replacement and don't affect functionality.
      `,
        'color: #0070f3; font-size: 16px; font-weight: bold',
        'color: inherit'
      );
    },
  };

  // Show help message
  console.log(
    '%cType __DEV__.help() for development utilities',
    'color: #0070f3; font-style: italic'
  );
}
