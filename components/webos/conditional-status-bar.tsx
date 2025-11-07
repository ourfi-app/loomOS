
'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { StatusBar } from './status-bar';

export function ConditionalStatusBar() {
  const { data: session, status } = useSession() || {};
  const pathname = usePathname();

  // Don't show status bar if:
  // 1. Not authenticated
  // 2. On auth pages (/auth/login, /auth/register)
  // 3. On onboarding page
  // 4. On home page (/)
  const shouldHideStatusBar = 
    status === 'unauthenticated' ||
    pathname === '/' ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/onboarding');

  if (shouldHideStatusBar) {
    return null;
  }

  return <StatusBar />;
}
