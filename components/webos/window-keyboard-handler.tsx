
'use client';

import { useEffect } from 'react';
import { useWindowManager } from '@/hooks/webos/use-window-manager';
import { useCardManager } from '@/lib/card-manager-store';
import { toast } from 'sonner';

interface WindowKeyboardHandlerProps {
  windowId?: string; // If provided, shortcuts only work for this window
}

export function WindowKeyboardHandler({ windowId }: WindowKeyboardHandlerProps) {
  const { handleKeyboardSnap, windows } = useWindowManager();
  const { cards, activeCardId } = useCardManager();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if Cmd/Ctrl is pressed
      const isModifier = event.metaKey || event.ctrlKey;
      if (!isModifier) return;

      // Determine which window to snap
      let targetWindowId = windowId;
      
      // If no specific window ID, use the active card
      if (!targetWindowId && activeCardId) {
        targetWindowId = activeCardId;
      }

      if (!targetWindowId) return;

      // Check if this is a window snap shortcut
      const modifiers = {
        ctrl: event.ctrlKey || event.metaKey,
        shift: event.shiftKey,
        alt: event.altKey,
      };

      const handled = handleKeyboardSnap(targetWindowId, event.key, modifiers);

      if (handled) {
        event.preventDefault();
        
        // Show toast feedback
        const snapLabels: Record<string, string> = {
          'ArrowLeft': event.altKey ? 'Top Left' : 'Left Half',
          'ArrowRight': event.altKey ? 'Top Right' : 'Right Half',
          'ArrowUp': event.altKey ? 'Top Left' : 'Maximize',
          'ArrowDown': event.altKey ? 'Bottom Left' : 'Center',
        };

        if (event.shiftKey) {
          const shiftLabels: Record<string, string> = {
            'ArrowLeft': 'Bottom Left',
            'ArrowRight': 'Bottom Right',
            'ArrowUp': 'Top Right',
            'ArrowDown': 'Bottom Right',
          };
          toast.success(`Window snapped: ${shiftLabels[event.key] || 'Position'}`);
        } else {
          toast.success(`Window snapped: ${snapLabels[event.key] || 'Position'}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windowId, handleKeyboardSnap, cards, activeCardId]);

  return null; // This component doesn't render anything
}

export default WindowKeyboardHandler;
