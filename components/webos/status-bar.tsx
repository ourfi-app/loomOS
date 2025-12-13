
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
import { AppLauncher } from '@/components/app-launcher';

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
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'var(--webos-bg-glass)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--webos-border-glass)',
                boxShadow: 'var(--webos-shadow-xl)',
                fontFamily: 'Helvetica Neue, Arial, sans-serif'
              }}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-neutral-100)',
                      border: '1px solid var(--color-neutral-200)'
                    }}
                  >
                    <Clock className="w-5 h-5" strokeWidth={2} style={{ color: 'var(--webos-app-blue)' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-light tabular-nums" style={{ color: 'var(--webos-text-primary)' }}>{time}</div>
                    <div className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>{fullDate}</div>
                  </div>
                </div>
                
                <div className="pt-2" style={{ borderTop: '1px solid var(--webos-border-primary)' }}>
                  <button
                    onClick={() => {
                      onClose();
                      window.open('/dashboard/apps/calendar', '_self');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    <span className="text-sm">Open Calendar</span>
                    <Calendar className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
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
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'var(--webos-bg-glass)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--webos-border-glass)',
                boxShadow: 'var(--webos-shadow-xl)',
                fontFamily: 'Helvetica Neue, Arial, sans-serif'
              }}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-light" style={{ color: 'var(--webos-text-primary)' }}>{weather.temp}°F</div>
                    <div className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>{weather.condition}</div>
                  </div>
                  <Cloud className="w-12 h-12" strokeWidth={1.5} style={{ color: 'var(--webos-app-teal)' }} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: '1px solid var(--webos-border-primary)' }}>
                  <div>
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>High / Low</div>
                    <div className="text-sm font-light" style={{ color: 'var(--webos-text-primary)' }}>{weather.high}° / {weather.low}°</div>
                  </div>
                  <div>
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Humidity</div>
                    <div className="text-sm font-light" style={{ color: 'var(--webos-text-primary)' }}>{weather.humidity}%</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Wind</div>
                    <div className="text-sm font-light" style={{ color: 'var(--webos-text-primary)' }}>{weather.wind} mph</div>
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
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'var(--webos-bg-glass)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--webos-border-glass)',
                boxShadow: 'var(--webos-shadow-xl)',
                fontFamily: 'Helvetica Neue, Arial, sans-serif'
              }}
            >
              <div className="p-3">
                {/* User Info */}
                <div 
                  className="flex items-center gap-3 p-3 rounded-2xl mb-2"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  <Avatar className="h-10 w-10 ring-2" style={{ ringColor: 'rgba(122, 158, 181, 0.3)' }}>
                    <AvatarFallback 
                      className="font-light text-sm"
                      style={{
                        backgroundColor: 'var(--webos-app-blue)',
                        color: 'var(--webos-text-white)'
                      }}
                    >
                      {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-light text-sm truncate" style={{ color: 'var(--webos-text-primary)' }}>
                      {session?.user?.name || 'Guest User'}
                    </div>
                    <div className="text-xs font-light truncate" style={{ color: 'var(--webos-text-secondary)' }}>
                      {session?.user?.email || 'Not logged in'}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    <User className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    <Settings className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                    <span>Settings</span>
                  </button>

                  <div className="my-2" style={{ borderTop: '1px solid var(--webos-border-primary)' }} />

                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      onThemeToggle();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    {theme === 'dark' ? (
                      <>
                        <Moon className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                        <span>Dark Mode</span>
                        <div className="ml-auto h-4 w-4 rounded-full" style={{ backgroundColor: 'var(--webos-app-blue)' }} />
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                        <span>Light Mode</span>
                        <div className="ml-auto h-4 w-4 rounded-full" style={{ backgroundColor: 'var(--webos-app-blue)' }} />
                      </>
                    )}
                  </button>

                  {/* Accessibility */}
                  <button
                    onClick={handleAccessibility}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    <Eye className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                    <span>Accessibility</span>
                  </button>

                  {/* Help */}
                  <button
                    onClick={handleHelp}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    <HelpCircle className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                    <span>Help & Support</span>
                  </button>

                  {/* Network Status (Read-only indicator) */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-light">
                    {isOnline ? (
                      <>
                        <Wifi className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-app-teal)' }} />
                        <span style={{ color: 'var(--webos-text-secondary)' }}>Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4" strokeWidth={2} style={{ color: 'var(--webos-text-secondary)' }} />
                        <span style={{ color: 'var(--webos-text-secondary)' }}>Offline</span>
                      </>
                    )}
                  </div>

                  <div className="my-2" style={{ borderTop: '1px solid var(--webos-border-primary)' }} />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-light"
                    style={{ color: 'var(--color-error-600)' }}
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
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
        className="fixed top-0 left-0 right-0 h-10 z-[100] px-4"
        style={{
          // True glassmorphic background - semi-transparent with strong blur
          background: 'var(--glass-white-70)',
          backdropFilter: 'blur(var(--blur-xl)) saturate(180%)',
          WebkitBackdropFilter: 'blur(var(--blur-xl)) saturate(180%)',
          borderBottom: '1px solid var(--glass-border-light)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
        <div className="h-full flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Notifications */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center w-8 h-8 transition-all rounded-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
              style={{ color: 'var(--webos-text-secondary)' }}
            >
              <Bell className="w-4 h-4" strokeWidth={2} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full text-[8px] font-light flex items-center justify-center"
                  style={{
                    background: 'var(--color-error-600)',
                    color: 'var(--webos-text-white)',
                    boxShadow: 'var(--webos-shadow-sm)'
                  }}
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
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Weather Information"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <Cloud className="w-4 h-4 transition-colors" strokeWidth={2} style={{ color: 'var(--webos-app-teal)' }} />
              <span className="text-xs font-light" style={{ color: 'var(--webos-text-primary)' }}>72°F</span>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                showWeatherFlyout && "rotate-180"
              )} style={{ color: 'var(--webos-text-secondary)' }} />
            </motion.button>

            <div className="h-5 w-px" style={{ backgroundColor: 'var(--webos-border-secondary)' }} />
            
            {/* Time/Date with Flyout */}
            <motion.button
              onClick={() => setShowTimeFlyout(!showTimeFlyout)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Date & Time"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <Clock className="w-4 h-4 transition-colors" strokeWidth={2} style={{ color: 'var(--webos-app-blue)' }} />
              <div className="flex flex-col items-start -space-y-0.5">
                <span className="text-xs font-light tabular-nums leading-none" style={{ color: 'var(--webos-text-primary)' }}>{time}</span>
                <span className="text-[10px] font-light leading-none" style={{ color: 'var(--webos-text-secondary)' }}>{shortDate}</span>
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                showTimeFlyout && "rotate-180"
              )} style={{ color: 'var(--webos-text-secondary)' }} />
            </motion.button>

            <div className="h-5 w-px" style={{ backgroundColor: 'var(--webos-border-secondary)' }} />

            {/* User Profile with Flyout */}
            <motion.button
              onClick={() => setShowUserFlyout(!showUserFlyout)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={session?.user?.name || 'User Menu'}
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <Avatar className="h-6 w-6 ring-2" style={{ ringColor: 'var(--webos-border-secondary)' }}>
                <AvatarFallback className="text-[10px] font-light" style={{ 
                  backgroundColor: 'var(--webos-app-blue)',
                  color: 'var(--webos-text-white)' 
                }}>
                  {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                showUserFlyout && "rotate-180"
              )} style={{ color: 'var(--webos-text-secondary)' }} />
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
      <AppLauncher 
        isOpen={showAppLauncher} 
        onClose={() => setShowAppLauncher(false)} 
      />
    </>
  );
}
