
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Wrench, 
  Scale, 
  DollarSign, 
  Mail,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isFuture, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';

interface FeedItem {
  id: string;
  type: 'meeting' | 'maintenance' | 'legal' | 'bill' | 'email' | 'announcement' | 'event';
  title: string;
  description?: string;
  date: Date;
  status: 'upcoming' | 'overdue' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const typeIcons = {
  meeting: Calendar,
  maintenance: Wrench,
  legal: Scale,
  bill: DollarSign,
  email: Mail,
  announcement: Bell,
  event: Calendar,
};

const typeColors = {
  meeting: 'text-blue-500',
  maintenance: 'text-orange-500',
  legal: 'text-purple-500',
  bill: 'text-green-500',
  email: 'text-cyan-500',
  announcement: 'text-red-500',
  event: 'text-pink-500',
};

const statusIcons = {
  upcoming: Clock,
  overdue: AlertTriangle,
  completed: CheckCircle2,
};

export function FeedWidget() {
  const { data: session } = useSession() || {};
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedItems();
  }, [session]);

  const fetchFeedItems = async () => {
    setIsLoading(true);
    try {
      // Fetch from multiple sources
      const [announcements, nextPayment, calendar, notificationsData] = await Promise.all([
        fetch('/api/announcements').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/payments/next').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/calendar').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/notifications?limit=10').then(r => r.ok ? r.json() : { notifications: [] }).catch(() => ({ notifications: [] })),
      ]);

      const items: FeedItem[] = [];

      // Add announcements
      if (Array.isArray(announcements)) {
        announcements.slice(0, 3).forEach((ann: any) => {
          items.push({
            id: `announcement-${ann.id}`,
            type: 'announcement',
            title: ann.title,
            description: ann.content?.substring(0, 100),
            date: new Date(ann.createdAt),
            status: isPast(new Date(ann.createdAt)) ? 'completed' : 'upcoming',
            priority: ann.priority || 'medium',
          });
        });
      }

      // Add next payment
      if (nextPayment && nextPayment.id) {
        const dueDate = new Date(nextPayment.dueDate);
        items.push({
          id: `payment-${nextPayment.id}`,
          type: 'bill',
          title: `Payment Due`,
          description: `Amount: $${Number(nextPayment.amount).toFixed(2)} - ${nextPayment.description || 'HOA Dues'}`,
          date: dueDate,
          status: nextPayment.status === 'OVERDUE' ? 'overdue' : (isPast(dueDate) ? 'overdue' : 'upcoming'),
          priority: nextPayment.status === 'OVERDUE' || isPast(dueDate) ? 'high' : 'medium',
          actionUrl: '/dashboard/payments',
        });
      }

      // Add calendar events
      if (Array.isArray(calendar)) {
        calendar.slice(0, 5).forEach((event: any) => {
          const eventDate = new Date(event.date);
          items.push({
            id: `event-${event.id}`,
            type: event.type === 'meeting' ? 'meeting' : 'event',
            title: event.title,
            description: event.description,
            date: eventDate,
            status: isPast(eventDate) ? 'completed' : 'upcoming',
            priority: 'medium',
          });
        });
      }

      // Add notifications as feed items
      const notifications = notificationsData.notifications || [];
      if (Array.isArray(notifications)) {
        notifications.slice(0, 5).forEach((un: any) => {
          const notification = un.notification;
          items.push({
            id: `notification-${un.id}`,
            type: notification.isUrgent ? 'maintenance' : 'email',
            title: notification.title,
            description: notification.message?.substring(0, 100),
            date: new Date(un.createdAt),
            status: un.isRead ? 'completed' : 'upcoming',
            priority: notification.isUrgent ? 'high' : 'low',
          });
        });
      }

      // Sort by date (newest first for past, soonest first for upcoming)
      items.sort((a, b) => {
        const aTime = a.date.getTime();
        const bTime = b.date.getTime();
        const nowTime = Date.now();

        // If both are in the future, sort ascending (soonest first)
        if (aTime > nowTime && bTime > nowTime) {
          return aTime - bTime;
        }
        // If both are in the past, sort descending (newest first)
        if (aTime < nowTime && bTime < nowTime) {
          return bTime - aTime;
        }
        // Mixed: put future items first
        return bTime - aTime;
      });

      setFeedItems(items);
    } catch (error) {
      console.error('Error fetching feed items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = () => {
    const now = new Date();
    if (filter === 'upcoming') {
      return feedItems.filter(item => isFuture(item.date));
    }
    if (filter === 'past') {
      return feedItems.filter(item => isPast(item.date));
    }
    return feedItems;
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const filteredItems = getFilteredItems();

  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Activity Feed
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                filter === 'all' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                filter === 'upcoming' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                filter === 'past' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Past
            </button>
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Loading feed...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No items to display
            </div>
          ) : (
            filteredItems.map((item) => {
              const TypeIcon = typeIcons[item.type];
              const StatusIcon = statusIcons[item.status];
              const typeColor = typeColors[item.type];

              return (
                <div
                  key={item.id}
                  className={cn(
                    "group p-3 rounded-lg border border-border/30 bg-background/40",
                    "hover:bg-background/60 hover:border-border/50 transition-all cursor-pointer",
                    item.status === 'overdue' && "border-red-500/30 bg-red-500/5"
                  )}
                  onClick={() => {
                    if (item.actionUrl) {
                      window.location.href = item.actionUrl;
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn("mt-0.5", typeColor)}>
                      <TypeIcon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-foreground line-clamp-1">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.actionUrl && (
                          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>

                      {/* Date and Status */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <StatusIcon className={cn(
                            "w-3 h-3",
                            item.status === 'overdue' && "text-red-500",
                            item.status === 'completed' && "text-green-500",
                            item.status === 'upcoming' && "text-blue-500"
                          )} />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        {item.priority === 'high' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-500/10 text-red-500 rounded">
                            Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-center text-muted-foreground border-t border-border/30 pt-2">
          {filteredItems.length} {filter === 'all' ? 'total' : filter} item{filteredItems.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Card>
  );
}
