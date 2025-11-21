'use client';

import { useCardManager } from '@/lib/card-manager-store';
import { useSession } from 'next-auth/react';
import { useRoleBasedPreloader } from '@/lib/route-preloader';
import { Card3DView } from '@/components/webos/card-3d-view';
import { Card } from '@/components/core/cards/Card';

export default function DashboardPage() {
  const { cards } = useCardManager();
  const { data: session } = useSession() || {};

  // Preload routes based on user role for faster navigation
  useRoleBasedPreloader(session?.user?.role);

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

      {/* Main Desktop View - Welcome screen when no apps open */}
      {cards.length === 0 && (
        <div className="h-full w-full flex items-center justify-center p-8">
          <Card 
            variant="glass" 
            className="text-center space-y-6 max-w-2xl w-full rounded-3xl"
            style={{
              background: 'var(--webos-bg-glass)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--webos-border-glass)',
              boxShadow: 'var(--webos-shadow-xl)',
              padding: '2rem'
            }}
          >
            <h1 
              className="text-2xl font-light tracking-tight mb-4" 
              style={{ color: 'var(--webos-text-primary)' }}
            >
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p 
              className="text-sm font-light mb-6" 
              style={{ color: 'var(--webos-text-tertiary)' }}
            >
              Open an app from the dock to get started
            </p>
            <div 
              className="text-xs font-light tracking-wide" 
              style={{ color: 'var(--webos-text-secondary)' }}
            >
              Press{' '}
              <kbd 
                className="px-2 py-1 rounded-xl text-xs font-light"
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
                className="px-2 py-1 rounded-xl text-xs font-light"
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
          </Card>
        </div>
      )}
    </div>
  );
}
