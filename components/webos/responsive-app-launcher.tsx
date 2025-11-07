
'use client';

/**
 * Responsive App Launcher
 * Demonstrates LoomOS-inspired responsive design patterns
 */

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { useCardManager } from '@/lib/card-manager-store';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { 
  getAllApps, 
  searchApps, 
  type AppDefinition,
  sortApps
} from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';
import { 
  RESPONSIVE_SPACING, 
  RESPONSIVE_TYPOGRAPHY, 
  RESPONSIVE_SIZES,
  LAYOUT_PATTERNS,
  RESPONSIVE_VISIBILITY,
  getResponsiveCardClasses,
} from '@/lib/responsive-system';
import { 
  useBreakpoint, 
  useIsMobile, 
  useResponsiveValue 
} from '@/hooks/use-responsive';
import { APP_ICONS, getAppIcon, getAppColor } from '@/lib/app-design-system';
import { 
  Search as SearchIcon, 
  X as CloseIcon, 
  Grid, 
  List, 
  SlidersHorizontal as FilterIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  Sparkles as SparklesIcon
} from 'lucide-react';

interface ResponsiveAppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResponsiveAppLauncher({ isOpen, onClose }: ResponsiveAppLauncherProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const { isAdminMode } = useAdminMode();
  const { launchApp } = useCardManager();
  
  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  
  // Responsive values
  const columns = useResponsiveValue({
    mobile: 2,
    tablet: 3,
    desktop: 4,
    desktopLarge: 5,
    desktopXL: 6,
    default: 2,
  });
  
  // App preferences
  const {
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    selectedCategories,
    toggleCategory,
    pinnedAppIds,
    togglePinned,
    trackAppUsage,
    appUsage,
  } = useAppPreferences();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  // Super admins always see admin features, regular admins need to toggle admin mode
  const showAdminFeatures = isSuperAdmin || (isAdmin && isAdminMode);

  // Get and filter apps
  const filteredApps = useMemo(() => {
    let apps = searchQuery 
      ? searchApps(searchQuery).filter(app => showAdminFeatures || !app.requiresAdmin)
      : getAllApps(showAdminFeatures);
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      apps = apps.filter(app => selectedCategories.includes(app.category));
    }
    
    // Sort apps
    apps = sortApps(apps, sortMode, appUsage);
    
    return apps;
  }, [searchQuery, showAdminFeatures, selectedCategories, sortMode, appUsage]);

  const handleAppClick = (app: AppDefinition) => {
    trackAppUsage(app.id);
    
    // Dashboard and Onboarding are special - navigate to full page (don't launch as cards)
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
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-40',
      'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      'backdrop-blur-2xl bg-opacity-95',
      'overflow-auto',
      'animate-fade-in'
    )}>
      {/* Header with responsive spacing */}
      <div className={cn(
        RESPONSIVE_SPACING.containerPadding.mobile,
        'sm:' + RESPONSIVE_SPACING.containerPadding.tablet,
        'md:' + RESPONSIVE_SPACING.containerPadding.desktop,
        'lg:' + RESPONSIVE_SPACING.containerPadding.desktopLarge,
        'py-4 sm:py-6',
        'border-b border-white/20',
        'backdrop-blur-xl bg-white/40'
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Title and close button */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className={cn(
                RESPONSIVE_TYPOGRAPHY.h1.mobile,
                RESPONSIVE_TYPOGRAPHY.h1.weight,
                RESPONSIVE_TYPOGRAPHY.h1.lineHeight,
                'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'
              )}>
                Applications
              </h1>
              <p className={cn(
                RESPONSIVE_TYPOGRAPHY.body.mobile,
                'text-gray-600 mt-1',
                RESPONSIVE_VISIBILITY.hideMobile // Hide on mobile to save space
              )}>
                {filteredApps.length} apps available • {breakpoint} breakpoint
              </p>
            </div>
            
            {/* Close button with responsive sizing */}
            <button
              onClick={onClose}
              className={cn(
                'flex items-center justify-center rounded-full',
                'bg-white/80 hover:bg-white',
                'shadow-lg hover:shadow-xl',
                'transition-all duration-300',
                'hover:scale-110 active:scale-95',
                // Responsive sizing
                'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12'
              )}
            >
              <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {/* Search bar with responsive sizing */}
          <div className="relative">
            <SearchIcon className={cn(
              'absolute left-3 sm:left-4 top-1/2 -translate-y-1/2',
              'text-gray-400',
              'w-5 h-5 sm:w-6 sm:h-6'
            )} />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full rounded-xl sm:rounded-2xl',
                'border-2 border-white/50',
                'bg-white/80 backdrop-blur-xl',
                'focus:outline-none focus:ring-4 focus:ring-blue-500/20',
                'transition-all duration-300',
                // Responsive sizing
                'h-12 sm:h-13 md:h-14',
                'pl-11 sm:pl-13 md:pl-14',
                'pr-4 sm:pr-5 md:pr-6',
                'text-sm sm:text-base md:text-lg'
              )}
            />
          </div>
        </div>
      </div>

      {/* App grid with responsive columns */}
      <div className={cn(
        RESPONSIVE_SPACING.containerPadding.mobile,
        'sm:' + RESPONSIVE_SPACING.containerPadding.tablet,
        'md:' + RESPONSIVE_SPACING.containerPadding.desktop,
        'lg:' + RESPONSIVE_SPACING.containerPadding.desktopLarge,
        'py-6 sm:py-8 md:py-10'
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Sort/Filter controls (desktop only) */}
          <div className={cn(
            'flex items-center justify-between mb-6',
            RESPONSIVE_VISIBILITY.hideDesktop // Hide on mobile to save space
          )}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSortMode('alphabetical')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  sortMode === 'alphabetical'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/60 text-gray-700 hover:bg-white'
                )}
              >
                A-Z
              </button>
              <button
                onClick={() => setSortMode('recent')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  sortMode === 'recent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/60 text-gray-700 hover:bg-white'
                )}
              >
                Recent
              </button>
              <button
                onClick={() => setSortMode('frequent')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  sortMode === 'frequent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/60 text-gray-700 hover:bg-white'
                )}
              >
                Frequent
              </button>
            </div>
          </div>

          {/* Apps grid with responsive columns */}
          <div className={cn(
            'grid gap-3 sm:gap-4 md:gap-5 lg:gap-6',
            `grid-cols-${columns}`
          )}>
            {filteredApps.map((app) => {
              const Icon = getAppIcon(app.iconKey);
              const appColor = getAppColor(app.colorKey);
              const isPinned = pinnedAppIds.includes(app.id);
              const isHovered = hoveredApp === app.id;

              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app)}
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                  className={cn(
                    // Responsive card sizing
                    'relative overflow-hidden',
                    'rounded-xl sm:rounded-2xl',
                    'shadow-lg hover:shadow-2xl',
                    'transition-all duration-300',
                    'hover:scale-105 active:scale-95',
                    'flex flex-col items-center justify-center',
                    'bg-gradient-to-br',
                    appColor.light,
                    // Responsive height
                    'h-24 sm:h-28 md:h-32 lg:h-36',
                    // Responsive padding
                    'p-3 sm:p-4 md:p-5'
                  )}
                >
                  {/* Gradient overlay on hover */}
                  {isHovered && (
                    <div className={cn(
                      'absolute inset-0',
                      'bg-gradient-to-br from-white/20 to-transparent',
                      'animate-fade-in'
                    )} />
                  )}

                  {/* Icon with responsive sizing */}
                  <div className="relative z-10">
                    <Icon className={cn(
                      'text-white',
                      'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14',
                      'transition-transform duration-300',
                      isHovered && 'scale-110'
                    )} />
                  </div>

                  {/* Title with responsive typography */}
                  <h3 className={cn(
                    'mt-2 sm:mt-3',
                    'text-white font-semibold text-center',
                    'text-xs sm:text-sm md:text-base',
                    'line-clamp-2'
                  )}>
                    {app.title}
                  </h3>

                  {/* Pin indicator */}
                  {isPinned && (
                    <div className={cn(
                      'absolute top-2 right-2',
                      'w-6 h-6 rounded-full',
                      'bg-white/30 backdrop-blur-sm',
                      'flex items-center justify-center'
                    )}>
                      <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
                    </div>
                  )}

                  {/* New badge (if applicable) */}
                  {app.isNew && (
                    <div className={cn(
                      'absolute top-2 left-2',
                      'px-2 py-1 rounded-full',
                      'bg-yellow-400 text-yellow-900',
                      'text-[10px] sm:text-xs font-bold'
                    )}>
                      NEW
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredApps.length === 0 && (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <SparklesIcon className={cn(
                'mx-auto text-gray-300 mb-4',
                'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20'
              )} />
              <h3 className={cn(
                RESPONSIVE_TYPOGRAPHY.h3.mobile,
                'text-gray-500 mb-2'
              )}>
                No apps found
              </h3>
              <p className={cn(
                RESPONSIVE_TYPOGRAPHY.body.mobile,
                'text-gray-400'
              )}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
