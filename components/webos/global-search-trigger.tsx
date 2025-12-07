'use client';

import { useEffect } from 'react';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';

/**
 * Global Search Trigger Component
 * 
 * Listens for global keyboard events to trigger the "just type" search feature:
 * 1. Cmd/Ctrl + K - Opens search
 * 2. Any alphanumeric key - Opens search with that character
 * 
 * Ignores typing in input fields, textareas, and contenteditable elements.
 */
export function GlobalSearchTrigger() {
  const { openSearch, isOpen } = useUniversalSearch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if search is already open
      if (isOpen) return;

      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[contenteditable="true"]') !== null;

      // Ignore if typing in an input field
      if (isInputField) return;

      // Ignore special keys
      const specialKeys = [
        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Home', 'End', 'PageUp', 'PageDown',
        'Insert', 'Delete', 'Backspace',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
      ];

      if (specialKeys.includes(e.key)) return;

      // Ignore if any modifier key is pressed (except Shift for capital letters)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Check if it's a printable character (letter, number, or symbol)
      if (e.key.length === 1) {
        e.preventDefault();
        openSearch('search', e.key);
      }
    };

    // Add event listener to window
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openSearch, isOpen]);

  // This component doesn't render anything
  return null;
}
