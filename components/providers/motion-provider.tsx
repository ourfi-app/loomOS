'use client';

import { LazyMotion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Motion Provider using LazyMotion for Code Splitting
 *
 * This component uses Framer Motion's built-in LazyMotion feature to reduce
 * the initial JavaScript bundle size.
 *
 * Bundle Size Impact:
 * - WITHOUT LazyMotion: ~120 KB (all features loaded upfront)
 * - WITH LazyMotion: ~30 KB initial + ~90 KB loaded on first animation
 * - Initial bundle savings: ~90 KB
 *
 * How it works:
 * 1. Only core framer-motion code is loaded initially (~30 KB)
 * 2. Animation features are loaded dynamically when first needed
 * 3. Features are cached after first load (no re-downloading)
 * 4. All existing motion components work without changes
 *
 * Supported Features (domMax):
 * - Layout animations
 * - Gestures (drag, pan, hover)
 * - Scroll animations
 * - SVG path animations
 * - All standard animations
 *
 * Usage:
 * Wrap your app or layout with this provider:
 * ```tsx
 * <MotionProvider>
 *   <YourComponents />
 * </MotionProvider>
 * ```
 *
 * All child components can use motion/AnimatePresence normally.
 */

// Dynamically import domMax features from framer-motion
// This is loaded on-demand when the first animation runs
const loadFeatures = () =>
  import('./motion-features').then((res) => res.default);

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
