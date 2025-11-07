
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WidgetLayout {
  i: string; // widget id
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

interface WidgetLayoutState {
  isEditMode: boolean;
  layouts: WidgetLayout[];
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  updateLayouts: (layouts: WidgetLayout[]) => void;
  resetToDefault: () => void;
  addWidget: (widgetId: string) => void;
  removeWidget: (widgetId: string) => void;
}

// Default widget layouts - empty for new users
// Users can add widgets as needed through the widget controls
const DEFAULT_LAYOUTS: WidgetLayout[] = [];

// Widget size defaults for new widgets
const WIDGET_DEFAULTS: Record<string, Partial<WidgetLayout>> = {
  weather: { w: 3, h: 2, minW: 2, minH: 2, maxW: 6, maxH: 4 },
  calendar: { w: 3, h: 3, minW: 2, minH: 2, maxW: 6, maxH: 5 },
  feed: { w: 3, h: 8, minW: 3, minH: 4, maxW: 6, maxH: 10 },
  email: { w: 4, h: 6, minW: 3, minH: 5, maxW: 6, maxH: 10 },
  tasks: { w: 3, h: 6, minW: 3, minH: 5, maxW: 6, maxH: 10 },
  notes: { w: 3, h: 6, minW: 3, minH: 5, maxW: 6, maxH: 10 },
  notifications: { w: 4, h: 6, minW: 3, minH: 5, maxW: 6, maxH: 10 },
};

export const useWidgetLayout = create<WidgetLayoutState>()(
  persist(
    (set, get) => ({
      isEditMode: false,
      layouts: DEFAULT_LAYOUTS,
      toggleEditMode: () =>
        set((state) => ({ isEditMode: !state.isEditMode })),
      setEditMode: (enabled: boolean) =>
        set({ isEditMode: enabled }),
      updateLayouts: (layouts: WidgetLayout[]) =>
        set({ layouts }),
      resetToDefault: () =>
        set({ layouts: DEFAULT_LAYOUTS }),
      addWidget: (widgetId: string) => {
        const { layouts } = get();
        
        // Check if widget already exists
        if (layouts.some(l => l.i === widgetId)) {
          return;
        }

        // Weather and calendar are now in status bar, don't allow adding them
        if (widgetId === 'weather' || widgetId === 'calendar') {
          return;
        }

        // Get widget defaults
        const defaults = WIDGET_DEFAULTS[widgetId] || { w: 3, h: 3, minW: 2, minH: 2, maxW: 6, maxH: 6 };

        // Find a good position for the new widget
        // Start from top-right and look for empty space
        let x = 9; // Start from right side
        let y = 0;

        // Simple placement algorithm - could be improved
        const maxY = Math.max(...layouts.map(l => l.y + l.h), 0);
        
        // Try to place widget in an empty spot
        for (let tryY = 0; tryY <= maxY + 2; tryY++) {
          for (let tryX = 0; tryX <= 12 - (defaults.w || 3); tryX++) {
            // Check if this position collides with any existing widget
            const collides = layouts.some(layout => {
              return !(
                tryX + (defaults.w || 3) <= layout.x ||
                tryX >= layout.x + layout.w ||
                tryY + (defaults.h || 3) <= layout.y ||
                tryY >= layout.y + layout.h
              );
            });

            if (!collides) {
              x = tryX;
              y = tryY;
              // Found a spot, break both loops
              tryY = maxY + 10;
              break;
            }
          }
        }

        const newWidget: WidgetLayout = {
          i: widgetId,
          x,
          y,
          ...defaults,
        } as WidgetLayout;

        set({ layouts: [...layouts, newWidget] });
      },
      removeWidget: (widgetId: string) => {
        const { layouts } = get();
        
        // Don't allow removing the search assistant
        if (widgetId === 'search-assistant') {
          return;
        }

        set({ layouts: layouts.filter(l => l.i !== widgetId) });
      },
    }),
    {
      name: 'widget-layout-storage',
    }
  )
);
