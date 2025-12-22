
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
  // 5. On admin pages (/admin/*) - they have their own headers
  const shouldHideStatusBar = 
    status === 'unauthenticated' ||
    pathname === '/' ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/admin');

  if (shouldHideStatusBar) {
    return null;
  }

  return <StatusBar />;
}
