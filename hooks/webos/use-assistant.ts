
'use client';

import { create } from 'zustand';

interface AssistantStore {
  isOpen: boolean;
  isDocked: boolean;  // true = integrated with Just Type, false = floating window
  pendingMessage: string | null;
  openAssistant: (initialMessage?: string) => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  undockAssistant: () => void;
  dockAssistant: () => void;
  clearPendingMessage: () => void;
}

export const useAssistant = create<AssistantStore>((set) => ({
  isOpen: false,
  isDocked: true,  // Start docked (integrated with Just Type)
  pendingMessage: null,
  openAssistant: (initialMessage?: string) => set({ 
    isOpen: true, 
    pendingMessage: initialMessage || null 
  }),
  closeAssistant: () => set({ isOpen: false, pendingMessage: null }),
  toggleAssistant: () => set((state) => ({ 
    isOpen: !state.isOpen,
    // When toggling, always start docked
    isDocked: !state.isOpen ? true : state.isDocked
  })),
  undockAssistant: () => set({ isDocked: false, isOpen: true }),
  dockAssistant: () => set({ isDocked: true, isOpen: true }),
  clearPendingMessage: () => set({ pendingMessage: null }),
}));
