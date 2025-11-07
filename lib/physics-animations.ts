
/**
 * Physics-based Animation Utilities for LoomOS
 * 
 * Provides spring physics and easing functions for natural, fluid animations
 * following LoomOS design principles
 */

import { Spring, Transition } from 'framer-motion';

/**
 * Predefined spring configurations for different interaction types
 */
export const SPRING_CONFIGS = {
  // Gentle, smooth springs for general UI
  soft: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
    mass: 0.8,
  },
  
  // Standard spring for most interactions
  default: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
  
  // Snappy spring for quick feedback
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 0.7,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 25,
    mass: 1.2,
    velocity: 10,
  },
  
  // Smooth spring for cards and panels
  smooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 28,
    mass: 1,
  },
  
  // Wobbly spring for emphasis
  wobbly: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 15,
    mass: 1.5,
  },
  
  // Stiff spring for precise animations
  stiff: {
    type: 'spring' as const,
    stiffness: 700,
    damping: 40,
    mass: 0.5,
  },
  
  // Slow, gentle spring for large elements
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
    mass: 1.2,
  },
} as const;

/**
 * Easing functions for tween animations
 */
export const EASING = {
  // Standard easings
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  
  // Custom easings for LoomOS feel
  webOS: [0.4, 0.0, 0.2, 1],
  webOSEmphasized: [0.4, 0.0, 0.6, 1],
  webOSDecelerated: [0.0, 0.0, 0.2, 1],
  webOSAccelerated: [0.4, 0.0, 1, 1],
  
  // Specialized easings
  anticipate: [0.7, -0.4, 0.4, 1.4],
  backIn: [0.36, 0, 0.66, -0.56],
  backOut: [0.34, 1.56, 0.64, 1],
  backInOut: [0.68, -0.6, 0.32, 1.6],
} as const;

/**
 * Duration presets (in seconds)
 */
export const DURATION = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

/**
 * Gesture-based animation configurations
 */
export const GESTURE_CONFIGS = {
  // Drag interactions
  drag: {
    dragElastic: 0.2,
    dragMomentum: true,
    dragTransition: { bounceStiffness: 600, bounceDamping: 20 },
  },
  
  // Swipe interactions
  swipe: {
    dragElastic: 0.1,
    dragMomentum: true,
    dragTransition: { bounceStiffness: 800, bounceDamping: 30 },
  },
  
  // Reorder interactions
  reorder: {
    dragElastic: 0,
    dragMomentum: false,
  },
  
  // Resize interactions
  resize: {
    dragElastic: 0.05,
    dragMomentum: false,
  },
} as const;

/**
 * Layout animation configurations
 */
export const LAYOUT_CONFIGS = {
  // Smooth layout transitions
  default: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35,
  },
  
  // Fast layout transitions
  fast: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 40,
  },
  
  // Gentle layout transitions
  gentle: {
    type: 'spring' as const,
    stiffness: 250,
    damping: 30,
  },
} as const;

/**
 * Preset animation variants for common patterns
 */
export const ANIMATION_VARIANTS = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: SPRING_CONFIGS.default,
  },
  
  // Scale in/out
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: SPRING_CONFIGS.snappy,
  },
  
  // Slide from bottom
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
    transition: SPRING_CONFIGS.smooth,
  },
  
  // Slide from top
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: SPRING_CONFIGS.smooth,
  },
  
  // Slide from left
  slideRight: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: SPRING_CONFIGS.smooth,
  },
  
  // Slide from right
  slideLeft: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
    transition: SPRING_CONFIGS.smooth,
  },
  
  // Bounce in
  bounceIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: SPRING_CONFIGS.bouncy,
  },
  
  // Rotate in
  rotateIn: {
    initial: { rotate: -180, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: 180, scale: 0, opacity: 0 },
    transition: SPRING_CONFIGS.smooth,
  },
  
  // Flip
  flip: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 },
    transition: SPRING_CONFIGS.default,
  },
  
  // Dock item entrance
  dockItem: {
    initial: { scale: 0, y: 50, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1 },
    exit: { scale: 0, y: 50, opacity: 0 },
    transition: SPRING_CONFIGS.bouncy,
  },
  
  // Card entrance
  card: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: SPRING_CONFIGS.smooth,
  },
  
  // Modal entrance
  modal: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: SPRING_CONFIGS.snappy,
  },
} as const;

/**
 * Calculate spring velocity based on distance and duration
 */
export function calculateVelocity(distance: number, duration: number): number {
  return distance / duration;
}

/**
 * Create a custom spring configuration
 */
export function createSpring(
  stiffness: number,
  damping: number,
  mass: number = 1,
  velocity: number = 0
): Spring {
  return {
    type: 'spring',
    stiffness,
    damping,
    mass,
    velocity,
  };
}

/**
 * Create a staggered children animation
 */
export function createStaggerTransition(
  delayBetween: number = 0.05,
  baseTransition: Transition = SPRING_CONFIGS.default
): Transition {
  return {
    ...baseTransition,
    staggerChildren: delayBetween,
    delayChildren: 0.1,
  };
}

/**
 * Interpolate between two values based on progress (0-1)
 */
export function interpolate(
  from: number,
  to: number,
  progress: number
): number {
  return from + (to - from) * progress;
}

/**
 * Apply easing function to a progress value (0-1)
 */
export function applyEasing(
  progress: number,
  easing: keyof typeof EASING
): number {
  // This is a simplified version - in production you'd use the actual cubic bezier calculation
  const easingCurve = EASING[easing];
  // For now, return progress as-is (linear)
  // In a real implementation, you'd calculate the cubic bezier value
  return progress;
}

/**
 * Create a rubberband effect for drag constraints
 */
export function rubberband(
  distance: number,
  dimension: number,
  constant: number = 0.15
): number {
  return (distance * dimension * constant) / (dimension + constant * distance);
}

/**
 * Calculate magnetic snap point
 */
export function magneticSnap(
  value: number,
  snapPoints: number[],
  threshold: number = 50
): number {
  for (const point of snapPoints) {
    if (Math.abs(value - point) < threshold) {
      return point;
    }
  }
  return value;
}

/**
 * Legacy exports for backward compatibility
 */
export const motionSpringPresets = SPRING_CONFIGS;

/**
 * Calculate momentum for scroll interactions
 */
export function calculateMomentum(
  current: number,
  velocity: number,
  friction: number = 0.95,
  timeStep: number = 16
): { position: number; velocity: number; distance: number } {
  let position = current;
  let vel = velocity;
  let totalDistance = 0;
  
  // Simulate momentum decay
  while (Math.abs(vel) > 0.1) {
    vel *= friction;
    position += vel * (timeStep / 1000);
    totalDistance += vel * (timeStep / 1000);
  }
  
  return {
    position,
    velocity: vel,
    distance: totalDistance,
  };
}

/**
 * Export all utilities
 */
export default {
  SPRING_CONFIGS,
  EASING,
  DURATION,
  GESTURE_CONFIGS,
  LAYOUT_CONFIGS,
  ANIMATION_VARIANTS,
  calculateVelocity,
  createSpring,
  createStaggerTransition,
  interpolate,
  applyEasing,
  rubberband,
  magneticSnap,
  motionSpringPresets,
  calculateMomentum,
};
