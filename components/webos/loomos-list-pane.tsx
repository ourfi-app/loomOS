'use client';

import React, { ReactNode } from 'react';
import { LoomOSSearchInput } from './loomos-search-input';
import { VirtualList } from '@/components/common';

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  selected?: boolean;
  unread?: boolean;
  badge?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

interface LoomOSListPaneProps {
  title?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  items: ListItem[];
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  enableVirtualScrolling?: boolean;
  estimatedItemHeight?: number;
}

export function LoomOSListPane({
  title,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  items,
  emptyMessage = 'No items found',
  loading = false,
  className = '',
  enableVirtualScrolling = true, // Enable by default for performance
  estimatedItemHeight = 80
}: LoomOSListPaneProps) {
  const renderListItem = (item: ListItem) => (
    <div 
      key={item.id}
      className={`p-4 border-b border-[var(--semantic-border-light)] cursor-pointer transition-colors ${
        item.selected 
          ? 'bg-[var(--semantic-primary-subtle)] border-l-4 border-l-orange-500' 
          : 'hover:bg-[var(--semantic-bg-subtle)]'
      }`}
      onClick={item.onClick}
      onContextMenu={item.onContextMenu}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {item.icon && (
            <div className="flex-shrink-0 mt-0.5">
              {item.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm truncate ${
              item.unread ? 'font-semibold text-[var(--semantic-text-primary)]' : 'font-medium text-[var(--semantic-text-secondary)]'
            }`}>
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-sm text-[var(--semantic-text-secondary)] truncate mt-1">
                {item.subtitle}
              </p>
            )}
            {item.timestamp && (
              <p className="text-xs text-[var(--semantic-text-tertiary)] mt-1">
                {item.timestamp}
              </p>
            )}
          </div>
        </div>
        {item.badge && (
          <div className="ml-2 flex-shrink-0">
            {item.badge}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex-1 bg-white flex flex-col border-r border-[var(--semantic-border-medium)] min-w-[300px] ${className}`}>
      {/* Search Bar */}
      {onSearchChange && (
        <div className="p-3 border-b border-[var(--semantic-border-medium)] bg-[var(--semantic-bg-subtle)]">
          <LoomOSSearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
      )}
      
      {/* Title (optional) */}
      {title && (
        <div className="px-4 py-2 border-b border-[var(--semantic-border-light)] bg-[var(--semantic-bg-subtle)]">
          <h2 className="text-sm font-semibold text-[var(--semantic-text-secondary)]">{title}</h2>
        </div>
      )}
      
      {/* List Items */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-[var(--semantic-text-tertiary)]">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : enableVirtualScrolling && items.length > 20 ? (
          // Use virtual scrolling for large lists (>20 items)
          <VirtualList
            items={items}
            renderItem={renderListItem}
            estimatedItemHeight={estimatedItemHeight}
            className="h-full"
          />
        ) : (
          // Use traditional rendering for small lists
          <div className="overflow-y-auto h-full">
            {items.map(renderListItem)}
          </div>
        )}
      </div>
    </div>
  );
}
