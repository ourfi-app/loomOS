'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { AppLauncherGridProps } from '../types';
import { AppCard } from './AppCard';
import { AppCategorySection } from './AppCategorySection';
import { groupAndOrderApps } from '../utils/appGrouping';
import { getAppStatus } from '../utils/appFilters';
import { fadeVariants } from '../utils/animations';

export function AppLauncherGrid({
  apps,
  groupByCategory,
  onAppClick,
  onAppAction,
  activeAppPath,
  dockAppIds,
  favoriteAppIds,
}: AppLauncherGridProps) {
  if (groupByCategory) {
    // Grouped by category
    const groupedApps = groupAndOrderApps(apps);

    return (
      <motion.div
        key="grouped"
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-5 sm:space-y-6 pb-2"
      >
        {groupedApps.map(({ category, apps: categoryApps, label }) => (
          <AppCategorySection
            key={category}
            category={category}
            apps={categoryApps}
            categoryLabel={label}
            onAppClick={onAppClick}
            onAppAction={onAppAction}
            activeAppPath={activeAppPath}
            dockAppIds={dockAppIds}
            favoriteAppIds={favoriteAppIds}
          />
        ))}
      </motion.div>
    );
  }

  // Flat grid (for search, favorites, recent)
  return (
    <motion.div
      key="flat"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-4 px-1 pb-2"
    >
      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
}
