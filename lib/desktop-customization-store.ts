
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DesktopWallpaper {
  type: 'solid' | 'gradient' | 'pattern' | 'image';
  value: string; // Color hex, gradient CSS, pattern name, or image URL
  blur: number;   // 0-10
  dim: number;    // 0-100 (percentage)
}

export interface DesktopTheme {
  mode: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontScale: number;      // 0.8-1.2
  reduceMotion: boolean;
}

export interface DesktopLayout {
  widgetTransparency: number;   // 0-100
  windowAnimationSpeed: number; // 0.5-2.0
  snapSensitivity: number;      // 10-50 (pixels)
  dockPosition: 'top' | 'bottom';
  dockSize: 'small' | 'medium' | 'large';
  statusBarVisible: boolean;
  showPerformanceMonitor: boolean;
}

interface DesktopCustomizationState {
  wallpaper: DesktopWallpaper;
  theme: DesktopTheme;
  layout: DesktopLayout;
  
  // Wallpaper actions
  setWallpaper: (wallpaper: Partial<DesktopWallpaper>) => void;
  
  // Theme actions
  setTheme: (theme: Partial<DesktopTheme>) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  setAccentColor: (color: string) => void;
  setFontScale: (scale: number) => void;
  toggleReduceMotion: () => void;
  
  // Layout actions
  setLayout: (layout: Partial<DesktopLayout>) => void;
  setDockPosition: (position: 'top' | 'bottom') => void;
  setDockSize: (size: 'small' | 'medium' | 'large') => void;
  toggleStatusBar: () => void;
  togglePerformanceMonitor: () => void;
  
  // Reset actions
  resetToDefaults: () => void;
  resetWallpaper: () => void;
  resetTheme: () => void;
  resetLayout: () => void;
}

const DEFAULT_WALLPAPER: DesktopWallpaper = {
  type: 'gradient',
  value: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)',
  blur: 0,
  dim: 0,
};

const DEFAULT_THEME: DesktopTheme = {
  mode: 'auto',
  accentColor: '#7a9eb5',
  fontScale: 1.0,
  reduceMotion: false,
};

const DEFAULT_LAYOUT: DesktopLayout = {
  widgetTransparency: 95,
  windowAnimationSpeed: 1.0,
  snapSensitivity: 20,
  dockPosition: 'bottom',
  dockSize: 'medium',
  statusBarVisible: true,
  showPerformanceMonitor: false,
};

export const useDesktopCustomization = create<DesktopCustomizationState>()(
  persist(
    (set, get) => ({
      wallpaper: DEFAULT_WALLPAPER,
      theme: DEFAULT_THEME,
      layout: DEFAULT_LAYOUT,
      
      setWallpaper: (wallpaper) => {
        set(state => ({
          wallpaper: { ...state.wallpaper, ...wallpaper },
        }));
      },
      
      setTheme: (theme) => {
        set(state => ({
          theme: { ...state.theme, ...theme },
        }));
      },
      
      setThemeMode: (mode) => {
        set(state => ({
          theme: { ...state.theme, mode },
        }));
      },
      
      setAccentColor: (color) => {
        set(state => ({
          theme: { ...state.theme, accentColor: color },
        }));
      },
      
      setFontScale: (scale) => {
        const constrainedScale = Math.max(0.8, Math.min(1.2, scale));
        set(state => ({
          theme: { ...state.theme, fontScale: constrainedScale },
        }));
      },
      
      toggleReduceMotion: () => {
        set(state => ({
          theme: { ...state.theme, reduceMotion: !state.theme.reduceMotion },
        }));
      },
      
      setLayout: (layout) => {
        set(state => ({
          layout: { ...state.layout, ...layout },
        }));
      },
      
      setDockPosition: (position) => {
        set(state => ({
          layout: { ...state.layout, dockPosition: position },
        }));
      },
      
      setDockSize: (size) => {
        set(state => ({
          layout: { ...state.layout, dockSize: size },
        }));
      },
      
      toggleStatusBar: () => {
        set(state => ({
          layout: { ...state.layout, statusBarVisible: !state.layout.statusBarVisible },
        }));
      },
      
      togglePerformanceMonitor: () => {
        set(state => ({
          layout: { ...state.layout, showPerformanceMonitor: !state.layout.showPerformanceMonitor },
        }));
      },
      
      resetToDefaults: () => {
        set({
          wallpaper: DEFAULT_WALLPAPER,
          theme: DEFAULT_THEME,
          layout: DEFAULT_LAYOUT,
        });
      },
      
      resetWallpaper: () => {
        set({ wallpaper: DEFAULT_WALLPAPER });
      },
      
      resetTheme: () => {
        set({ theme: DEFAULT_THEME });
      },
      
      resetLayout: () => {
        set({ layout: DEFAULT_LAYOUT });
      },
    }),
    {
      name: 'desktop-customization-storage',
    }
  )
);

// Preset wallpapers
export const PRESET_WALLPAPERS = {
  solid: [
    { name: 'Light Gray', value: '#e8e8e8' },
    { name: 'Sunset Orange', value: '#f093fb' },
    { name: 'Forest Green', value: '#4facfe' },
    { name: 'Medium Gray', value: '#999999' },
    { name: 'Coral Red', value: '#fa709a' },
    { name: 'Slate Gray', value: '#64748b' },
  ],
  gradient: [
    { 
      name: 'WebOS Gray', 
      value: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)' 
    },
    { 
      name: 'Sunset Vibes', 
      value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
    },
    { 
      name: 'Ocean Breeze', 
      value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
    },
    { 
      name: 'Morning Glow', 
      value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' 
    },
    { 
      name: 'Arctic Frost', 
      value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' 
    },
    { 
      name: 'Dark Matter', 
      value: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' 
    },
  ],
  pattern: [
    { name: 'Subtle Dots', value: 'dots' },
    { name: 'Diagonal Lines', value: 'lines' },
    { name: 'Grid', value: 'grid' },
    { name: 'Waves', value: 'waves' },
  ],
  image: [
    {
      name: 'Teal Mountain',
      value: '/backgrounds/desktop-bkgrd-tealmtn.webp',
      thumbnail: '/backgrounds/desktop-bkgrd-tealmtn.webp'
    },
    {
      name: 'Gold Wave',
      value: '/backgrounds/desktop-bkgrd-goldwave.webp',
      thumbnail: '/backgrounds/desktop-bkgrd-goldwave.webp'
    },
  ],
};
