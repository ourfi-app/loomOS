
/**
 * React Hook for Haptic Feedback
 * 
 * Provides easy access to haptic feedback in React components
 */

import { useCallback, useEffect, useState } from 'react';
import {
  triggerHaptic,
  stopHaptic,
  isHapticSupported,
  getHapticPreferences,
  setHapticPreferences,
  toggleHaptics,
  setHapticIntensity,
  Haptics,
  type HapticPattern,
  type HapticIntensity,
} from '@/lib/haptics';

/**
 * Hook to access haptic feedback
 */
export function useHapticFeedback() {
  const [isSupported, setIsSupported] = useState(false);
  const [preferences, setPreferencesState] = useState(getHapticPreferences());

  useEffect(() => {
    setIsSupported(isHapticSupported());
    setPreferencesState(getHapticPreferences());
  }, []);

  const trigger = useCallback((pattern: HapticPattern, options?: {
    force?: boolean;
    debounceMs?: number;
    customPattern?: number | number[];
  }) => {
    triggerHaptic(pattern, options);
  }, []);

  const stop = useCallback(() => {
    stopHaptic();
  }, []);

  const toggle = useCallback((enabled?: boolean) => {
    const newEnabled = toggleHaptics(enabled);
    setPreferencesState(getHapticPreferences());
    return newEnabled;
  }, []);

  const setIntensity = useCallback((intensity: HapticIntensity) => {
    setHapticIntensity(intensity);
    setPreferencesState(getHapticPreferences());
  }, []);

  const updatePreferences = useCallback((prefs: Partial<typeof preferences>) => {
    setHapticPreferences(prefs);
    setPreferencesState(getHapticPreferences());
  }, []);

  return {
    trigger,
    stop,
    toggle,
    setIntensity,
    updatePreferences,
    isSupported,
    preferences,
    // Convenience methods (excluding toggle to avoid conflict with system toggle)
    tap: Haptics.tap,
    press: Haptics.press,
    longPress: Haptics.longPress,
    select: Haptics.select,
    scroll: Haptics.scroll,
    dragStart: Haptics.dragStart,
    dragEnd: Haptics.dragEnd,
    drop: Haptics.drop,
    swipe: Haptics.swipe,
    swipeEdge: Haptics.swipeEdge,
    cardOpen: Haptics.cardOpen,
    cardClose: Haptics.cardClose,
    cardSnap: Haptics.cardSnap,
    cardDismiss: Haptics.cardDismiss,
    pinchStart: Haptics.pinchStart,
    pinchEnd: Haptics.pinchEnd,
    rotate: Haptics.rotate,
    switch: Haptics.switch,
    input: Haptics.input,
    submit: Haptics.submit,
    clear: Haptics.clear,
    success: Haptics.success,
    warning: Haptics.warning,
    error: Haptics.error,
    navigate: Haptics.navigate,
    back: Haptics.back,
    notification: Haptics.notification,
  };
}

/**
 * Hook for button haptic feedback
 * Automatically triggers haptic on click/press
 */
export function useButtonHaptic(options: {
  type?: 'tap' | 'press' | 'longPress';
  disabled?: boolean;
} = {}) {
  const { type = 'tap', disabled = false } = options;
  const haptic = useHapticFeedback();

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    switch (type) {
      case 'tap':
        haptic.tap();
        break;
      case 'press':
        haptic.press();
        break;
      case 'longPress':
        haptic.longPress();
        break;
    }
  }, [type, disabled, haptic]);

  return { onClick: handleClick };
}

/**
 * Hook for swipe gesture haptic feedback
 */
export function useSwipeHaptic() {
  const haptic = useHapticFeedback();

  const onSwipeStart = useCallback(() => {
    haptic.dragStart();
  }, [haptic]);

  const onSwipeEnd = useCallback(() => {
    haptic.swipe();
  }, [haptic]);

  const onSwipeEdge = useCallback(() => {
    haptic.swipeEdge();
  }, [haptic]);

  return {
    onSwipeStart,
    onSwipeEnd,
    onSwipeEdge,
  };
}

/**
 * Hook for drag gesture haptic feedback
 */
export function useDragHaptic() {
  const haptic = useHapticFeedback();

  const onDragStart = useCallback(() => {
    haptic.dragStart();
  }, [haptic]);

  const onDragEnd = useCallback(() => {
    haptic.dragEnd();
  }, [haptic]);

  const onDrop = useCallback(() => {
    haptic.drop();
  }, [haptic]);

  return {
    onDragStart,
    onDragEnd,
    onDrop,
  };
}

/**
 * Hook for toggle/switch haptic feedback
 */
export function useToggleHaptic() {
  const haptic = useHapticFeedback();

  const onToggle = useCallback((isOn: boolean) => {
    haptic.toggle(isOn);
  }, [haptic]);

  return { onToggle };
}

/**
 * Hook for form interaction haptic feedback
 */
export function useFormHaptic() {
  const haptic = useHapticFeedback();

  const onFocus = useCallback(() => {
    haptic.input();
  }, [haptic]);

  const onSubmit = useCallback(() => {
    haptic.submit();
  }, [haptic]);

  const onClear = useCallback(() => {
    haptic.clear();
  }, [haptic]);

  const onSuccess = useCallback(() => {
    haptic.success();
  }, [haptic]);

  const onError = useCallback(() => {
    haptic.error();
  }, [haptic]);

  return {
    onFocus,
    onSubmit,
    onClear,
    onSuccess,
    onError,
  };
}

/**
 * Hook for list/scroll haptic feedback
 */
export function useScrollHaptic() {
  const haptic = useHapticFeedback();

  const onSelect = useCallback(() => {
    haptic.select();
  }, [haptic]);

  const onScroll = useCallback(() => {
    haptic.scroll();
  }, [haptic]);

  return {
    onSelect,
    onScroll,
  };
}

/**
 * Export all hooks
 */
export default {
  useHapticFeedback,
  useButtonHaptic,
  useSwipeHaptic,
  useDragHaptic,
  useToggleHaptic,
  useFormHaptic,
  useScrollHaptic,
};
