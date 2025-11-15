
'use client';

import React, { useEffect, useState } from 'react';
import { Command, X } from 'lucide-react';
import { handleKeyboardShortcuts, type KeyboardShortcut } from '@/lib/accessibility-helpers';
import { useRouter } from 'next/navigation';
import { useAccessibilityStore } from '@/lib/accessibility-store';

/**
 * Global Keyboard Shortcuts Component
 * Handles system-wide keyboard shortcuts
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const keyboardNavigationEnabled = useAccessibilityStore((state) => state.keyboardNavigationEnabled);
  
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Go to home',
      action: () => router.push('/dashboard'),
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Go to documents',
      action: () => router.push('/dashboard/documents'),
    },
    {
      key: 'p',
      ctrl: true,
      description: 'Go to payments',
      action: () => router.push('/dashboard/payments'),
    },
    {
      key: 'c',
      ctrl: true,
      description: 'Go to calendar',
      action: () => router.push('/dashboard/apps/calendar'),
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette',
      action: () => {
        // TODO: Open command palette
        console.log('Command palette');
      },
    },
  ];
  
  useEffect(() => {
    if (!keyboardNavigationEnabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      handleKeyboardShortcuts(event, shortcuts);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardNavigationEnabled, shortcuts]);
  
  if (!showHelp) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 flex items-center justify-between border-b border-[var(--semantic-border-medium)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--semantic-accent)] flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Keyboard Shortcuts</h2>
              <p className="text-sm text-[var(--semantic-text-secondary)]">Navigate faster with your keyboard</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="w-8 h-8 rounded-full hover:bg-[var(--semantic-bg-muted)] flex items-center justify-center transition-colors"
            aria-label="Close keyboard shortcuts"
          >
            <X className="w-5 h-5 text-[var(--semantic-text-secondary)]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--semantic-bg-subtle)] hover:bg-[var(--semantic-surface-hover)] transition-colors"
              >
                <span className="text-sm text-[var(--semantic-text-secondary)]">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.ctrl && (
                    <kbd className="px-2 py-1 text-xs font-semibold text-[var(--semantic-text-primary)] bg-white border border-[var(--semantic-border-medium)] rounded shadow-sm">
                      Ctrl
                    </kbd>
                  )}
                  {shortcut.shift && (
                    <kbd className="px-2 py-1 text-xs font-semibold text-[var(--semantic-text-primary)] bg-white border border-[var(--semantic-border-medium)] rounded shadow-sm">
                      Shift
                    </kbd>
                  )}
                  {shortcut.alt && (
                    <kbd className="px-2 py-1 text-xs font-semibold text-[var(--semantic-text-primary)] bg-white border border-[var(--semantic-border-medium)] rounded shadow-sm">
                      Alt
                    </kbd>
                  )}
                  {shortcut.meta && (
                    <kbd className="px-2 py-1 text-xs font-semibold text-[var(--semantic-text-primary)] bg-white border border-[var(--semantic-border-medium)] rounded shadow-sm">
                      ⌘
                    </kbd>
                  )}
                  <kbd className="px-2 py-1 text-xs font-semibold text-[var(--semantic-text-primary)] bg-white border border-[var(--semantic-border-medium)] rounded shadow-sm">
                    {shortcut.key.toUpperCase()}
                  </kbd>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-[var(--semantic-primary-subtle)] rounded-lg border border-[var(--semantic-primary-light)]">
            <h3 className="text-sm font-semibold text-[var(--semantic-primary-dark)] mb-2">General Navigation</h3>
            <ul className="text-xs text-[var(--semantic-primary-dark)] space-y-1">
              <li>• <kbd className="px-1 py-0.5 bg-white rounded text-xs">Tab</kbd> - Move focus forward</li>
              <li>• <kbd className="px-1 py-0.5 bg-white rounded text-xs">Shift+Tab</kbd> - Move focus backward</li>
              <li>• <kbd className="px-1 py-0.5 bg-white rounded text-xs">Enter</kbd> or <kbd className="px-1 py-0.5 bg-white rounded text-xs">Space</kbd> - Activate button</li>
              <li>• <kbd className="px-1 py-0.5 bg-white rounded text-xs">Esc</kbd> - Close dialog/modal</li>
              <li>• <kbd className="px-1 py-0.5 bg-white rounded text-xs">↑↓</kbd> - Navigate lists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
