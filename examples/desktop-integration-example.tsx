/**
 * Example: Desktop Integration
 * 
 * This file demonstrates how to integrate the Desktop App Launcher system
 * into your loomOS dashboard.
 */

'use client';

import { Desktop } from '@/components/desktop';
import { useAppStore } from '@/lib/store/appStore';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';

export default function DashboardWithDesktopExample() {
  const { runningApps, isAppRunning, launchApp } = useAppStore();

  // Get some featured apps
  const featuredApps = APP_REGISTRY.filter(app => 
    ['organizer', 'inbox', 'documents', 'community'].includes(app.id)
  );

  return (
    <Desktop showDock={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            Welcome to loomOS
          </h1>
          <p className="text-xl text-text-secondary">
            Your personal operating system
          </p>
          
          {/* Running Apps Indicator */}
          {runningApps.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 text-accent-blue">
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              <span className="text-sm font-medium">
                {runningApps.length} app{runningApps.length > 1 ? 's' : ''} running
              </span>
            </div>
          )}
        </div>

        {/* Quick Launch Cards */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Quick Launch
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredApps.map((app) => {
              const Icon = app.icon;
              const running = isAppRunning(app.id);
              
              return (
                <button
                  key={app.id}
                  onClick={() => launchApp(app)}
                  className={cn(
                    'group relative p-6 rounded-2xl bg-bg-surface hover:bg-bg-elevated',
                    'border border-border-light hover:border-border-medium',
                    'transition-all duration-200 hover:shadow-lg',
                    'text-left'
                  )}
                >
                  {/* Running Indicator */}
                  {running && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                  )}
                  
                  {/* App Icon */}
                  <div
                    className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
                      'bg-gradient-to-br shadow-md group-hover:shadow-xl transition-shadow',
                      app.gradient || 'from-gray-500 to-gray-700'
                    )}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* App Info */}
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {app.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {app.description || 'Launch this app'}
                  </p>
                  
                  {/* Launch Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-accent-blue">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Quick Stats
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Apps"
              value={APP_REGISTRY.length}
              icon="📱"
              color="blue"
            />
            <StatCard
              title="Running Apps"
              value={runningApps.length}
              icon="⚡"
              color="green"
            />
            <StatCard
              title="Minimized Apps"
              value={runningApps.filter(a => a.state === 'minimized').length}
              icon="📋"
              color="purple"
            />
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="max-w-7xl mx-auto mt-12 p-6 rounded-2xl bg-bg-surface border border-border-light">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            ⌨️ Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-bg-secondary text-text-secondary font-mono">
                ⌘ Space
              </kbd>
              <span className="text-text-secondary">Open App Launcher</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-bg-secondary text-text-secondary font-mono">
                Esc
              </kbd>
              <span className="text-text-secondary">Close Launcher</span>
            </div>
          </div>
        </div>
      </div>
    </Desktop>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="p-6 rounded-2xl bg-bg-surface border border-border-light">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          'bg-gradient-to-br shadow-md',
          colorClasses[color]
        )}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-3xl font-bold text-text-primary">
          {value}
        </div>
      </div>
      <h4 className="text-sm font-medium text-text-secondary">
        {title}
      </h4>
    </div>
  );
}
