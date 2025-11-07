
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DesktopShortcut {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: string; // Action identifier that will be handled by the system
  keyboard?: string;
  category: 'create' | 'window' | 'workspace' | 'system' | 'navigation';
  enabled: boolean;
  order: number;
}

interface DesktopShortcutsState {
  shortcuts: DesktopShortcut[];
  quickActionsVisible: boolean;
  recentActions: string[]; // Recent shortcut IDs
  
  // Actions
  toggleQuickActions: () => void;
  executeShortcut: (id: string) => void;
  updateShortcut: (id: string, updates: Partial<DesktopShortcut>) => void;
  reorderShortcuts: (newOrder: string[]) => void;
  resetShortcuts: () => void;
}

const DEFAULT_SHORTCUTS: DesktopShortcut[] = [
  // Create actions
  {
    id: 'new-task',
    name: 'New Task',
    description: 'Create a new task',
    icon: 'plus-square',
    action: 'create-task',
    keyboard: 'Ctrl+T',
    category: 'create',
    enabled: true,
    order: 1,
  },
  {
    id: 'new-note',
    name: 'New Note',
    description: 'Create a new note',
    icon: 'sticky-note',
    action: 'create-note',
    keyboard: 'Ctrl+N',
    category: 'create',
    enabled: true,
    order: 2,
  },
  {
    id: 'new-message',
    name: 'New Message',
    description: 'Send a new message',
    icon: 'message-square',
    action: 'create-message',
    keyboard: 'Ctrl+M',
    category: 'create',
    enabled: true,
    order: 3,
  },
  // System actions
  {
    id: 'screenshot',
    name: 'Screenshot',
    description: 'Take a screenshot',
    icon: 'camera',
    action: 'take-screenshot',
    keyboard: 'Ctrl+Shift+4',
    category: 'system',
    enabled: true,
    order: 4,
  },
  {
    id: 'search',
    name: 'Search',
    description: 'Global search (Spotlight)',
    icon: 'search',
    action: 'open-spotlight',
    keyboard: 'Ctrl+Space',
    category: 'navigation',
    enabled: true,
    order: 5,
  },
  {
    id: 'quick-settings',
    name: 'Quick Settings',
    description: 'Open quick settings panel',
    icon: 'settings',
    action: 'open-quick-settings',
    keyboard: 'Ctrl+,',
    category: 'system',
    enabled: true,
    order: 6,
  },
  // Window management
  {
    id: 'show-all-windows',
    name: 'Show All Windows',
    description: 'Exposé all open windows',
    icon: 'layout-grid',
    action: 'show-all-windows',
    keyboard: 'Ctrl+Shift+A',
    category: 'window',
    enabled: true,
    order: 7,
  },
  {
    id: 'show-desktop',
    name: 'Show Desktop',
    description: 'Minimize all windows',
    icon: 'monitor',
    action: 'show-desktop',
    keyboard: 'Ctrl+Shift+D',
    category: 'window',
    enabled: true,
    order: 8,
  },
];

export const useDesktopShortcuts = create<DesktopShortcutsState>()(
  persist(
    (set, get) => ({
      shortcuts: DEFAULT_SHORTCUTS,
      quickActionsVisible: false,
      recentActions: [],
      
      toggleQuickActions: () => {
        set(state => ({ quickActionsVisible: !state.quickActionsVisible }));
      },
      
      executeShortcut: (id) => {
        const { recentActions } = get();
        // Add to recent, keeping only last 5
        const updated = [id, ...recentActions.filter(a => a !== id)].slice(0, 5);
        set({ recentActions: updated });
      },
      
      updateShortcut: (id, updates) => {
        set(state => ({
          shortcuts: state.shortcuts.map(s =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },
      
      reorderShortcuts: (newOrder) => {
        set(state => {
          const reordered = newOrder.map((id, index) => {
            const shortcut = state.shortcuts.find(s => s.id === id);
            return shortcut ? { ...shortcut, order: index } : null;
          }).filter(Boolean) as DesktopShortcut[];
          
          return { shortcuts: reordered };
        });
      },
      
      resetShortcuts: () => {
        set({ shortcuts: DEFAULT_SHORTCUTS, recentActions: [] });
      },
    }),
    {
      name: 'desktop-shortcuts-storage',
    }
  )
);
