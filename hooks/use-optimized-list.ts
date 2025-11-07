
/**
 * Optimized List Hook
 * Provides virtual scrolling and efficient rendering for large lists
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { calculateVirtualScroll } from '@/lib/performance-utils';

export interface UseOptimizedListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useOptimizedList<T>(
  items: T[],
  options: UseOptimizedListOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible items based on scroll position
  const virtualData = useMemo(() => {
    return calculateVirtualScroll(
      scrollTop,
      containerHeight,
      itemHeight,
      items.length,
      overscan
    );
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(
      virtualData.visibleStartIndex,
      virtualData.visibleEndIndex + 1
    );
  }, [items, virtualData]);

  // Handle scroll event
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    visibleItems,
    virtualData,
    totalHeight: virtualData.totalHeight,
    offsetY: virtualData.offsetY,
  };
}

/**
 * Optimized Pagination Hook
 * Provides efficient pagination with prefetching
 */
export interface UseOptimizedPaginationOptions {
  pageSize: number;
  prefetchPages?: number;
}

export function useOptimizedPagination<T>(
  items: T[],
  options: UseOptimizedPaginationOptions
) {
  const { pageSize, prefetchPages = 1 } = options;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / pageSize);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, pageSize]);

  // Prefetch next pages for smoother navigation
  const prefetchedItems = useMemo(() => {
    const prefetchStart = currentPage * pageSize;
    const prefetchEnd = prefetchStart + (prefetchPages * pageSize);
    return items.slice(prefetchStart, prefetchEnd);
  }, [items, currentPage, pageSize, prefetchPages]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    totalPages,
    currentItems,
    prefetchedItems,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Optimized Search Hook
 * Provides debounced search with memoization
 */
export interface UseOptimizedSearchOptions {
  debounceMs?: number;
  minLength?: number;
}

export function useOptimizedSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  options: UseOptimizedSearchOptions = {}
) {
  const { debounceMs = 300, minLength = 0 } = options;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounce query updates
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs]);

  // Filter items based on debounced query
  const filteredItems = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minLength) {
      return items;
    }
    return items.filter(item => searchFn(item, debouncedQuery));
  }, [items, debouncedQuery, minLength, searchFn]);

  const isSearching = query !== debouncedQuery;

  return {
    query,
    setQuery,
    filteredItems,
    isSearching,
    hasResults: filteredItems.length > 0,
    resultCount: filteredItems.length,
  };
}
