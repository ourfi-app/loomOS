/**
 * Constants and configuration for the Unified Dock
 */

import type {
  DockOrientation,
  DockPosition,
  DockSize,
  DockAction,
  DockAnimationConfig,
  DockAutoHideConfig,
  DockGestureConfig,
} from '../types';

/**
 * Default dock configuration
 */
export const DOCK_DEFAULTS = {
  orientation: 'horizontal' as DockOrientation,
  position: 'bottom' as DockPosition,
  size: 'medium' as DockSize,
  maxPinnedApps: 5,
  showRunningApps: true,
  showLooms: true,
  showAppLauncher: true,
  autoHide: false,
  enableGestures: true,
  enableDragAndDrop: true,
  enableKeyboard: true,
};

/**
 * Dock size dimensions (in pixels)
 */
export const DOCK_SIZES = {
  small: {
    itemSize: 48,
    itemSizeSm: 56,
    iconSize: 24,
    iconSizeSm: 28,
    gap: 8,
    gapSm: 12,
    padding: 12,
    paddingSm: 16,
  },
  medium: {
    itemSize: 56,
    itemSizeSm: 64,
    iconSize: 28,
    iconSizeSm: 32,
    gap: 8,
    gapSm: 12,
    padding: 16,
    paddingSm: 20,
  },
  large: {
    itemSize: 64,
    itemSizeSm: 72,
    iconSize: 32,
    iconSizeSm: 36,
    gap: 12,
    gapSm: 16,
    padding: 20,
    paddingSm: 24,
  },
};

/**
 * Animation configurations
 */
export const DOCK_ANIMATIONS: Record<string, DockAnimationConfig> = {
  default: {
    stiffness: 300,
    damping: 30,
    duration: 250,
    stagger: 20,
  },
  fast: {
    stiffness: 500,
    damping: 30,
    duration: 150,
    stagger: 10,
  },
  slow: {
    stiffness: 200,
    damping: 25,
    duration: 350,
    stagger: 30,
  },
  item: {
    stiffness: 500,
    damping: 30,
    duration: 200,
    stagger: 0,
  },
};

/**
 * Auto-hide configuration
 */
export const AUTO_HIDE_CONFIG: DockAutoHideConfig = {
  enabled: true,
  showThreshold: 100, // Show when within 100px of edge
  hideDelay: 1000, // Hide after 1 second
};

/**
 * Gesture configuration
 */
export const GESTURE_CONFIG: DockGestureConfig = {
  enabled: true,
  minSwipeDistance: 50, // Minimum 50px swipe
  maxSwipeDuration: 500, // Maximum 500ms duration
};

/**
 * Action labels for context menu
 */
export const ACTION_LABELS: Record<DockAction, string> = {
  open: 'Open',
  close: 'Close',
  minimize: 'Minimize',
  restore: 'Restore',
  pin: 'Pin to Dock',
  unpin: 'Unpin from Dock',
  replace: 'Replace in Dock',
  remove: 'Remove',
  info: 'App Info',
  quit: 'Quit',
};

/**
 * Indicator types and their colors
 */
export const INDICATORS = {
  running: {
    size: 'w-1.5 h-1.5',
    color: 'bg-white/60',
  },
  active: {
    size: 'w-2 h-2',
    color: 'bg-white',
    animation: 'animate-pulse',
  },
  minimized: {
    size: 'w-2.5 h-2.5',
    color: 'bg-[var(--semantic-warning)]',
  },
};

/**
 * Accessibility labels
 */
export const A11Y_LABELS = {
  dock: 'Application Dock',
  dockItem: (title: string, status: string) => `${title} - ${status}`,
  launchApp: (title: string) => `Launch ${title}`,
  restoreApp: (title: string) => `Restore ${title}`,
  quitApp: (title: string) => `Quit ${title}`,
  pinApp: (title: string) => `Pin ${title} to dock`,
  unpinApp: (title: string) => `Unpin ${title} from dock`,
  appLauncher: 'Open App Grid',
  gestureButton: 'Swipe up to show dock',
  separator: 'Dock separator',
  contextMenu: (title: string) => `${title} actions`,
};

/**
 * Toast messages
 */
export const TOAST_MESSAGES = {
  appLaunched: (title: string) => ({
    title: 'Opening App',
    description: `Launching ${title}...`,
  }),
  appRestored: (title: string) => ({
    title: 'Restored',
    description: `${title} has been restored`,
  }),
  appClosed: (title: string) => ({
    title: 'App Closed',
    description: `${title} has been closed`,
  }),
  appPinned: (title: string, position: number) => ({
    title: 'Pinned to Dock',
    description: `${title} added to position ${position + 1}`,
  }),
  appUnpinned: (title: string) => ({
    title: 'Unpinned',
    description: `${title} removed from dock`,
  }),
  replacePrompt: () => ({
    title: 'Select App',
    description: 'Open the app grid and right-click on any app to add it to this position',
  }),
  loomCreated: (title: string) => ({
    title: 'Loom Created',
    description: `"${title}" has been pinned to the dock`,
  }),
  loomRestored: (title: string) => ({
    title: 'Loom Restored',
    description: `"${title}" has been restored`,
  }),
  loomUnpinned: (title: string) => ({
    title: 'Loom Unpinned',
    description: `"${title}" has been removed from the dock`,
  }),
  maxAppsReached: (max: number) => ({
    title: 'Dock Full',
    description: `Maximum ${max} apps can be pinned to the dock`,
  }),
};

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  showDock: 'Cmd+D',
  hideDock: 'Escape',
  openAppLauncher: ['Cmd+Space', 'Ctrl+Space'],
  focusFirst: 'Home',
  focusLast: 'End',
  navigateLeft: 'ArrowLeft',
  navigateRight: 'ArrowRight',
  navigateUp: 'ArrowUp',
  navigateDown: 'ArrowDown',
  launchApp: 'Enter',
  showContextMenu: ['Shift+F10', 'ContextMenu'],
};

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 768,
  desktopLarge: 1024,
  desktopXL: 1280,
};

/**
 * Z-index values
 */
export const Z_INDEX = {
  dock: 9999,
  gestureButton: 9998,
  contextMenu: 10000,
  tooltip: 10001,
};

/**
 * Timing constants (ms)
 */
export const TIMING = {
  tooltipDelay: 500,
  hoverDelay: 300,
  longPressDelay: 500,
  doubleClickDelay: 300,
};

/**
 * Drag and drop configuration
 */
export const DRAG_DROP_CONFIG = {
  dragThreshold: 5, // px to start drag
  dropZoneSize: 80, // px
  reorderThreshold: 0.5, // 50% overlap to trigger reorder
};

/**
 * CSS classes for dock themes
 */
export const DOCK_THEMES = {
  glass: {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-border)',
    shadow: 'var(--shadow-lg)',
  },
  solid: {
    background: 'var(--webos-surface)',
    backdropFilter: 'none',
    border: '1px solid var(--webos-border-light)',
    shadow: 'var(--shadow-md)',
  },
  minimal: {
    background: 'transparent',
    backdropFilter: 'none',
    border: 'none',
    shadow: 'none',
  },
};

/**
 * Default theme
 */
export const DEFAULT_THEME = 'glass';
