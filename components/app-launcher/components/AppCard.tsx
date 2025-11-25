'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppCardProps } from '../types';
import { AppContextMenu } from './AppContextMenu';
import { cardVariants, cardHoverVariants } from '../utils/animations';
import { A11Y_LABELS } from '../utils/constants';

export function AppCard({
  app,
  isActive,
  isInDock,
  isFavorite,
  onClick,
  onContextAction,
  index,
  className,
}: AppCardProps) {
  const IconComponent = app.icon;

  return (
    <AppContextMenu
      app={app}
      isInDock={isInDock}
      isFavorite={isFavorite}
      onAction={onContextAction}
    >
      <motion.button
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        aria-label={A11Y_LABELS.appCard(app.title)}
        className={cn(
          'group flex flex-col items-center gap-2',
          'p-2 rounded-lg',
          'hover:bg-white/5',
          'transition-colors',
          'relative',
          className
        )}
      >
        {/* App Icon Container */}
        <motion.div 
          variants={cardHoverVariants}
          className={cn(
            'relative',
            'w-14 h-14 sm:w-16 sm:h-16',
            'rounded-xl',
            'flex items-center justify-center',
            'bg-gradient-to-br shadow-lg',
            'transition-all group-hover:shadow-xl',
            app.gradient
          )}
        >
          {/* Favorite Star Badge */}
          {isFavorite && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[var(--semantic-warning)] flex items-center justify-center shadow-md z-10"
            >
              <Star className="w-3 h-3 text-white fill-white" />
            </motion.div>
          )}

          {/* New/Beta Badges */}
          {app.isNew && !isFavorite && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          )}
          {app.isBeta && !isFavorite && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
              <FlaskConical className="w-2.5 h-2.5 text-white" />
            </div>
          )}

          {/* Status Indicators */}
          {isActive && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--semantic-success)] border-2 border-surface-dark animate-pulse" />
          )}
          {isInDock && (
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
          )}

          {/* Icon */}
          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" />
        </motion.div>

        {/* App Name */}
        <span 
          className="text-xs sm:text-sm text-center leading-tight line-clamp-2 font-medium max-w-full"
          style={{ color: 'var(--webos-text-primary)' }}
        >
          {app.title}
        </span>
      </motion.button>
    </AppContextMenu>
  );
}
