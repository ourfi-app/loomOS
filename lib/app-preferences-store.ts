
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SortMode = 'default' | 'alphabetical' | 'recent' | 'frequent' | 'custom';
export type ViewMode = 'grid' | 'list' | 'bento';

interface AppUsage {
  appId: string;
  lastUsed: number;
  useCount: number;
}

interface AppPreferences {
  // View preferences
  viewMode: ViewMode;
  sortMode: SortMode;
  selectedCategories: string[];

  // Quick Launch Dock (4 customizable + 1 fixed menu button)
  dockAppIds: string[]; // Exactly 4 apps

  // Legacy pinned apps (for backwards compatibility)
  pinnedAppIds: string[];

  // Desktop widgets
  desktopWidgets: string[];

  // Favorites (independent of dock pins)
  favoriteAppIds: string[];

  // Usage tracking
  appUsage: Record<string, AppUsage>;
  recentSearches: string[];

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  toggleCategory: (category: string) => void;
  setCategories: (categories: string[]) => void;

  // Quick Launch Dock actions
  setDockApps: (appIds: string[]) => void;
  addToDock: (appId: string, position?: number) => void;
  removeFromDock: (appId: string) => void;
  reorderDock: (appIds: string[]) => void;

  // Legacy pinned apps actions
  togglePinned: (appId: string) => void;
  setPinnedApps: (appIds: string[]) => void;
  reorderPinnedApps: (appIds: string[]) => void;

  // Favorites actions
  toggleFavorite: (appId: string) => void;
  addFavorite: (appId: string) => void;
  removeFavorite: (appId: string) => void;

  toggleWidget: (appId: string) => void;

  trackAppUsage: (appId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  getMostUsedApps: (limit?: number) => string[];
  getRecentApps: (limit?: number) => string[];
}

export const useAppPreferences = create<AppPreferences>()(
  persist(
    (set, get) => ({
      viewMode: 'grid',
      sortMode: 'default',
      selectedCategories: [],
      // Default Quick Launch Dock: 4 pre-installed essential apps (browser, mail, calendar, settings)
      dockAppIds: ['browser', 'mail', 'calendar', 'settings'],
      // Default Pinned Apps: Most used essentials
      pinnedAppIds: [],
      desktopWidgets: [],
      // Default Favorites: Start with most essential apps
      favoriteAppIds: ['home', 'assistant', 'notifications', 'profile', 'payments'],
      appUsage: {},
      recentSearches: [],
      
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortMode: (mode) => set({ sortMode: mode }),
      
      toggleCategory: (category) => 
        set((state) => {
          const selected = state.selectedCategories;
          return {
            selectedCategories: selected.includes(category)
              ? selected.filter(c => c !== category)
              : [...selected, category]
          };
        }),
      
      setCategories: (categories) => set({ selectedCategories: categories }),
      
      // Quick Launch Dock actions
      setDockApps: (appIds) => 
        set({ dockAppIds: appIds.slice(0, 4) }), // Ensure exactly 4 apps
      
      addToDock: (appId, position) =>
        set((state) => {
          const newDockAppIds = [...state.dockAppIds];
          
          // Remove if already in dock
          const existingIndex = newDockAppIds.indexOf(appId);
          if (existingIndex !== -1) {
            newDockAppIds.splice(existingIndex, 1);
          }
          
          // Add at position or at the end
          if (position !== undefined && position >= 0 && position < 4) {
            newDockAppIds.splice(position, 0, appId);
          } else {
            newDockAppIds.push(appId);
          }
          
          // Keep only first 4
          return { dockAppIds: newDockAppIds.slice(0, 4) };
        }),
      
      removeFromDock: (appId) =>
        set((state) => ({
          dockAppIds: state.dockAppIds.filter(id => id !== appId),
        })),
      
      reorderDock: (appIds) =>
        set({ dockAppIds: appIds.slice(0, 4) }),
      
      // Legacy pinned apps actions
      togglePinned: (appId) =>
        set((state) => {
          const pinned = state.pinnedAppIds;
          return {
            pinnedAppIds: pinned.includes(appId)
              ? pinned.filter(id => id !== appId)
              : [...pinned, appId]
          };
        }),
      
      setPinnedApps: (appIds) => set({ pinnedAppIds: appIds }),
      
      reorderPinnedApps: (appIds) => set({ pinnedAppIds: appIds }),

      // Favorites actions
      toggleFavorite: (appId) =>
        set((state) => {
          const favorites = state.favoriteAppIds;
          return {
            favoriteAppIds: favorites.includes(appId)
              ? favorites.filter(id => id !== appId)
              : [...favorites, appId]
          };
        }),

      addFavorite: (appId) =>
        set((state) => {
          if (state.favoriteAppIds.includes(appId)) return state;
          return {
            favoriteAppIds: [...state.favoriteAppIds, appId]
          };
        }),

      removeFavorite: (appId) =>
        set((state) => ({
          favoriteAppIds: state.favoriteAppIds.filter(id => id !== appId)
        })),

      toggleWidget: (appId) =>
        set((state) => {
          const widgets = state.desktopWidgets;
          return {
            desktopWidgets: widgets.includes(appId)
              ? widgets.filter(id => id !== appId)
              : [...widgets, appId]
          };
        }),
      
      trackAppUsage: (appId) =>
        set((state) => ({
          appUsage: {
            ...state.appUsage,
            [appId]: {
              appId,
              lastUsed: Date.now(),
              useCount: (state.appUsage[appId]?.useCount || 0) + 1
            }
          }
        })),
      
      addRecentSearch: (query) =>
        set((state) => {
          const searches = [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 10);
          return { recentSearches: searches };
        }),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      getMostUsedApps: (limit = 10) => {
        const usage = get().appUsage;
        return Object.values(usage)
          .sort((a, b) => b.useCount - a.useCount)
          .slice(0, limit)
          .map(u => u.appId);
      },
      
      getRecentApps: (limit = 10) => {
        const usage = get().appUsage;
        return Object.values(usage)
          .sort((a, b) => b.lastUsed - a.lastUsed)
          .slice(0, limit)
          .map(u => u.appId);
      },
    }),
    {
      name: 'app-preferences-storage',
    }
  )
);
