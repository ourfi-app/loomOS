
/**
 * Desktop Interaction Utilities
 * Optimized for mouse and keyboard users
 */

import { useEffect, useCallback, useState } from 'react';

// ============================================
// Hover State Management
// ============================================

/**
 * Enhanced hover classes for desktop
 */
export const HOVER_EFFECTS = {
  // List items
  listItem: `
    transition-all duration-150 ease-out
    hover:bg-gray-50 hover:shadow-sm
    hover:-translate-y-0.5
    active:translate-y-0
  `,
  
  // Cards
  card: `
    transition-all duration-200 ease-out
    hover:shadow-lg hover:-translate-y-1
    hover:border-gray-300
    active:translate-y-0 active:shadow-md
  `,
  
  // Buttons (subtle)
  buttonSubtle: `
    transition-all duration-150 ease-out
    hover:bg-opacity-90 hover:shadow-sm
    active:scale-95
  `,
  
  // Buttons (prominent)
  buttonProminent: `
    transition-all duration-150 ease-out
    hover:shadow-md hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm
  `,
  
  // Icons
  icon: `
    transition-all duration-150 ease-out
    hover:scale-110 hover:text-blue-600
    active:scale-95
  `,
  
  // Links
  link: `
    transition-all duration-150 ease-out
    hover:text-blue-600 hover:underline
    active:text-blue-700
  `,
  
  // Navigation items
  navItem: `
    transition-all duration-150 ease-out
    hover:bg-gray-100 hover:text-gray-900
    hover:border-l-4 hover:border-blue-500
    active:bg-gray-200
  `,
  
  // Table rows
  tableRow: `
    transition-all duration-100 ease-out
    hover:bg-blue-50
    cursor-pointer
  `,
} as const;

/**
 * Focus ring styles for keyboard navigation
 */
export const FOCUS_RING = {
  default: `
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
  `,
  
  inset: `
    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
    focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500
  `,
  
  prominent: `
    focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2
    focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2
  `,
} as const;

// ============================================
// Keyboard Shortcuts
// ============================================

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

/**
 * Hook for registering keyboard shortcuts
 */
export function useKeyboardShortcut(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (event.ctrlKey || event.metaKey);
        const metaMatch = shortcut.meta === undefined || shortcut.meta === event.metaKey;
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();

        if (ctrlMatch && metaMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Global keyboard shortcuts (available everywhere)
 */
export const GLOBAL_SHORTCUTS: Record<string, Omit<KeyboardShortcut, 'action'>> = {
  search: {
    key: 'k',
    ctrl: true,
    description: 'Open universal search',
    category: 'Navigation',
  },
  help: {
    key: '/',
    ctrl: true,
    description: 'Show keyboard shortcuts',
    category: 'Help',
  },
  settings: {
    key: ',',
    ctrl: true,
    description: 'Open settings',
    category: 'Navigation',
  },
  toggleSidebar: {
    key: 'b',
    ctrl: true,
    description: 'Toggle sidebar',
    category: 'Navigation',
  },
  escape: {
    key: 'Escape',
    description: 'Close dialog/modal',
    category: 'General',
  },
};

// ============================================
// Context Menu
// ============================================

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  shortcut?: string;
  separator?: boolean;
}

/**
 * Hook for handling right-click context menus
 */
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>(null);

  const showContextMenu = useCallback(
    (event: React.MouseEvent, items: ContextMenuItem[]) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        items,
      });
    },
    []
  );

  const hideContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Hide context menu on click or scroll
  useEffect(() => {
    if (contextMenu) {
      const handleClickOutside = () => hideContextMenu();
      const handleScroll = () => hideContextMenu();
      
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }
    return undefined;
  }, [contextMenu, hideContextMenu]);

  return { contextMenu, showContextMenu, hideContextMenu };
}

// ============================================
// Selection Management
// ============================================

/**
 * Hook for managing multi-select with keyboard modifiers
 */
export function useMultiSelect<T>(items: T[], getId: (item: T) => string) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const handleSelect = useCallback(
    (item: T, index: number, event?: React.MouseEvent) => {
      const id = getId(item);
      
      if (event?.ctrlKey || event?.metaKey) {
        // Toggle selection
        setSelectedIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
        setLastSelectedIndex(index);
      } else if (event?.shiftKey && lastSelectedIndex !== null) {
        // Range selection
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        const rangeIds = items.slice(start, end + 1).map(getId);
        setSelectedIds(prev => new Set([...prev, ...rangeIds]));
      } else {
        // Single selection
        setSelectedIds(new Set([id]));
        setLastSelectedIndex(index);
      }
    },
    [items, getId, lastSelectedIndex]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedIndex(null);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(getId)));
  }, [items, getId]);

  const isSelected = useCallback(
    (item: T) => selectedIds.has(getId(item)),
    [selectedIds, getId]
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    handleSelect,
    clearSelection,
    selectAll,
    isSelected,
  };
}

// ============================================
// Drag and Drop Utilities
// ============================================

/**
 * Visual feedback classes for drag and drop
 */
export const DRAG_CLASSES = {
  draggable: `
    cursor-move
    transition-all duration-150
    hover:shadow-md
  `,
  
  dragging: `
    opacity-50
    shadow-2xl
    scale-105
    rotate-2
  `,
  
  dropZone: `
    transition-all duration-200
    border-2 border-dashed border-gray-300
  `,
  
  dropZoneActive: `
    border-blue-500 bg-blue-50
  `,
  
  dropZoneInvalid: `
    border-red-500 bg-red-50
  `,
} as const;

// ============================================
// Mouse Interaction Helpers
// ============================================

/**
 * Detect if user is using mouse (vs touch)
 */
export function useIsMouseUser() {
  const [isMouseUser, setIsMouseUser] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => setIsMouseUser(true);
    const handleTouchStart = () => setIsMouseUser(false);

    window.addEventListener('mousemove', handleMouseMove, { once: true });
    window.addEventListener('touchstart', handleTouchStart, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return isMouseUser;
}

/**
 * Double-click handler with single-click delay
 */
export function useDoubleClick(
  onClick: () => void,
  onDoubleClick: () => void,
  delay: number = 300
) {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 1) {
      const timer = setTimeout(() => {
        onClick();
        setClickCount(0);
      }, delay);
      return () => clearTimeout(timer);
    } else if (clickCount === 2) {
      onDoubleClick();
      setClickCount(0);
    }
    return undefined;
  }, [clickCount, onClick, onDoubleClick, delay]);

  return () => setClickCount(prev => prev + 1);
}

// ============================================
// Scroll Enhancement
// ============================================

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element: HTMLElement | null, offset: number = 0) {
  if (!element) return;
  
  const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Hook for detecting scroll direction
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
}

