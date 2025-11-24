
'use client';

/**
 * Accessibility Helpers
 * Utilities for keyboard navigation, focus management, and ARIA support
 */

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    !!event.ctrlKey === !!shortcut.ctrl &&
    !!event.shiftKey === !!shortcut.shift &&
    !!event.altKey === !!shortcut.alt &&
    !!event.metaKey === !!shortcut.meta
  );
}

export function handleKeyboardShortcuts(
  event: KeyboardEvent,
  shortcuts: KeyboardShortcut[]
): boolean {
  for (const shortcut of shortcuts) {
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault();
      shortcut.action();
      return true;
    }
  }
  return false;
}

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

export interface FocusableElement extends HTMLElement {
  focus: () => void;
  blur: () => void;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): FocusableElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  return Array.from(container.querySelectorAll<FocusableElement>(selector));
}

/**
 * Trap focus within a container (useful for modals)
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab: moving backwards
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  firstElement?.focus();
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Manage focus return after closing a modal/dialog
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null;
  
  save() {
    this.previousFocus = document.activeElement as HTMLElement;
  }
  
  restore() {
    this.previousFocus?.focus();
    this.previousFocus = null;
  }
}

/**
 * Arrow key navigation for lists
 */
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onNavigate: (newIndex: number) => void
) {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    return;
  }
  
  event.preventDefault();
  let newIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowUp':
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case 'ArrowDown':
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = items.length - 1;
      break;
  }
  
  onNavigate(newIndex);
  items[newIndex]?.focus();
}

// ============================================================================
// ARIA HELPERS
// ============================================================================

export interface AriaLabelOptions {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
}

export function getAriaProps(options: AriaLabelOptions) {
  const props: Record<string, string> = {};
  
  if (options.label) props['aria-label'] = options.label;
  if (options.labelledBy) props['aria-labelledby'] = options.labelledBy;
  if (options.describedBy) props['aria-describedby'] = options.describedBy;
  
  return props;
}

/**
 * Create a unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

// ============================================================================
// TOUCH TARGET HELPERS
// ============================================================================

export function ensureMinimumTouchTarget(element: HTMLElement, minSize: number = 44) {
  const rect = element.getBoundingClientRect();
  
  if (rect.width < minSize || rect.height < minSize) {
      console.warn(`Touch target too small: ${rect.width}×${rect.height}px (minimum ${minSize}×${minSize}px)`,
      element
    );
  }
}

// ============================================================================
// CONTRAST HELPERS
// ============================================================================

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3] ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getLuminance(rgb: RGBColor): number {
  const [r = 0, g = 0, b = 0] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

export function meetsWCAGContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  fontSize: 'normal' | 'large' = 'normal'
): boolean {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return false;
  
  const ratio = getContrastRatio(fg, bg);
  
  if (level === 'AAA') {
    return fontSize === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  // AA level
  return fontSize === 'large' ? ratio >= 3 : ratio >= 4.5;
}

// ============================================================================
// SCREEN READER ONLY STYLES
// ============================================================================

export const srOnlyStyles = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  borderWidth: '0',
};
