'use client';

import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loomOSTheme, layouts, animations } from '@/lib/loomos-design-system';
import { cn } from '@/lib/utils';

export interface LoomOSAppTemplateProps {
  // App metadata
  title: string;
  icon?: ReactNode;
  color?: string;

  // Three-pane content
  navigation?: ReactNode;
  content: ReactNode;
  details?: ReactNode;

  // Layout options
  showNavigation?: boolean;
  showDetails?: boolean;
  navigationWidth?: number;
  contentWidth?: number;

  // Header actions
  headerActions?: ReactNode;

  // Callbacks
  onNavigationToggle?: (visible: boolean) => void;
  onDetailsToggle?: (visible: boolean) => void;

  className?: string;
}

/**
 * LoomOSAppTemplate
 *
 * The signature loomOS three-pane layout template.
 * Provides a consistent, beautiful interface for all apps.
 *
 * Layout Structure:
 * ┌─────────────┬──────────────┬────────────────┐
 * │             │              │                │
 * │ Navigation  │   Content    │    Details     │
 * │    Pane     │     Pane     │     Pane       │
 * │             │              │                │
 * │   (Lists,   │  (Main view  │  (Item info,   │
 * │   filters)  │   or grid)   │   metadata)    │
 * │             │              │                │
 * └─────────────┴──────────────┴────────────────┘
 */
export function LoomOSAppTemplate({
  title,
  icon,
  color = loomOSTheme.colors.accent,
  navigation,
  content,
  details,
  showNavigation = true,
  showDetails = true,
  navigationWidth = layouts.threePaneLayout.navigation.defaultWidth,
  contentWidth = layouts.threePaneLayout.list.defaultWidth,
  headerActions,
  onNavigationToggle,
  onDetailsToggle,
  className,
}: LoomOSAppTemplateProps) {
  const [isNavigationVisible, setIsNavigationVisible] = useState(showNavigation);
  const [isDetailsVisible, setIsDetailsVisible] = useState(showDetails);

  const toggleNavigation = () => {
    const newState = !isNavigationVisible;
    setIsNavigationVisible(newState);
    onNavigationToggle?.(newState);
  };

  const toggleDetails = () => {
    const newState = !isDetailsVisible;
    setIsDetailsVisible(newState);
    onDetailsToggle?.(newState);
  };

  return (
    <div className={cn('loomos-app-container h-full flex flex-col bg-[var(--semantic-surface-hover)]', className)}>
      {/* App Header */}
      <div
        className="loomos-app-header flex items-center gap-3 px-4 py-3 border-b border-[var(--semantic-border-light)]"
        style={{ backgroundColor: color }}
      >
        {/* Navigation Toggle */}
        {navigation && (
          <motion.button
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
            onClick={toggleNavigation}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}

        {/* App Icon */}
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center text-white">
            {icon}
          </div>
        )}

        {/* App Title */}
        <h1 className="text-lg font-semibold text-white flex-1">
          {title}
        </h1>

        {/* Header Actions */}
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}

        {/* Details Toggle */}
        {details && (
          <motion.button
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
            onClick={toggleDetails}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle details"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Three-Pane Layout */}
      <div className="loomos-pane-container flex flex-1 overflow-hidden">
        {/* Navigation Pane */}
        <AnimatePresence>
          {navigation && isNavigationVisible && (
            <motion.div
              className="loomos-pane loomos-navigation-pane bg-white border-r border-[var(--semantic-border-light)] overflow-y-auto"
              style={{
                minWidth: layouts.threePaneLayout.navigation.minWidth,
                maxWidth: layouts.threePaneLayout.navigation.maxWidth,
                width: navigationWidth,
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: navigationWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {navigation}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Pane */}
        <div
          className="loomos-pane loomos-content-pane bg-[var(--semantic-bg-subtle)] overflow-y-auto flex-1"
          style={{
            minWidth: layouts.threePaneLayout.list.minWidth,
          }}
        >
          {content}
        </div>

        {/* Details Pane */}
        <AnimatePresence>
          {details && isDetailsVisible && (
            <motion.div
              className="loomos-pane loomos-detail-pane bg-white border-l border-[var(--semantic-border-light)] overflow-y-auto"
              style={{
                minWidth: layouts.threePaneLayout.detail.minWidth,
                flex: layouts.threePaneLayout.detail.flex,
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {details}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * LoomOSNavigationItem
 *
 * Navigation item for the navigation pane
 */
export interface NavigationItemProps {
  icon?: ReactNode;
  label: string;
  badge?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function LoomOSNavigationItem({
  icon,
  label,
  badge,
  isActive = false,
  onClick,
}: NavigationItemProps) {
  return (
    <motion.button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        isActive
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-bg-subtle)]'
      )}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      {icon && (
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
      )}

      {/* Label */}
      <span className="flex-1 truncate">{label}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full min-w-[20px] text-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </motion.button>
  );
}

/**
 * LoomOSContentList
 *
 * List view for the content pane
 */
export interface ContentListProps {
  children: ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function LoomOSContentList({
  children,
  emptyMessage = 'No items to display',
  className,
}: ContentListProps) {
  const childArray = React.Children.toArray(children);

  if (childArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-[var(--semantic-text-tertiary)]">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('loomos-content-list divide-y divide-gray-200', className)}>
      {children}
    </div>
  );
}

/**
 * LoomOSContentListItem
 *
 * List item for the content list
 */
export interface ContentListItemProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  metadata?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function LoomOSContentListItem({
  title,
  subtitle,
  icon,
  metadata,
  isSelected = false,
  onClick,
}: ContentListItemProps) {
  return (
    <motion.button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        isSelected
          ? 'bg-blue-50 border-l-4 border-blue-500'
          : 'hover:bg-[var(--semantic-bg-subtle)] border-l-4 border-transparent'
      )}
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
    >
      {/* Icon */}
      {icon && (
        <div className="w-10 h-10 flex items-center justify-center bg-[var(--semantic-surface-hover)] rounded-lg flex-shrink-0">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[var(--semantic-text-primary)] truncate">{title}</div>
        {subtitle && (
          <div className="text-sm text-[var(--semantic-text-tertiary)] truncate">{subtitle}</div>
        )}
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="text-xs text-[var(--semantic-text-tertiary)] flex-shrink-0">
          {metadata}
        </div>
      )}
    </motion.button>
  );
}

/**
 * LoomOSDetailPane
 *
 * Detail pane content wrapper
 */
export interface DetailPaneProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function LoomOSDetailPane({
  title,
  children,
  actions,
  className,
}: DetailPaneProps) {
  return (
    <div className={cn('loomos-detail-pane-content h-full flex flex-col', className)}>
      {/* Detail Header */}
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--semantic-border-light)]">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}

/**
 * LoomOSSection
 *
 * Section within detail pane or content area
 */
export interface SectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function LoomOSSection({ title, children, className }: SectionProps) {
  return (
    <div className={cn('loomos-section mb-6 last:mb-0', className)}>
      {title && (
        <h3 className="text-sm font-semibold text-[var(--semantic-text-secondary)] uppercase tracking-wide mb-3">
          {title}
        </h3>
      )}
      <div>{children}</div>
    </div>
  );
}
