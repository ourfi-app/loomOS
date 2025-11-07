
/**
 * Standardized Animation Timing Configuration
 * Use these constants throughout the app for consistent feel
 * These align with Tailwind's default duration classes
 */

export const ANIMATION_DURATION = {
  // Micro interactions (hover, focus, small changes) - duration-150
  micro: 150,
  
  // UI transitions (dropdowns, tooltips, small components) - duration-200
  ui: 200,
  
  // Page transitions (cards, panels, larger components) - duration-300
  transition: 300,
  
  // Modals and overlays - duration-500
  modal: 500,
  
  // Page loads and heavy transitions - duration-700
  page: 700,
} as const;

/**
 * Desktop-optimized animation durations
 * Slightly faster for more responsive feel on desktop
 */
export const DESKTOP_ANIMATION_DURATION = {
  // Hover feedback - very fast
  hover: 150,
  
  // Button clicks and toggles
  interaction: 200,
  
  // Panel slides and transitions
  transition: 250,
  
  // Modal appearances
  modal: 350,
  
  // Page loads
  pageLoad: 450,
} as const;

export const ANIMATION_EASING = {
  // Standard easing for most interactions
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // Accelerated (elements entering screen)
  enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // Decelerated (elements exiting screen)
  exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Sharp (quick transitions)
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  
  // Emphasized (attention-grabbing)
  emphasized: 'cubic-bezier(0.2, 0.0, 0, 1)',
} as const;

/**
 * Get CSS transition string
 * @param properties - CSS properties to transition (e.g., ['opacity', 'transform'])
 * @param duration - Duration key from ANIMATION_DURATION
 * @param easing - Easing key from ANIMATION_EASING
 */
export function getTransition(
  properties: string[],
  duration: keyof typeof ANIMATION_DURATION = 'ui',
  easing: keyof typeof ANIMATION_EASING = 'standard'
): string {
  const durationMs = ANIMATION_DURATION[duration];
  const easingFn = ANIMATION_EASING[easing];
  return properties.map(prop => `${prop} ${durationMs}ms ${easingFn}`).join(', ');
}

/**
 * Get Tailwind animation duration class
 */
export function getTailwindDuration(duration: keyof typeof ANIMATION_DURATION): string {
  return `duration-${ANIMATION_DURATION[duration]}`;
}

/**
 * Common animation classes for Tailwind
 */
export const ANIMATION_CLASSES = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-350',
  fadeOut: 'animate-out fade-out duration-250',
  
  // Slide animations
  slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-350',
  slideInFromTop: 'animate-in slide-in-from-top-4 duration-350',
  slideInFromLeft: 'animate-in slide-in-from-left-4 duration-350',
  slideInFromRight: 'animate-in slide-in-from-right-4 duration-350',
  
  // Zoom animations
  zoomIn: 'animate-in zoom-in-95 duration-350',
  zoomOut: 'animate-out zoom-out-95 duration-250',
  
  // Combined animations
  fadeSlideIn: 'animate-in fade-in slide-in-from-bottom-4 duration-350',
  fadeZoomIn: 'animate-in fade-in zoom-in-95 duration-350',
  
  // Hover effects (use with transition classes)
  hoverScale: 'transition-transform duration-150 hover:scale-105 active:scale-95',
  hoverOpacity: 'transition-opacity duration-150 hover:opacity-80',
  hoverShadow: 'transition-shadow duration-250 hover:shadow-lg',
  
  // Desktop-optimized hover effects
  hoverLift: 'transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  hoverHighlight: 'transition-colors duration-150 hover:bg-gray-50',
  hoverElevate: 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
  
  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
} as const;

/**
 * Framer Motion animation variants for staggered lists
 */
export const LIST_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  },
};

/**
 * Page transition variants
 */
export const PAGE_TRANSITION_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

/**
 * Modal/Dialog animation variants
 */
export const MODAL_ANIMATION_VARIANTS = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  content: {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  },
};
