
'use client';

import { useEffect } from 'react';
import { useDesktopShortcuts } from '@/lib/desktop-shortcuts-store';
import { useWindowManager } from '@/hooks/webos/use-window-manager';
import { useCardManager } from '@/lib/card-manager-store';

interface DesktopKeyboardHandlerProps {
  onOpenSpotlight: () => void;
  onOpenQuickSettings: () => void;
  onOpenCustomization: () => void;
  onShowAllWindows?: () => void;
  onShowDesktop?: () => void;
  onToggleWidgetManager?: () => void;
  onOpenUniversalSearch?: () => void;
}

export function DesktopKeyboardHandler({
  onOpenSpotlight,
  onOpenQuickSettings,
  onOpenCustomization,
  onShowAllWindows,
  onShowDesktop,
  onToggleWidgetManager,
  onOpenUniversalSearch,
}: DesktopKeyboardHandlerProps) {
  const { executeShortcut } = useDesktopShortcuts();
  const { handleKeyboardSnap, windows } = useWindowManager();
  const { activeCardId } = useCardManager();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      
      // Window snapping with Win/Ctrl+Arrow keys
      if (ctrl && !shift && !alt && activeCardId) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          handleKeyboardSnap(activeCardId, e.key, { ctrl });
          return;
        }
      }

      // Window snapping with Win/Ctrl+Option+Arrow (quarters)
      if (ctrl && alt && !shift && activeCardId) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          handleKeyboardSnap(activeCardId, e.key, { ctrl, alt });
          return;
        }
      }

      // Window snapping with Win/Ctrl+Shift+Arrow (alternate quarters)
      if (ctrl && shift && !alt && activeCardId) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          handleKeyboardSnap(activeCardId, e.key, { ctrl, shift });
          return;
        }
      }
      
      // Universal Search with AI Assistant (Ctrl+K)
      if (ctrl && e.key === 'k') {
        e.preventDefault();
        onOpenUniversalSearch?.();
        executeShortcut('universal-search');
        return;
      }
      
      // Spotlight Search (Ctrl+Space)
      if (ctrl && e.code === 'Space') {
        e.preventDefault();
        onOpenSpotlight();
        executeShortcut('search');
        return;
      }
      
      // Quick Settings (Ctrl+,)
      if (ctrl && e.key === ',') {
        e.preventDefault();
        onOpenQuickSettings();
        executeShortcut('quick-settings');
        return;
      }
      
      // Desktop Customization (Ctrl+Shift+P)
      if (ctrl && shift && e.key === 'P') {
        e.preventDefault();
        onOpenCustomization();
        return;
      }
      
      // Show All Windows (Ctrl+Shift+A or F3)
      if ((ctrl && shift && e.key === 'A') || e.key === 'F3') {
        e.preventDefault();
        onShowAllWindows?.();
        executeShortcut('show-all-windows');
        return;
      }
      
      // Show Desktop (Ctrl+Shift+D or F11)
      if ((ctrl && shift && e.key === 'D') || e.key === 'F11') {
        e.preventDefault();
        onShowDesktop?.();
        executeShortcut('show-desktop');
        return;
      }
      
      // Widget Manager (Ctrl+Shift+W)
      if (ctrl && shift && e.key === 'W') {
        e.preventDefault();
        onToggleWidgetManager?.();
        return;
      }
      
      // Show All Shortcuts (Ctrl+Shift+/)
      if (ctrl && shift && e.key === '?') {
        e.preventDefault();
        console.log('Show keyboard shortcuts dialog');
        return;
      }
      
      // New Task (Ctrl+T)
      if (ctrl && !shift && e.key === 't') {
        // Only if not in an input
        if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          e.preventDefault();
          executeShortcut('new-task');
          console.log('Create new task');
          return;
        }
      }
      
      // New Note (Ctrl+N)
      if (ctrl && !shift && e.key === 'n') {
        // Only if not in an input
        if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          e.preventDefault();
          executeShortcut('new-note');
          console.log('Create new note');
          return;
        }
      }
      
      // New Message (Ctrl+M)
      if (ctrl && !shift && e.key === 'm') {
        // Only if not in an input
        if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          e.preventDefault();
          executeShortcut('new-message');
          console.log('Create new message');
          return;
        }
      }
      
      // Screenshot (Ctrl+Shift+4)
      if (ctrl && shift && e.key === '4') {
        e.preventDefault();
        executeShortcut('screenshot');
        console.log('Take screenshot');
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onOpenSpotlight, 
    onOpenQuickSettings, 
    onOpenCustomization,
    onShowAllWindows,
    onShowDesktop,
    onToggleWidgetManager,
    executeShortcut,
    handleKeyboardSnap,
    activeCardId,
    windows,
  ]);
  
  return null; // This component doesn't render anything
}
