
'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/lib/accessibility-store';

/**
 * Accessibility Initializer
 * Applies accessibility settings to the document
 * Should be included once in the root layout
 */
export function AccessibilityInitializer() {
  const {
    reducedMotion,
    highContrast,
    fontSize,
    focusHighlightEnabled,
    compactMode,
  } = useAccessibilityStore();
  
  useEffect(() => {
    // Load system preferences on mount
    useAccessibilityStore.getState().loadFromSystem();
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply reduced motion
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply font size
    root.setAttribute('data-font-size', fontSize);
    switch (fontSize) {
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'x-large':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
    }
    
    // Apply focus highlight
    if (!focusHighlightEnabled) {
      root.classList.add('no-focus-highlight');
    } else {
      root.classList.remove('no-focus-highlight');
    }
    
    // Apply compact mode
    if (compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [reducedMotion, highContrast, fontSize, focusHighlightEnabled, compactMode]);
  
  return null;
}
