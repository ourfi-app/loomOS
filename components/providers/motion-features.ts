/**
 * Framer Motion Features for LazyMotion
 *
 * This file exports the feature set that will be loaded dynamically
 * when the first animation runs.
 *
 * Using 'domMax' includes all animation features needed for web apps:
 * - Layout animations (layout prop)
 * - Drag gestures
 * - Pan gestures
 * - Hover/tap/focus gestures
 * - Scroll-triggered animations
 * - SVG path animations
 * - All transform properties
 *
 * Alternative feature sets:
 * - domAnimation: Basic animations only (~70 KB) - no layout/gestures
 * - domMax: All features (~90 KB) - recommended for most apps
 *
 * We use domMax because the app uses:
 * - Drag & drop (desktop-widget-card, swipeable-card)
 * - Pan gestures (swipe navigation, pull-to-refresh)
 * - Layout animations (card stacks, window animations)
 */

export { domMax as default } from 'framer-motion';
