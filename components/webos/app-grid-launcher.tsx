'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { useCardManager } from '@/lib/card-manager-store';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { cn } from '@/lib/utils';
import { MdClose, MdSearch, MdClear } from 'react-icons/md';
import { PlayCircle, Pin, PinOff, Sparkles, FlaskConical, Star, Clock, Grid3x3 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getAllApps, searchApps, getAppById, type AppDefinition } from '@/lib/enhanced-app-registry';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AppGridLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunch?: (app: AppDefinition) => void;
}

// Tab type for navigation
type TabType = 'all' | 'favorites' | 'recent';

// Simple App Button with enhanced animations
interface AppButtonProps {
  app: AppDefinition;
  isActive: boolean;
  isInDock: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onAddToDock: () => void;
  onToggleFavorite: () => void;
  index: number;
}

function AppButton({ app, isActive, isInDock, isFavorite, onClick, onAddToDock, onToggleFavorite, index }: AppButtonProps) {
  const IconComponent = app.icon;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            delay: index * 0.02, // Stagger animation
          }}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors relative"
        >
          {/* App Icon */}
          <div className={cn(
            "relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg transition-all group-hover:shadow-xl",
            app.gradient
          )}>
            {/* Favorite Star Badge */}
            {isFavorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center shadow-md z-10"
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
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#1a1a1a] animate-pulse" />
            )}
            {isInDock && (
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
            )}

            {/* Icon */}
            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" />
          </div>

          {/* App Name */}
          <span className="text-xs sm:text-sm text-white/90 group-hover:text-white text-center leading-tight line-clamp-2 font-medium max-w-full">
            {app.title}
          </span>
        </motion.button>
      </ContextMenuTrigger>

      {/* Context Menu */}
      <ContextMenuContent className="w-56">
        <div className="px-2 py-1.5 border-b border-white/10 mb-1">
          <p className="text-sm font-medium text-white/90">{app.title}</p>
          <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{app.description}</p>
        </div>

        <ContextMenuItem onClick={onClick}>
          <PlayCircle className="mr-2 h-4 w-4" />
          <span>Open</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onToggleFavorite}>
          <Star className={cn("mr-2 h-4 w-4", isFavorite && "fill-current text-yellow-500")} />
          <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
        </ContextMenuItem>

        {!isInDock ? (
          <ContextMenuItem onClick={onAddToDock}>
            <Pin className="mr-2 h-4 w-4" />
            <span>Add to Dock</span>
          </ContextMenuItem>
        ) : (
          <ContextMenuItem disabled>
            <PinOff className="mr-2 h-4 w-4" />
            <span>In Dock</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function AppGridLauncher({ isOpen, onClose, onAppLaunch }: AppGridLauncherProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const { launchApp } = useCardManager();
  const { dockAppIds, addToDock, favoriteAppIds, toggleFavorite, getRecentApps, trackAppUsage } = useAppPreferences();
  const { openSearch } = useUniversalSearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const showAdminFeatures = isSuperAdmin || (isAdmin && isAdminMode);

  // Get and filter apps based on active tab and search
  const filteredApps = useMemo(() => {
    let apps: AppDefinition[] = [];

    // If searching, override tab filtering
    if (searchQuery) {
      apps = searchApps(searchQuery).filter(app =>
        showAdminFeatures || !app.requiresAdmin
      );
    } else {
      // Get apps based on active tab
      switch (activeTab) {
        case 'favorites':
          apps = favoriteAppIds
            .map(id => getAppById(id))
            .filter((app): app is AppDefinition =>
              app !== undefined &&
              (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
            );
          break;

        case 'recent':
          const recentAppIds = getRecentApps(20); // Get 20 most recent apps
          apps = recentAppIds
            .map(id => getAppById(id))
            .filter((app): app is AppDefinition =>
              app !== undefined &&
              (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
            );
          break;

        case 'all':
        default:
          apps = getAllApps(showAdminFeatures);
          break;
      }
    }

    return apps;
  }, [searchQuery, activeTab, showAdminFeatures, favoriteAppIds, getRecentApps]);

  // Group apps by category
  const groupedApps = useMemo(() => {
    const groups: Record<string, AppDefinition[]> = {};
    
    filteredApps.forEach(app => {
      if (!groups[app.category]) {
        groups[app.category] = [];
      }
      const group = groups[app.category];
      if (group) {
        group.push(app);
      }
    });
    
    return groups;
  }, [filteredApps]);

  const handleAppClick = (app: AppDefinition) => {
    // Track app usage
    trackAppUsage(app.id);

    // Special handling for AI Assistant
    if (app.id === 'ai-assistant' || app.id === 'assistant') {
      openSearch('ai');
      onClose();
      return;
    }

    if (onAppLaunch) {
      onAppLaunch(app);
    } else {
      // Dashboard and Onboarding are special - navigate to full page
      if (app.path === '/dashboard' || app.path === '/onboarding') {
        router.push(app.path);
      } else {
        launchApp({
          id: app.id,
          title: app.title,
          path: app.path,
          color: app.gradient,
          icon: app.id,
        });
        router.push(app.path);
      }
      onClose();
    }
  };

  const handleAddToDock = (app: AppDefinition) => {
    addToDock(app.id);
    toast.success('Added to Dock', {
      description: `${app.title} has been added to your dock`,
    });
  };

  const handleToggleFavorite = (app: AppDefinition) => {
    toggleFavorite(app.id);
    const isFavorite = favoriteAppIds.includes(app.id);
    toast.success(isFavorite ? 'Removed from Favorites' : 'Added to Favorites', {
      description: `${app.title} ${isFavorite ? 'removed from' : 'added to'} your favorites`,
      icon: isFavorite ? '⭐' : '⭐',
    });
  };

  const isInDock = (appId: string) => dockAppIds.includes(appId);
  const isFavorite = (appId: string) => favoriteAppIds.includes(appId);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(path);
  };

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categoryNames: Record<string, string> = {
    essentials: 'Essentials',
    personal: 'Personal',
    community: 'Community',
    productivity: 'Productivity',
    admin: 'Administration',
    settings: 'Settings',
  };

  // Tabs configuration
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Apps', icon: Grid3x3 },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-7xl bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/5 p-4 sm:p-6 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-3 flex-shrink-0">
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-display text-white/90">Apps</h2>

              {/* Search Bar */}
              <div className="relative flex-1">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 sm:h-11 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/8 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    <MdClear className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors flex-shrink-0"
                title="Close"
              >
                <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Tabs Navigation */}
            {!searchQuery && (
              <div className="flex gap-2 mb-4 flex-shrink-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all flex-1 sm:flex-initial',
                        isActive
                          ? 'bg-white/10 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:bg-white/8 hover:text-white/80'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white/10 rounded-lg"
                          style={{ zIndex: -1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* App Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
              {filteredApps.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12 text-white/40"
                >
                  {activeTab === 'favorites' && !searchQuery ? (
                    <>
                      <Star className="w-14 h-14 mb-4 opacity-20" />
                      <p className="text-lg font-medium mb-2">No favorites yet</p>
                      <p className="text-sm text-white/30 max-w-xs">
                        Star your favorite apps to quick access them here
                      </p>
                    </>
                  ) : activeTab === 'recent' && !searchQuery ? (
                    <>
                      <Clock className="w-14 h-14 mb-4 opacity-20" />
                      <p className="text-lg font-medium mb-2">No recent apps</p>
                      <p className="text-sm text-white/30 max-w-xs">
                        Apps you open will appear here
                      </p>
                    </>
                  ) : (
                    <>
                      <MdSearch className="w-14 h-14 mb-4 opacity-20" />
                      <p className="text-sm">No apps found</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-colors"
                        >
                          Clear Search
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              ) : searchQuery || activeTab === 'favorites' || activeTab === 'recent' ? (
                // Show flat grid when searching or in Favorites/Recent tab
                <motion.div
                  key={`${activeTab}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-4 px-1 pb-2"
                >
                  {filteredApps.map((app, index) => (
                    <AppButton
                      key={app.id}
                      app={app}
                      index={index}
                      isActive={isActive(app.path)}
                      isInDock={isInDock(app.id)}
                      isFavorite={isFavorite(app.id)}
                      onClick={() => handleAppClick(app)}
                      onAddToDock={() => handleAddToDock(app)}
                      onToggleFavorite={() => handleToggleFavorite(app)}
                    />
                  ))}
                </motion.div>
              ) : (
                // Show grouped by categories in All Apps tab
                <motion.div
                  key="all-categories"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6 pb-2"
                >
                  {['essentials', 'personal', 'community', 'productivity', 'admin', 'settings'].map(category => {
                    const apps = groupedApps[category];
                    if (!apps || apps.length === 0) return null;

                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      >
                        <div className="flex items-center gap-3 mb-3 px-1">
                          <h3 className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-wider">
                            {categoryNames[category]}
                          </h3>
                          <div className="flex-1 h-px bg-white/5" />
                          <span className="text-xs sm:text-sm text-white/40 font-medium">{apps.length}</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-4 px-1">
                          {apps.map((app, index) => (
                            <AppButton
                              key={app.id}
                              app={app}
                              index={index}
                              isActive={isActive(app.path)}
                              isInDock={isInDock(app.id)}
                              isFavorite={isFavorite(app.id)}
                              onClick={() => handleAppClick(app)}
                              onAddToDock={() => handleAddToDock(app)}
                              onToggleFavorite={() => handleToggleFavorite(app)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
