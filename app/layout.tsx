
import type { Metadata, Viewport } from 'next';
import './globals.css';
// Phase 2 Migration: Removed redundant and deprecated CSS imports
// - Removed duplicate design-token imports (already imported in globals.css)
// - Removed @/styles/loomos-components.css (deprecated, styles use design-tokens)
// - Removed @/styles/webos-theme.css (deprecated per Phase 1, tokens moved to design-tokens/semantic.css)
// All design tokens are now centralized in globals.css via /design-tokens/
import '@/styles/just-type-search.css';
import { Providers } from '@/components/providers';
import { PWAInstallPrompt } from '@/components/webos/pwa-install-prompt';
import { PWAUpdateNotification } from '@/components/webos/pwa-update-notification';
import { NetworkStatusBanner } from '@/components/webos/network-status-banner';
import { ConditionalStatusBar } from '@/components/webos/conditional-status-bar';
import { AccessibilityInitializer } from '@/components/accessibility-initializer';
import { PerformanceInitializer } from '@/components/performance-initializer';
import { SkipToContent } from '@/components/common/skip-to-content';
import { JustTypeSearch } from '@/components/webos/just-type-search';
import { GlobalSearchTrigger } from '@/components/webos/global-search-trigger';

export const metadata: Metadata = {
  title: 'Self-Managed Condo Software for Chicago | Community Manager',
  description: 'Stop drowning in spreadsheets. Community Manager is condo management software born in Ravenswood, built for Chicago\'s self-managed 3-flats and associations.',
  icons: {
    icon: '/icon-community-manager.png',
    shortcut: '/icon-community-manager.png',
    apple: [
      { url: '/icon-community-manager.png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192' },
      { url: '/icons/icon-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Community Manager',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Primary font: System fonts prioritizing Helvetica Neue (webOS style) */}
        {/* Fallback fonts: Cambo (serif) and Titillium Web (sans-serif) */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cambo&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased webos-theme" data-theme="webos">
        <Providers>
          <SkipToContent />
          <PerformanceInitializer />
          <AccessibilityInitializer />
          <ConditionalStatusBar />
          <NetworkStatusBanner />
          <PWAUpdateNotification />
          <PWAInstallPrompt />
          <GlobalSearchTrigger />
          <JustTypeSearch />
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
