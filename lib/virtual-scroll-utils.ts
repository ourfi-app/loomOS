
'use client';

/**
 * Utilities for virtual scrolling optimization
 */

export interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  isAtTop: boolean;
  isAtBottom: boolean;
  scrollPercentage: number;
}

/**
 * Calculate scroll metrics from a scroll container
 */
export function getScrollMetrics(element: HTMLElement): ScrollMetrics {
  const { scrollTop, scrollHeight, clientHeight } = element;
  const isAtTop = scrollTop <= 10;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
  const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    isAtTop,
    isAtBottom,
    scrollPercentage,
  };
}

/**
 * Smooth scroll to a specific position
 */
export function smoothScrollTo(
  element: HTMLElement,
  position: number,
  duration: number = 300
): Promise<void> {
  return new Promise((resolve) => {
    const start = element.scrollTop;
    const distance = position - start;
    const startTime = performance.now();

    function scroll() {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      element.scrollTop = start + distance * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(scroll);
  });
}

/**
 * Debounced scroll handler
 */
export function createDebouncedScrollHandler(
  callback: (element: HTMLElement) => void,
  delay: number = 150
): (element: HTMLElement) => void {
  let timeoutId: NodeJS.Timeout;

  return (element: HTMLElement) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(element), delay);
  };
}

/**
 * Throttled scroll handler
 */
export function createThrottledScrollHandler(
  callback: (element: HTMLElement) => void,
  delay: number = 100
): (element: HTMLElement) => void {
  let lastCall = 0;

  return (element: HTMLElement) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(element);
    }
  };
}

/**
 * Calculate visible items in viewport
 */
export interface VisibleItemsConfig {
  containerHeight: number;
  scrollTop: number;
  itemHeight: number;
  totalItems: number;
  overscan?: number;
}

export interface VisibleItemsResult {
  startIndex: number;
  endIndex: number;
  visibleCount: number;
  offsetBefore: number;
  offsetAfter: number;
}

export function calculateVisibleItems({
  containerHeight,
  scrollTop,
  itemHeight,
  totalItems,
  overscan = 3,
}: VisibleItemsConfig): VisibleItemsResult {
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount);

  const offsetBefore = startIndex * itemHeight;
  const offsetAfter = (totalItems - endIndex - 1) * itemHeight;

  return {
    startIndex,
    endIndex,
    visibleCount,
    offsetBefore,
    offsetAfter,
  };
}

/**
 * Dynamic item height tracker
 */
export class ItemHeightTracker {
  private heights: Map<number, number> = new Map();
  private defaultHeight: number;

  constructor(defaultHeight: number = 60) {
    this.defaultHeight = defaultHeight;
  }

  setHeight(index: number, height: number): void {
    this.heights.set(index, height);
  }

  getHeight(index: number): number {
    return this.heights.get(index) || this.defaultHeight;
  }

  getTotalHeight(itemCount: number): number {
    let total = 0;
    for (let i = 0; i < itemCount; i++) {
      total += this.getHeight(i);
    }
    return total;
  }

  getOffsetTop(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.getHeight(i);
    }
    return offset;
  }

  clear(): void {
    this.heights.clear();
  }
}

/**
 * Virtual scroll state manager
 */
export interface VirtualScrollState {
  scrollTop: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  totalHeight: number;
}

export class VirtualScrollManager {
  private state: VirtualScrollState;
  private heightTracker: ItemHeightTracker;
  private containerHeight: number;
  private overscan: number;

  constructor(
    itemCount: number,
    defaultItemHeight: number = 60,
    containerHeight: number = 800,
    overscan: number = 3
  ) {
    this.heightTracker = new ItemHeightTracker(defaultItemHeight);
    this.containerHeight = containerHeight;
    this.overscan = overscan;

    this.state = {
      scrollTop: 0,
      visibleStartIndex: 0,
      visibleEndIndex: Math.min(
        itemCount - 1,
        Math.ceil(containerHeight / defaultItemHeight) + overscan
      ),
      totalHeight: itemCount * defaultItemHeight,
    };
  }

  updateScroll(scrollTop: number, itemCount: number): void {
    this.state.scrollTop = scrollTop;

    // Calculate visible range
    let currentOffset = 0;
    let startIndex = 0;

    for (let i = 0; i < itemCount; i++) {
      const itemHeight = this.heightTracker.getHeight(i);
      if (currentOffset + itemHeight > scrollTop) {
        startIndex = Math.max(0, i - this.overscan);
        break;
      }
      currentOffset += itemHeight;
    }

    // Calculate end index
    currentOffset = this.heightTracker.getOffsetTop(startIndex);
    let endIndex = startIndex;

    for (let i = startIndex; i < itemCount; i++) {
      currentOffset += this.heightTracker.getHeight(i);
      if (currentOffset > scrollTop + this.containerHeight) {
        endIndex = Math.min(itemCount - 1, i + this.overscan);
        break;
      }
    }

    if (endIndex === startIndex) {
      endIndex = itemCount - 1;
    }

    this.state.visibleStartIndex = startIndex;
    this.state.visibleEndIndex = endIndex;
    this.state.totalHeight = this.heightTracker.getTotalHeight(itemCount);
  }

  measureItem(index: number, height: number): void {
    this.heightTracker.setHeight(index, height);
  }

  getState(): VirtualScrollState {
    return { ...this.state };
  }

  getOffsetTop(index: number): number {
    return this.heightTracker.getOffsetTop(index);
  }
}
