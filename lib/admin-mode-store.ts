
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'admin' | 'board' | 'resident';

interface AdminModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Legacy support - will be deprecated
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (mode: boolean) => void;
}

export const useAdminMode = create<AdminModeState>()(
  persist(
    (set) => ({
      viewMode: 'admin', // Default to admin mode for admin users
      setViewMode: (mode: ViewMode) => set({ 
        viewMode: mode,
        isAdminMode: mode === 'admin', // Keep legacy support
      }),
      
      // Legacy support - will be deprecated
      isAdminMode: true,
      toggleAdminMode: () => set((state) => ({ 
        isAdminMode: !state.isAdminMode,
        viewMode: !state.isAdminMode ? 'admin' : 'resident',
      })),
      setAdminMode: (mode: boolean) => set({ 
        isAdminMode: mode,
        viewMode: mode ? 'admin' : 'resident',
      }),
    }),
    {
      name: 'admin-mode-storage',
    }
  )
);
