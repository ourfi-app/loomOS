
/**
 * Smart link component for cross-app navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface AppLinkProps {
  appId: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function AppLink({ appId, label, className, showIcon = false, children }: AppLinkProps) {
  const router = useRouter();

  const appPaths: Record<string, { path: string; label: string }> = {
    'home': { path: '/dashboard', label: 'Home' },
    'ai-assistant': { path: '/dashboard/chat', label: 'AI Assistant' },
    'notifications': { path: '/dashboard/notifications', label: 'Notifications' },
    'profile': { path: '/dashboard/profile', label: 'My Profile' },
    'payments': { path: '/dashboard/payments', label: 'My Payments' },
    'documents': { path: '/dashboard/documents', label: 'Documents' },
    'directory': { path: '/dashboard/directory', label: 'Directory' },
    'marketplace': { path: '/dashboard/marketplace', label: 'App Store' },
    'admin-panel': { path: '/dashboard/admin', label: 'Admin Panel' },
    'messages': { path: '/dashboard/messages', label: 'Messages' },
    'calendar': { path: '/dashboard/apps/calendar', label: 'Calendar' },
    'tasks': { path: '/dashboard/apps/tasks', label: 'Tasks' },
    'notes': { path: '/dashboard/apps/notes', label: 'Notes' },
    'email': { path: '/dashboard/apps/email', label: 'Email' },
  };

  const appInfo = appPaths[appId];
  if (!appInfo) return null;

  const displayLabel = label || appInfo.label;

  return (
    <button
      onClick={() => router.push(appInfo.path)}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline',
        className
      )}
    >
      {children || displayLabel}
      {showIcon && <ExternalLink className="h-3 w-3" />}
    </button>
  );
}

