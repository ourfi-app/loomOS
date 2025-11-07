
'use client';

/**
 * AppPageWrapper - Provides automatic desktop windowing for app pages
 * 
 * This component wraps app content and automatically applies desktop windowing
 * on large screens while keeping full-page layout on mobile/tablet.
 */

import { usePathname } from 'next/navigation';
import { useIsDesktop } from '@/hooks/use-responsive';
import { DesktopAppWrapper } from './desktop-app-wrapper';
import { type MenuBarItem } from './desktop-app-window';
import { ReactNode } from 'react';

interface AppPageWrapperProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  menuBar?: MenuBarItem[];
  toolbar?: ReactNode;
  statusBar?: ReactNode;
  showMenuBar?: boolean;
}

// Map routes to app titles and icons
const APP_INFO: Record<string, { title: string; icon?: ReactNode }> = {
  '/dashboard/documents': { title: 'Documents' },
  '/dashboard/directory': { title: 'Directory' },
  '/dashboard/calendar': { title: 'Calendar' },
  '/dashboard/messages': { title: 'Messages' },
  '/dashboard/notifications': { title: 'Notifications' },
  '/dashboard/my-household': { title: 'My Household' },
  '/dashboard/household': { title: 'Household' },
  '/dashboard/profile': { title: 'Profile' },
  '/dashboard/payments': { title: 'Payments' },
  '/dashboard/my-community': { title: 'My Community' },
};

export function AppPageWrapper({
  children,
  title,
  icon,
  menuBar,
  toolbar,
  statusBar,
  showMenuBar = true,
}: AppPageWrapperProps) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  
  // Auto-detect app info from pathname if not provided
  const appInfo = APP_INFO[pathname];
  const finalTitle = title || appInfo?.title || 'App';
  const finalIcon = icon || appInfo?.icon;
  
  // On desktop, wrap in DesktopAppWrapper
  if (isDesktop) {
    return (
      <DesktopAppWrapper
        title={finalTitle}
        icon={finalIcon}
        menuBar={menuBar}
        toolbar={toolbar}
        statusBar={statusBar}
        showMenuBar={showMenuBar}
      >
        {children}
      </DesktopAppWrapper>
    );
  }
  
  // On mobile/tablet, render children directly (full page)
  return <>{children}</>;
}
