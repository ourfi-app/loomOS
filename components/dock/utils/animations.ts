/**
 * Framer Motion animation variants for the Unified Dock
 */

import { Variants } from 'framer-motion';
import { DOCK_ANIMATIONS } from './constants';

/**
 * Dock container variants (entrance/exit)
 */
export const dockContainerVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.default.stiffness,
      damping: DOCK_ANIMATIONS.default.damping,
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Dock variants for vertical orientation
 */
export const dockContainerVerticalVariants: Variants = {
  hidden: (position: 'left' | 'right') => ({
    x: position === 'left' ? -100 : 100,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.default.stiffness,
      damping: DOCK_ANIMATIONS.default.damping,
    },
  },
  exit: (position: 'left' | 'right') => ({
    x: position === 'left' ? -100 : 100,
    opacity: 0,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  }),
};

/**
 * Dock inner container variants (drag over effect)
 */
export const dockInnerVariants: Variants = {
  normal: {
    scale: 1,
  },
  dragOver: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.item.stiffness,
      damping: DOCK_ANIMATIONS.item.damping,
    },
  },
};

/**
 * Dock item variants (hover/tap/drag)
 */
export const dockItemVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.2,
    y: -8,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.item.stiffness,
      damping: DOCK_ANIMATIONS.item.damping,
    },
  },
  tap: {
    scale: 1.05,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
  drag: {
    scale: 1.1,
    opacity: 0.7,
    zIndex: 1000,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Dock item vertical variants
 */
export const dockItemVerticalVariants: Variants = {
  idle: {
    scale: 1,
    x: 0,
  },
  hover: {
    scale: 1.2,
    x: -8,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.item.stiffness,
      damping: DOCK_ANIMATIONS.item.damping,
    },
  },
  tap: {
    scale: 1.05,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
  drag: {
    scale: 1.1,
    opacity: 0.7,
    zIndex: 1000,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Running indicator variants
 */
export const indicatorVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Minimized badge variants
 */
export const minimizedBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.item.stiffness,
      damping: DOCK_ANIMATIONS.item.damping,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Separator variants (fade in/out)
 */
export const separatorVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DOCK_ANIMATIONS.default.duration / 1000,
    },
  },
};

/**
 * Gesture button variants
 */
export const gestureButtonVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DOCK_ANIMATIONS.default.duration / 1000,
    },
  },
  pulse: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Tooltip variants
 */
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Context menu variants
 */
export const contextMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: DOCK_ANIMATIONS.fast.duration / 1000,
    },
  },
};

/**
 * Stagger children animation
 */
export const staggerChildrenVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: DOCK_ANIMATIONS.default.stagger / 1000,
    },
  },
};

/**
 * Stagger item animation
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DOCK_ANIMATIONS.default.duration / 1000,
    },
  },
};

/**
 * Loom icon variants (special animation for looms)
 */
export const loomIconVariants: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.2,
    y: -8,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.item.stiffness,
      damping: DOCK_ANIMATIONS.item.damping,
      rotate: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  },
  tap: {
    scale: 1.05,
  },
};

/**
 * App launcher button variants (special rotation)
 */
export const appLauncherVariants: Variants = {
  closed: {
    rotate: 0,
  },
  open: {
    rotate: 180,
    transition: {
      type: 'spring',
      stiffness: DOCK_ANIMATIONS.default.stiffness,
      damping: DOCK_ANIMATIONS.default.damping / 2,
    },
  },
};
