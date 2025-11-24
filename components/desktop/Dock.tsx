'use client';

import { motion } from 'framer-motion';
import { Grid3x3, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store/appStore';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';
import { useAppPreferences } from '@/lib/app-preferences-store';

export function Dock() {
  const { toggleLauncher, launchApp, isAppRunning } = useAppStore();
  const { dockApps = [] } = useAppPreferences();

  // Get favorite apps from preferences (default to first 5 apps if not set)
  const favoriteApps = dockApps.length > 0
    ? APP_REGISTRY.filter(app => dockApps.includes(app.id))
    : APP_REGISTRY.slice(0, 5);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="relative">
        {/* Dock Container with Glass Effect */}
        <div className="px-3 py-2 rounded-2xl bg-glass-white-90 dark:bg-glass-black-80 backdrop-blur-xl border border-border-light shadow-dock">
          <div className="flex items-center gap-2">
            {/* Favorite App Icons */}
            {favoriteApps.map((app) => (
              <DockIcon
                key={app.id}
                app={app}
                isRunning={isAppRunning(app.id)}
                onLaunch={() => launchApp(app)}
              />
            ))}

            {/* Separator */}
            <div className="w-px h-10 bg-border-light mx-1" />

            {/* App Launcher Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLauncher}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-accent-blue to-accent-blue-dark',
                'hover:shadow-lg transition-shadow',
                'focus:outline-none focus:ring-2 focus:ring-accent-blue/50'
              )}
              aria-label="Open App Launcher"
            >
              <Grid3x3 className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Dock Indicator Line */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-text-tertiary/20" />
      </div>
    </motion.div>
  );
}

function DockIcon({
  app,
  isRunning,
  onLaunch,
}: {
  app: any;
  isRunning: boolean;
  onLaunch: () => void;
}) {
  const Icon = app.icon;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.15, y: -8 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={onLaunch}
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          'bg-gradient-to-br shadow-md hover:shadow-lg transition-shadow',
          'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
          app.gradient || 'from-gray-500 to-gray-700'
        )}
        aria-label={`Launch ${app.title}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.button>

      {/* Running Indicator Dot */}
      {isRunning && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-blue"
        />
      )}

      {/* Tooltip on Hover */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="px-2 py-1 rounded-lg bg-chrome-dark text-white text-xs whitespace-nowrap shadow-lg">
          {app.title}
        </div>
      </div>
    </div>
  );
}
