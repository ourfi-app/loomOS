'use client';

import { useCardManager } from '@/lib/card-manager-store';
import { useSession } from 'next-auth/react';
import { useRoleBasedPreloader } from '@/lib/route-preloader';
import { Card3DView } from '@/components/webos/card-3d-view';

export default function DashboardPage() {
  const { cards } = useCardManager();
  const { data: session } = useSession() || {};

  // Preload routes based on user role for faster navigation
  useRoleBasedPreloader(session?.user?.role);

  return (
    <div
      className="relative h-full w-full overflow-hidden webos-gradient-bg"
      style={{
        background: 'var(--semantic-bg-base)',
      }}
    >
      {/* 3D Card Switcher View */}
      <Card3DView />

      {/* Main Desktop View - Welcome screen when no apps open */}
      {cards.length === 0 && (
        <div className="h-full w-full flex items-center justify-center p-8">
          <div className="webos-card text-center space-y-6 max-w-2xl w-full">
            <div className="webos-card-body">
              <h1 className="webos-heading-1 mb-4">
                Welcome back, {session?.user?.name || 'User'}!
              </h1>
              <p className="webos-body text-secondary mb-6">
                Open an app from the dock to get started
              </p>
              <div className="webos-caption">
                Press{' '}
                <kbd className="webos-kbd">Cmd+K</kbd>
                {' '}or{' '}
                <kbd className="webos-kbd">Ctrl+K</kbd>
                {' '}for universal search
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
