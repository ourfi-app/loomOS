
import { useState, useCallback, useEffect } from 'react';
import { 
  calculateSnapBounds, 
  detectSnapZone, 
  getKeyboardSnapPosition,
  type SnapPosition 
} from '@/lib/window-snapping';

export interface WindowState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isSnapped: boolean;
  snapPosition: SnapPosition | null;
  zIndex: number;
  previousBounds?: { x: number; y: number; width: number; height: number };
}

interface WindowManagerHook {
  windows: Record<string, WindowState>;
  getWindowState: (id: string) => WindowState;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number, newX?: number, newY?: number) => void;
  maximizeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  initializeWindow: (id: string) => void;
  removeWindow: (id: string) => void;
  snapWindow: (id: string, position: SnapPosition) => void;
  snapWindowToCursor: (id: string, cursorX: number, cursorY: number) => void;
  handleKeyboardSnap: (id: string, key: string, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean }) => boolean;
}

const STORAGE_KEY = 'webos-window-states';
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 600;

// Z-index hierarchy:
// - Regular windows: 50-89
// - Maximized windows: 90
// - Status bar: 100
// - Dock: 9999 (always on top)
const BASE_Z_INDEX = 50;

// Get responsive dock + gesture area height based on viewport width
// This accounts for the full dock height including padding
const getDockHeight = () => {
  if (typeof window === 'undefined') return 96;
  const width = window.innerWidth;
  // Dock consists of: icon (64px) + padding (28px) + container padding (32px) = ~124px
  if (width >= 768) return 120;  // md breakpoint - desktop dock
  if (width >= 640) return 100;  // sm breakpoint - tablet dock
  return 96;  // mobile default
};

// Keep for backwards compatibility
const getGestureAreaHeight = getDockHeight;

/**
 * Get viewport dimensions accounting for status bar and gesture area.
 * This ensures windows are positioned within the usable screen area.
 */
const getViewportBounds = () => {
  if (typeof window === 'undefined') {
    return { minX: 0, minY: 0, maxX: 1920, maxY: 1080 };
  }

  const statusBarHeight = 48; // h-12 (3rem = 48px) - matches StatusBar height
  const dockHeight = getDockHeight(); // Full dock height including padding
  const padding = 0; // No padding - allow windows to use full viewport

  return {
    minX: padding,
    minY: statusBarHeight + padding,
    maxX: window.innerWidth - padding,
    maxY: window.innerHeight - dockHeight - padding, // Reserve space for dock
  };
};

export function useWindowManager(): WindowManagerHook {
  const [windows, setWindows] = useState<Record<string, WindowState>>({});
  const [highestZIndex, setHighestZIndex] = useState(BASE_Z_INDEX);

  // Load saved window states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWindows(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load window states:', e);
      }
    }
  }, []);

  // Save window states to localStorage
  useEffect(() => {
    if (Object.keys(windows).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
    }
  }, [windows]);

  // Re-constrain windows when viewport resizes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const bounds = getViewportBounds();
      
      setWindows(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        Object.keys(updated).forEach(id => {
          const win = updated[id];
          if (!win || win.isMaximized) return; // Skip maximized windows
          
          // Constrain position
          let newX = win.x;
          let newY = win.y;
          let newWidth = win.width;
          let newHeight = win.height;
          
          // Ensure window stays within bounds
          if (newX + newWidth > bounds.maxX) {
            newX = Math.max(bounds.minX, bounds.maxX - newWidth);
          }
          if (newY + newHeight > bounds.maxY) {
            newY = Math.max(bounds.minY, bounds.maxY - newHeight);
          }
          
          // Ensure window is not larger than viewport
          if (newWidth > bounds.maxX - bounds.minX) {
            newWidth = bounds.maxX - bounds.minX;
          }
          if (newHeight > bounds.maxY - bounds.minY) {
            newHeight = bounds.maxY - bounds.minY;
          }
          
          if (newX !== win.x || newY !== win.y || newWidth !== win.width || newHeight !== win.height) {
            updated[id] = { ...win, x: newX, y: newY, width: newWidth, height: newHeight };
            hasChanges = true;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDefaultPosition = useCallback((id: string) => {
    const bounds = getViewportBounds();
    
    // Calculate available space
    const availableWidth = bounds.maxX - bounds.minX;
    const availableHeight = bounds.maxY - bounds.minY;
    
    // Ensure minimum space for window (leave margins)
    const marginX = Math.min(50, availableWidth * 0.05);
    const marginY = Math.min(50, availableHeight * 0.05);
    
    // Constrain default window size to available space with margins
    const constrainedWidth = Math.max(
      MIN_WIDTH,
      Math.min(DEFAULT_WIDTH, availableWidth - marginX * 2)
    );
    const constrainedHeight = Math.max(
      MIN_HEIGHT,
      Math.min(DEFAULT_HEIGHT, availableHeight - marginY * 2)
    );
    
    // Calculate the center of the available viewport space
    const centerX = bounds.minX + availableWidth / 2;
    const centerY = bounds.minY + availableHeight / 2;
    
    // Offset by window count for cascading effect (max 5 cascades)
    const windowCount = Object.keys(windows).length;
    const offset = (windowCount % 5) * 40;
    
    // Calculate position ensuring it stays within bounds
    // Start from center and apply offset, then constrain
    let x = centerX - constrainedWidth / 2 + offset;
    let y = centerY - constrainedHeight / 2 + offset;
    
    // Ensure the window doesn't go outside bounds
    x = Math.max(bounds.minX, Math.min(x, bounds.maxX - constrainedWidth));
    y = Math.max(bounds.minY, Math.min(y, bounds.maxY - constrainedHeight));
    
    return {
      x,
      y,
      width: constrainedWidth,
      height: constrainedHeight,
    };
  }, [windows]);

  const getWindowState = useCallback((id: string): WindowState => {
    const existingWindow = windows[id];
    if (existingWindow) {
      return existingWindow;
    }
    
    // Return default state if not found
    const defaultPos = getDefaultPosition(id);
    return {
      id,
      ...defaultPos,
      isMaximized: false,
      isSnapped: false,
      snapPosition: null,
      zIndex: highestZIndex,
    };
  }, [windows, getDefaultPosition, highestZIndex]);

  const initializeWindow = useCallback((id: string) => {
    if (!windows[id]) {
      const defaultPos = getDefaultPosition(id);
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);
      
      setWindows(prev => ({
        ...prev,
        [id]: {
          id,
          ...defaultPos,
          isMaximized: false,
          isSnapped: false,
          snapPosition: null,
          zIndex: newZIndex,
        },
      }));
    }
  }, [windows, getDefaultPosition, highestZIndex]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    const bounds = getViewportBounds();
    const windowState = windows[id];
    
    if (!windowState) return;
    
    // Get current window dimensions
    const windowWidth = windowState.width || DEFAULT_WIDTH;
    const windowHeight = windowState.height || DEFAULT_HEIGHT;
    
    // Constrain position to ensure entire window stays within viewport
    // Ensure at least 50px of the window is visible (for dragging back)
    const minVisibleWidth = Math.min(50, windowWidth);
    const minVisibleHeight = Math.min(50, windowHeight);
    
    const constrainedX = Math.max(
      bounds.minX - windowWidth + minVisibleWidth,  // Allow window to go left, but keep some visible
      Math.min(x, bounds.maxX - minVisibleWidth)     // Keep at least some of window visible on right
    );
    
    const constrainedY = Math.max(
      bounds.minY,                                    // Never go above status bar
      Math.min(y, bounds.maxY - minVisibleHeight)    // Keep at least some of window visible at bottom
    );
    
    setWindows(prev => {
      const currentWindow = prev[id];
      if (!currentWindow) return prev;
      
      return {
        ...prev,
        [id]: {
          ...currentWindow,
          x: constrainedX,
          y: constrainedY,
          isMaximized: false,
          isSnapped: false,
          snapPosition: null,
        },
      };
    });
  }, [windows]);

  const updateWindowSize = useCallback((id: string, width: number, height: number, newX?: number, newY?: number) => {
    const bounds = getViewportBounds();
    const windowState = windows[id];
    
    if (!windowState) return;
    
    // Calculate the available space from window position to viewport edge
    const availableWidth = bounds.maxX - (newX ?? windowState.x);
    const availableHeight = bounds.maxY - (newY ?? windowState.y);
    
    // Constrain size to both minimum dimensions and available space
    const constrainedWidth = Math.max(MIN_WIDTH, Math.min(width, availableWidth));
    const constrainedHeight = Math.max(MIN_HEIGHT, Math.min(height, availableHeight));
    
    // If new position is provided (from resize with position change), constrain it too
    let finalX = newX ?? windowState.x;
    let finalY = newY ?? windowState.y;
    
    // Ensure the new position keeps window within bounds
    finalX = Math.max(bounds.minX, Math.min(finalX, bounds.maxX - constrainedWidth));
    finalY = Math.max(bounds.minY, Math.min(finalY, bounds.maxY - constrainedHeight));
    
    setWindows(prev => {
      const currentWindow = prev[id];
      if (!currentWindow) return prev;
      
      return {
        ...prev,
        [id]: {
          ...currentWindow,
          x: finalX,
          y: finalY,
          width: constrainedWidth,
          height: constrainedHeight,
          isMaximized: false,
          isSnapped: false,
          snapPosition: null,
        },
      };
    });
  }, [windows]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const windowState = prev[id];
      if (!windowState) return prev;

      // Save current bounds before maximizing (for restore)
      const previousBounds = windowState.previousBounds || {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
      };

      // Calculate maximized bounds (full viewport minus status bar and dock)
      const bounds = getViewportBounds();
      const statusBarHeight = 48; // Match status bar height
      const dockHeight = getDockHeight(); // Full dock height
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

      return {
        ...prev,
        [id]: {
          ...windowState,
          x: 0,
          y: statusBarHeight,
          width: viewportWidth,
          height: viewportHeight - statusBarHeight - dockHeight,
          isMaximized: true,
          isSnapped: false,
          snapPosition: null,
          previousBounds,
          zIndex: 90, // Maximized windows get special z-index
        },
      };
    });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => {
      const windowState = prev[id];
      if (!windowState) return prev;

      // If window was snapped/maximized and has previous bounds, restore to those
      if (windowState.previousBounds && (windowState.isSnapped || windowState.isMaximized)) {
        // Get a fresh z-index for restored window
        const newZIndex = Math.min(highestZIndex + 1, 89);
        
        return {
          ...prev,
          [id]: {
            ...windowState,
            ...windowState.previousBounds,
            isMaximized: false,
            isSnapped: false,
            snapPosition: null,
            previousBounds: undefined,
            zIndex: newZIndex,
          },
        };
      }

      // Otherwise just clear the maximized/snapped state
      return {
        ...prev,
        [id]: {
          ...windowState,
          isMaximized: false,
          isSnapped: false,
          snapPosition: null,
        },
      };
    });
  }, [highestZIndex]);

  const minimizeWindow = useCallback((id: string) => {
    // In WebOS, minimizing typically sends the window to the dock/card view
    // For now, we'll restore it to its previous state (unmaximize/unsnap)
    // This provides a consistent "reduce window size" behavior
    restoreWindow(id);
  }, [restoreWindow]);

  const focusWindow = useCallback((id: string) => {
    // Cap at 89 to leave room for maximized windows at 90
    const newZIndex = Math.min(highestZIndex + 1, 89);
    setHighestZIndex(newZIndex);
    
    setWindows(prev => {
      const currentWindow = prev[id];
      if (!currentWindow) return prev;
      
      return {
        ...prev,
        [id]: {
          ...currentWindow,
          zIndex: newZIndex,
        },
      };
    });
  }, [highestZIndex]);

  const removeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const newWindows = { ...prev };
      delete newWindows[id];
      return newWindows;
    });
  }, []);

  const snapWindow = useCallback((id: string, position: SnapPosition) => {
    setWindows(prev => {
      const windowState = prev[id];
      if (!windowState) return prev;

      // Save current bounds before snapping (for restore)
      const previousBounds = windowState.previousBounds || {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
      };

      // Calculate new snap bounds
      const snapBounds = calculateSnapBounds(position);

      return {
        ...prev,
        [id]: {
          ...windowState,
          ...snapBounds,
          isSnapped: true,
          isMaximized: position === 'maximize',
          snapPosition: position,
          previousBounds,
        },
      };
    });
  }, []);

  const snapWindowToCursor = useCallback((id: string, cursorX: number, cursorY: number) => {
    const zone = detectSnapZone(cursorX, cursorY);
    if (zone) {
      snapWindow(id, zone.position);
    }
  }, [snapWindow]);

  const handleKeyboardSnap = useCallback((
    id: string,
    key: string,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean }
  ): boolean => {
    const snapPosition = getKeyboardSnapPosition(key, modifiers);
    if (snapPosition) {
      snapWindow(id, snapPosition);
      return true;
    }
    return false;
  }, [snapWindow]);

  return {
    windows,
    getWindowState,
    updateWindowPosition,
    updateWindowSize,
    maximizeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    initializeWindow,
    removeWindow,
    snapWindow,
    snapWindowToCursor,
    handleKeyboardSnap,
  };
}
