
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoomOSDrawerItemProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/**
 * LoomOS Drawer Item
 * 
 * Expandable/collapsible list item with smooth animations.
 * Reference: list-items-examples.png
 * 
 * @example
 * <LoomOSDrawerItem 
 *   title="Account Settings"
 *   defaultOpen={false}
 * >
 *   <SettingsContent />
 * </LoomOSDrawerItem>
 * 
 * <LoomOSDrawerItem 
 *   title="Advanced"
 *   icon={<Settings className="w-5 h-5" />}
 *   expanded={isExpanded}
 *   onToggle={setIsExpanded}
 * >
 *   <AdvancedSettings />
 * </LoomOSDrawerItem>
 */
export function LoomOSDrawerItem({
  title,
  icon,
  children,
  defaultOpen = false,
  expanded,
  onToggle,
  className,
  headerClassName,
  contentClassName
}: LoomOSDrawerItemProps) {
  // Controlled or uncontrolled state
  const [internalExpanded, setInternalExpanded] = useState(defaultOpen);
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  
  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (onToggle) {
      onToggle(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  // Check if icon is a component type (function)
  const isIconComponent = typeof icon === 'function';
  const IconComponent = isIconComponent ? (icon as React.ComponentType<{ className?: string }>) : null;

  return (
    <div
      className={cn(
        'border-b border-neutral-200 dark:border-neutral-700',
        className
      )}
      data-state={isExpanded ? 'open' : 'closed'}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3',
          'transition-colors duration-200',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          'focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800',
          'active:bg-neutral-200 dark:active:bg-neutral-700',
          headerClassName
        )}
        aria-expanded={isExpanded}
        aria-controls={`drawer-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 text-neutral-600 dark:text-neutral-400">
            {IconComponent ? <IconComponent className="w-5 h-5" /> : <>{icon}</>}
          </div>
        )}
        
        {/* Title */}
        <span className="flex-1 text-left text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </span>
        
        {/* Expand Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex-shrink-0 text-neutral-500 dark:text-neutral-400"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`drawer-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.1
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                },
                opacity: {
                  duration: 0.15
                }
              }
            }}
            className={cn(
              'overflow-hidden',
              contentClassName
            )}
          >
            <div className="px-4 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

LoomOSDrawerItem.displayName = 'LoomOSDrawerItem';
