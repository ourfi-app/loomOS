'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'admin' | 'board' | 'resident';

interface AdminModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAdminMode: boolean;
}

export const useAdminMode = create<AdminModeState>()(persist(
  (set, get) => ({
    viewMode: 'resident',
    isAdminMode: false,
    setViewMode: (mode: ViewMode) => {
      set({ 
        viewMode: mode,
        isAdminMode: mode === 'admin'
      });
    },
  }),
  {
    name: 'admin-mode-storage',
  }
));
