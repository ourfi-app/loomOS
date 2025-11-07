
'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccessibilitySettings {
  // Visual preferences
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  
  // Interaction preferences
  keyboardNavigationEnabled: boolean;
  screenReaderOptimized: boolean;
  focusHighlightEnabled: boolean;
  
  // Audio preferences
  soundEffectsEnabled: boolean;
  hapticsEnabled: boolean;
  
  // Layout preferences
  sidebarAlwaysVisible: boolean;
  compactMode: boolean;
}

interface AccessibilityState extends AccessibilitySettings {
  // Actions
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  setKeyboardNavigation: (value: boolean) => void;
  setScreenReaderOptimized: (value: boolean) => void;
  setFocusHighlight: (value: boolean) => void;
  setSoundEffects: (value: boolean) => void;
  setHaptics: (value: boolean) => void;
  setSidebarAlwaysVisible: (value: boolean) => void;
  setCompactMode: (value: boolean) => void;
  
  // Bulk actions
  resetToDefaults: () => void;
  loadFromSystem: () => void;
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  fontSize: 'normal',
  keyboardNavigationEnabled: true,
  screenReaderOptimized: false,
  focusHighlightEnabled: true,
  soundEffectsEnabled: false,
  hapticsEnabled: true,
  sidebarAlwaysVisible: false,
  compactMode: false,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setHighContrast: (value) => set({ highContrast: value }),
      setLargeText: (value) => set({ largeText: value }),
      setFontSize: (size) => set({ fontSize: size }),
      setKeyboardNavigation: (value) => set({ keyboardNavigationEnabled: value }),
      setScreenReaderOptimized: (value) => set({ screenReaderOptimized: value }),
      setFocusHighlight: (value) => set({ focusHighlightEnabled: value }),
      setSoundEffects: (value) => set({ soundEffectsEnabled: value }),
      setHaptics: (value) => set({ hapticsEnabled: value }),
      setSidebarAlwaysVisible: (value) => set({ sidebarAlwaysVisible: value }),
      setCompactMode: (value) => set({ compactMode: value }),
      
      resetToDefaults: () => set(defaultSettings),
      
      loadFromSystem: () => {
        if (typeof window === 'undefined') return;
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        set({
          reducedMotion: prefersReducedMotion,
          highContrast: prefersHighContrast,
        });
      },
    }),
    {
      name: 'montrecott-accessibility',
    }
  )
);

// Hook to sync with system preferences
export function useSystemAccessibilitySync() {
  const loadFromSystem = useAccessibilityStore((state) => state.loadFromSystem);
  
  if (typeof window !== 'undefined') {
    // Sync on mount
    useEffect(() => {
      loadFromSystem();
      
      // Listen for changes
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      
      const handleReducedMotionChange = (e: MediaQueryListEvent) => {
        useAccessibilityStore.getState().setReducedMotion(e.matches);
      };
      
      const handleHighContrastChange = (e: MediaQueryListEvent) => {
        useAccessibilityStore.getState().setHighContrast(e.matches);
      };
      
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
      highContrastQuery.addEventListener('change', handleHighContrastChange);
      
      return () => {
        reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
        highContrastQuery.removeEventListener('change', handleHighContrastChange);
      };
    }, [loadFromSystem]);
  }
}
