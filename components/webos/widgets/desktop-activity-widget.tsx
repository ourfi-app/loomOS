'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  UserPlus,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { DesktopWidget } from '@/lib/desktop-widget-store';

interface ActivityItem {
  id: string;
  type: 'user' | 'task' | 'message' | 'document' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface DesktopActivityWidgetProps {
  widget: DesktopWidget;
}

export function DesktopActivityWidget({ widget }: DesktopActivityWidgetProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>(
    widget.settings.filter || 'today'
  );

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'user',
          title: 'New resident registered',
          description: 'Jane Smith (Unit 405) completed onboarding',
          timestamp: '5m ago',
          user: 'Jane Smith',
          status: 'success',
        },
        {
          id: '2',
          type: 'task',
          title: 'Maintenance request completed',
          description: 'HVAC repair in Unit 302 finished',
          timestamp: '15m ago',
          user: 'Maintenance Team',
          status: 'success',
        },
        {
          id: '3',
          type: 'message',
          title: 'New community message',
          description: 'Annual meeting announcement posted',
          timestamp: '1h ago',
          user: 'Admin',
          status: 'info',
        },
        {
          id: '4',
          type: 'document',
          title: 'Document uploaded',
          description: 'December financial report added',
          timestamp: '2h ago',
          user: 'Finance Dept',
          status: 'info',
        },
        {
          id: '5',
          type: 'event',
          title: 'Event reminder',
          description: 'Community BBQ scheduled for tomorrow',
          timestamp: '3h ago',
          status: 'warning',
        },
        {
          id: '6',
          type: 'system',
          title: 'System update',
          description: 'Security cameras firmware updated',
          timestamp: '5h ago',
          status: 'success',
        },
        {
          id: '7',
          type: 'task',
          title: 'Task assigned',
          description: 'Pool maintenance scheduled for next week',
          timestamp: '6h ago',
          user: 'Facilities Manager',
          status: 'info',
        },
        {
          id: '8',
          type: 'user',
          title: 'Access code changed',
          description: 'Main entrance access codes updated',
          timestamp: '1d ago',
          user: 'Security',
          status: 'warning',
        },
      ];

      setActivities(mockActivities);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchActivities, widget.refreshInterval]);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'today') {
      return activity.timestamp.includes('m ago') || activity.timestamp.includes('h ago');
    }
    if (filter === 'week') {
      return !activity.timestamp.includes('mo ago') && !activity.timestamp.includes('yr ago');
    }
    return true;
  });

  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      user: UserPlus,
      task: CheckCircle2,
      message: MessageSquare,
      document: FileText,
      event: Calendar,
      system: Settings,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type: string, status?: string) => {
    if (status === 'success') return 'text-[var(--semantic-success)] bg-[var(--semantic-success)]/10';
    if (status === 'warning') return 'text-[var(--semantic-warning)] bg-[var(--semantic-warning)]/10';
    if (status === 'error') return 'text-[var(--semantic-error)] bg-[var(--semantic-error)]/10';

    const colors: Record<string, string> = {
      user: 'text-[var(--semantic-primary)] bg-[var(--semantic-primary)]/10',
      task: 'text-[var(--semantic-success)] bg-[var(--semantic-success)]/10',
      message: 'text-[var(--semantic-accent)] bg-[var(--semantic-accent)]/10',
      document: 'text-[var(--semantic-primary)] bg-[var(--semantic-primary)]/10',
      event: 'text-[var(--semantic-accent)] bg-[var(--semantic-accent)]/10',
      system: 'text-[var(--semantic-text-tertiary)] bg-[var(--semantic-text-tertiary)]/10',
    };
    return colors[type] || 'text-muted-foreground bg-muted/50';
  };

  if (loading) {
    return (
      <div className="h-full p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-muted/50 rounded-lg animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </p>
            <p className="text-xs text-muted-foreground">
              {filteredActivities.length} {filter} {filteredActivities.length === 1 ? 'event' : 'events'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => router.push('/dashboard/activity')}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            View All
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {(['all', 'today', 'week'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {f === 'all' && 'All Time'}
              {f === 'today' && 'Today'}
              {f === 'week' && 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <ScrollArea className="flex-1 p-2">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No activity {filter !== 'all' && filter}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type, activity.status);

              return (
                <div
                  key={activity.id}
                  className="relative"
                >
                  {/* Timeline Line */}
                  {index < filteredActivities.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                  )}

                  <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    {/* Icon */}
                    <div className={cn(
                      'p-2 rounded-lg flex-shrink-0 w-8 h-8 flex items-center justify-center relative z-10',
                      colorClass
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h4 className="text-sm font-medium leading-tight">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {activity.description}
                      </p>

                      {activity.user && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {activity.user}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t bg-muted/20">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold">
              {activities.filter(a => a.type === 'task').length}
            </p>
            <p className="text-xs text-muted-foreground">Tasks</p>
          </div>
          <div>
            <p className="text-lg font-bold">
              {activities.filter(a => a.type === 'user').length}
            </p>
            <p className="text-xs text-muted-foreground">Users</p>
          </div>
          <div>
            <p className="text-lg font-bold">
              {activities.filter(a => a.status === 'success').length}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
