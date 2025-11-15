'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { DesktopWidget } from '@/lib/desktop-widget-store';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'message' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface DesktopNotificationsWidgetProps {
  widget: DesktopWidget;
}

export function DesktopNotificationsWidget({ widget }: DesktopNotificationsWidgetProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      
      const transformedNotifications: Notification[] = (data.notifications || []).map((un: any) => {
        const notification = un.notification;
        const createdAt = new Date(un.createdAt);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);
        
        let timestamp = '';
        if (diffMinutes < 1) {
          timestamp = 'Just now';
        } else if (diffMinutes < 60) {
          timestamp = `${diffMinutes}m ago`;
        } else if (diffMinutes < 1440) {
          timestamp = `${Math.floor(diffMinutes / 60)}h ago`;
        } else {
          timestamp = `${Math.floor(diffMinutes / 1440)}d ago`;
        }

        let widgetType: 'info' | 'warning' | 'success' | 'message' | 'alert' = 'info';
        if (notification.isUrgent) {
          widgetType = 'alert';
        } else if (notification.type === 'SMS' || notification.type === 'BOTH') {
          widgetType = 'warning';
        } else {
          widgetType = 'message';
        }

        return {
          id: un.id,
          type: widgetType,
          title: notification.title,
          message: notification.message,
          timestamp,
          isRead: un.isRead,
        };
      });

      setNotifications(transformedNotifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications, widget.refreshInterval]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));

      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: false } : n
        ));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'message': return MessageSquare;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'text-[var(--semantic-error)] bg-[var(--semantic-error)]/10';
      case 'warning': return 'text-[var(--semantic-warning)] bg-[var(--semantic-warning)]/10';
      case 'success': return 'text-[var(--semantic-success)] bg-[var(--semantic-success)]/10';
      case 'message': return 'text-[var(--semantic-primary)] bg-[var(--semantic-primary)]/10';
      case 'info': return 'text-[var(--semantic-accent)] bg-[var(--semantic-accent)]/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="h-full p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30">
            <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse" />
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
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => router.push('/dashboard/notifications')}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            View All
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1 p-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map(notification => {
              const Icon = getTypeIcon(notification.type);
              const colorClass = getTypeColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'p-3 rounded-lg transition-all group relative',
                    !notification.isRead && 'bg-primary/5'
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      'p-2 rounded-lg flex-shrink-0 w-10 h-10 flex items-center justify-center',
                      colorClass
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          'text-sm leading-tight',
                          !notification.isRead && 'font-semibold'
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>

                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5 text-[var(--semantic-success)]" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
