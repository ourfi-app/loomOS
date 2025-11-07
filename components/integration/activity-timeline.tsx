
/**
 * Activity Timeline Component
 * Shows unified activity feed from all apps
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CreditCard,
  FileText,
  MessageSquare,
  Calendar,
  CheckSquare,
  Bell,
  Users,
  Upload,
  Check,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'payment' | 'document' | 'message' | 'task' | 'event' | 'announcement' | 'directory';
  title: string;
  description?: string;
  timestamp: Date;
  user?: { name: string; email: string };
  metadata?: Record<string, any>;
  path?: string;
}

interface ActivityTimelineProps {
  limit?: number;
  showFilters?: boolean;
  userId?: string;
}

export function ActivityTimeline({ limit = 20, showFilters = true, userId }: ActivityTimelineProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, [userId, filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      // Fetch data from multiple endpoints
      const endpoints = [
        '/api/payments',
        '/api/documents',
        '/api/messages',
        '/api/tasks',
        '/api/calendar',
        '/api/announcements',
      ];

      const results = await Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(userId ? `${endpoint}?userId=${userId}` : endpoint)
            .then(res => res.ok ? res.json() : null)
        )
      );

      const allActivities: Activity[] = [];

      // Process payments
      const paymentsResult = results[0];
      if (paymentsResult && paymentsResult.status === 'fulfilled' && paymentsResult.value) {
        const payments = paymentsResult.value.payments || [];
        payments.forEach((p: any) => {
          allActivities.push({
            id: `payment-${p.id}`,
            type: 'payment',
            title: `Payment ${p.status === 'PAID' ? 'Received' : 'Due'}`,
            description: `$${Number(p.amount).toFixed(2)} - ${p.status}`,
            timestamp: new Date(p.createdAt || p.dueDate),
            metadata: p,
            path: `/dashboard/payments?id=${p.id}`,
          });
        });
      }

      // Process documents
      const documentsResult = results[1];
      if (documentsResult && documentsResult.status === 'fulfilled' && documentsResult.value) {
        const documents = documentsResult.value.files || [];
        documents.forEach((d: any) => {
          allActivities.push({
            id: `document-${d.id}`,
            type: 'document',
            title: 'Document Uploaded',
            description: d.filename,
            timestamp: new Date(d.uploaded_at || d.createdAt),
            user: d.uploaded_by_user,
            metadata: d,
            path: `/dashboard/documents?doc=${d.id}`,
          });
        });
      }

      // Process messages
      const messagesResult = results[2];
      if (messagesResult && messagesResult.status === 'fulfilled' && messagesResult.value) {
        const messages = messagesResult.value.messages || [];
        messages.forEach((m: any) => {
          allActivities.push({
            id: `message-${m.id}`,
            type: 'message',
            title: 'Message Received',
            description: m.subject,
            timestamp: new Date(m.createdAt),
            user: m.sender,
            metadata: m,
            path: `/dashboard/messages?id=${m.id}`,
          });
        });
      }

      // Process tasks
      const tasksResult = results[3];
      if (tasksResult && tasksResult.status === 'fulfilled' && tasksResult.value) {
        const tasks = tasksResult.value || [];
        tasks.forEach((t: any) => {
          allActivities.push({
            id: `task-${t.id}`,
            type: 'task',
            title: `Task ${t.status === 'COMPLETED' ? 'Completed' : 'Created'}`,
            description: t.title,
            timestamp: new Date(t.updatedAt || t.createdAt),
            metadata: t,
            path: `/dashboard/apps/tasks?id=${t.id}`,
          });
        });
      }

      // Process events
      const eventsResult = results[4];
      if (eventsResult && eventsResult.status === 'fulfilled' && eventsResult.value) {
        const events = eventsResult.value || [];
        events.forEach((e: any) => {
          allActivities.push({
            id: `event-${e.id}`,
            type: 'event',
            title: 'Event Scheduled',
            description: e.title,
            timestamp: new Date(e.createdAt || e.startDate),
            metadata: e,
            path: `/dashboard/apps/calendar?event=${e.id}`,
          });
        });
      }

      // Process announcements
      const announcementsResult = results[5];
      if (announcementsResult && announcementsResult.status === 'fulfilled' && announcementsResult.value) {
        const announcements = announcementsResult.value.announcements || [];
        announcements.forEach((a: any) => {
          allActivities.push({
            id: `announcement-${a.id}`,
            type: 'announcement',
            title: 'New Announcement',
            description: a.title,
            timestamp: new Date(a.createdAt),
            user: a.author,
            metadata: a,
            path: `/dashboard/admin/announcements?id=${a.id}`,
          });
        });
      }

      // Sort by timestamp descending
      allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Apply filter
      const filtered = filter === 'all' 
        ? allActivities 
        : allActivities.filter(a => a.type === filter);

      setActivities(filtered.slice(0, limit));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return CreditCard;
      case 'document':
        return FileText;
      case 'message':
        return MessageSquare;
      case 'task':
        return CheckSquare;
      case 'event':
        return Calendar;
      case 'announcement':
        return Bell;
      case 'directory':
        return Users;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20';
      case 'document':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'message':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'task':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'event':
        return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
      case 'announcement':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'directory':
        return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const filters = [
    { value: 'all', label: 'All Activity' },
    { value: 'payment', label: 'Payments' },
    { value: 'document', label: 'Documents' },
    { value: 'message', label: 'Messages' },
    { value: 'task', label: 'Tasks' },
    { value: 'event', label: 'Events' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activity Timeline
            </CardTitle>
            <CardDescription>Recent activity across all apps</CardDescription>
          </div>
          {showFilters && (
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <Button
                  key={f.value}
                  variant={filter === f.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No activity found</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors group"
                    onClick={() => activity.path && router.push(activity.path)}
                  >
                    <div className={cn('p-2 rounded-lg', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(activity.timestamp, 'MMM d, h:mm a')}
                        </span>
                      </div>

                      {activity.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {activity.description}
                        </p>
                      )}

                      {activity.user && (
                        <p className="text-xs text-muted-foreground">
                          by {activity.user.name || activity.user.email}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
