'use client';

import { useCardManager } from '@/lib/card-manager-store';
import { useSession } from 'next-auth/react';
import { useRoleBasedPreloader } from '@/lib/route-preloader';

export default function DashboardPage() {
  const { cards } = useCardManager();
  const { data: session } = useSession() || {};
  
  // Preload routes based on user role for faster navigation
  useRoleBasedPreloader(session?.user?.role);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Main Desktop View - Simple Welcome */}
      {cards.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center">
          <div
            className="text-center space-y-4 max-w-2xl px-6"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-2xl)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <h1
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em'
              }}
            >
              Welcome back, {session?.user?.name || 'User'}! 👋
            </h1>
            <p
              style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--text-secondary)'
              }}
            >
              Open an app from the dock to get started
            </p>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)'
              }}
            >
              Press <kbd
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              >Cmd+K</kbd> or <kbd
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              >Ctrl+K</kbd> for universal search
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
