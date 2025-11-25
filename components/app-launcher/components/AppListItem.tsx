'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, FlaskConical, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AppListItemProps } from '../types';
import { AppContextMenu } from './AppContextMenu';
import { listItemVariants } from '../utils/animations';
import { A11Y_LABELS, CATEGORY_LABELS } from '../utils/constants';

export function AppListItem({
  app,
  isActive,
  isInDock,
  isFavorite,
  onClick,
  onContextAction,
  className,
}: AppListItemProps) {
  const IconComponent = app.icon;

  return (
    <AppContextMenu
      app={app}
      isInDock={isInDock}
      isFavorite={isFavorite}
      onAction={onContextAction}
    >
      <motion.button
        variants={listItemVariants}
        initial="hidden"
        animate="visible"
        onClick={onClick}
        aria-label={A11Y_LABELS.appCard(app.title)}
        style={{
          backgroundColor: isActive ? 'var(--webos-surface-active)' : 'transparent',
        }}
        className={cn(
          'group flex items-center gap-4',
          'w-full p-3 rounded-lg',
          'hover:bg-white/5',
          'transition-all',
          'text-left',
          className
        )}
      >
        {/* App Icon */}
        <div 
          className={cn(
            'relative',
            'w-12 h-12',
            'rounded-xl flex-shrink-0',
            'flex items-center justify-center',
            'bg-gradient-to-br shadow-md',
            'group-hover:shadow-lg',
            'transition-shadow',
            app.gradient
          )}
        >
          {isFavorite && (
            <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[var(--semantic-warning)] flex items-center justify-center shadow-sm z-10">
              <Star className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          )}
          <IconComponent className="w-6 h-6 text-white drop-shadow-md" />
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 
              className="text-sm sm:text-base font-medium truncate"
              style={{ color: 'var(--webos-text-primary)' }}
            >
              {app.title}
            </h3>
            
            {/* Badges */}
            <div className="flex items-center gap-1">
              {app.isNew && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500 text-white">
                  NEW
                </Badge>
              )}
              {app.isBeta && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500 text-white">
                  BETA
                </Badge>
              )}
              {isInDock && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Dock
                </Badge>
              )}
            </div>
          </div>
          
          <p 
            className="text-xs sm:text-sm truncate"
            style={{ color: 'var(--webos-text-tertiary)' }}
          >
            {app.description}
          </p>
          
          <p 
            className="text-xs mt-0.5"
            style={{ color: 'var(--webos-text-tertiary)' }}
          >
            {CATEGORY_LABELS[app.category]}
          </p>
        </div>

        {/* Status Indicator */}
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-[var(--semantic-success)] animate-pulse" />
        )}

        {/* Chevron */}
        <ChevronRight 
          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--webos-icon-default)' }}
        />
      </motion.button>
    </AppContextMenu>
  );
}
