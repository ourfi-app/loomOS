
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/toaster';
import { NotificationBanner } from './webos/notification-banner';
import { UniversalSearch } from './webos/universal-search';
import { AccessibilityInitializer } from './accessibility-initializer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AccessibilityInitializer />
        {children}
        <Toaster />
        <NotificationBanner />
        <UniversalSearch />
      </ThemeProvider>
    </SessionProvider>
  );
}
