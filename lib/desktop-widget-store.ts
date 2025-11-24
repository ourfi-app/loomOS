
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DesktopWidgetPosition {
  x: number;
  y: number;
}

export interface DesktopWidgetSize {
  width: number;
  height: number;
}

export interface DesktopWidget {
  id: string;
  widgetType: string;
  position: DesktopWidgetPosition;
  size: DesktopWidgetSize;
  settings: Record<string, any>;
  isCollapsed: boolean;
  isPinned: boolean;
  refreshInterval: number; // in seconds
  order: number; // z-index order
}

interface DesktopWidgetState {
  widgets: DesktopWidget[];
  selectedWidgetId: string | null;
  isManaging: boolean;
  
  // Widget CRUD
  addWidget: (widgetType: string) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<DesktopWidget>) => void;
  
  // Widget Positioning
  updatePosition: (widgetId: string, position: DesktopWidgetPosition) => void;
  updateSize: (widgetId: string, size: DesktopWidgetSize) => void;
  
  // Widget States
  toggleCollapse: (widgetId: string) => void;
  togglePin: (widgetId: string) => void;
  
  // Selection & Management
  selectWidget: (widgetId: string | null) => void;
  bringToFront: (widgetId: string) => void;
  setManaging: (isManaging: boolean) => void;
  
  // Bulk Operations
  resetAllWidgets: () => void;
  clearAllWidgets: () => void;
}

// Widget type configurations
const WIDGET_DEFAULTS: Record<string, Partial<DesktopWidget>> = {
  tasks: {
    size: { width: 360, height: 480 },
    refreshInterval: 300,
    settings: { filter: 'all', showCompleted: false },
  },
  notes: {
    size: { width: 340, height: 420 },
    refreshInterval: 600,
    settings: { showPinned: true, gridView: true },
  },
  notifications: {
    size: { width: 380, height: 520 },
    refreshInterval: 30,
    settings: { filter: 'all', autoMarkRead: false },
  },
  email: {
    size: { width: 400, height: 500 },
    refreshInterval: 120,
    settings: { showUnreadOnly: false, previewLength: 'medium' },
  },
  stats: {
    size: { width: 320, height: 280 },
    refreshInterval: 300,
    settings: { showCharts: true },
  },
  activity: {
    size: { width: 360, height: 450 },
    refreshInterval: 180,
    settings: { maxItems: 10 },
  },
};

// Calculate smart initial position for new widgets
function getInitialPosition(existingWidgets: DesktopWidget[], widgetType: string): DesktopWidgetPosition {
  // Start from top-right area (common for desktop widgets)
  const baseX = window.innerWidth - 420;
  const baseY = 120;
  
  // Offset based on number of existing widgets
  const offset = existingWidgets.length * 40;
  
  return {
    x: Math.max(baseX - offset, 100),
    y: Math.min(baseY + offset, window.innerHeight - 600),
  };
}

let widgetIdCounter = 1;

export const useDesktopWidgets = create<DesktopWidgetState>()(
  persist(
    (set, get) => ({
      widgets: [],
      selectedWidgetId: null,
      isManaging: false,
      
      addWidget: (widgetType: string) => {
        const { widgets } = get();
        
        // Check if widget type already exists
        if (widgets.some(w => w.widgetType === widgetType)) {
          return;
        }
        
        const defaults = WIDGET_DEFAULTS[widgetType] || {
          size: { width: 360, height: 400 },
          refreshInterval: 300,
          settings: {},
        };
        
        const newWidget: DesktopWidget = {
          id: `desktop-widget-${widgetType}-${widgetIdCounter++}`,
          widgetType,
          position: getInitialPosition(widgets, widgetType),
          size: defaults.size!,
          settings: defaults.settings || {},
          isCollapsed: false,
          isPinned: false,
          refreshInterval: defaults.refreshInterval || 300,
          order: widgets.length,
        };
        
        set({ widgets: [...widgets, newWidget] });
      },
      
      removeWidget: (widgetId: string) => {
        set(state => ({
          widgets: state.widgets.filter(w => w.id !== widgetId),
          selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
        }));
      },
      
      updateWidget: (widgetId: string, updates: Partial<DesktopWidget>) => {
        set(state => ({
          widgets: state.widgets.map(w =>
            w.id === widgetId ? { ...w, ...updates } : w
          ),
        }));
      },
      
      updatePosition: (widgetId: string, position: DesktopWidgetPosition) => {
        get().updateWidget(widgetId, { position });
      },
      
      updateSize: (widgetId: string, size: DesktopWidgetSize) => {
        get().updateWidget(widgetId, { size });
      },
      
      toggleCollapse: (widgetId: string) => {
        const widget = get().widgets.find(w => w.id === widgetId);
        if (widget) {
          get().updateWidget(widgetId, { isCollapsed: !widget.isCollapsed });
        }
      },
      
      togglePin: (widgetId: string) => {
        const widget = get().widgets.find(w => w.id === widgetId);
        if (widget) {
          get().updateWidget(widgetId, { isPinned: !widget.isPinned });
        }
      },
      
      selectWidget: (widgetId: string | null) => {
        set({ selectedWidgetId: widgetId });
      },
      
      bringToFront: (widgetId: string) => {
        const { widgets } = get();
        const maxOrder = Math.max(...widgets.map(w => w.order), 0);
        get().updateWidget(widgetId, { order: maxOrder + 1 });
      },
      
      setManaging: (isManaging: boolean) => {
        set({ isManaging });
      },
      
      resetAllWidgets: () => {
        // Reset to default widget set
        set({
          widgets: [],
          selectedWidgetId: null,
        });
      },
      
      clearAllWidgets: () => {
        set({
          widgets: [],
          selectedWidgetId: null,
        });
      },
    }),
    {
      name: 'desktop-widgets-storage',
    }
  )
);
