'use client';

import { useState } from 'react';
import { useCardManager } from '@/lib/card-manager-store';
import { useSession } from 'next-auth/react';
import { useRoleBasedPreloader } from '@/lib/route-preloader';
import { Card3DView } from '@/components/webos/card-3d-view';
import { Card } from '@/components/core/cards/Card';
import { Search, Mail, Users, Calendar, FileText, DollarSign, Home } from 'lucide-react';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { cards, openApp } = useCardManager();
  const { data: session } = useSession() || {};
  const [searchFocused, setSearchFocused] = useState(false);

  // Preload routes based on user role for faster navigation
  useRoleBasedPreloader(session?.user?.role);

  // Featured apps for the home screen carousel
  const featuredApps = [
    { id: 'inbox', icon: Mail, preview: '/previews/inbox.jpg' },
    { id: 'contacts', icon: Users, preview: '/previews/contacts.jpg' },
    { id: 'organizer', icon: Calendar, preview: '/previews/calendar.jpg' },
    { id: 'documents', icon: FileText, preview: '/previews/documents.jpg' },
    { id: 'accounting', icon: DollarSign, preview: '/previews/accounting.jpg' },
    { id: 'my-household', icon: Home, preview: '/previews/household.jpg' },
  ];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      {/* 3D Card Switcher View */}
      <Card3DView />

      {/* Main Desktop View - webOS Home Screen when no apps open */}
      {cards.length === 0 && (
        <div className="h-full w-full flex flex-col items-center justify-start p-8 pt-24">
          {/* "JUST TYPE" Search Bar - webOS Style */}
          <div className="w-full max-w-2xl mb-12 space-y-2">
            <div 
              className="text-xs font-light text-center tracking-[0.3em] uppercase"
              style={{ 
                color: 'var(--webos-text-tertiary)',
                opacity: searchFocused ? 0 : 1, 
                transition: 'opacity 0.3s ease-out' 
              }}
            >
              Just Type
            </div>
            <div
              className={cn(
                "relative rounded-full overflow-hidden transition-all duration-300",
                "bg-white backdrop-blur-sm",
                searchFocused ? "ring-2 ring-offset-2" : ""
              )}
              style={{
                border: '1px solid var(--webos-border-light)',
                boxShadow: searchFocused 
                  ? 'var(--webos-shadow-elevated), 0 0 0 3px rgba(128, 128, 128, 0.1)'
                  : 'var(--webos-shadow-card)',
                ringColor: searchFocused ? 'var(--webos-accent-blue)' : 'transparent'
              }}
            >
              <div className="flex items-center px-6 py-3.5">
                <Search 
                  className="w-5 h-5 mr-3" 
                  style={{ color: 'var(--webos-text-tertiary)' }}
                />
                <input
                  type="text"
                  placeholder="Search apps, contacts, messages..."
                  className="flex-1 bg-transparent border-none outline-none text-base font-light placeholder:font-light"
                  style={{ 
                    color: 'var(--webos-text-primary)',
                    fontFamily: '"Helvetica Neue", Arial, sans-serif'
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>
          </div>

          {/* App Preview Cards - webOS Style Carousel */}
          <div className="w-full max-w-6xl">
            <h2 
              className="text-sm font-light mb-6 px-4 uppercase tracking-wide"
              style={{ color: 'var(--webos-text-secondary)' }}
            >
              Recent Apps
            </h2>
            
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-6 px-4 snap-x snap-mandatory hide-scrollbar">
                {featuredApps.map((app, index) => {
                  const appDef = APP_REGISTRY[app.id];
                  const AppIcon = app.icon;
                  
                  // Muted webOS-style gradients
                  const webOSGradients = [
                    'linear-gradient(135deg, #9ca3a0 0%, #b8bfbc 100%)', // Gray
                    'linear-gradient(135deg, #8ba87d 0%, #a3b89a 100%)', // Green
                    'linear-gradient(135deg, #b58a7a 0%, #c4a090 100%)', // Brown
                    'linear-gradient(135deg, #9d8ab5 0%, #b3a0c4 100%)', // Purple
                    'linear-gradient(135deg, #7ab5a8 0%, #90c4b8 100%)', // Teal
                    'linear-gradient(135deg, #b57a9e 0%, #c490ae 100%)', // Rose
                  ];
                  
                  return (
                    <div
                      key={app.id}
                      className="flex-shrink-0 snap-center"
                      style={{
                        animation: `scale-in 0.4s ease-out ${index * 0.08}s backwards`
                      }}
                    >
                      <button
                        onClick={() => openApp(app.id)}
                        className="group relative w-80 h-48 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-102 focus:outline-none focus:ring-2"
                        style={{
                          background: 'white',
                          border: '1px solid var(--webos-border-light)',
                          boxShadow: 'var(--webos-shadow-card)',
                          transition: 'all 0.3s var(--webos-ease-out)',
                          ringColor: 'var(--webos-accent-blue)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = 'var(--webos-shadow-card-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'var(--webos-shadow-card)';
                        }}
                      >
                        {/* App Preview Content */}
                        <div className="absolute inset-0 flex flex-col">
                          {/* Header with App Info */}
                          <div 
                            className="flex items-center gap-3 p-5"
                            style={{
                              background: webOSGradients[index % webOSGradients.length]
                            }}
                          >
                            <div 
                              className="w-11 h-11 rounded-xl flex items-center justify-center"
                              style={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <AppIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="text-white font-light text-base tracking-tight">
                                {appDef?.title || app.id}
                              </h3>
                              <p className="text-white/80 text-xs font-light">
                                {appDef?.description?.substring(0, 28) || 'Open app'}...
                              </p>
                            </div>
                          </div>

                          {/* Preview Area */}
                          <div 
                            className="flex-1 flex items-center justify-center p-6"
                            style={{ background: 'var(--webos-bg-secondary)' }}
                          >
                            <div className="text-center opacity-30">
                              <AppIcon 
                                className="w-14 h-14 mx-auto mb-2" 
                                style={{ color: 'var(--webos-text-tertiary)' }}
                              />
                              <p 
                                className="text-xs font-light"
                                style={{ color: 'var(--webos-text-secondary)' }}
                              >
                                Preview
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div 
            className="mt-8 text-xs font-light tracking-wide"
            style={{ color: 'var(--webos-text-tertiary)' }}
          >
            Press{' '}
            <kbd 
              className="px-2 py-0.5 rounded text-xs font-light"
              style={{ 
                backgroundColor: 'white',
                border: '1px solid var(--webos-border-light)',
                boxShadow: 'var(--webos-shadow-sm)',
                color: 'var(--webos-text-secondary)',
                fontFamily: '"Helvetica Neue", monospace'
              }}
            >
              Cmd+K
            </kbd>
            {' '}or{' '}
            <kbd 
              className="px-2 py-0.5 rounded text-xs font-light"
              style={{ 
                backgroundColor: 'white',
                border: '1px solid var(--webos-border-light)',
                boxShadow: 'var(--webos-shadow-sm)',
                color: 'var(--webos-text-secondary)',
                fontFamily: '"Helvetica Neue", monospace'
              }}
            >
              Ctrl+K
            </kbd>
            {' '}for universal search
          </div>
        </div>
      )}
    </div>
  );
}
