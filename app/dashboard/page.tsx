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
        background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)',
      }}
    >
      {/* 3D Card Switcher View */}
      <Card3DView />

      {/* Main Desktop View - Welcome screen when no apps open */}
      {cards.length === 0 && (
        <div className="h-full w-full flex items-center justify-center p-8">
          <Card variant="glass" className="text-center space-y-6 max-w-2xl w-full">
            <h1 className="text-2xl font-light mb-4" style={{ color: '#4a4a4a' }}>
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-sm font-light mb-6" style={{ color: '#6a6a6a' }}>
              Open an app from the dock to get started
            </p>
            <div className="text-xs font-light" style={{ color: '#8a8a8a' }}>
              Press{' '}
              <kbd 
                className="px-2 py-1 rounded text-xs font-light"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.2)'
                }}
              >
                Cmd+K
              </kbd>
              {' '}or{' '}
              <kbd 
                className="px-2 py-1 rounded text-xs font-light"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.2)'
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
