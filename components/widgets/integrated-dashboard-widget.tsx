
/**
 * Integrated Dashboard Widget
 * Shows a quick overview of data from multiple apps
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  CreditCard,
  CheckSquare,
  Calendar,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function IntegratedDashboardWidget() {
  const router = useRouter();
  const [stats, setStats] = useState({
    unreadNotifications: 0,
    pendingPayments: 0,
    activeTasks: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [notifRes, paymentsRes, tasksRes, eventsRes, messagesRes] = await Promise.allSettled([
        fetch('/api/notifications'),
        fetch('/api/payments'),
        fetch('/api/tasks?status=TODO&status=IN_PROGRESS'),
        fetch('/api/calendar'),
        fetch('/api/messages?folder=inbox'),
      ]);

      const newStats = {
        unreadNotifications: 0,
        pendingPayments: 0,
        activeTasks: 0,
        upcomingEvents: 0,
        unreadMessages: 0,
        loading: false,
      };

      if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
        const data = await notifRes.value.json();
        newStats.unreadNotifications = data.unreadCount || 0;
      }

      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
        const data = await paymentsRes.value.json();
        newStats.pendingPayments = (data.payments || []).filter(
          (p: any) => p.status === 'PENDING' || p.status === 'OVERDUE'
        ).length;
      }

      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const data = await tasksRes.value.json();
        newStats.activeTasks = data.length || 0;
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
        const data = await eventsRes.value.json();
        const now = new Date();
        newStats.upcomingEvents = (data || []).filter((e: any) => {
          const eventDate = new Date(e.startDate);
          return eventDate >= now;
        }).length;
      }

      if (messagesRes.status === 'fulfilled' && messagesRes.value.ok) {
        const data = await messagesRes.value.json();
        newStats.unreadMessages = (data.messages || []).filter((m: any) => {
          const recipient = m.recipients?.[0];
          return recipient && !recipient.isRead;
        }).length;
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const statItems = [
    {
      label: 'Notifications',
      value: stats.unreadNotifications,
      icon: Bell,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      path: '/dashboard/notifications',
    },
    {
      label: 'Payments',
      value: stats.pendingPayments,
      icon: CreditCard,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      path: '/dashboard/payments',
    },
    {
      label: 'Tasks',
      value: stats.activeTasks,
      icon: CheckSquare,
      color: 'text-[var(--semantic-primary)]',
      bgColor: 'bg-[var(--semantic-primary)]/10',
      path: '/dashboard/apps/tasks',
    },
    {
      label: 'Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-[var(--semantic-accent)]',
      bgColor: 'bg-[var(--semantic-accent)]/10',
      path: '/dashboard/apps/calendar',
    },
    {
      label: 'Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      path: '/dashboard/messages',
    },
  ];

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Activity Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {stats.loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-3">
            {statItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left w-full"
                >
                  <div className={cn('p-2 rounded-lg', item.bgColor)}>
                    <Icon className={cn('h-5 w-5', item.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.value === 0 ? 'All clear' : `${item.value} pending`}
                    </p>
                  </div>
                  {item.value > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.value}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Open AI Assistant with context about the stats
              router.push('/dashboard/chat');
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

