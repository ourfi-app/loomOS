// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * Momentum Scroll Hook
 * Provides inertial scrolling with physics-based deceleration
 */

import { useRef, useEffect, useCallback } from 'react';
import { calculateMomentum } from '@/lib/physics-animations';

export interface MomentumScrollOptions {
  friction?: number;
  threshold?: number;
  axis?: 'x' | 'y' | 'both';
  onScrollEnd?: () => void;
}

export function useMomentumScroll(
  options: MomentumScrollOptions = {}
) {
  const {
    friction = 0.95,
    threshold = 0.1,
    axis = 'y',
    onScrollEnd,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const isDraggingRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    isDraggingRef.current = true;
    const touch = e.touches[0];
    if (!touch) return;
    
    lastPosRef.current = { x: touch.clientX, y: touch.clientY };
    lastTimeRef.current = Date.now();
    velocityRef.current = { x: 0, y: 0 };

    // Cancel any ongoing momentum animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;
    
    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) || 1;

    const deltaX = touch.clientX - lastPosRef.current.x;
    const deltaY = touch.clientY - lastPosRef.current.y;

    // Calculate velocity (pixels per millisecond)
    velocityRef.current = {
      x: deltaX / deltaTime,
      y: deltaY / deltaTime,
    };

    // Update scroll position
    if (axis === 'y' || axis === 'both') {
      containerRef.current.scrollTop -= deltaY;
    }
    if (axis === 'x' || axis === 'both') {
      containerRef.current.scrollLeft -= deltaX;
    }

    lastPosRef.current = { x: touch.clientX, y: touch.clientY };
    lastTimeRef.current = now;
  }, [axis]);

  const animateMomentum = useCallback(() => {
    if (!containerRef.current) return;

    const { x: vx, y: vy } = velocityRef.current;
    
    // Apply friction
    velocityRef.current.x *= friction;
    velocityRef.current.y *= friction;

    // Check if velocity is below threshold
    const isBelowThreshold = Math.abs(vx) < threshold && Math.abs(vy) < threshold;

    if (isBelowThreshold) {
      onScrollEnd?.();
      return;
    }

    // Apply momentum scroll
    if (axis === 'y' || axis === 'both') {
      containerRef.current.scrollTop -= vy * 16; // Multiply by frame time
    }
    if (axis === 'x' || axis === 'both') {
      containerRef.current.scrollLeft -= vx * 16;
    }

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [friction, threshold, axis, onScrollEnd]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    
    // Start momentum animation if velocity is significant
    const { x, y } = velocityRef.current;
    if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
      animateMomentum();
    } else {
      onScrollEnd?.();
    }
  }, [threshold, animateMomentum, onScrollEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return containerRef;
}

/**
 * Simpler hook for enabling momentum scroll on an element
 */
export function useSimpleMomentumScroll(elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Enable smooth scrolling
    element.style.scrollBehavior = 'smooth';
    // @ts-expect-error - WebKit-specific property for iOS momentum scrolling
    element.style.webkitOverflowScrolling = 'touch';

    // Add CSS for better scroll performance
    element.style.willChange = 'scroll-position';
    element.style.transform = 'translateZ(0)'; // Force GPU acceleration

    return () => {
      element.style.scrollBehavior = '';
      // @ts-expect-error
      element.style.webkitOverflowScrolling = '';
      element.style.willChange = '';
      element.style.transform = '';
    };
  }, [elementRef]);
}
