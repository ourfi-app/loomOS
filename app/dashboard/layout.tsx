
// loomOS Dashboard Layout - Full Design System Implementation
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Home, Users, CreditCard, FileText, MessageSquare, Settings, 
  Bell, User, Shield, Upload, Calendar, BarChart, Building,
  Mail, Globe, Music, Bluetooth, Wifi, Battery, Search, X,
  ChevronDown, LogOut, Clock as ClockIcon
} from 'lucide-react';

// System status bar with live clock and user profile
function SystemStatusBar({ 
  onOpenAppLauncher, 
  currentUser 
}: { 
  onOpenAppLauncher: () => void;
  currentUser: any;
}) {
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-4 z-50"
      style={{ 
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Left: loomOS logo */}
      <button
        onClick={onOpenAppLauncher}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="text-white font-light text-sm tracking-wide">loomOS</div>
      </button>

      {/* Center: System icons */}
      <div className="flex items-center gap-4">
        <Mail className="w-4 h-4 text-white/70" />
        <MessageSquare className="w-4 h-4 text-white/70" />
        <Music className="w-4 h-4 text-white/70" />
        <Bluetooth className="w-4 h-4 text-white/70" />
        <Wifi className="w-4 h-4 text-white/70" />
        <Battery className="w-4 h-4 text-white/70" />
      </div>

      {/* Right: Clock and user profile */}
      <div className="flex items-center gap-4">
        <div className="text-white/90 text-sm font-light">
          {formatTime(time)}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-3 h-3 text-white/70" />
          </button>
          
          {showProfileMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#2a2a2a',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="p-3 border-b border-white/10">
                <div className="text-white text-sm font-light">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-white/60 text-xs font-light">
                  {currentUser?.email || ''}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full px-3 py-2 text-left text-white/90 text-sm font-light hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// App Launcher with grid view
function AppLauncher({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState('apps');
  const router = useRouter();

  const apps = [
    { id: 'inbox', title: 'Mail', icon: Mail, path: '/dashboard/messages', color: '#7a9eb5' },
    { id: 'contacts', title: 'Contacts', icon: Users, path: '/dashboard/directory', color: '#b58a7a' },
    { id: 'calendar', title: 'Calendar', icon: Calendar, path: '/dashboard/apps/calendar', color: '#b5a07a' },
    { id: 'documents', title: 'Documents', icon: FileText, path: '/dashboard/documents', color: '#8ab57a' },
    { id: 'payments', title: 'Payments', icon: CreditCard, path: '/dashboard/payments', color: '#7ab5a0' },
    { id: 'community', title: 'Community', icon: Building, path: '/dashboard/my-community', color: '#9a7ab5' },
    { id: 'chat', title: 'AI Chat', icon: MessageSquare, path: '/dashboard/chat', color: '#b57a9e' },
    { id: 'admin', title: 'Admin', icon: Shield, path: '/dashboard/admin', color: '#7a8ab5' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40"
      style={{ backgroundColor: 'rgba(74, 74, 74, 0.95)' }}
      onClick={onClose}
    >
      <div className="h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Tab navigation */}
        <div 
          className="flex items-center gap-1 px-8 pt-16 pb-4"
          style={{ backgroundColor: '#5a5a5a' }}
        >
          {['apps', 'downloads', 'favorites', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-2 text-xs font-light tracking-wider uppercase transition-colors rounded-t-lg"
              style={{
                color: activeTab === tab ? '#fff' : '#aaa',
                backgroundColor: activeTab === tab ? '#4a4a4a' : 'transparent'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* App grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-7 gap-6 max-w-6xl mx-auto">
            {apps.map((app) => {
              const AppIcon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    router.push(app.path);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: app.color,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                    }}
                  >
                    <AppIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-xs font-light text-center">
                    {app.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Global search functionality
function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      // Mock search results
      setSearchResults({
        apps: [
          { id: 'mail', title: 'Mail', type: 'app' },
          { id: 'calendar', title: 'Calendar', type: 'app' },
        ],
        contacts: [
          { id: '1', name: 'John Doe', type: 'contact' },
        ],
        messages: [
          { id: '1', subject: 'Meeting tomorrow', type: 'message' },
        ]
      });
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-30">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}
      >
        <div className="flex items-center px-6 py-4">
          <Search className="w-5 h-5 mr-3" style={{ color: '#8a8a8a' }} />
          <input
            type="text"
            placeholder="JUST TYPE"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="flex-1 bg-transparent border-none outline-none text-base font-light"
            style={{ 
              color: '#4a4a4a',
              fontFamily: '"Helvetica Neue", Arial, sans-serif'
            }}
          />
          {searchQuery && (
            <button onClick={() => handleSearch('')}>
              <X className="w-4 h-4" style={{ color: '#8a8a8a' }} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {searchResults && isFocused && (
          <div 
            className="border-t px-6 py-4 max-h-96 overflow-y-auto"
            style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
          >
            {searchResults.apps && searchResults.apps.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-light tracking-wider uppercase mb-2" style={{ color: '#8a8a8a' }}>
                  APPS
                </div>
                {searchResults.apps.map((app: any) => (
                  <div key={app.id} className="py-2 text-sm font-light" style={{ color: '#4a4a4a' }}>
                    {app.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)'
      }}>
        <div className="text-center">
          <div className="text-sm font-light" style={{ color: '#8a8a8a' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* System Status Bar */}
      <SystemStatusBar 
        onOpenAppLauncher={() => setShowAppLauncher(true)}
        currentUser={session.user}
      />

      {/* Main Content */}
      <div className="pt-10 h-screen overflow-hidden">
        {children}
      </div>

      {/* Global Search */}
      <GlobalSearch />

      {/* App Launcher */}
      <AppLauncher 
        isOpen={showAppLauncher}
        onClose={() => setShowAppLauncher(false)}
      />
    </div>
  );
}
