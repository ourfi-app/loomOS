
'use client';

import { useState, useEffect } from 'react';
import { Bell, BellDot, Check, X, AlertCircle, Info, CheckCircle, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'message' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export function NotificationsWidget() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      
      // Transform API data to widget format
      const transformedNotifications: Notification[] = (data.notifications || []).map((un: any) => {
        const notification = un.notification;
        const createdAt = new Date(un.createdAt);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);
        
        let timestamp = '';
        if (diffMinutes < 1) {
          timestamp = 'Just now';
        } else if (diffMinutes < 60) {
          timestamp = `${diffMinutes} min ago`;
        } else if (diffMinutes < 1440) {
          timestamp = `${Math.floor(diffMinutes / 60)} hour${Math.floor(diffMinutes / 60) > 1 ? 's' : ''} ago`;
        } else {
          timestamp = `${Math.floor(diffMinutes / 1440)} day${Math.floor(diffMinutes / 1440) > 1 ? 's' : ''} ago`;
        }

        // Map notification type to widget type
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
          actionUrl: undefined,
          actionLabel: undefined,
        };
      });

      setNotifications(transformedNotifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Set empty array on error
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Optimistically update UI
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));

      // Call API
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        // Revert on error
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: false } : n
        ));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert on error
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: false } : n
      ));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Optimistically update UI
      const previousNotifications = [...notifications];
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));

      // Call API
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (!response.ok) {
        // Revert on error
        setNotifications(previousNotifications);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleViewAll = () => {
    router.push('/dashboard/notifications');
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
      case 'alert': return 'text-red-500 bg-red-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'message': return 'text-blue-500 bg-blue-500/10';
      case 'info': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayedNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  if (loading) {
    return (
      <Card className="h-full bg-card/60 backdrop-blur-sm border-border/30">
        <div className="p-4 space-y-3">
          <div className="h-5 bg-muted/50 rounded animate-pulse w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 relative">
              <Bell className="w-5 h-5 text-purple-500" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">Notifications</h3>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          <button
            onClick={handleViewAll}
            className="text-xs text-primary hover:underline"
          >
            View All
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all",
              filter === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all",
              filter === 'unread'
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            displayedNotifications.map((notification) => {
              const Icon = getTypeIcon(notification.type);
              const colorClass = getTypeColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg transition-all group relative",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0 w-10 h-10 flex items-center justify-center",
                      colorClass
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm leading-tight",
                          !notification.isRead && "font-semibold"
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

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>

                        {notification.actionLabel && (
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="text-xs text-primary hover:underline"
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5 text-green-500" />
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
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      {unreadCount > 0 && (
        <div className="p-3 border-t border-border/30 bg-muted/20">
          <button
            onClick={handleMarkAllAsRead}
            className="w-full py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        </div>
      )}
    </Card>
  );
}
