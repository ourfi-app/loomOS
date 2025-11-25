'use client';

import { motion } from 'framer-motion';
import type { AppCategorySectionProps } from '../types';
import { AppCard } from './AppCard';
import { getAppStatus } from '../utils/appFilters';
import { slideUpVariants } from '../utils/animations';

export function AppCategorySection({
  category,
  apps,
  categoryLabel,
  onAppClick,
  onAppAction,
  activeAppPath,
  dockAppIds,
  favoriteAppIds,
}: AppCategorySectionProps) {
  if (apps.length === 0) return null;

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <h3 
          className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--webos-text-secondary)' }}
        >
          {categoryLabel}
        </h3>
        <div 
          className="flex-1 h-px" 
          style={{ backgroundColor: 'var(--webos-border-light)' }} 
        />
        <span 
          className="text-xs sm:text-sm font-medium"
          style={{ color: 'var(--webos-text-tertiary)' }}
        >
          {apps.length}
        </span>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-4 px-1">
        {apps.map((app, index) => {
          const { isActive, isInDock, isFavorite } = getAppStatus(
            app,
            dockAppIds,
            favoriteAppIds,
            activeAppPath
          );

          return (
            <AppCard
              key={app.id}
              app={app}
              index={index}
              isActive={isActive}
              isInDock={isInDock}
              isFavorite={isFavorite}
              onClick={() => onAppClick(app)}
              onContextAction={(action) => onAppAction(app, action)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
