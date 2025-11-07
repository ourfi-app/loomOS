
/**
 * Global Keyboard Shortcuts System
 * Provides customizable keyboard shortcuts across the application
 */

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export type ShortcutAction = 
  | 'navigate:home'
  | 'navigate:calendar'
  | 'navigate:tasks'
  | 'navigate:notes'
  | 'navigate:messages'
  | 'navigate:directory'
  | 'navigate:documents'
  | 'open:search'
  | 'open:launcher'
  | 'open:shortcuts'
  | 'create:task'
  | 'create:note'
  | 'create:event'
  | 'toggle:theme'
  | 'toggle:sidebar'
  | 'save'
  | 'cancel'
  | 'delete'
  | 'refresh';

export type Shortcut = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: ShortcutAction;
  description: string;
  global?: boolean;
};

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  // Navigation
  { key: 'h', ctrl: true, action: 'navigate:home', description: 'Go to Home', global: true },
  { key: 'c', ctrl: true, shift: true, action: 'navigate:calendar', description: 'Open Calendar', global: true },
  { key: 't', ctrl: true, shift: true, action: 'navigate:tasks', description: 'Open Tasks', global: true },
  { key: 'n', ctrl: true, shift: true, action: 'navigate:notes', description: 'Open Notes', global: true },
  { key: 'm', ctrl: true, shift: true, action: 'navigate:messages', description: 'Open Messages', global: true },
  { key: 'd', ctrl: true, shift: true, action: 'navigate:directory', description: 'Open Directory', global: true },
  { key: 'f', ctrl: true, shift: true, action: 'navigate:documents', description: 'Open Documents', global: true },
  
  // Actions
  { key: 'k', ctrl: true, action: 'open:search', description: 'Open Search / Command Palette', global: true },
  { key: 'l', ctrl: true, action: 'open:launcher', description: 'Open App Launcher', global: true },
  { key: '/', ctrl: true, action: 'open:shortcuts', description: 'Show Keyboard Shortcuts', global: true },
  
  // Create
  { key: 't', ctrl: true, action: 'create:task', description: 'Create New Task', global: false },
  { key: 'n', ctrl: true, action: 'create:note', description: 'Create New Note', global: false },
  { key: 'e', ctrl: true, action: 'create:event', description: 'Create New Event', global: false },
  
  // UI
  { key: 'd', ctrl: true, alt: true, action: 'toggle:theme', description: 'Toggle Dark/Light Mode', global: true },
  { key: 'b', ctrl: true, action: 'toggle:sidebar', description: 'Toggle Sidebar', global: true },
  
  // Standard
  { key: 's', ctrl: true, action: 'save', description: 'Save', global: false },
  { key: 'Escape', action: 'cancel', description: 'Cancel / Close', global: false },
  { key: 'Delete', ctrl: true, action: 'delete', description: 'Delete', global: false },
  { key: 'r', ctrl: true, action: 'refresh', description: 'Refresh', global: false },
];

class KeyboardShortcutManager {
  private shortcuts: Map<string, Shortcut> = new Map();
  private listeners: Map<ShortcutAction, Set<() => void>> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    DEFAULT_SHORTCUTS.forEach(shortcut => {
      const key = this.getShortcutKey(shortcut);
      this.shortcuts.set(key, shortcut);
    });
  }

  private getShortcutKey(shortcut: Omit<Shortcut, 'action' | 'description'>): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.meta) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  register(shortcut: Shortcut) {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  unregister(shortcut: Omit<Shortcut, 'action' | 'description'>) {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  subscribe(action: ShortcutAction, callback: () => void) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set());
    }
    this.listeners.get(action)!.add(callback);

    return () => {
      this.listeners.get(action)?.delete(callback);
    };
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    const key = this.getShortcutKey({
      key: event.key,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    });

    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      const listeners = this.listeners.get(shortcut.action);
      if (listeners && listeners.size > 0) {
        event.preventDefault();
        listeners.forEach(callback => callback());
        return true;
      }
    }

    return false;
  }

  getAllShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values());
  }

  getShortcutForAction(action: ShortcutAction): Shortcut | undefined {
    return Array.from(this.shortcuts.values()).find(s => s.action === action);
  }
}

export const shortcutManager = new KeyboardShortcutManager();

/**
 * Hook for using keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts?: { action: ShortcutAction; handler: () => void }[]
) {
  const router = useRouter();

  // Default navigation handlers
  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Register custom shortcuts
    if (shortcuts) {
      shortcuts.forEach(({ action, handler }) => {
        const unsubscribe = shortcutManager.subscribe(action, handler);
        unsubscribers.push(unsubscribe);
      });
    }

    // Register default navigation handlers
    unsubscribers.push(
      shortcutManager.subscribe('navigate:home', () => handleNavigation('/dashboard')),
      shortcutManager.subscribe('navigate:calendar', () => handleNavigation('/dashboard/apps/calendar')),
      shortcutManager.subscribe('navigate:tasks', () => handleNavigation('/dashboard/apps/tasks')),
      shortcutManager.subscribe('navigate:notes', () => handleNavigation('/dashboard/apps/notes')),
      shortcutManager.subscribe('navigate:messages', () => handleNavigation('/dashboard/messages')),
      shortcutManager.subscribe('navigate:directory', () => handleNavigation('/dashboard/directory')),
      shortcutManager.subscribe('navigate:documents', () => handleNavigation('/dashboard/documents'))
    );

    // Global keyboard event listener
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Only allow certain shortcuts in inputs (like Escape, Ctrl+S)
        if (event.key !== 'Escape' && !(event.ctrlKey && event.key === 's')) {
          return;
        }
      }

      shortcutManager.handleKeyDown(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [shortcuts, handleNavigation]);

  return {
    registerShortcut: shortcutManager.register.bind(shortcutManager),
    unregisterShortcut: shortcutManager.unregister.bind(shortcutManager),
    getAllShortcuts: shortcutManager.getAllShortcuts.bind(shortcutManager),
  };
}

/**
 * Get formatted shortcut display string
 */
export function getShortcutDisplay(shortcut: Shortcut): string {
  const parts = [];
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  if (shortcut.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');
  if (shortcut.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (shortcut.meta) parts.push(isMac ? '⌘' : 'Win');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(isMac ? '' : '+');
}
