

// loomOS Dashboard Layout - Full Design System Implementation with Responsive UI/UX
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Home, Users, CreditCard, FileText, MessageSquare, Settings, 
  Bell, User, Shield, Upload, Calendar, BarChart, Building,
  Mail, Globe, Music, Bluetooth, Wifi, Battery, Search, X,
  ChevronDown, LogOut, Clock as ClockIcon, Menu
} from 'lucide-react';
import { Dock } from '@/components/dock';

// System status bar with live clock and user profile - Fully Responsive
function SystemStatusBar({ 
  onOpenAppLauncher, 
  currentUser 
}: { 
  onOpenAppLauncher: () => void;
  currentUser: any;
}) {
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-menu]')) {
        setShowProfileMenu(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <nav 
      role="navigation"
      aria-label="System status bar"
      className="fixed top-0 left-0 right-0 h-10 sm:h-11 md:h-12 flex items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 z-50 transition-all duration-200"
      style={{ 
        background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Left Section: loomOS logo and hamburger menu */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Hamburger menu for mobile */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Toggle mobile menu"
          aria-expanded={showMobileMenu}
          data-menu="mobile"
        >
          <Menu className="w-5 h-5" style={{ color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
        </button>

        {/* loomOS Logo */}
        <button
          onClick={onOpenAppLauncher}
          className="flex items-center gap-1.5 sm:gap-2 hover:bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minHeight: '44px' }}
          aria-label="Open app launcher"
        >
          <div 
            className="font-light text-xs sm:text-sm md:text-base tracking-wide truncate" 
            style={{ 
              color: '#ffffff',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
            }}
          >
            loomOS
          </div>
        </button>
      </div>

      {/* Center Section: System icons - REMOVED/COMMENTED OUT */}
      {/* 
      <div 
        className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4"
        role="toolbar"
        aria-label="System quick actions"
      >
        <button 
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Mail"
        >
          <Mail className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--chrome-text-secondary)' }} />
        </button>
        <button 
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Messages"
        >
          <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--chrome-text-secondary)' }} />
        </button>
        <button 
          className="hidden lg:block p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Music"
        >
          <Music className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--chrome-text-secondary)' }} />
        </button>
        <button 
          className="hidden xl:block p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Bluetooth"
        >
          <Bluetooth className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--chrome-text-secondary)' }} />
        </button>
        <button 
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="WiFi"
        >
          <Wifi className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--chrome-text-secondary)' }} />
        </button>
        <button 
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Battery"
        >
          <Battery className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--chrome-text-secondary)' }} />
        </button>
      </div>
      */}

      {/* Right Section: Clock and user profile */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        {/* Clock - Adaptive display */}
        <div 
          className="text-xs sm:text-sm md:text-base font-light whitespace-nowrap hidden sm:block"
          style={{ 
            color: '#ffffff',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="hidden lg:inline">{formatDate(time)} </span>
          {formatTime(time)}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" data-menu="profile">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileMenu(!showProfileMenu);
            }}
            className="flex items-center gap-1.5 sm:gap-2 hover:bg-white/10 px-2 py-1.5 sm:py-2 rounded-lg transition-all duration-200 active:scale-95"
            style={{ minHeight: '44px' }}
            aria-label="User profile menu"
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
          >
            <div 
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" style={{ color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
            </div>
            <ChevronDown 
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
              style={{ color: 'rgba(255, 255, 255, 0.8)', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} 
            />
          </button>
          
          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div 
              role="menu"
              aria-label="User menu"
              className="absolute right-0 top-full mt-2 w-56 sm:w-60 md:w-64 rounded-xl overflow-hidden animate-fadeIn"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                boxShadow: 'var(--shadow-modal)',
                border: '1px solid var(--glass-border-light)',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div className="p-3 sm:p-4 border-b border-white/10">
                <div className="text-sm sm:text-base font-light truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-xs sm:text-sm font-light truncate" style={{ color: 'var(--text-secondary)' }}>
                  {currentUser?.email || ''}
                </div>
              </div>
              <button
                role="menuitem"
                onClick={() => signOut()}
                className="w-full px-3 sm:px-4 py-3 text-left text-sm sm:text-base font-light hover:bg-white/10 transition-colors flex items-center gap-2 sm:gap-3"
                style={{ color: 'var(--text-primary)', minHeight: '44px' }}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div 
          role="menu"
          aria-label="Mobile navigation menu"
          className="lg:hidden absolute left-0 top-full w-full sm:w-64 rounded-b-xl overflow-hidden animate-slideDown"
          style={{
            backgroundColor: 'var(--chrome-dark)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderTop: 'none'
          }}
        >
          <div className="p-2">
            <button 
              role="menuitem"
              className="w-full px-3 py-3 text-left text-sm font-light hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                minHeight: '44px' 
              }}
            >
              <Mail className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
              Mail
            </button>
            <button 
              role="menuitem"
              className="w-full px-3 py-3 text-left text-sm font-light hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                minHeight: '44px' 
              }}
            >
              <MessageSquare className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
              Messages
            </button>
            <button 
              role="menuitem"
              className="w-full px-3 py-3 text-left text-sm font-light hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                minHeight: '44px' 
              }}
            >
              <Music className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
              Music
            </button>
            <button 
              role="menuitem"
              className="w-full px-3 py-3 text-left text-sm font-light hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                minHeight: '44px' 
              }}
            >
              <Wifi className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
              WiFi
            </button>
            <button 
              role="menuitem"
              className="w-full px-3 py-3 text-left text-sm font-light hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                minHeight: '44px' 
              }}
            >
              <Battery className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }} />
              Battery
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Type definition for installed app
interface InstalledApp {
  installationId: string;
  appId: string;
  name: string;
  iconName: string;
  path: string;
  color: string;
  isPinned: boolean;
  launchCount: number;
  lastUsedAt: string | null;
  category: string;
  shortDescription: string;
}

// Helper to dynamically import Lucide icons
function getIconComponent(iconName: string) {
  // Import all lucide-react icons dynamically
  const icons: Record<string, any> = {
    Mail, Users, Calendar, FileText, CreditCard, Building, MessageSquare,
    Shield, Settings, BarChart, Home, Globe, Bell, Upload, ClockIcon
  };
  
  return icons[iconName] || Home; // Default to Home if icon not found
}

// App Launcher with grid view - Enhanced with search, history, and pagination
function AppLauncher({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState('apps');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');
  const [currentPage, setCurrentPage] = useState(0);
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user's installed apps
  useEffect(() => {
    async function fetchInstalledApps() {
      if (!isOpen) return; // Only fetch when launcher is open
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/user/installed-apps');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to fetch installed apps');
        }
        
        setApps(result.data || []);
      } catch (err: any) {
        console.error('Error fetching installed apps:', err);
        setError(err.message || 'Failed to load apps');
      } finally {
        setLoading(false);
      }
    }
    
    fetchInstalledApps();
  }, [isOpen]);

  const APPS_PER_PAGE = 12;

  // Filter and sort apps based on search query and sort preference
  const filteredApps = apps
    .filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned apps always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'recent') {
        // Sort by last used date
        if (!a.lastUsedAt && !b.lastUsedAt) return 0;
        if (!a.lastUsedAt) return 1;
        if (!b.lastUsedAt) return -1;
        return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
      }
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    currentPage * APPS_PER_PAGE,
    (currentPage + 1) * APPS_PER_PAGE
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev].slice(0, 5)); // Keep last 5 searches
    }
  };

  const handleAppClick = async (app: InstalledApp) => {
    // Track app usage
    try {
      await fetch('/api/user/installed-apps', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.appId,
          action: 'track-usage',
        }),
      });
    } catch (err) {
      console.error('Failed to track app usage:', err);
    }
    
    router.push(app.path);
    onClose();
    // Add to search history if searched
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="App launcher"
      className="fixed inset-0 z-40 animate-fadeIn"
      style={{ 
        backgroundColor: 'var(--glass-black-95)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div className="h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Search Area with Sorting and History */}
        <div 
          className="px-4 sm:px-6 md:px-8 pt-12 sm:pt-14 md:pt-16 pb-3 sm:pb-4"
          style={{ backgroundColor: 'var(--glass-black-60)' }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Search Bar with Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-12 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-light bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                  style={{ minHeight: '44px' }}
                  aria-label="Search apps"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowHistory(false);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-all"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                )}
              </div>

              {/* App Sorting Button */}
              <button
                onClick={() => setSortBy(prev => prev === 'name' ? 'recent' : 'name')}
                className="p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 transition-all active:scale-95"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Sort apps"
                title={sortBy === 'name' ? 'Sort by Recent' : 'Sort by Name'}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              </button>

              {/* Search History Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 transition-all active:scale-95 relative"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Search history"
                title="Search History"
              >
                <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                {searchHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {searchHistory.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search History Dropdown */}
            {showHistory && searchHistory.length > 0 && (
              <div 
                className="mt-2 p-2 rounded-xl bg-white/10 border border-white/20 animate-fadeIn"
              >
                <div className="text-xs sm:text-sm font-light text-white/60 px-3 py-1 uppercase tracking-wider">
                  Recent Searches
                </div>
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(query);
                      setShowHistory(false);
                    }}
                    className="w-full px-3 py-2 text-left text-white text-sm sm:text-base font-light hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
                    style={{ minHeight: '44px' }}
                  >
                    <ClockIcon className="w-4 h-4 text-white/60" />
                    {query}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSearchHistory([]);
                    setShowHistory(false);
                  }}
                  className="w-full px-3 py-2 text-center text-white/60 text-xs sm:text-sm font-light hover:bg-white/10 rounded-lg transition-all mt-1"
                  style={{ minHeight: '44px' }}
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab navigation - Responsive */}
        <div 
          className="flex items-center gap-1 px-2 sm:px-4 md:px-6 lg:px-8 pb-2 sm:pb-3 md:pb-4 overflow-x-auto"
          style={{ backgroundColor: 'var(--chrome-medium)' }}
          role="tablist"
        >
          {['apps', 'downloads', 'favorites', 'settings'].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${tab}-panel`}
              onClick={() => setActiveTab(tab)}
              className="px-3 sm:px-4 md:px-6 py-2 text-xs sm:text-sm font-light tracking-wider uppercase transition-all duration-200 rounded-t-lg whitespace-nowrap"
              style={{
                color: activeTab === tab ? 'var(--chrome-text)' : 'var(--text-tertiary)',
                backgroundColor: activeTab === tab ? 'var(--chrome-dark)' : 'transparent',
                minHeight: '44px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* App grid - Responsive columns */}
        <div 
          id={`${activeTab}-panel`}
          role="tabpanel"
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <p className="text-white/60 text-base sm:text-lg font-light">Loading apps...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-red-400/50" />
                <p className="text-white/80 text-base sm:text-lg font-light mb-2">Failed to Load Apps</p>
                <p className="text-white/60 text-sm font-light mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-light transition-all"
                  style={{ minHeight: '44px' }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : paginatedApps.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
              {paginatedApps.map((app) => {
                const AppIcon = getIconComponent(app.iconName);
                return (
                  <button
                    key={app.installationId}
                    onClick={() => handleAppClick(app)}
                    className="flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-200 active:scale-95 relative"
                    style={{ minHeight: '44px' }}
                    aria-label={`Open ${app.name}`}
                  >
                    {/* Pinned indicator */}
                    {app.isPinned && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-yellow-500/80 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    <div 
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-200 hover:scale-105"
                      style={{
                        backgroundColor: app.color || '#7a9eb5',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.9)'
                      }}
                    >
                      <AppIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-white text-xs sm:text-sm font-light text-center line-clamp-2">
                      {app.name}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <p className="text-white/60 text-base sm:text-lg font-light">
                  {searchQuery ? 'No apps found' : 'No apps installed'}
                </p>
                <button
                  onClick={() => searchQuery ? setSearchQuery('') : router.push('/dashboard/apps')}
                  className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-light transition-all"
                  style={{ minHeight: '44px' }}
                >
                  {searchQuery ? 'Clear Search' : 'Browse Apps'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div 
            className="flex items-center justify-center gap-2 px-4 py-4 sm:py-5"
            style={{ backgroundColor: 'var(--chrome-dark)' }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className="transition-all duration-200"
                style={{
                  width: currentPage === i ? '32px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  backgroundColor: currentPage === i ? 'var(--chrome-text)' : 'var(--glass-white-60)',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={`Go to page ${i + 1}`}
                aria-current={currentPage === i ? 'page' : undefined}
              >
                <span style={{
                  width: currentPage === i ? '32px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  backgroundColor: currentPage === i ? 'var(--chrome-text)' : 'var(--glass-white-60)',
                  display: 'block'
                }} />
              </button>
            ))}
          </div>
        )}

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden fixed top-4 right-4 p-3 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-95"
          style={{ 
            backgroundColor: 'var(--glass-black-40)',
            minWidth: '44px',
            minHeight: '44px'
          }}
          aria-label="Close app launcher"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAppLauncher, setShowAppLauncher] = useState(false);

  // Disabled for styling playground
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.replace('/auth/login');
  //   }
  // }, [status, router]);

  // Disabled for styling playground - skip loading check
  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center" style={{ 
  //       background: 'var(--bg-primary)'
  //     }}>
  //       <div className="text-center">
  //         <div className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
  //       </div>
  //     </div>
  //   );
  // }

  // Disabled for styling playground - skip session check
  // if (!session) {
  //   return null;
  // }

  // Mock user for styling playground
  const mockSession = session || {
    user: {
      id: 'mock-user',
      name: 'Styling Playground User',
      email: 'demo@loomos.com',
      role: 'ADMIN',
      organizationId: 'mock-org'
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* System Status Bar - Responsive - ALWAYS VISIBLE */}
      <SystemStatusBar 
        onOpenAppLauncher={() => setShowAppLauncher(true)}
        currentUser={mockSession.user}
      />

      {/* Main Content - Responsive padding */}
      <div className="pt-10 sm:pt-11 md:pt-12 h-screen overflow-hidden">
        {children}
      </div>


      {/* Global Search - Now handled by JustTypeSearch in root layout (/app/layout.tsx) */}
      {/* Use Cmd/Ctrl+K or just start typing to activate global search */}

      {/* App Launcher - Responsive */}
      <AppLauncher 
        isOpen={showAppLauncher}
        onClose={() => setShowAppLauncher(false)}
      />

      {/* Floating Dock with Gesture Button - webOS Style */}
      <Dock />

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        /* Smooth scrolling for all scrollable areas */
        * {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--glass-black-10);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.8);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        /* Focus visible for keyboard navigation */
        *:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}