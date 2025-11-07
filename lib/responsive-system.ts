
/**
 * LoomOS-Inspired Responsive Design System
 * 
 * This system provides comprehensive device size responsiveness based on LoomOS principles:
 * - Coherent Adaptability: UI adapts intelligently to screen size and input method
 * - Multi-pane layouts that collapse/expand gracefully
 * - Touch-optimized sizing on mobile, precision on desktop
 * - Consistent spatial relationships across breakpoints
 */

/**
 * Responsive Breakpoints
 * Following LoomOS principle of "Coherent Adaptability"
 */
export const BREAKPOINTS = {
  // Mobile (Phone - Portrait)
  mobile: {
    min: 0,
    max: 639,
    label: 'Mobile',
    description: 'Phone portrait mode',
    icon: '📱',
    inputMethod: 'touch',
  },
  
  // Mobile Landscape / Small Tablet
  mobileLandscape: {
    min: 640,
    max: 767,
    label: 'Mobile Landscape',
    description: 'Phone landscape or small tablet',
    icon: '📱',
    inputMethod: 'touch',
  },
  
  // Tablet (iPad Portrait)
  tablet: {
    min: 768,
    max: 1023,
    label: 'Tablet',
    description: 'Tablet portrait mode',
    icon: '📲',
    inputMethod: 'touch',
  },
  
  // Desktop / Tablet Landscape
  desktop: {
    min: 1024,
    max: 1279,
    label: 'Desktop',
    description: 'Small desktop or tablet landscape',
    icon: '💻',
    inputMethod: 'mouse',
  },
  
  // Large Desktop
  desktopLarge: {
    min: 1280,
    max: 1535,
    label: 'Large Desktop',
    description: 'Standard desktop monitor',
    icon: '🖥️',
    inputMethod: 'mouse',
  },
  
  // Extra Large Desktop
  desktopXL: {
    min: 1536,
    max: Infinity,
    label: 'XL Desktop',
    description: 'Large desktop monitor',
    icon: '🖥️',
    inputMethod: 'mouse',
  },
} as const;

/**
 * Touch Target Sizes (LoomOS Principle: Easy touch targeting)
 * Minimum 44px for touch, can be smaller for mouse
 */
export const TOUCH_TARGETS = {
  mobile: {
    minimum: 'min-h-[44px] min-w-[44px]',
    button: 'h-12 px-6',
    icon: 'w-6 h-6',
    iconButton: 'w-12 h-12',
  },
  tablet: {
    minimum: 'min-h-[40px] min-w-[40px]',
    button: 'h-11 px-5',
    icon: 'w-5 h-5',
    iconButton: 'w-11 h-11',
  },
  desktop: {
    minimum: 'min-h-[36px] min-w-[36px]',
    button: 'h-10 px-4',
    icon: 'w-5 h-5',
    iconButton: 'w-10 h-10',
  },
} as const;

/**
 * Responsive Spacing
 * Adapts padding, margin, and gaps based on screen size
 */
export const RESPONSIVE_SPACING = {
  // Container padding (outer edges)
  containerPadding: {
    mobile: 'px-4',
    tablet: 'px-6',
    desktop: 'px-8',
    desktopLarge: 'px-12',
  },
  
  // Content spacing (between elements)
  contentGap: {
    mobile: 'gap-3',
    tablet: 'gap-4',
    desktop: 'gap-6',
    desktopLarge: 'gap-8',
  },
  
  // Section spacing (between major sections)
  sectionGap: {
    mobile: 'gap-6',
    tablet: 'gap-8',
    desktop: 'gap-10',
    desktopLarge: 'gap-12',
  },
  
  // Card padding (internal spacing)
  cardPadding: {
    mobile: 'p-4',
    tablet: 'p-5',
    desktop: 'p-6',
    desktopLarge: 'p-8',
  },
} as const;

/**
 * Responsive Typography
 * Scales text appropriately for readability at each size
 */
export const RESPONSIVE_TYPOGRAPHY = {
  // Display titles (hero, page headers)
  display: {
    mobile: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
  },
  
  // Page titles
  h1: {
    mobile: 'text-xl md:text-2xl lg:text-3xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
  },
  
  // Section titles
  h2: {
    mobile: 'text-lg md:text-xl lg:text-2xl',
    weight: 'font-semibold',
    lineHeight: 'leading-snug',
  },
  
  // Subsection titles
  h3: {
    mobile: 'text-base md:text-lg lg:text-xl',
    weight: 'font-semibold',
    lineHeight: 'leading-snug',
  },
  
  // Body text
  body: {
    mobile: 'text-sm md:text-base',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
  },
  
  // Small text (captions, labels)
  small: {
    mobile: 'text-xs md:text-sm',
    weight: 'font-normal',
    lineHeight: 'leading-normal',
  },
  
  // Tiny text (helper text, timestamps)
  tiny: {
    mobile: 'text-[10px] md:text-xs',
    weight: 'font-normal',
    lineHeight: 'leading-normal',
  },
} as const;

/**
 * Responsive Layout Patterns
 * LoomOS-inspired multi-pane layouts that adapt gracefully
 */
export const LAYOUT_PATTERNS = {
  // Single column (mobile) → Multi-column (desktop)
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'md:grid-cols-3 lg:grid-cols-4',
    desktopLarge: 'xl:grid-cols-5 2xl:grid-cols-6',
  },
  
  // Master-detail pattern (LoomOS Email-style)
  masterDetail: {
    mobile: 'flex-col',  // Stack vertically on mobile
    tablet: 'sm:flex-row sm:divide-x',  // Side-by-side on tablet+
    masterWidth: 'sm:w-80 md:w-96',
    detailWidth: 'sm:flex-1',
  },
  
  // Sidebar layout
  sidebar: {
    mobile: 'flex-col',
    tablet: 'md:flex-row md:divide-x',
    sidebarWidth: 'md:w-64 lg:w-72 xl:w-80',
    contentWidth: 'md:flex-1',
  },
  
  // Dashboard grid
  dashboard: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    desktopLarge: 'xl:grid-cols-4',
  },
  
  // App grid (launcher)
  appGrid: {
    mobile: 'grid-cols-2',
    tablet: 'sm:grid-cols-3',
    desktop: 'md:grid-cols-4 lg:grid-cols-5',
    desktopLarge: 'xl:grid-cols-6 2xl:grid-cols-7',
  },
} as const;

/**
 * Responsive Component Sizing
 * Consistent sizing across different screen sizes
 */
export const RESPONSIVE_SIZES = {
  // App cards in launcher
  appCard: {
    mobile: 'h-20',
    tablet: 'sm:h-22',
    desktop: 'md:h-24',
    desktopLarge: 'lg:h-28',
  },
  
  // App icons
  appIcon: {
    mobile: 'w-6 h-6',
    tablet: 'sm:w-7 sm:h-7',
    desktop: 'md:w-8 md:h-8',
    desktopLarge: 'lg:w-10 lg:h-10',
  },
  
  // Dock items
  dockItem: {
    mobile: 'w-12 h-12',
    tablet: 'sm:w-14 sm:h-14',
    desktop: 'md:w-16 md:h-16',
    desktopLarge: 'lg:w-18 lg:h-18',
  },
  
  // Dock icon
  dockIcon: {
    mobile: 'w-6 h-6',
    tablet: 'sm:w-7 sm:h-7',
    desktop: 'md:w-8 md:h-8',
    desktopLarge: 'lg:w-9 lg:h-9',
  },
  
  // Avatar sizes
  avatar: {
    small: 'w-8 h-8',
    medium: 'w-10 h-10 sm:w-12 sm:h-12',
    large: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    xlarge: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  },
  
  // Dialog/Modal sizes
  dialog: {
    small: 'max-w-sm',
    medium: 'max-w-md sm:max-w-lg',
    large: 'max-w-lg sm:max-w-xl md:max-w-2xl',
    xlarge: 'max-w-xl sm:max-w-2xl md:max-w-4xl',
    full: 'max-w-full sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw]',
  },
  
  // Popover/Dropdown sizes
  popover: {
    small: 'w-48',
    medium: 'w-56 sm:w-64',
    large: 'w-64 sm:w-72 md:w-80',
    xlarge: 'w-72 sm:w-80 md:w-96',
  },
} as const;

/**
 * Responsive Visibility Classes
 * Show/hide elements based on screen size
 */
export const RESPONSIVE_VISIBILITY = {
  // Show only on mobile
  mobileOnly: 'block sm:hidden',
  
  // Hide on mobile
  hideMobile: 'hidden sm:block',
  
  // Show only on tablet
  tabletOnly: 'hidden sm:block md:hidden',
  
  // Hide on tablet
  hideTablet: 'block sm:hidden md:block',
  
  // Show only on desktop
  desktopOnly: 'hidden md:block',
  
  // Hide on desktop
  hideDesktop: 'block md:hidden',
  
  // Show on tablet and up
  tabletUp: 'hidden sm:block',
  
  // Show on desktop and up
  desktopUp: 'hidden md:block',
} as const;

/**
 * LoomOS Three-Zone UI Architecture
 * Adapts for different screen sizes
 */
export const UI_ZONES = {
  // Status bar height (top)
  statusBar: {
    mobile: 'h-10',
    tablet: 'sm:h-11',
    desktop: 'md:h-12',
  },
  
  // Gesture area height (bottom)
  gestureArea: {
    mobile: 'h-14',
    tablet: 'sm:h-16',
    desktop: 'md:h-18',
  },
  
  // Main content area (fills remaining space)
  mainContent: {
    mobile: 'flex-1 overflow-auto',
  },
  
  // Dock positioning
  dock: {
    mobile: 'bottom-4',
    tablet: 'sm:bottom-5',
    desktop: 'md:bottom-6',
  },
} as const;

/**
 * Responsive Animation Speeds
 * Faster animations on mobile, more elaborate on desktop
 */
export const RESPONSIVE_ANIMATIONS = {
  mobile: {
    fast: 'duration-100',
    normal: 'duration-200',
    slow: 'duration-300',
  },
  desktop: {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  },
} as const;

/**
 * Helper Functions
 */

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(width: number): keyof typeof BREAKPOINTS {
  if (width < BREAKPOINTS.mobileLandscape.min) return 'mobile';
  if (width < BREAKPOINTS.tablet.min) return 'mobileLandscape';
  if (width < BREAKPOINTS.desktop.min) return 'tablet';
  if (width < BREAKPOINTS.desktopLarge.min) return 'desktop';
  if (width < BREAKPOINTS.desktopXL.min) return 'desktopLarge';
  return 'desktopXL';
}

/**
 * Check if current device is touch-capable
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get appropriate touch target size based on device
 */
export function getTouchTargetSize(isTouchDevice: boolean) {
  return isTouchDevice ? TOUCH_TARGETS.mobile : TOUCH_TARGETS.desktop;
}

/**
 * Build responsive class string
 * Combines base classes with responsive variants
 */
export function buildResponsiveClasses(config: {
  base?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  desktopLarge?: string;
  desktopXL?: string;
}): string {
  const classes = [config.base || ''];
  
  if (config.mobile) classes.push(config.mobile);
  if (config.tablet) classes.push(`sm:${config.tablet}`);
  if (config.desktop) classes.push(`md:${config.desktop}`);
  if (config.desktopLarge) classes.push(`lg:${config.desktopLarge}`);
  if (config.desktopXL) classes.push(`xl:${config.desktopXL}`);
  
  return classes.filter(Boolean).join(' ');
}

/**
 * Get responsive spacing for containers
 */
export function getContainerSpacing(size: 'mobile' | 'tablet' | 'desktop' | 'desktopLarge' = 'mobile') {
  return RESPONSIVE_SPACING.containerPadding[size];
}

/**
 * Get responsive grid columns
 */
export function getGridColumns(pattern: keyof typeof LAYOUT_PATTERNS = 'grid') {
  const layout = LAYOUT_PATTERNS[pattern];
  return Object.values(layout).join(' ');
}

/**
 * Create responsive card classes
 */
export function getResponsiveCardClasses() {
  return {
    container: `
      ${RESPONSIVE_SPACING.cardPadding.mobile}
      ${RESPONSIVE_SIZES.appCard.mobile}
      rounded-xl
      shadow-md
      transition-all duration-300
      hover:scale-105 hover:shadow-xl
      active:scale-95
    `,
    icon: `
      ${RESPONSIVE_SIZES.appIcon.mobile}
    `,
    title: `
      ${RESPONSIVE_TYPOGRAPHY.h3.mobile}
      ${RESPONSIVE_TYPOGRAPHY.h3.weight}
    `,
    description: `
      ${RESPONSIVE_TYPOGRAPHY.small.mobile}
      ${RESPONSIVE_TYPOGRAPHY.small.weight}
    `,
  };
}

/**
 * Create responsive dock classes
 */
export function getResponsiveDockClasses() {
  return {
    container: `
      fixed
      ${UI_ZONES.dock.mobile}
      ${UI_ZONES.dock.tablet}
      ${UI_ZONES.dock.desktop}
      left-1/2
      -translate-x-1/2
      z-50
    `,
    item: `
      ${RESPONSIVE_SIZES.dockItem.mobile}
      ${RESPONSIVE_SIZES.dockItem.tablet}
      ${RESPONSIVE_SIZES.dockItem.desktop}
      ${RESPONSIVE_SIZES.dockItem.desktopLarge}
      rounded-2xl
      transition-all duration-300
      hover:scale-110
      active:scale-95
    `,
    icon: `
      ${RESPONSIVE_SIZES.dockIcon.mobile}
      ${RESPONSIVE_SIZES.dockIcon.tablet}
      ${RESPONSIVE_SIZES.dockIcon.desktop}
      ${RESPONSIVE_SIZES.dockIcon.desktopLarge}
    `,
  };
}

/**
 * Export type definitions
 */
export type Breakpoint = keyof typeof BREAKPOINTS;
export type LayoutPattern = keyof typeof LAYOUT_PATTERNS;
export type ComponentSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Default export with all responsive utilities
 */
export default {
  BREAKPOINTS,
  TOUCH_TARGETS,
  RESPONSIVE_SPACING,
  RESPONSIVE_TYPOGRAPHY,
  LAYOUT_PATTERNS,
  RESPONSIVE_SIZES,
  RESPONSIVE_VISIBILITY,
  UI_ZONES,
  RESPONSIVE_ANIMATIONS,
  getCurrentBreakpoint,
  isTouchDevice,
  getTouchTargetSize,
  buildResponsiveClasses,
  getContainerSpacing,
  getGridColumns,
  getResponsiveCardClasses,
  getResponsiveDockClasses,
};
