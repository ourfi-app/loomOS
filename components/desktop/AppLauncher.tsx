'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useAppStore } from '@/lib/store/appStore';
import { APP_REGISTRY, CATEGORIES, getAppsByCategory } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';

export function AppLauncher() {
  const { launcherOpen, closeLauncher, launchApp } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter apps based on search and category
  const filteredApps = useMemo(() => {
    let apps = selectedCategory === 'all' 
      ? APP_REGISTRY 
      : getAppsByCategory(selectedCategory as any);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      apps = apps.filter(
        (app) =>
          app.title.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query) ||
          app.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
      );
    }

    return apps;
  }, [searchQuery, selectedCategory]);

  const handleAppLaunch = (app: any) => {
    launchApp(app);
    setSearchQuery('');
  };

  if (!launcherOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        onClick={closeLauncher}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-6xl max-h-[85vh] mx-4 bg-bg-surface rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-bg-surface/95 backdrop-blur-xl border-b border-border-light">
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-bg-secondary text-text-primary placeholder:text-text-tertiary rounded-xl border border-border-light focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 outline-none transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <CategoryButton
                  active={selectedCategory === 'all'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Apps
                </CategoryButton>
                {CATEGORIES.map((category) => (
                  <CategoryButton
                    key={category.id}
                    active={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </CategoryButton>
                ))}
              </div>
            </div>
          </div>

          {/* App Grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onLaunch={() => handleAppLaunch(app)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No apps found
                </h3>
                <p className="text-text-secondary">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={closeLauncher}
            className="absolute top-4 right-4 p-2 rounded-full bg-bg-hover hover:bg-bg-active text-text-secondary hover:text-text-primary transition-all"
            aria-label="Close launcher"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Category Button Component
function CategoryButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
        active
          ? 'bg-accent-blue text-white shadow-md'
          : 'bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
      )}
    >
      {children}
    </button>
  );
}

// App Card Component
function AppCard({
  app,
  onLaunch,
}: {
  app: any;
  onLaunch: () => void;
}) {
  const Icon = app.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onLaunch}
      className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-bg-secondary hover:bg-bg-hover transition-colors"
    >
      {/* App Icon */}
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-xl',
          'bg-gradient-to-br',
          app.gradient || 'from-gray-500 to-gray-700'
        )}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* App Title */}
      <div className="text-center">
        <div className="text-sm font-medium text-text-primary line-clamp-2">
          {app.title}
        </div>
      </div>

      {/* Beta/New Badge */}
      {(app.isBeta || app.isNew) && (
        <div
          className={cn(
            'absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold',
            app.isNew
              ? 'bg-accent-blue text-white'
              : 'bg-warning text-white'
          )}
        >
          {app.isNew ? 'New' : 'Beta'}
        </div>
      )}
    </motion.button>
  );
}
