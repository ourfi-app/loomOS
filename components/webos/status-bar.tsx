
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, Bell, HelpCircle, Sun, Moon, 
  User, LogOut, Settings, ChevronDown, Cloud, 
  CloudRain, Home, Calendar, Clock, Eye, Accessibility,
  Search, Command, Grid3x3, Sparkles
} from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useNotifications } from '@/hooks/webos/use-notifications';
import { NotificationDashboard } from './notification-dashboard';
import { useRouter } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AccessibilityPanel } from './accessibility-panel';
import { IntelligentSearch } from './intelligent-search';
import { QuickAppSwitcher } from './quick-app-switcher';
import { AppGridLauncher } from './app-grid-launcher';

// Export status bar height constant for use in other components
export const STATUS_BAR_HEIGHT = 40;

// Flyout menu component for time/date
function TimeFlyout({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [fullDate, setFullDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
      setDate(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
      setFullDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[95]"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-40 z-[96] w-80"
          >
            <div className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tabular-nums">{time}</div>
                    <div className="text-sm text-muted-foreground">{fullDate}</div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <button
                    onClick={() => {
                      onClose();
                      window.open('/dashboard/apps/calendar', '_self');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-sm font-medium">Open Calendar</span>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Flyout menu component for weather
function WeatherFlyout({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'Partly Cloudy',
    high: 78,
    low: 65,
    humidity: 65,
    wind: 8
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[95]"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-72 z-[96] w-72"
          >
            <div className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{weather.temp}°F</div>
                    <div className="text-sm text-muted-foreground">{weather.condition}</div>
                  </div>
                  <Cloud className="w-12 h-12 text-sky-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">High / Low</div>
                    <div className="text-sm font-semibold">{weather.high}° / {weather.low}°</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                    <div className="text-sm font-semibold">{weather.humidity}%</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Wind</div>
                    <div className="text-sm font-semibold">{weather.wind} mph</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Flyout menu component for user profile
function UserProfileFlyout({ 
  isOpen, 
  onClose,
  onThemeToggle,
  onAccessibilityOpen,
  onHelpOpen,
  theme,
  isOnline 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onThemeToggle: () => void;
  onAccessibilityOpen: () => void;
  onHelpOpen: () => void;
  theme: string | undefined;
  isOnline: boolean;
}) {
  const { data: session } = useSession() || {};
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleProfile = () => {
    onClose();
    router.push('/dashboard/profile');
  };

  const handleSettings = () => {
    onClose();
    router.push('/dashboard/system-settings');
  };

  const handleAccessibility = () => {
    onClose();
    onAccessibilityOpen();
  };

  const handleHelp = () => {
    onClose();
    onHelpOpen();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[95]"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-4 z-[96] w-64"
          >
            <div className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-3">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 mb-2">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {session?.user?.name || 'Guest User'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {session?.user?.email || 'Not logged in'}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Settings</span>
                  </button>

                  <div className="my-2 border-t" />

                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      onThemeToggle();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Moon className="w-4 h-4 text-muted-foreground" />
                        <span>Dark Mode</span>
                        <div className="ml-auto h-4 w-4 rounded-full bg-primary" />
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4 text-muted-foreground" />
                        <span>Light Mode</span>
                        <div className="ml-auto h-4 w-4 rounded-full bg-primary" />
                      </>
                    )}
                  </button>

                  {/* Accessibility */}
                  <button
                    onClick={handleAccessibility}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>Accessibility</span>
                  </button>

                  {/* Help */}
                  <button
                    onClick={handleHelp}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Help & Support</span>
                  </button>

                  {/* Network Status (Read-only indicator) */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm">
                    {isOnline ? (
                      <>
                        <Wifi className="w-4 h-4 text-emerald-500" />
                        <span className="text-muted-foreground">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-orange-500" />
                        <span className="text-muted-foreground">Offline</span>
                      </>
                    )}
                  </div>

                  <div className="my-2 border-t" />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function StatusBar() {
  const { isOnline } = usePWA();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession() || {};
  const { notifications } = useNotifications();
  const router = useRouter();
  const { closeAllCards } = useCardManager();
  const [time, setTime] = useState('');
  const [shortDate, setShortDate] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTimeFlyout, setShowTimeFlyout] = useState(false);
  const [showWeatherFlyout, setShowWeatherFlyout] = useState(false);
  const [showUserFlyout, setShowUserFlyout] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showIntelligentSearch, setShowIntelligentSearch] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  // Handler to return to home dashboard
  const handleReturnHome = () => {
    closeAllCards();
    router.push('/dashboard');
  };

  // Handler to launch help app
  const handleLaunchHelp = () => {
    const helpApp = APP_REGISTRY.help;
    if (helpApp) {
      router.push(helpApp.path);
    }
  };

  // Toggle theme
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
      setShortDate(now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for Intelligent Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowIntelligentSearch(true);
      }
      
      // Cmd/Ctrl + Tab for Quick App Switcher
      if ((e.metaKey || e.ctrlKey) && e.key === 'Tab') {
        e.preventDefault();
        setShowAppSwitcher(true);
      }
      
      // Cmd/Ctrl + Space for App Launcher
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setShowAppLauncher(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.3
        }}
        className="fixed top-0 left-0 right-0 h-10 bg-gradient-to-b from-background/95 via-background/90 to-background/85 backdrop-blur-xl border-b border-border/40 z-[100] px-4 shadow-sm"
      >
        <div className="h-full flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Home Button + Notifications */}
          <div className="flex items-center gap-2">
            <motion.button 
              onClick={handleReturnHome}
              className="flex items-center gap-2 text-foreground/90 font-semibold hover:text-foreground transition-all cursor-pointer group px-2 py-1 rounded-md hover:bg-accent/50 active:scale-95"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Return to Home Dashboard"
            >
              <Home className="w-4 h-4 text-primary" strokeWidth={2.5} />
              <span className="text-xs tracking-wide font-bold">Community Manager</span>
            </motion.button>

            <div className="h-5 w-px bg-border/60" />

            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-all rounded-md hover:bg-accent/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
            >
              <Bell className="w-4 h-4" strokeWidth={2.5} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-[8px] font-bold text-white flex items-center justify-center shadow-md"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Right: All Controls Grouped */}
          <div className="flex items-center gap-2">
            {/* Weather with Flyout */}
            <motion.button
              onClick={() => setShowWeatherFlyout(!showWeatherFlyout)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-accent/60 transition-all group border border-transparent hover:border-border/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Weather Information"
            >
              <Cloud className="w-4 h-4 text-sky-500 group-hover:text-sky-600 transition-colors" strokeWidth={2} />
              <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">72°F</span>
              <ChevronDown className={cn(
                "w-3 h-3 text-muted-foreground transition-transform",
                showWeatherFlyout && "rotate-180"
              )} />
            </motion.button>

            <div className="h-5 w-px bg-border/60" />
            
            {/* Time/Date with Flyout */}
            <motion.button
              onClick={() => setShowTimeFlyout(!showTimeFlyout)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-accent/60 transition-all group border border-transparent hover:border-border/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Date & Time"
            >
              <Clock className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" strokeWidth={2} />
              <div className="flex flex-col items-start -space-y-0.5">
                <span className="text-xs font-semibold tabular-nums text-foreground/80 group-hover:text-foreground leading-none">{time}</span>
                <span className="text-[10px] font-medium text-muted-foreground leading-none">{shortDate}</span>
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 text-muted-foreground transition-transform",
                showTimeFlyout && "rotate-180"
              )} />
            </motion.button>

            <div className="h-5 w-px bg-border/60" />

            {/* User Profile with Flyout */}
            <motion.button
              onClick={() => setShowUserFlyout(!showUserFlyout)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent/60 transition-all border border-transparent hover:border-border/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={session?.user?.name || 'User Menu'}
            >
              <Avatar className="h-6 w-6 ring-2 ring-border/50">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className={cn(
                "w-3 h-3 text-muted-foreground transition-transform",
                showUserFlyout && "rotate-180"
              )} />
            </motion.button>

          </div>
        </div>

        {/* Flyout Menus */}
        <TimeFlyout isOpen={showTimeFlyout} onClose={() => setShowTimeFlyout(false)} />
        <WeatherFlyout isOpen={showWeatherFlyout} onClose={() => setShowWeatherFlyout(false)} />
        <UserProfileFlyout 
          isOpen={showUserFlyout} 
          onClose={() => setShowUserFlyout(false)}
          onThemeToggle={handleThemeToggle}
          onAccessibilityOpen={() => {
            setShowUserFlyout(false);
            setShowAccessibilityPanel(true);
          }}
          onHelpOpen={() => {
            setShowUserFlyout(false);
            handleLaunchHelp();
          }}
          theme={theme}
          isOnline={isOnline}
        />
      </motion.div>

      {/* Notification Dashboard */}
      <AnimatePresence>
        {showNotifications && mounted && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]"
            />
            <NotificationDashboard />
          </>
        )}
      </AnimatePresence>

      {/* Accessibility Panel */}
      {showAccessibilityPanel && (
        <AccessibilityPanel onClose={() => setShowAccessibilityPanel(false)} />
      )}

      {/* Intelligent Search */}
      <IntelligentSearch 
        isOpen={showIntelligentSearch} 
        onClose={() => setShowIntelligentSearch(false)} 
      />

      {/* Quick App Switcher */}
      <QuickAppSwitcher 
        isOpen={showAppSwitcher} 
        onClose={() => setShowAppSwitcher(false)} 
      />

      {/* App Launcher */}
      <AppGridLauncher 
        isOpen={showAppLauncher} 
        onClose={() => setShowAppLauncher(false)} 
      />
    </>
  );
}
