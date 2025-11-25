/**
 * Animation variants for Framer Motion
 */

import { Variants } from 'framer-motion';
import { ANIMATION_DURATION } from './constants';

/**
 * Backdrop fade animation
 */
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.backdrop / 1000,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.backdrop / 1000,
    },
  },
};

/**
 * Launcher container animation
 */
export const launcherVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
    },
  },
};

/**
 * App card animation with stagger
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * (ANIMATION_DURATION.stagger / 1000),
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
    },
  },
};

/**
 * App card hover animation
 */
export const cardHoverVariants: Variants = {
  hover: {
    scale: 1.05,
    y: -4,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
    },
  },
  tap: {
    scale: 0.95,
  },
};

/**
 * Tab content transition
 */
export const tabContentVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
    },
  },
};

/**
 * Empty state animation
 */
export const emptyStateVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
    },
  },
};

/**
 * Badge animation
 */
export const badgeVariants: Variants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

/**
 * List item animation
 */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * (ANIMATION_DURATION.stagger / 1000),
      duration: ANIMATION_DURATION.fast / 1000,
    },
  }),
};

/**
 * Slide up animation
 */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/**
 * Fade animation
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
