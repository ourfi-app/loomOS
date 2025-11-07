
'use client';

import { Card } from '@/components/ui/card';
import { Bell, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function NotificationsWidget() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications?limit=3');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-20 bg-muted rounded" />
      </Card>
    );
  }

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => router.push('/dashboard/notifications')}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-pink-600" />
          </div>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="text-sm font-medium text-muted-foreground">Notifications</div>
          <div className="text-lg font-bold">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </div>
        </div>
        
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>

      {notifications.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border/50">
          {notifications.slice(0, 2).map((notif: any) => (
            <div key={notif.id} className="flex items-start gap-2 text-sm">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                notif.isRead ? "bg-muted-foreground/30" : "bg-pink-600"
              )} />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "line-clamp-1 text-sm",
                  notif.isRead ? "text-muted-foreground" : "text-foreground font-medium"
                )}>
                  {notif.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
