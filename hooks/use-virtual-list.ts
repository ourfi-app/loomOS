
'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Hook for managing virtual scrolling with Intersection Observer
 * Provides utilities for dynamic item rendering and scroll management
 */

export interface VirtualListConfig {
  itemCount: number;
  overscan?: number; // Number of items to render outside viewport
  estimatedItemHeight?: number;
}

export interface VirtualListReturn {
  visibleRange: { start: number; end: number };
  totalHeight: number;
  offsetTop: number;
  measureElement: (index: number, element: HTMLElement | null) => void;
}

/**
 * Custom hook for virtual scrolling
 * Uses dynamic height measurement for flexible layouts
 */
export function useVirtualList({
  itemCount,
  overscan = 5,
  estimatedItemHeight = 60
}: VirtualListConfig): VirtualListReturn {
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(800); // Default viewport height

  // Measure item height
  const measureElement = useCallback((index: number, element: HTMLElement | null) => {
    if (element && !itemHeights.has(index)) {
      const height = element.getBoundingClientRect().height;
      setItemHeights(prev => {
        const next = new Map(prev);
        next.set(index, height);
        return next;
      });
    }
  }, [itemHeights]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    let height = 0;
    for (let i = 0; i < itemCount; i++) {
      height += itemHeights.get(i) || estimatedItemHeight;
    }
    return height;
  }, [itemCount, itemHeights, estimatedItemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    let start = 0;
    let end = 0;
    let currentOffset = 0;

    // Find start index
    for (let i = 0; i < itemCount; i++) {
      const itemHeight = itemHeights.get(i) || estimatedItemHeight;
      if (currentOffset + itemHeight > scrollTop) {
        start = Math.max(0, i - overscan);
        break;
      }
      currentOffset += itemHeight;
    }

    // Find end index
    currentOffset = 0;
    for (let i = 0; i < itemCount; i++) {
      const itemHeight = itemHeights.get(i) || estimatedItemHeight;
      currentOffset += itemHeight;
      if (currentOffset > scrollTop + containerHeight) {
        end = Math.min(itemCount - 1, i + overscan);
        break;
      }
    }

    if (end === 0) end = itemCount - 1;

    return { start, end };
  }, [scrollTop, containerHeight, itemCount, itemHeights, estimatedItemHeight, overscan]);

  // Calculate offset for positioning
  const offsetTop = useMemo(() => {
    let offset = 0;
    for (let i = 0; i < visibleRange.start; i++) {
      offset += itemHeights.get(i) || estimatedItemHeight;
    }
    return offset;
  }, [visibleRange.start, itemHeights, estimatedItemHeight]);

  return {
    visibleRange,
    totalHeight,
    offsetTop,
    measureElement
  };
}

/**
 * Hook for scroll position tracking
 */
export function useScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    setScrollTop(target.scrollTop);
    setScrollHeight(target.scrollHeight);
    setClientHeight(target.clientHeight);
  }, []);

  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    isAtBottom: scrollTop + clientHeight >= scrollHeight - 10,
    isAtTop: scrollTop <= 10,
    handleScroll
  };
}

/**
 * Hook for infinite scroll
 */
export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  threshold = 0.8
) {
  const { ref, inView } = useInView({
    threshold,
  });

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  return { ref, inView };
}
