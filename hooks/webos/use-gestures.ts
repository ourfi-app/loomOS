
import { useEffect, useRef, useState, useCallback } from 'react';

export interface GestureHandlers {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
}

export interface UseGesturesOptions {
  threshold?: number; // Minimum distance for swipe (px)
  velocityThreshold?: number; // Minimum velocity for flick (px/ms)
  longPressDelay?: number; // Delay for long press (ms)
  enablePinch?: boolean; // Enable pinch gesture
  preventScroll?: boolean; // Prevent default scroll behavior
}

export function useGestures(
  handlers: GestureHandlers,
  options: UseGesturesOptions = {}
) {
  const {
    threshold = 50,
    velocityThreshold = 0.65,
    longPressDelay = 500,
    enablePinch = false,
    preventScroll = false,
  } = options;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);
  const initialDistance = useRef<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isGesturing, setIsGesturing] = useState(false);

  // Calculate distance between two touch points for pinch gesture
  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2 || !touches[0] || !touches[1]) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    if (!touch) return;
    
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Handle pinch gesture initialization
    if (enablePinch && e.touches.length === 2) {
      initialDistance.current = getTouchDistance(e.touches);
      setIsGesturing(true);
    }

    // Start long press timer
    if (handlers.onLongPress && e.touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        handlers.onLongPress?.();
      }, longPressDelay);
    }
  }, [handlers, longPressDelay, enablePinch, preventScroll, getTouchDistance]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }

    // Cancel long press if finger moves significantly
    if (longPressTimer.current && touchStart.current) {
      const touch = e.touches[0];
      if (!touch) return;
      
      const deltaX = Math.abs(touch.clientX - touchStart.current.x);
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }

    // Handle pinch gesture
    if (enablePinch && e.touches.length === 2 && initialDistance.current && handlers.onPinch) {
      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance) {
        const scale = currentDistance / initialDistance.current;
        handlers.onPinch(scale);
      }
    }
  }, [handlers, enablePinch, preventScroll, getTouchDistance]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (isLongPressing) {
      setIsLongPressing(false);
      touchStart.current = null;
      return;
    }

    // Reset pinch gesture
    if (isGesturing) {
      setIsGesturing(false);
      initialDistance.current = null;
    }

    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check for double tap
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    if (distance < threshold && timeSinceLastTap < 300 && handlers.onDoubleTap) {
      handlers.onDoubleTap();
      lastTapTime.current = 0; // Reset to prevent triple tap
      touchStart.current = null;
      return;
    }

    // Single tap
    if (distance < threshold) {
      handlers.onTap?.();
      lastTapTime.current = currentTime;
      touchStart.current = null;
      return;
    }

    // Swipe gesture - determine direction
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal) {
      if (Math.abs(deltaX) > threshold && velocityX > velocityThreshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold && velocityY > velocityThreshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    touchStart.current = null;
  }, [handlers, threshold, velocityThreshold, isLongPressing, isGesturing]);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isGesturing: isLongPressing || isGesturing,
  };
}
