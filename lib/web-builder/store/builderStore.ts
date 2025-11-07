import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { SerializedNodes } from '@craftjs/core';
import {
  Project,
  ThemeConfig,
  ImageAsset,
  IconAsset,
  BuilderUI,
  defaultTheme
} from './types';

interface HistoryState {
  componentTree: SerializedNodes | null;
  theme: ThemeConfig;
  timestamp: number;
}

interface BuilderState {
  // Current project
  project: Project | null;

  // Component tree (from Craft.js)
  componentTree: SerializedNodes | null;

  // Theme configuration
  theme: ThemeConfig;

  // Assets
  assets: {
    images: ImageAsset[];
    icons: IconAsset[];
  };

  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  maxHistory: number;

  // UI state
  ui: BuilderUI;

  // Actions
  setProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
  setComponentTree: (tree: SerializedNodes) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  addAsset: (asset: ImageAsset | IconAsset) => void;
  removeAsset: (id: string) => void;

  // History actions
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // UI actions
  setSelectedNode: (nodeId: string | null) => void;
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  toggleAIDrawer: () => void;
  setAIDrawerOpen: (open: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
  setZoom: (zoom: number) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  project: null,
  componentTree: null,
  theme: defaultTheme,
  assets: { images: [], icons: [] },
  history: [],
  historyIndex: -1,
  maxHistory: 50,
  ui: {
    selectedNode: null,
    viewport: 'desktop' as const,
    aiDrawerOpen: false,
    isDragging: false,
    zoom: 1,
  },
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setProject: (project) => set({ project }),

      updateProject: (updates) => set((state) => {
        if (state.project) {
          state.project = { ...state.project, ...updates, updatedAt: new Date() };
        }
      }),

      setComponentTree: (tree) => set((state) => {
        state.componentTree = tree;
        // Auto-save to history
        const { saveToHistory } = get();
        saveToHistory();
      }),

      updateTheme: (newTheme) => set((state) => {
        state.theme = { ...state.theme, ...newTheme };
      }),

      addAsset: (asset) => set((state) => {
        if ('url' in asset && asset.url.match(/\.(jpg|png|webp|gif|svg)/i)) {
          state.assets.images.push(asset as ImageAsset);
        } else {
          state.assets.icons.push(asset as IconAsset);
        }
      }),

      removeAsset: (id) => set((state) => {
        state.assets.images = state.assets.images.filter(img => img.id !== id);
        state.assets.icons = state.assets.icons.filter(icon => icon.id !== id);
      }),

      // History management
      saveToHistory: () => set((state) => {
        const newHistoryItem: HistoryState = {
          componentTree: state.componentTree,
          theme: state.theme,
          timestamp: Date.now(),
        };

        // Remove any "future" history if we're not at the end
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }

        // Add new history item
        state.history.push(newHistoryItem);

        // Limit history size
        if (state.history.length > state.maxHistory) {
          state.history.shift();
        } else {
          state.historyIndex++;
        }
      }),

      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          const previousState = state.history[state.historyIndex];
          state.componentTree = previousState.componentTree;
          state.theme = previousState.theme;
        }
      }),

      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          const nextState = state.history[state.historyIndex];
          state.componentTree = nextState.componentTree;
          state.theme = nextState.theme;
        }
      }),

      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },

      // UI actions
      setSelectedNode: (nodeId) => set((state) => {
        state.ui.selectedNode = nodeId;
      }),

      setViewport: (viewport) => set((state) => {
        state.ui.viewport = viewport;
      }),

      toggleAIDrawer: () => set((state) => {
        state.ui.aiDrawerOpen = !state.ui.aiDrawerOpen;
      }),

      setAIDrawerOpen: (open) => set((state) => {
        state.ui.aiDrawerOpen = open;
      }),

      setIsDragging: (isDragging) => set((state) => {
        state.ui.isDragging = isDragging;
      }),

      setZoom: (zoom) => set((state) => {
        state.ui.zoom = Math.max(0.25, Math.min(2, zoom));
      }),

      reset: () => set(initialState),
    })),
    {
      name: 'loomos-web-builder-storage',
      // Only persist essential data, not UI state
      partialize: (state) => ({
        project: state.project,
        componentTree: state.componentTree,
        theme: state.theme,
        assets: state.assets,
        history: state.history.slice(-10), // Only keep last 10 history items
        historyIndex: Math.min(state.historyIndex, 9),
      }),
    }
  )
);
