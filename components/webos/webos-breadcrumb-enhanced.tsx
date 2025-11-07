
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface WebOSBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

/**
 * WebOS Breadcrumb Enhanced
 * 
 * Breadcrumb navigation with animations and responsive behavior.
 * Reference: hierarchical-and-sideways-nav.png, task-flow-navigation.png
 * 
 * @example
 * <WebOSBreadcrumb 
 *   items={[
 *     { label: 'Home', href: '/dashboard' },
 *     { label: 'Messages', href: '/messages' },
 *     { label: 'Inbox' }
 *   ]}
 *   showHome
 * />
 */
export function WebOSBreadcrumb({
  items,
  className,
  showHome = false,
  maxItems = 4
}: WebOSBreadcrumbProps) {
  // Truncate items if too many
  const displayItems = items.length > maxItems
    ? [
        items[0],
        { label: '...', href: undefined },
        ...items.slice(-(maxItems - 2))
      ].filter((item): item is NonNullable<typeof item> => item !== undefined)
    : items;

  return (
    <nav 
      className={cn('flex items-center gap-2', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {showHome && (
          <>
            <li>
              <Link
                href="/dashboard"
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded',
                  'text-sm text-neutral-600 dark:text-neutral-400',
                  'hover:text-neutral-900 dark:hover:text-neutral-100',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'transition-colors'
                )}
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            {displayItems.length > 0 && (
              <li className="text-neutral-400 dark:text-neutral-600">
                <ChevronRight className="w-4 h-4" />
              </li>
            )}
          </>
        )}

        {displayItems.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1 rounded',
                      'text-sm text-neutral-600 dark:text-neutral-400',
                      'hover:text-neutral-900 dark:hover:text-neutral-100',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'transition-colors'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className={cn(
                    'flex items-center gap-2 px-2 py-1',
                    'text-sm font-medium',
                    index === displayItems.length - 1
                      ? 'text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}>
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                )}
              </motion.div>
            </li>
            
            {index < displayItems.length - 1 && (
              <li className="text-neutral-400 dark:text-neutral-600">
                <ChevronRight className="w-4 h-4" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

/**
 * WebOS Breadcrumb Item Component (for manual composition)
 */
export interface WebOSBreadcrumbItemProps {
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
  className?: string;
}

export function WebOSBreadcrumbItem({
  children,
  href,
  icon,
  current,
  className
}: WebOSBreadcrumbItemProps) {
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (href && !current) {
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded',
          'text-sm text-neutral-600 dark:text-neutral-400',
          'hover:text-neutral-900 dark:hover:text-neutral-100',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          'transition-colors',
          className
        )}
        aria-current={current ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <span 
      className={cn(
        'flex items-center gap-2 px-2 py-1',
        'text-sm font-medium',
        current 
          ? 'text-neutral-900 dark:text-neutral-100' 
          : 'text-neutral-600 dark:text-neutral-400',
        className
      )}
      aria-current={current ? 'page' : undefined}
    >
      {content}
    </span>
  );
}

WebOSBreadcrumb.displayName = 'WebOSBreadcrumb';
WebOSBreadcrumbItem.displayName = 'WebOSBreadcrumbItem';
