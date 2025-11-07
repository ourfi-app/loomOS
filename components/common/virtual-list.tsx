
'use client';

import React, { forwardRef, useCallback, CSSProperties } from 'react';
import { Virtuoso, VirtuosoHandle, ListRange } from 'react-virtuoso';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimatedItemHeight?: number;
  className?: string;
  style?: CSSProperties;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  emptyState?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
  itemClassName?: string;
  onRangeChanged?: (range: ListRange) => void;
  increaseViewportBy?: number;
  atBottomThreshold?: number;
  followOutput?: boolean | 'smooth' | 'auto';
}

/**
 * Virtual List Component using react-virtuoso
 * Optimized for rendering large lists with dynamic item heights
 */
function VirtualListInner<T>(
  {
    items,
    renderItem,
    estimatedItemHeight = 60,
    className,
    style,
    overscan = 5,
    onEndReached,
    endReachedThreshold = 500,
    emptyState,
    header,
    footer,
    isLoading = false,
    loadingComponent,
    itemClassName,
    onRangeChanged,
    increaseViewportBy = 200,
    atBottomThreshold = 50,
    followOutput = false,
  }: VirtualListProps<T>,
  ref: React.Ref<VirtuosoHandle>
) {
  const itemContent = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return null;
      return (
        <div className={itemClassName}>
          {renderItem(item, index)}
        </div>
      );
    },
    [items, renderItem, itemClassName]
  );

  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
      <p className="text-lg">No items to display</p>
    </div>
  );

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (items.length === 0 && !isLoading) {
    return (
      <div className={cn('h-full', className)} style={style}>
        {emptyState || defaultEmptyState}
      </div>
    );
  }

  return (
    <Virtuoso
      ref={ref}
      data={items}
      itemContent={itemContent}
      defaultItemHeight={estimatedItemHeight}
      overscan={overscan}
      className={className}
      style={style}
      endReached={onEndReached}
      atBottomThreshold={atBottomThreshold}
      rangeChanged={onRangeChanged}
      increaseViewportBy={increaseViewportBy}
      followOutput={followOutput}
      components={{
        Header: header ? () => <>{header}</> : undefined,
        Footer: footer || isLoading ? () => <>{footer || (isLoading && (loadingComponent || defaultLoadingComponent))}</> : undefined,
      }}
    />
  );
}

export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtuosoHandle> }
) => React.ReactElement;

/**
 * Virtual Grid Component for grid layouts
 */
export interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns: number;
  estimatedItemHeight?: number;
  gap?: number;
  className?: string;
  style?: CSSProperties;
  onEndReached?: () => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  columns = 3,
  estimatedItemHeight = 200,
  gap = 16,
  className,
  style,
  onEndReached,
  emptyState,
  isLoading = false,
}: VirtualGridProps<T>) {
  // Group items into rows
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  const rowContent = useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row) return null;
      return (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {row.map((item, colIndex) => (
            <div key={index * columns + colIndex}>
              {renderItem(item, index * columns + colIndex)}
            </div>
          ))}
        </div>
      );
    },
    [rows, columns, gap, renderItem]
  );

  if (items.length === 0 && !isLoading) {
    return (
      <div className={cn('h-full', className)} style={style}>
        {emptyState || (
          <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
            <p className="text-lg">No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Virtuoso
      data={rows}
      itemContent={rowContent}
      defaultItemHeight={estimatedItemHeight}
      className={className}
      style={style}
      endReached={onEndReached}
      components={{
        Footer: isLoading ? () => (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : undefined,
      }}
    />
  );
}
