/**
 * loomOS Design System
 *
 * The liberation-focused design system inspired by webOS principles.
 * Beautiful, responsive, and activity-centric interface design.
 *
 * Core Principles:
 * - Activity-centric over app-centric
 * - Live card previews over static screenshots
 * - Physics-based animations for tangible feel
 * - Liberation from vendor lock-in
 * - Privacy-first architecture
 */

/**
 * loomOS Theme Configuration
 * Signature colors and design tokens
 */
export const loomOSTheme = {
  name: 'loomOS',

  // Color Palette - Liberation-focused branding
  colors: {
    // Signature loomOS Colors
    accent: '#F18825',         // loomOS signature orange - liberation & warmth
    primary: '#F18825',        // Trust blue - reliability & openness
    success: '#4CAF50',        // Growth green - freedom & progress
    warning: '#FF9800',        // Attention orange
    error: '#F44336',          // Alert red

    // Surface Colors
    surface: '#EAEAEA',        // Card background - soft & approachable
    surfaceElevated: '#FFFFFF', // Elevated surfaces
    background: '#E8E8E8',     // Main background

    // Chrome Colors
    chrome: {
      dark: '#333333',         // Dark chrome
      light: '#4C4C4C',        // Light chrome
      transparent: 'rgba(51, 51, 51, 0.95)', // Translucent chrome
    },

    // Text Colors
    text: {
      primary: '#1E1E1E',
      secondary: '#666666',
      tertiary: '#999999',
      inverse: '#FFFFFF',
      disabled: '#CCCCCC',
    },

    // Border Colors
    border: {
      light: '#E0E0E0',
      medium: '#CCCCCC',
      dark: '#999999',
    },

    // Status Colors
    status: {
      unread: '#F18825',
      important: '#F44336',
      archived: '#999999',
    },

    // Activity-specific colors
    activity: {
      email: '#4285F4',
      calendar: '#34A853',
      tasks: '#FBBC04',
      notes: '#EA4335',
      social: '#8E24AA',
    },
  },

  // Physics-based Animation System
  // These values create tangible, responsive interactions
  physics: {
    // Spring physics for natural motion
    spring: {
      stiffness: 300,          // How "tight" the spring is
      damping: 25,             // How much resistance/bounce
      mass: 1,                 // Weight of the element
    },

    // Gesture thresholds
    gesture: {
      velocityThreshold: 750,  // px/s needed for swipe actions (card dismissal)
      distanceThreshold: 100,  // px distance for swipe recognition
      flickVelocity: 300,      // px/s for quick flicks
    },

    // Timing functions (cubic-bezier curves)
    easing: {
      standard: [0.4, 0.0, 0.2, 1],        // Standard ease
      decelerate: [0.0, 0.0, 0.2, 1],      // Deceleration
      accelerate: [0.4, 0.0, 1, 1],        // Acceleration
      sharp: [0.4, 0.0, 0.6, 1],           // Sharp transition
      spring: [0.42, 0, 0.58, 1],          // Spring-like
    },

    // Duration presets (in ms)
    duration: {
      instant: 100,
      fast: 150,
      normal: 200,
      slow: 300,
      slower: 500,
      slowest: 700,
    },
  },

  // Spacing System (based on 4px grid)
  spacing: {
    touchTarget: 44,           // Minimum touch target size (iOS/Android standard)
    cardRadius: 8,             // Card corner radius
    cardPadding: 16,           // Standard card padding
    listItemHeight: 56,        // Standard list item height
    headerHeight: 56,          // App header height
    dockHeight: 72,            // Dock height
    gestureAreaHeight: 48,     // Bottom gesture area

    // Scale values
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
  },

  // Typography System
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },

    fontSize: {
      xs: 11,
      sm: 13,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },

    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.9)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.9), 0 1px 2px 0 rgba(0, 0, 0, 0.9)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.9), 0 2px 4px -1px rgba(0, 0, 0, 0.9)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.9), 0 4px 6px -2px rgba(0, 0, 0, 0.9)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.9)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    card: '0 2px 10px rgba(0, 0, 0, 0.9)',
    cardActive: '0 8px 20px rgba(0, 0, 0, 0.9)',
  },

  // Z-index Layering System
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    card: 10,
    cardActive: 20,
    dock: 100,
    gestureArea: 200,
  },

  // Breakpoints (responsive design)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

/**
 * Card States
 * Define visual states for interactive cards
 */
export const cardStates = {
  default: {
    scale: 1,
    opacity: 1,
    shadow: loomOSTheme.shadows.card,
  },
  minimized: {
    scale: 0.25,
    opacity: 0.9,
    shadow: loomOSTheme.shadows.sm,
  },
  maximized: {
    scale: 1,
    opacity: 1,
    shadow: loomOSTheme.shadows.xl,
  },
  active: {
    scale: 1,
    opacity: 1,
    shadow: loomOSTheme.shadows.cardActive,
  },
  hover: {
    scale: 1.02,
    opacity: 1,
    shadow: loomOSTheme.shadows.lg,
  },
} as const;

/**
 * Animation Presets
 * Reusable animation configurations for Framer Motion
 */
export const animations = {
  // Card animations
  card: {
    initial: { scale: 0.25, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.25, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: loomOSTheme.physics.spring.stiffness,
      damping: loomOSTheme.physics.spring.damping,
    },
  },

  // Dock icon animations
  dockIcon: {
    hover: { scale: 1.15, y: -5 },
    tap: { scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },

  // Slide in from bottom (modals, sheets)
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },

  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Scale in/out (popovers, tooltips)
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.15 },
  },

  // List item stagger
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  // Just Type search
  searchBar: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
} as const;

/**
 * Layout Configurations
 * Standard layout patterns for loomOS
 */
export const layouts = {
  // Three-pane layout (signature loomOS pattern)
  threePaneLayout: {
    navigation: {
      minWidth: 240,
      maxWidth: 300,
      defaultWidth: 260,
    },
    list: {
      minWidth: 300,
      maxWidth: 400,
      defaultWidth: 360,
    },
    detail: {
      minWidth: 400,
      flex: 1,
    },
  },

  // Card view layout
  cardView: {
    cardWidth: 280,
    cardHeight: 160,
    gap: 16,
    columns: {
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
    },
  },

  // Dock layout
  dock: {
    height: 72,
    iconSize: 56,
    gap: 12,
    padding: 8,
  },
} as const;

/**
 * Gesture Configurations
 * Touch and mouse gesture settings
 */
export const gestures = {
  // Swipe to dismiss (cards, notifications)
  swipeDismiss: {
    axis: 'y' as const,
    threshold: loomOSTheme.physics.gesture.distanceThreshold,
    velocity: loomOSTheme.physics.gesture.velocityThreshold,
    direction: 'down' as const,
  },

  // Swipe navigation (between cards)
  swipeNavigate: {
    axis: 'x' as const,
    threshold: 50,
    velocity: 500,
  },

  // Long press (context menu)
  longPress: {
    duration: 500, // ms
  },

  // Drag (reorder items)
  drag: {
    threshold: 5, // px before drag starts
    elastic: 0.2, // bounce factor
  },
} as const;

/**
 * Utility Functions
 */

/**
 * Convert theme value to CSS custom property
 */
export function toCSSVar(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/**
 * Get responsive value based on breakpoint
 */
export function getResponsiveValue<T>(
  values: { sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T },
  screenWidth: number
): T | undefined {
  if (screenWidth >= loomOSTheme.breakpoints['2xl'] && values['2xl']) return values['2xl'];
  if (screenWidth >= loomOSTheme.breakpoints.xl && values.xl) return values.xl;
  if (screenWidth >= loomOSTheme.breakpoints.lg && values.lg) return values.lg;
  if (screenWidth >= loomOSTheme.breakpoints.md && values.md) return values.md;
  if (screenWidth >= loomOSTheme.breakpoints.sm && values.sm) return values.sm;
  return undefined;
}

/**
 * Create spring animation config
 */
export function createSpring(
  stiffness: number = loomOSTheme.physics.spring.stiffness,
  damping: number = loomOSTheme.physics.spring.damping,
  mass: number = loomOSTheme.physics.spring.mass
) {
  return {
    type: 'spring' as const,
    stiffness,
    damping,
    mass,
  };
}

/**
 * Create ease animation config
 */
export function createEase(
  duration: number = loomOSTheme.physics.duration.normal,
  easing: number[] = loomOSTheme.physics.easing.standard
) {
  return {
    duration: duration / 1000, // Convert to seconds for Framer Motion
    ease: easing,
  };
}

export default loomOSTheme;
