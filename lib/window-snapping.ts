
/**
 * Window Snapping System
 * Provides intelligent window snapping to edges, corners, and custom layouts
 */

export type SnapPosition = 
  | 'left-half' 
  | 'right-half' 
  | 'top-half'
  | 'bottom-half'
  | 'top-left-quarter'
  | 'top-right-quarter'
  | 'bottom-left-quarter'
  | 'bottom-right-quarter'
  | 'maximize'
  | 'center'
  | 'restore';

export interface SnapZone {
  position: SnapPosition;
  x: number;
  y: number;
  width: number;
  height: number;
  triggerArea: { x: number; y: number; width: number; height: number };
}

export interface SnapResult {
  position: SnapPosition;
  bounds: { x: number; y: number; width: number; height: number };
  animated: boolean;
}

// Configuration
const SNAP_THRESHOLD = 80; // pixels from edge to trigger snap (increased for better detection)
const CORNER_THRESHOLD = 200; // pixels from corner to trigger quarter snap (increased)
const STATUS_BAR_HEIGHT = 28; // h-7 = 1.75rem
const GESTURE_AREA_HEIGHT = 72; // h-18 = 4.5rem on desktop
const PADDING = 0; // No padding for snap zones (use full screen)

/**
 * Get available screen bounds accounting for status bar and gesture area
 */
export function getScreenBounds(): { x: number; y: number; width: number; height: number } {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, width: 1920, height: 1080 };
  }

  return {
    x: PADDING,
    y: STATUS_BAR_HEIGHT + PADDING,
    width: window.innerWidth - PADDING * 2,
    height: window.innerHeight - STATUS_BAR_HEIGHT - GESTURE_AREA_HEIGHT - PADDING * 2,
  };
}

/**
 * Generate all snap zones based on current screen bounds
 */
export function getSnapZones(): SnapZone[] {
  const screen = getScreenBounds();
  const halfWidth = screen.width / 2;
  const quarterWidth = screen.width / 2;
  const quarterHeight = screen.height / 2;

  return [
    // Left half
    {
      position: 'left-half',
      x: screen.x,
      y: screen.y,
      width: halfWidth,
      height: screen.height,
      triggerArea: {
        x: 0,
        y: CORNER_THRESHOLD,
        width: SNAP_THRESHOLD,
        height: window.innerHeight - CORNER_THRESHOLD * 2,
      },
    },
    
    // Right half
    {
      position: 'right-half',
      x: screen.x + halfWidth,
      y: screen.y,
      width: halfWidth,
      height: screen.height,
      triggerArea: {
        x: window.innerWidth - SNAP_THRESHOLD,
        y: CORNER_THRESHOLD,
        width: SNAP_THRESHOLD,
        height: window.innerHeight - CORNER_THRESHOLD * 2,
      },
    },

    // Maximize (top edge)
    {
      position: 'maximize',
      x: screen.x,
      y: screen.y,
      width: screen.width,
      height: screen.height,
      triggerArea: {
        x: CORNER_THRESHOLD,
        y: 0,
        width: window.innerWidth - CORNER_THRESHOLD * 2,
        height: SNAP_THRESHOLD,
      },
    },

    // Top-left quarter
    {
      position: 'top-left-quarter',
      x: screen.x,
      y: screen.y,
      width: quarterWidth,
      height: quarterHeight,
      triggerArea: {
        x: 0,
        y: 0,
        width: CORNER_THRESHOLD,
        height: CORNER_THRESHOLD,
      },
    },

    // Top-right quarter
    {
      position: 'top-right-quarter',
      x: screen.x + quarterWidth,
      y: screen.y,
      width: quarterWidth,
      height: quarterHeight,
      triggerArea: {
        x: window.innerWidth - CORNER_THRESHOLD,
        y: 0,
        width: CORNER_THRESHOLD,
        height: CORNER_THRESHOLD,
      },
    },

    // Bottom-left quarter
    {
      position: 'bottom-left-quarter',
      x: screen.x,
      y: screen.y + quarterHeight,
      width: quarterWidth,
      height: quarterHeight,
      triggerArea: {
        x: 0,
        y: window.innerHeight - CORNER_THRESHOLD,
        width: CORNER_THRESHOLD,
        height: CORNER_THRESHOLD,
      },
    },

    // Bottom-right quarter
    {
      position: 'bottom-right-quarter',
      x: screen.x + quarterWidth,
      y: screen.y + quarterHeight,
      width: quarterWidth,
      height: quarterHeight,
      triggerArea: {
        x: window.innerWidth - CORNER_THRESHOLD,
        y: window.innerHeight - CORNER_THRESHOLD,
        width: CORNER_THRESHOLD,
        height: CORNER_THRESHOLD,
      },
    },
  ];
}

/**
 * Detect which snap zone (if any) the cursor is in
 */
export function detectSnapZone(cursorX: number, cursorY: number): SnapZone | null {
  const zones = getSnapZones();

  // Check corners first (higher priority)
  for (const zone of zones) {
    if (zone.position.includes('quarter')) {
      if (
        cursorX >= zone.triggerArea.x &&
        cursorX <= zone.triggerArea.x + zone.triggerArea.width &&
        cursorY >= zone.triggerArea.y &&
        cursorY <= zone.triggerArea.y + zone.triggerArea.height
      ) {
        return zone;
      }
    }
  }

  // Then check edges
  for (const zone of zones) {
    if (!zone.position.includes('quarter')) {
      if (
        cursorX >= zone.triggerArea.x &&
        cursorX <= zone.triggerArea.x + zone.triggerArea.width &&
        cursorY >= zone.triggerArea.y &&
        cursorY <= zone.triggerArea.y + zone.triggerArea.height
      ) {
        return zone;
      }
    }
  }

  return null;
}

/**
 * Calculate window bounds for a given snap position
 */
export function calculateSnapBounds(position: SnapPosition): { x: number; y: number; width: number; height: number } {
  const screen = getScreenBounds();
  const halfWidth = screen.width / 2;
  const halfHeight = screen.height / 2;

  switch (position) {
    case 'left-half':
      return {
        x: screen.x,
        y: screen.y,
        width: halfWidth,
        height: screen.height,
      };

    case 'right-half':
      return {
        x: screen.x + halfWidth,
        y: screen.y,
        width: halfWidth,
        height: screen.height,
      };

    case 'top-half':
      return {
        x: screen.x,
        y: screen.y,
        width: screen.width,
        height: halfHeight,
      };

    case 'bottom-half':
      return {
        x: screen.x,
        y: screen.y + halfHeight,
        width: screen.width,
        height: halfHeight,
      };

    case 'top-left-quarter':
      return {
        x: screen.x,
        y: screen.y,
        width: halfWidth,
        height: halfHeight,
      };

    case 'top-right-quarter':
      return {
        x: screen.x + halfWidth,
        y: screen.y,
        width: halfWidth,
        height: halfHeight,
      };

    case 'bottom-left-quarter':
      return {
        x: screen.x,
        y: screen.y + halfHeight,
        width: halfWidth,
        height: halfHeight,
      };

    case 'bottom-right-quarter':
      return {
        x: screen.x + halfWidth,
        y: screen.y + halfHeight,
        width: halfWidth,
        height: halfHeight,
      };

    case 'maximize':
      return {
        x: screen.x,
        y: screen.y,
        width: screen.width,
        height: screen.height,
      };

    case 'center':
      const centerWidth = Math.min(900, screen.width * 0.7);
      const centerHeight = Math.min(600, screen.height * 0.7);
      return {
        x: screen.x + (screen.width - centerWidth) / 2,
        y: screen.y + (screen.height - centerHeight) / 2,
        width: centerWidth,
        height: centerHeight,
      };

    case 'restore':
      // Return a sensible default size
      return {
        x: screen.x + 100,
        y: screen.y + 100,
        width: Math.min(900, screen.width - 200),
        height: Math.min(600, screen.height - 200),
      };

    default:
      return { x: screen.x, y: screen.y, width: 800, height: 600 };
  }
}

/**
 * Check if two bounds are approximately equal (for detecting if window is already snapped)
 */
export function boundsAreEqual(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  tolerance: number = 5
): boolean {
  return (
    Math.abs(a.x - b.x) < tolerance &&
    Math.abs(a.y - b.y) < tolerance &&
    Math.abs(a.width - b.width) < tolerance &&
    Math.abs(a.height - b.height) < tolerance
  );
}

/**
 * Get the snap position for keyboard shortcuts
 */
export function getKeyboardSnapPosition(
  key: string,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean }
): SnapPosition | null {
  // Cmd+Ctrl+Arrow for halves
  if (modifiers.ctrl && !modifiers.alt && !modifiers.shift) {
    switch (key) {
      case 'ArrowLeft':
        return 'left-half';
      case 'ArrowRight':
        return 'right-half';
      case 'ArrowUp':
        return 'maximize';
      case 'ArrowDown':
        return 'center';
      default:
        return null;
    }
  }

  // Cmd+Option+Arrow for quarters
  if (modifiers.alt && !modifiers.ctrl && !modifiers.shift) {
    switch (key) {
      case 'ArrowLeft':
        return 'top-left-quarter';
      case 'ArrowRight':
        return 'top-right-quarter';
      case 'ArrowUp':
        return 'top-left-quarter';
      case 'ArrowDown':
        return 'bottom-left-quarter';
      default:
        return null;
    }
  }

  // Cmd+Shift+Arrow for quarters (alternate)
  if (modifiers.shift && !modifiers.ctrl && !modifiers.alt) {
    switch (key) {
      case 'ArrowLeft':
        return 'bottom-left-quarter';
      case 'ArrowRight':
        return 'bottom-right-quarter';
      case 'ArrowUp':
        return 'top-right-quarter';
      case 'ArrowDown':
        return 'bottom-right-quarter';
      default:
        return null;
    }
  }

  return null;
}

/**
 * Animate window to new bounds
 */
export function animateWindowTransition(
  element: HTMLElement,
  targetBounds: { x: number; y: number; width: number; height: number },
  duration: number = 200
): Promise<void> {
  return new Promise((resolve) => {
    const startBounds = {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      // Interpolate bounds
      const currentBounds = {
        x: startBounds.x + (targetBounds.x - startBounds.x) * eased,
        y: startBounds.y + (targetBounds.y - startBounds.y) * eased,
        width: startBounds.width + (targetBounds.width - startBounds.width) * eased,
        height: startBounds.height + (targetBounds.height - startBounds.height) * eased,
      };

      // Apply bounds
      element.style.left = `${currentBounds.x}px`;
      element.style.top = `${currentBounds.y}px`;
      element.style.width = `${currentBounds.width}px`;
      element.style.height = `${currentBounds.height}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}
