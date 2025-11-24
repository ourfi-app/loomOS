'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import { AppLauncher } from './AppLauncher';
import { AppWindow } from './AppWindow';
import { MinimizedCarousel } from './MinimizedCarousel';
import { Dock } from './Dock';

interface DesktopProps {
  children?: React.ReactNode;
  showDock?: boolean;
  className?: string;
}

/**
 * Main Desktop Component
 * 
 * Orchestrates the entire desktop experience including:
 * - App Launcher (full-screen grid modal)
 * - Fullscreen App Windows
 * - Minimized App Carousel
 * - Dock with quick access
 * 
 * Usage:
 * ```tsx
 * <Desktop>
 *   {children} // Your dashboard content or wallpaper
 * </Desktop>
 * ```
 */
export function Desktop({ children, showDock = true, className }: DesktopProps) {
  const { getFullscreenApp, closeLauncher } = useAppStore();
  const fullscreenApp = getFullscreenApp();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Space: Toggle App Launcher
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        useAppStore.getState().toggleLauncher();
      }

      // Escape: Close App Launcher
      if (e.key === 'Escape') {
        closeLauncher();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [closeLauncher]);

  return (
    <div className={className}>
      {/* Desktop Background / Dashboard Content */}
      {!fullscreenApp && (
        <div className="min-h-screen">
          {children}
        </div>
      )}

      {/* Fullscreen App Window */}
      <AppWindow />

      {/* Minimized Apps Carousel */}
      <MinimizedCarousel />

      {/* Dock */}
      {showDock && <Dock />}

      {/* App Launcher Modal */}
      <AppLauncher />
    </div>
  );
}
