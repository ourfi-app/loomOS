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
      className="relative h-full w-full overflow-hidden"
      style={{
        background: 'linear-gradient(to top, #f0f2f5, #ffffff)',
      }}
    >
      {/* 3D Card Switcher View */}
      <Card3DView />

      {/* Main Desktop View - Welcome screen when no apps open */}
      {cards.length === 0 && (
        <div className="h-full w-full flex items-center justify-center">
          <div
            className="text-center space-y-4 max-w-2xl px-6"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: '400',
                color: 'var(--text-primary)',
                letterSpacing: '0.5px'
              }}
            >
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                color: 'var(--text-secondary)'
              }}
            >
              Open an app from the dock to get started
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: '300',
                color: 'var(--text-tertiary)'
              }}
            >
              Press <kbd
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '0.375rem',
                  color: 'var(--text-primary)'
                }}
              >Cmd+K</kbd> or <kbd
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '0.375rem',
                  color: 'var(--text-primary)'
                }}
              >Ctrl+K</kbd> for universal search
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
