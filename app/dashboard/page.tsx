

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Globe, Mail, Calendar, 
  MapPin, Paperclip, Star, Home, MessageSquare, 
  Users, FileText, Settings, X, Minimize, LucideIcon,
  Loader2, AlertCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Type definitions
interface InstalledApp {
  installationId: string;
  installedAt: string;
  lastUsedAt: string | null;
  isPinned: boolean;
  launchCount: number;
  appId: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconName: string;
  color: string;
  path: string;
  category: string;
  isSystem: boolean;
}

// Email data for Mail app
const emailData = {
  folders: [
    { id: 'all-inboxes', name: 'All Inboxes', count: 12 },
    { id: 'gmail', name: 'Gmail', count: 5 },
    { id: 'yahoo', name: 'Yahoo', count: 4 },
    { id: 'exchange', name: 'Exchange', count: 3 },
    { id: 'starred', name: 'Starred', count: 2, isStarred: true }
  ],
  messages: [
    {
      id: 1,
      from: 'John Smith',
      subject: 'Q4 Budget Review',
      preview: 'Please review the attached budget proposal for Q4...',
      time: '10:30 AM',
      date: 'Nov 23, 2025',
      hasAttachment: true,
      body: 'Hi team,\n\nPlease review the attached budget proposal for Q4. We need to finalize this by end of week.\n\nBest regards,\nJohn'
    },
    {
      id: 2,
      from: 'Sarah Johnson',
      subject: 'Meeting Reschedule',
      preview: 'Can we move tomorrow\'s meeting to 3 PM?',
      time: '9:15 AM',
      date: 'Nov 23, 2025',
      hasAttachment: false,
      body: 'Hi,\n\nCan we move tomorrow\'s meeting to 3 PM? I have a conflict at 2 PM.\n\nThanks,\nSarah'
    },
    {
      id: 3,
      from: 'Mike Davis',
      subject: 'Project Update',
      preview: 'The new feature is ready for testing...',
      time: 'Yesterday',
      date: 'Nov 22, 2025',
      hasAttachment: false,
      body: 'Team,\n\nThe new feature is ready for testing. Please check it out and let me know if you find any issues.\n\nMike'
    }
  ]
};

// Stack card positioning helper
function getStackCardPosition(cardIndex: number, totalCards: number, isExpanded: boolean, isCentered: boolean) {
  if (!isCentered || !isExpanded) {
    const rotationAngle = (cardIndex - (totalCards - 1) / 2) * 8;
    const horizontalOffset = (cardIndex - (totalCards - 1) / 2) * 35;
    // Keep vertical offset at 0 to maintain horizontal alignment
    const verticalOffset = 0;
    return {
      translateX: horizontalOffset,
      translateY: verticalOffset,
      rotate: rotationAngle,
      scale: 1 - (Math.abs(cardIndex - (totalCards - 1) / 2) * 0.03)
    };
  } else {
    const spread = 500;
    const offset = (cardIndex - (totalCards - 1) / 2) * spread;
    return {
      translateX: offset,
      translateY: 0,
      rotate: 0,
      scale: 1
    };
  }
}

// Helper function to get Lucide icon component from icon name
function getIconComponent(iconName: string): LucideIcon {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || Globe; // Default to Globe if icon not found
}

export default function DashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('all-inboxes');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Fetch user's installed apps
  useEffect(() => {
    async function fetchInstalledApps() {
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
  }, []);

  const handlePrevCard = () => {
    setCurrentCard((prev) => (prev > 0 ? prev - 1 : apps.length - 1));
  };

  const handleNextCard = () => {
    setCurrentCard((prev) => (prev < apps.length - 1 ? prev + 1 : 0));
  };

  const handleCardClick = async (app: InstalledApp) => {
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
    
    // Navigate to the app
    if (app.slug === 'mail' || app.slug === 'messages') {
      setActiveApp('mail');
    } else {
      router.push(app.path);
    }
  };

  // Render full Mail app
  const renderMailApp = () => (
    <div 
      className="absolute inset-0 flex flex-col"
      style={{
        backgroundColor: 'var(--semantic-surface-base)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Mail app header */}
      <div 
        className="flex items-center justify-between px-6 py-3"
        style={{
          backgroundColor: 'var(--semantic-bg-subtle)',
          borderBottom: '1px solid var(--glass-black-10)'
        }}
      >
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5" style={{ color: 'var(--semantic-text-primary)' }} />
          <span className="text-base font-light" style={{ color: 'var(--semantic-text-primary)' }}>Mail</span>
        </div>
        <button onClick={() => setActiveApp(null)}>
          <X className="w-5 h-5" style={{ color: 'var(--semantic-text-secondary)' }} />
        </button>
      </div>

      {/* Three-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Folders */}
        <div 
          className="w-48 border-r overflow-y-auto"
          style={{ 
            backgroundColor: '#f8f8f8',
            borderColor: 'var(--glass-black-10)'
          }}
        >
          <div className="p-3">
            <div className="text-xs font-light tracking-wider uppercase mb-3" style={{ color: 'var(--semantic-text-tertiary)' }}>
              FAVORITES
            </div>
            {emailData.folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors"
                style={{
                  backgroundColor: selectedFolder === folder.id ? 'rgba(122, 158, 181, 0.2)' : 'transparent',
                  color: 'var(--semantic-text-primary)'
                }}
              >
                <div className="flex items-center gap-2">
                  {folder.isStarred && <Star className="w-3 h-3" style={{ color: '#b5a07a' }} />}
                  <span className="text-sm font-light">{folder.name}</span>
                </div>
                <span className="text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
                  {folder.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div 
          className="w-80 border-r overflow-y-auto"
          style={{ 
            backgroundColor: '#fff',
            borderColor: 'var(--glass-black-10)'
          }}
        >
          {emailData.messages.map((message) => (
            <button
              key={message.id}
              onClick={() => setSelectedEmail(message)}
              className="w-full px-4 py-3 border-b text-left transition-colors hover:bg-gray-50"
              style={{
                borderColor: 'rgba(0,0,0,0.05)',
                backgroundColor: selectedEmail?.id === message.id ? '#f0f8ff' : 'transparent'
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-light" style={{ color: 'var(--semantic-text-primary)' }}>
                  {message.from}
                </span>
                <span className="text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
                  {message.time}
                </span>
              </div>
              <div className="text-sm font-light mb-1" style={{ color: 'var(--semantic-text-secondary)' }}>
                {message.subject}
              </div>
              <div className="text-xs font-light flex items-center gap-2" style={{ color: 'var(--semantic-text-muted)' }}>
                {message.preview.substring(0, 50)}...
                {message.hasAttachment && <Paperclip className="w-3 h-3" />}
              </div>
            </button>
          ))}
        </div>

        {/* Detail Pane */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#fff' }}>
          {selectedEmail ? (
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#7a9eb5' }}
                >
                  <span className="text-white font-light">
                    {selectedEmail.from.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-base font-light mb-1" style={{ color: 'var(--semantic-text-primary)' }}>
                    {selectedEmail.from}
                  </div>
                  <div className="text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
                    {selectedEmail.date} at {selectedEmail.time}
                  </div>
                </div>
              </div>
              <h2 className="text-lg font-light mb-4" style={{ color: 'var(--semantic-text-primary)' }}>
                {selectedEmail.subject}
              </h2>
              <div 
                className="text-sm font-light whitespace-pre-wrap"
                style={{ color: 'var(--semantic-text-secondary)', lineHeight: '1.6' }}
              >
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4" style={{ color: '#d0d0d0' }} />
                <p className="text-sm font-light" style={{ color: 'var(--semantic-text-muted)' }}>
                  Select a message to read
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render active app
  if (activeApp === 'mail') {
    return (
      <div className="h-full relative">
        {renderMailApp()}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div 
        className="h-full relative overflow-hidden flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)',
          fontFamily: '"Helvetica Neue", Arial, sans-serif'
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--semantic-text-secondary)' }} />
          <p className="text-base font-light" style={{ color: 'var(--semantic-text-secondary)' }}>
            Loading your apps...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className="h-full relative overflow-hidden flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)',
          fontFamily: '"Helvetica Neue", Arial, sans-serif'
        }}
      >
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-16 h-16" style={{ color: '#ef4444' }} />
          <h3 className="text-xl font-light" style={{ color: 'var(--semantic-text-primary)' }}>
            Failed to Load Apps
          </h3>
          <p className="text-sm font-light" style={{ color: 'var(--semantic-text-secondary)' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-light transition-colors"
            style={{
              backgroundColor: '#7a9eb5',
              color: 'white',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (apps.length === 0) {
    return (
      <div 
        className="h-full relative overflow-hidden flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)',
          fontFamily: '"Helvetica Neue", Arial, sans-serif'
        }}
      >
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <FileText className="w-16 h-16" style={{ color: 'var(--semantic-text-tertiary)' }} />
          <h3 className="text-xl font-light" style={{ color: 'var(--semantic-text-primary)' }}>
            No Apps Installed
          </h3>
          <p className="text-sm font-light" style={{ color: 'var(--semantic-text-secondary)' }}>
            Visit the App Store to install apps and get started.
          </p>
          <button
            onClick={() => router.push('/dashboard/apps')}
            className="px-6 py-2 rounded-lg font-light transition-colors"
            style={{
              backgroundColor: '#7a9eb5',
              color: 'white',
            }}
          >
            Browse Apps
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard view with card carousel
  return (
    <div 
      className="h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Card Carousel */}
      <div className="h-full flex items-center justify-center px-8 md:px-16">
        <div className="relative w-full max-w-5xl h-[500px]">
          {/* Navigation buttons - Only show if more than 1 app */}
          {apps.length > 1 && (
            <>
              <button
                onClick={handlePrevCard}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: 'var(--glass-white-80)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                }}
              >
                <ChevronLeft className="w-6 h-6" style={{ color: 'var(--semantic-text-primary)' }} />
              </button>
              <button
                onClick={handleNextCard}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: 'var(--glass-white-80)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                }}
              >
                <ChevronRight className="w-6 h-6" style={{ color: 'var(--semantic-text-primary)' }} />
              </button>
            </>
          )}

          {/* Cards */}
          <div className="relative h-full flex items-center justify-center">
            {apps.map((app, index) => {
              const isCentered = index === currentCard;
              const IconComponent = getIconComponent(app.iconName);

              // Render app card
              return (
                <button
                  key={app.installationId}
                  onClick={() => isCentered && handleCardClick(app)}
                  className="absolute transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl"
                  style={{
                    width: '400px',
                    height: '300px',
                    backgroundColor: app.color || 'var(--semantic-surface-base)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transform: `translateX(${(index - currentCard) * 420}px) scale(${isCentered ? 1 : 0.85})`,
                    opacity: isCentered ? 1 : 0.5,
                    zIndex: isCentered ? 10 : 1
                  }}
                >
                  <div className="p-8 h-full flex flex-col">
                    {/* App Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <IconComponent className="w-6 h-6" style={{ color: 'var(--semantic-text-primary)' }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-light" style={{ color: 'var(--semantic-text-primary)' }}>
                            {app.name}
                          </h3>
                          {app.isPinned && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-current" style={{ color: '#b5a07a' }} />
                              <span className="text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
                                Pinned
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-light px-2 py-1 rounded" style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--semantic-text-tertiary)'
                      }}>
                        {app.category}
                      </div>
                    </div>

                    {/* App Description */}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-light line-clamp-3" style={{ color: 'var(--semantic-text-secondary)' }}>
                        {app.shortDescription || 'No description available'}
                      </p>
                    </div>

                    {/* App Stats */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                      <div className="flex items-center justify-between text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
                        <div className="flex items-center gap-4">
                          <span>Used {app.launchCount} times</span>
                          {app.lastUsedAt && (
                            <span>
                              Last: {new Date(app.lastUsedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {isCentered && (
                          <span className="text-sm" style={{ color: 'var(--semantic-text-primary)' }}>
                            Click to open →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dock */}
      <div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl flex items-center gap-4"
        style={{
          backgroundColor: 'var(--glass-white-60)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}
      >
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#7a9eb5' }}
          >
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: 'var(--semantic-text-secondary)' }}>Home</span>
        </button>
        <button 
          onClick={() => setActiveApp('mail')}
          className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#b58a7a' }}
          >
            <Mail className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: 'var(--semantic-text-secondary)' }}>Mail</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#8ab57a' }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: 'var(--semantic-text-secondary)' }}>Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#b5a07a' }}
          >
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-light" style={{ color: 'var(--semantic-text-secondary)' }}>Calendar</span>
        </button>
      </div>
    </div>
  );
}

