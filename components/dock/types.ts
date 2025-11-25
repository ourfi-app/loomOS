/**
 * TypeScript interfaces and types for the Unified Dock Component
 */

import { type AppDefinition } from '@/lib/enhanced-app-registry';
import type { Card } from '@/lib/card-manager-store';
import type { Loom } from '@/lib/loom-store';

// Re-export for convenience
export type { AppDefinition, Card, Loom };

// ============================================================================
// Dock Configuration
// ============================================================================

/**
 * Dock orientation
 */
export type DockOrientation = 'horizontal' | 'vertical';

/**
 * Dock position on screen
 */
export type DockPosition = 'bottom' | 'left' | 'right' | 'top';

/**
 * Dock size variants
 */
export type DockSize = 'small' | 'medium' | 'large';

/**
 * Dock actions (for context menu and keyboard shortcuts)
 */
export type DockAction =
  | 'open'
  | 'close'
  | 'minimize'
  | 'restore'
  | 'pin'
  | 'unpin'
  | 'replace'
  | 'remove'
  | 'info'
  | 'quit';

/**
 * Dock item status
 */
export interface DockItemStatus {
  /** Whether the app is currently active */
  isActive: boolean;
  /** Whether the app is running */
  isRunning: boolean;
  /** Whether the app is minimized */
  isMinimized: boolean;
  /** Whether the app is pinned to dock */
  isPinned: boolean;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * Main Dock Props
 */
export interface DockProps {
  /** Dock orientation */
  orientation?: DockOrientation;
  /** Dock position on screen */
  position?: DockPosition;
  /** Dock size */
  size?: DockSize;
  /** Whether to show running apps that aren't pinned */
  showRunningApps?: boolean;
  /** Whether to show looms in the dock */
  showLooms?: boolean;
  /** Whether to show the app launcher button */
  showAppLauncher?: boolean;
  /** Maximum number of pinned apps */
  maxPinnedApps?: number;
  /** Whether dock auto-hides when not in use */
  autoHide?: boolean;
  /** Whether to enable gesture controls */
  enableGestures?: boolean;
  /** Whether to enable drag-and-drop reordering */
  enableDragAndDrop?: boolean;
  /** Whether to enable keyboard navigation */
  enableKeyboard?: boolean;
  /** Custom callback when app is launched */
  onAppLaunch?: (app: AppDefinition) => void;
  /** Custom callback when loom is restored */
  onLoomRestore?: (loomId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dock Item Props
 */
export interface DockItemProps {
  /** App definition */
  app: AppDefinition;
  /** Item status flags */
  status: DockItemStatus;
  /** Position in dock (for pinned apps) */
  position?: number;
  /** Whether item is being dragged */
  isDragging?: boolean;
  /** Whether item is a drop target */
  isDropTarget?: boolean;
  /** Callback when item is clicked */
  onClick: (app: AppDefinition) => void;
  /** Callback when mouse enters */
  onMouseEnter: (appId: string) => void;
  /** Callback when mouse leaves */
  onMouseLeave: () => void;
  /** Callback when drag starts */
  onDragStart?: (appId: string) => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
  /** Callback when item is dropped on this item */
  onDrop?: (draggedAppId: string, targetAppId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dock Item Context Menu Props
 */
export interface DockItemContextMenuProps {
  /** App definition */
  app: AppDefinition;
  /** Item status flags */
  status: DockItemStatus;
  /** Position in dock (for pinned apps) */
  position?: number;
  /** Whether item can be customized (position < maxPinned) */
  canCustomize: boolean;
  /** Callback when an action is performed */
  onAction: (app: AppDefinition, action: DockAction) => void;
  /** Child elements (trigger) */
  children: React.ReactNode;
}

/**
 * Dock Tooltip Props
 */
export interface DockTooltipProps {
  /** App title to display */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional keyboard shortcut */
  shortcut?: string;
  /** Whether tooltip is shown */
  isOpen: boolean;
  /** Child elements (trigger) */
  children: React.ReactNode;
}

/**
 * Dock Separator Props
 */
export interface DockSeparatorProps {
  /** Dock orientation */
  orientation: DockOrientation;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dock Gesture Button Props
 */
export interface DockGestureButtonProps {
  /** Whether dock is visible */
  isDockVisible: boolean;
  /** Whether on home page */
  isHomePage: boolean;
  /** Callback to show dock */
  onShowDock: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loom Icon Props
 */
export interface LoomIconProps {
  /** Loom data */
  loom: Loom;
  /** Callback when clicked */
  onClick: () => void;
  /** Callback when context menu is opened */
  onContextMenu: (e: React.MouseEvent) => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * useDockItems Hook Return Type
 */
export interface UseDockItemsReturn {
  /** Pinned apps in the dock */
  pinnedApps: AppDefinition[];
  /** Running apps not pinned */
  runningApps: AppDefinition[];
  /** Combined dock apps (pinned + running) */
  dockApps: AppDefinition[];
  /** Map of app ID to card */
  cardsByAppId: Map<string, Card>;
  /** Set of running app IDs */
  runningAppIds: Set<string>;
  /** Get status for an app */
  getAppStatus: (appId: string) => DockItemStatus;
}

/**
 * useDockActions Hook Return Type
 */
export interface UseDockActionsReturn {
  /** Launch or restore an app */
  handleAppLaunch: (app: AppDefinition) => void;
  /** Close/quit an app */
  handleCloseApp: (appId: string) => void;
  /** Pin app to dock */
  handlePinApp: (appId: string, position?: number) => void;
  /** Unpin app from dock */
  handleUnpinApp: (appId: string) => void;
  /** Replace app in dock at position */
  handleReplaceInDock: (appId: string, position: number) => void;
  /** Handle context menu action */
  handleContextAction: (app: AppDefinition, action: DockAction) => void;
}

/**
 * useDockVisibility Hook Return Type
 */
export interface UseDockVisibilityReturn {
  /** Whether dock is visible */
  isVisible: boolean;
  /** Whether dock is hovered */
  isDockHovered: boolean;
  /** Show dock */
  showDock: () => void;
  /** Hide dock */
  hideDock: () => void;
  /** Toggle dock visibility */
  toggleDock: () => void;
  /** Set dock hovered state */
  setIsDockHovered: (hovered: boolean) => void;
}

/**
 * useDragAndDrop Hook Return Type
 */
export interface UseDragAndDropReturn {
  /** ID of item being dragged */
  draggedItemId: string | null;
  /** ID of drop target item */
  dropTargetId: string | null;
  /** Whether dock is in drag-over state */
  isDragOver: boolean;
  /** Handle drag start */
  handleDragStart: (itemId: string) => void;
  /** Handle drag end */
  handleDragEnd: () => void;
  /** Handle drag over dock */
  handleDockDragOver: (e: React.DragEvent) => void;
  /** Handle drag leave dock */
  handleDockDragLeave: () => void;
  /** Handle drop on dock */
  handleDockDrop: (e: React.DragEvent) => void;
  /** Handle drop on item (for reordering) */
  handleItemDrop: (draggedId: string, targetId: string) => void;
}

/**
 * useDockKeyboard Hook Return Type
 */
export interface UseDockKeyboardReturn {
  /** ID of focused dock item */
  focusedItemId: string | null;
  /** Handle keyboard events */
  handleKeyDown: (e: KeyboardEvent) => void;
  /** Focus specific item */
  focusItem: (itemId: string) => void;
  /** Clear focus */
  clearFocus: () => void;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Dock action event
 */
export interface DockActionEvent {
  app: AppDefinition;
  action: DockAction;
  timestamp: number;
}

/**
 * Dock drag event
 */
export interface DockDragEvent {
  draggedItemId: string;
  targetItemId?: string;
  position?: number;
  timestamp: number;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Dock animation configuration
 */
export interface DockAnimationConfig {
  /** Spring stiffness */
  stiffness: number;
  /** Spring damping */
  damping: number;
  /** Animation duration (ms) */
  duration: number;
  /** Stagger delay between items (ms) */
  stagger: number;
}

/**
 * Dock auto-hide configuration
 */
export interface DockAutoHideConfig {
  /** Enabled */
  enabled: boolean;
  /** Distance from edge to trigger show (px) */
  showThreshold: number;
  /** Delay before hiding (ms) */
  hideDelay: number;
}

/**
 * Dock gesture configuration
 */
export interface DockGestureConfig {
  /** Enabled */
  enabled: boolean;
  /** Minimum swipe distance (px) */
  minSwipeDistance: number;
  /** Maximum swipe duration (ms) */
  maxSwipeDuration: number;
}
