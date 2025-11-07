
/**
 * Haptic Feedback System
 * 
 * Provides tactile feedback for touch interactions following WebOS principles:
 * - Natural, responsive feedback
 * - Different patterns for different interaction types
 * - Performance-optimized with debouncing
 * - User preference-based enabling/disabling
 */

export type HapticPattern = 
  | 'light'       // Light tap (button press, toggle)
  | 'medium'      // Medium tap (card selection, swipe action)
  | 'heavy'       // Heavy tap (long press, drag start)
  | 'success'     // Success feedback (task complete, save)
  | 'warning'     // Warning feedback (validation error, limit reached)
  | 'error'       // Error feedback (failed action, network error)
  | 'selection'   // Selection change (picker scroll, slider adjust)
  | 'impact'      // Impact (card snap, page change)
  | 'notification'; // Notification arrival

/**
 * Haptic pattern configurations
 * Maps patterns to Vibration API values
 */
const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [30, 100, 30, 100, 30],
  selection: 5,
  impact: 15,
  notification: [20, 100, 20, 100, 20],
};

/**
 * Haptic intensity levels
 */
export type HapticIntensity = 'off' | 'light' | 'medium' | 'strong';

/**
 * Haptic preferences stored in localStorage
 */
interface HapticPreferences {
  enabled: boolean;
  intensity: HapticIntensity;
}

/**
 * Default haptic preferences
 */
const DEFAULT_PREFERENCES: HapticPreferences = {
  enabled: true,
  intensity: 'medium',
};

/**
 * Local storage key for preferences
 */
const PREFERENCES_KEY = 'webos-haptic-preferences';

/**
 * Check if Vibration API is available
 */
export function isHapticSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Get haptic preferences from localStorage
 */
export function getHapticPreferences(): HapticPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load haptic preferences:', error);
  }
  
  return DEFAULT_PREFERENCES;
}

/**
 * Save haptic preferences to localStorage
 */
export function setHapticPreferences(preferences: Partial<HapticPreferences>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getHapticPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save haptic preferences:', error);
  }
}

/**
 * Adjust haptic pattern based on intensity preference
 */
function adjustPatternForIntensity(
  pattern: number | number[],
  intensity: HapticIntensity
): number | number[] {
  if (intensity === 'off') return 0;
  
  const multiplier = {
    light: 0.5,
    medium: 1.0,
    strong: 1.5,
  }[intensity];
  
  if (Array.isArray(pattern)) {
    return pattern.map(v => Math.round(v * multiplier));
  }
  
  return Math.round(pattern * multiplier);
}

/**
 * Debounce map to prevent rapid-fire haptics
 */
const debounceMap = new Map<string, number>();

/**
 * Trigger haptic feedback
 * 
 * @param pattern - The type of haptic pattern to trigger
 * @param options - Optional configuration
 */
export function triggerHaptic(
  pattern: HapticPattern,
  options: {
    force?: boolean;           // Force haptic even if debounced
    debounceMs?: number;       // Debounce duration (default: 50ms)
    customPattern?: number | number[]; // Custom vibration pattern
  } = {}
): void {
  // Check if haptics are supported
  if (!isHapticSupported()) return;
  
  // Get preferences
  const preferences = getHapticPreferences();
  if (!preferences.enabled || preferences.intensity === 'off') return;
  
  // Debounce rapid haptics (prevent battery drain)
  const now = Date.now();
  const debounceMs = options.debounceMs ?? 50;
  const lastTrigger = debounceMap.get(pattern);
  
  if (!options.force && lastTrigger && now - lastTrigger < debounceMs) {
    return;
  }
  
  debounceMap.set(pattern, now);
  
  // Get and adjust pattern
  const rawPattern = options.customPattern ?? HAPTIC_PATTERNS[pattern];
  const adjustedPattern = adjustPatternForIntensity(rawPattern, preferences.intensity);
  
  // Trigger vibration
  try {
    navigator.vibrate(adjustedPattern);
  } catch (error) {
    console.warn('Failed to trigger haptic feedback:', error);
  }
}

/**
 * Stop any ongoing haptic feedback
 */
export function stopHaptic(): void {
  if (!isHapticSupported()) return;
  
  try {
    navigator.vibrate(0);
  } catch (error) {
    console.warn('Failed to stop haptic feedback:', error);
  }
}

/**
 * Haptic feedback helpers for common interactions
 */
export const Haptics = {
  // Button interactions
  tap: () => triggerHaptic('light'),
  press: () => triggerHaptic('medium'),
  longPress: () => triggerHaptic('heavy'),
  
  // List interactions
  select: () => triggerHaptic('selection'),
  scroll: () => triggerHaptic('selection', { debounceMs: 100 }),
  
  // Drag interactions
  dragStart: () => triggerHaptic('medium'),
  dragEnd: () => triggerHaptic('light'),
  drop: () => triggerHaptic('impact'),
  
  // Swipe interactions
  swipe: () => triggerHaptic('medium'),
  swipeEdge: () => triggerHaptic('impact'),
  
  // Card interactions
  cardOpen: () => triggerHaptic('medium'),
  cardClose: () => triggerHaptic('light'),
  cardSnap: () => triggerHaptic('impact'),
  cardDismiss: () => triggerHaptic('medium'),
  
  // Gesture interactions
  pinchStart: () => triggerHaptic('light'),
  pinchEnd: () => triggerHaptic('light'),
  rotate: () => triggerHaptic('selection', { debounceMs: 100 }),
  
  // Toggle interactions
  toggle: (isOn: boolean) => triggerHaptic(isOn ? 'medium' : 'light'),
  switch: () => triggerHaptic('medium'),
  
  // Form interactions
  input: () => triggerHaptic('selection'),
  submit: () => triggerHaptic('medium'),
  clear: () => triggerHaptic('light'),
  
  // Feedback
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  
  // Navigation
  navigate: () => triggerHaptic('medium'),
  back: () => triggerHaptic('light'),
  
  // Notifications
  notification: () => triggerHaptic('notification'),
  
  // App launcher
  appLaunch: () => triggerHaptic('medium'),
  appClose: () => triggerHaptic('light'),
  appSwitch: () => triggerHaptic('selection'),
  
  // System
  refresh: () => triggerHaptic('medium'),
  load: () => triggerHaptic('light'),
  
  // Accessibility
  focus: () => triggerHaptic('selection', { debounceMs: 200 }),
  
  // Custom
  custom: (pattern: number | number[]) => 
    triggerHaptic('light', { customPattern: pattern }),
};

/**
 * Toggle haptic feedback on/off
 */
export function toggleHaptics(enabled?: boolean): boolean {
  const current = getHapticPreferences();
  const newEnabled = enabled ?? !current.enabled;
  setHapticPreferences({ enabled: newEnabled });
  return newEnabled;
}

/**
 * Set haptic intensity
 */
export function setHapticIntensity(intensity: HapticIntensity): void {
  setHapticPreferences({ intensity });
  // Trigger a test haptic at the new intensity
  if (intensity !== 'off') {
    setTimeout(() => triggerHaptic('medium', { force: true }), 100);
  }
}

/**
 * Export all haptic utilities
 */
export default {
  isHapticSupported,
  getHapticPreferences,
  setHapticPreferences,
  triggerHaptic,
  stopHaptic,
  toggleHaptics,
  setHapticIntensity,
  Haptics,
};
