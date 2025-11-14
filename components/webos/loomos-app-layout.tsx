'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { LoomOSStatusBar } from './loomos-status-bar';
import { LoomOSAppHeader } from './loomos-app-header';
import { GestureArea } from './gesture-area';
import { useIsDesktop } from '@/hooks/use-responsive';

interface LoomOSAppLayoutProps {
  appName: string;
  appIcon?: ReactNode;
  headerActions?: ReactNode;
  bottomToolbar?: ReactNode;
  showStatusBar?: boolean;
  showGestureArea?: boolean;
  children: ReactNode;
}

export function LoomOSAppLayout({
  appName,
  appIcon,
  headerActions,
  bottomToolbar,
  showStatusBar = true,
  showGestureArea = true,
  children
}: LoomOSAppLayoutProps) {
  // On desktop, apps are opened in windows with their own chrome
  // So we hide the internal status bar and app header to avoid double chrome
  const isDesktopBreakpoint = useIsDesktop();
  
  // Use client-side only detection to avoid hydration mismatches
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only apply desktop logic after mount to avoid hydration issues
  const isDesktop = isMounted && isDesktopBreakpoint;
  
  // On desktop, just render content directly without any chrome
  // The DesktopAppWindow wrapper will provide the window chrome
  if (isDesktop) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden bg-background">
        {children}
      </div>
    );
  }
  
  // On mobile/tablet, render full LoomOS layout with status bar and header
  return (
    <div className="h-full flex flex-col bg-[var(--semantic-bg-muted)] relative">
      {/* Status Bar */}
      {showStatusBar && <LoomOSStatusBar appName={appName} />}
      
      {/* App Header */}
      <LoomOSAppHeader 
        appName={appName} 
        appIcon={appIcon}
        actions={headerActions} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0 mb-14 sm:mb-16 md:mb-[72px]">
        {children}
      </div>
      
      {/* Bottom Toolbar (optional) */}
      {bottomToolbar && (
        <div className="bg-gradient-to-b from-gray-200 to-gray-300 border-t border-[var(--semantic-border-strong)] px-4 py-3 flex items-center justify-center gap-3 mb-14 sm:mb-16 md:mb-[72px]">
          {bottomToolbar}
        </div>
      )}
      
      {/* LoomOS Gesture Area */}
      {showGestureArea && <GestureArea />}
    </div>
  );
}
