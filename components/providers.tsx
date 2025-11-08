
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/toaster';
import { NotificationBanner } from './webos/notification-banner';
import { UniversalSearch } from './webos/universal-search';
import { AccessibilityInitializer } from './accessibility-initializer';
import { TenantProviderWrapper } from './tenant-provider-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TenantProviderWrapper>
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
      </TenantProviderWrapper>
    </SessionProvider>
  );
}
