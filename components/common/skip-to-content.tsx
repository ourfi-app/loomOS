
'use client';

/**
 * Skip to Main Content Link
 * Provides keyboard-only users with a way to skip navigation and go directly to main content
 * This is a WCAG 2.1 Level A requirement (2.4.1 Bypass Blocks)
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
    >
      Skip to main content
    </a>
  );
}
