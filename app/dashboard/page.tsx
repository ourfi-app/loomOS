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
          <div className="w-full max-w-2xl mb-12 space-y-3">
            <div 
              className="text-xs font-light text-[var(--webos-text-tertiary)] text-center tracking-[0.3em] uppercase"
              style={{ opacity: searchFocused ? 0 : 1, transition: 'opacity 0.3s' }}
            >
              Just Type
            </div>
            <div
              className={cn(
                "relative rounded-full overflow-hidden transition-all duration-300",
                "bg-white/90 backdrop-blur-xl shadow-xl",
                searchFocused ? "ring-2 ring-blue-400" : ""
              )}
              style={{
                border: '1px solid rgba(207, 204, 199, 0.3)',
                boxShadow: searchFocused 
                  ? '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.1)'
                  : '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center px-6 py-4">
                <Search className="w-5 h-5 text-[var(--webos-text-tertiary)] mr-3" />
                <input
                  type="text"
                  placeholder="Search apps, contacts, messages..."
                  className="flex-1 bg-transparent border-none outline-none text-base font-light"
                  style={{ color: 'var(--webos-text-primary)' }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>
          </div>

          {/* App Preview Cards - webOS Style Carousel */}
          <div className="w-full max-w-6xl">
            <h2 
              className="text-sm font-light text-[var(--webos-text-secondary)] mb-6 px-4 uppercase tracking-wide"
            >
              Recent Apps
            </h2>
            
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-6 px-4 snap-x snap-mandatory hide-scrollbar">
                {featuredApps.map((app, index) => {
                  const appDef = APP_REGISTRY[app.id];
                  const AppIcon = app.icon;
                  
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
                        className="group relative w-80 h-48 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(207, 204, 199, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                        }}
                      >
                        {/* App Preview Content */}
                        <div className="absolute inset-0 flex flex-col">
                          {/* Header with App Info */}
                          <div 
                            className="flex items-center gap-3 p-6 bg-gradient-to-br"
                            style={{
                              background: appDef?.gradient 
                                ? `linear-gradient(135deg, ${appDef.gradient.split(' ')[0].replace('from-', '')} 0%, ${appDef.gradient.split(' ')[1].replace('to-', '')} 100%)`
                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            }}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                              <AppIcon className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="text-white font-semibold text-lg">
                                {appDef?.title || app.id}
                              </h3>
                              <p className="text-white/80 text-xs">
                                {appDef?.description?.substring(0, 30) || 'Open app'}...
                              </p>
                            </div>
                          </div>

                          {/* Preview Area */}
                          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                            <div className="text-center opacity-40">
                              <AppIcon className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                              <p className="text-xs text-gray-500">Preview coming soon</p>
                            </div>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div 
            className="mt-8 text-xs font-light tracking-wide text-[var(--webos-text-tertiary)]"
          >
            Press{' '}
            <kbd 
              className="px-2 py-1 rounded-lg text-xs font-light"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                border: '1px solid var(--webos-border-secondary)',
                boxShadow: 'var(--webos-shadow-sm)'
              }}
            >
              Cmd+K
            </kbd>
            {' '}or{' '}
            <kbd 
              className="px-2 py-1 rounded-lg text-xs font-light"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                border: '1px solid var(--webos-border-secondary)',
                boxShadow: 'var(--webos-shadow-sm)'
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
