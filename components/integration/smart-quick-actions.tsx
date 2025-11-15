
/**
 * Smart Quick Actions Panel
 * Context-aware quick actions based on current app and data
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  CreditCard,
  Calendar,
  CheckSquare,
  MessageSquare,
  FileText,
  Users,
  Bell,
  Plus,
  Upload,
  Send,
  Sparkles,
  Clock,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  color?: string;
  priority: number;
}

export function SmartQuickActions() {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const router = useRouter();
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [stats, setStats] = useState({
    pendingPayments: 0,
    unreadMessages: 0,
    activeTasks: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    fetchStats();
    updateActions();
  }, [pathname, session]);

  const fetchStats = async () => {
    try {
      const [paymentsRes, messagesRes, tasksRes, eventsRes] = await Promise.allSettled([
        fetch('/api/payments?status=PENDING&status=OVERDUE'),
        fetch('/api/messages?folder=inbox&unread=true'),
        fetch('/api/tasks?status=TODO&status=IN_PROGRESS'),
        fetch('/api/calendar?upcoming=true'),
      ]);

      const newStats = {
        pendingPayments: 0,
        unreadMessages: 0,
        activeTasks: 0,
        upcomingEvents: 0,
      };

      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
        const data = await paymentsRes.value.json();
        newStats.pendingPayments = (data.payments || []).length;
      }

      if (messagesRes.status === 'fulfilled' && messagesRes.value.ok) {
        const data = await messagesRes.value.json();
        newStats.unreadMessages = (data.messages || []).length;
      }

      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const data = await tasksRes.value.json();
        newStats.activeTasks = (data || []).length;
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
        const data = await eventsRes.value.json();
        newStats.upcomingEvents = (data || []).length;
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateActions = () => {
    const allActions: QuickAction[] = [];
    const isAdmin = (session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'SUPER_ADMIN';

    // Global actions (always available)
    allActions.push({
      id: 'ai-assistant',
      label: 'Ask AI',
      icon: Sparkles,
      path: '/dashboard/chat',
      color: 'text-amber-600',
      priority: 100,
    });

    // Context-aware actions based on current page
    if (pathname?.includes('/payments')) {
      allActions.push({
        id: 'new-payment',
        label: 'Record Payment',
        icon: DollarSign,
        path: '/dashboard/payments/new',
        priority: 90,
      });
      if (isAdmin) {
        allActions.push({
          id: 'export-payments',
          label: 'Export Report',
          icon: FileText,
          path: '/dashboard/accounting?action=export',
          priority: 70,
        });
      }
    }

    if (pathname?.includes('/documents')) {
      allActions.push({
        id: 'upload-document',
        label: 'Upload Document',
        icon: Upload,
        path: '/dashboard/documents?action=upload',
        priority: 90,
      });
      allActions.push({
        id: 'search-documents',
        label: 'Search Documents',
        icon: FileText,
        path: '/dashboard/documents?action=search',
        priority: 70,
      });
    }

    if (pathname?.includes('/directory')) {
      allActions.push({
        id: 'send-message',
        label: 'Send Message',
        icon: MessageSquare,
        path: '/dashboard/messages/compose',
        priority: 85,
      });
      allActions.push({
        id: 'export-directory',
        label: 'Export Directory',
        icon: Users,
        path: '/dashboard/directory?action=export',
        priority: 60,
      });
    }

    if (pathname?.includes('/tasks')) {
      allActions.push({
        id: 'new-task',
        label: 'New Task',
        icon: Plus,
        path: '/dashboard/apps/tasks/create',
        priority: 90,
      });
      allActions.push({
        id: 'schedule-task',
        label: 'Schedule on Calendar',
        icon: Calendar,
        path: '/dashboard/apps/calendar',
        priority: 70,
      });
    }

    if (pathname?.includes('/calendar')) {
      allActions.push({
        id: 'new-event',
        label: 'New Event',
        icon: Plus,
        path: '/dashboard/apps/calendar/create',
        priority: 90,
      });
      allActions.push({
        id: 'create-task-from-event',
        label: 'Create Task',
        icon: CheckSquare,
        path: '/dashboard/apps/tasks/create',
        priority: 70,
      });
    }

    if (pathname?.includes('/messages')) {
      allActions.push({
        id: 'compose',
        label: 'Compose Message',
        icon: Send,
        path: '/dashboard/messages/compose',
        priority: 90,
      });
    }

    // High-priority actions based on stats
    if (stats.pendingPayments > 0) {
      allActions.push({
        id: 'view-pending-payments',
        label: 'Pending Payments',
        icon: CreditCard,
        path: '/dashboard/payments?filter=pending',
        badge: `${stats.pendingPayments}`,
        color: 'text-emerald-600',
        priority: 95,
      });
    }

    if (stats.activeTasks > 0) {
      allActions.push({
        id: 'view-tasks',
        label: 'Active Tasks',
        icon: CheckSquare,
        path: '/dashboard/apps/tasks',
        badge: `${stats.activeTasks}`,
        color: 'text-[var(--semantic-primary)]',
        priority: 80,
      });
    }

    if (stats.upcomingEvents > 0) {
      allActions.push({
        id: 'view-events',
        label: 'Upcoming Events',
        icon: Calendar,
        path: '/dashboard/apps/calendar',
        badge: `${stats.upcomingEvents}`,
        color: 'text-[var(--semantic-accent)]',
        priority: 75,
      });
    }

    if (stats.unreadMessages > 0) {
      allActions.push({
        id: 'view-messages',
        label: 'Unread Messages',
        icon: MessageSquare,
        path: '/dashboard/messages',
        badge: `${stats.unreadMessages}`,
        color: 'text-[var(--semantic-primary)]',
        priority: 85,
      });
    }

    // Common actions (lower priority)
    allActions.push(
      {
        id: 'view-documents',
        label: 'Browse Documents',
        icon: FileText,
        path: '/dashboard/documents',
        priority: 65,
      },
      {
        id: 'view-directory',
        label: 'Resident Directory',
        icon: Users,
        path: '/dashboard/directory',
        priority: 60,
      }
    );

    // Sort by priority descending and take top 8
    const topActions = allActions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);

    setActions(topActions);
  };

  const handleAction = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={action.id}
              onClick={() => handleAction(action.path)}
              className="cursor-pointer"
            >
              <Icon className={cn('mr-2 h-4 w-4', action.color)} />
              <span className="flex-1">{action.label}</span>
              {action.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {action.badge}
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push('/dashboard/chat')}>
          <Sparkles className="mr-2 h-4 w-4 text-amber-600" />
          Ask AI for Help
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
