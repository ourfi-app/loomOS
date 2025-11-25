'use client';

import { motion } from 'framer-motion';
import type { AppLauncherListProps } from '../types';
import { AppListItem } from './AppListItem';
import { getAppStatus } from '../utils/appFilters';
import { fadeVariants } from '../utils/animations';

export function AppLauncherList({
  apps,
  onAppClick,
  onAppAction,
  activeAppPath,
  dockAppIds,
  favoriteAppIds,
}: AppLauncherListProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-1 pb-2"
    >
      {apps.map((app, index) => {
        const { isActive, isInDock, isFavorite } = getAppStatus(
          app,
          dockAppIds,
          favoriteAppIds,
          activeAppPath
        );

        return (
          <AppListItem
            key={app.id}
            app={app}
            isActive={isActive}
            isInDock={isInDock}
            isFavorite={isFavorite}
            onClick={() => onAppClick(app)}
            onContextAction={(action) => onAppAction(app, action)}
          />
        );
      })}
    </motion.div>
  );
}
