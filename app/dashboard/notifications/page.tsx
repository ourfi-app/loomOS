
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle, AlertCircle, Info, X, Menu, RefreshCw, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LoomOSAppHeader,
  LoomOSNavigationPane,
  LoomOSListPane,
  LoomOSDetailPane,
  LoomOSSectionHeader
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';
import type { NavigationItem, ListItem } from '@/components/webos';
import { useNotifications, useNotificationMutations, type Notification as UserNotification } from '@/hooks/use-api';
import { toastSuccess, toastError, toastCRUD } from '@/lib/toast-helpers';
import { ErrorBoundary } from '@/components/common';

type FilterMode = 'all' | 'unread' | 'urgent';

export default function NotificationsPage() {
  const session = useSession()?.data;
  const router = useRouter();
  
  // Use new API hooks
  const { data: notificationsData, isLoading, error, refresh } = useNotifications({ limit: 100 });
  const { markAsRead: apiMarkAsRead, markAllAsRead: apiMarkAllAsRead, deleteNotification: apiDeleteNotification } = useNotificationMutations();
  
  const userNotifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;
  const loading = isLoading;
  
  const [filter, setFilter] = useState<FilterMode>('all');
  const [selectedNotification, setSelectedNotification] = useState<typeof userNotifications[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Show error toasts
  useEffect(() => {
    if (error) {
      toastError(error);
    }
  }, [error]);

  const markAsRead = async (id: string) => {
    try {
      await apiMarkAsRead(id);
      refresh();
    } catch (error: any) {
      toastError(error.message || 'Failed to mark notification as read');
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    
    try {
      await apiDeleteNotification(id);
      
      if (selectedNotification?.id === id) {
        setSelectedNotification(null);
      }
      
      toastCRUD.deleted('notification');
      refresh();
    } catch (error: any) {
      toastError(error.message || 'Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiMarkAllAsRead();
      toastSuccess('All notifications marked as read');
      refresh();
    } catch (error: any) {
      toastError(error.message || 'Failed to mark all as read');
    }
  };

  const getIcon = (isUrgent: boolean) => {
    if (isUrgent) {
      return <AlertCircle className="w-5 h-5 text-[var(--semantic-error)]" />;
    }
    return <Info className="w-5 h-5 text-webos-badge" />;
  };

  // Filter notifications
  const filteredNotifications = userNotifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'urgent') return n.notification.isUrgent;
    return true;
  }).filter(n => {
    // Search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      n.notification.title.toLowerCase().includes(query) ||
      n.notification.message.toLowerCase().includes(query)
    );
  });

  const handleNotificationClick = (notification: UserNotification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Handle deep link navigation - extract from message format: "... [Link: /path]"
    try {
      const message = notification.notification?.message || "";
      const linkMatch = message.match(/\[Link: (\/[^\]]+)\]/);
      const deepLink = linkMatch ? linkMatch[1] : null;
      
      if (deepLink) {
        console.log(`[Notifications] Navigating to deep link: ${deepLink}`);
        router.push(deepLink);
      }
    } catch (error) {
      console.error('[Notifications] Failed to extract deep link or navigate:', error);
    }
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'all',
      label: 'All',
      icon: <Bell className="w-4 h-4" />,
      count: userNotifications.length,
      active: filter === 'all',
      onClick: () => setFilter('all')
    },
    {
      id: 'unread',
      label: 'Unread',
      icon: <AlertCircle className="w-4 h-4" />,
      count: unreadCount,
      active: filter === 'unread',
      onClick: () => setFilter('unread')
    },
    {
      id: 'urgent',
      label: 'Urgent',
      icon: <AlertCircle className="w-4 h-4" />,
      count: userNotifications.filter(n => n.notification.isUrgent).length,
      active: filter === 'urgent',
      onClick: () => setFilter('urgent')
    }
  ];

  // List items
  const listItems: ListItem[] = filteredNotifications.map(userNotif => ({
    id: userNotif.id,
    title: userNotif.notification.title,
    subtitle: userNotif.notification.message,
    timestamp: format(new Date(userNotif.createdAt), 'h:mm a'),
    selected: selectedNotification?.id === userNotif.id,
    badge: userNotif.notification.isUrgent ? (
      <AlertCircle className="w-3 h-3 text-[var(--semantic-error)]" />
    ) : undefined,
    icon: !userNotif.isRead ? (
      <div className="w-2 h-2 rounded-full bg-[var(--semantic-primary)]" />
    ) : undefined,
    onClick: () => handleNotificationClick(userNotif)
  }));

  return (
    <ErrorBoundary>
      <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Navigation Pane */}
          <LoomOSNavigationPane
            title="FILTERS"
            items={navigationItems}
          />

        {/* List Pane */}
        <LoomOSListPane
          searchPlaceholder="Search notifications..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          items={listItems}
          loading={loading}
          emptyMessage="No notifications found"
        />

        {/* Detail Pane */}
        <LoomOSDetailPane
          title={selectedNotification?.notification.title}
          subtitle={selectedNotification ? format(new Date(selectedNotification.createdAt), 'MMM dd, yyyy  h:mm a') : undefined}
          actions={
            selectedNotification ? (
              <div className="flex items-center gap-2">
                {!selectedNotification.isRead && (
                  <Button
                    icon={<Check className="w-4 h-4" />}
                    onClick={() => markAsRead(selectedNotification.id)}
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => deleteNotification(selectedNotification.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            ) : undefined
          }
          isEmpty={!selectedNotification}
          emptyIcon={<Bell className="w-20 h-20" />}
          emptyMessage="No notification selected"
          emptySubMessage="Select a notification from the list to view details"
        >
          {selectedNotification && (
            <div className="space-y-6">
              {/* Icon and metadata */}
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                  selectedNotification.notification.isUrgent ? 'bg-[var(--semantic-error-bg)]' : 'bg-[var(--semantic-surface-hover)]'
                )}>
                  {getIcon(selectedNotification.notification.isUrgent)}
                </div>
                <div className="flex-1">
                  {selectedNotification.notification.isUrgent && (
                    <Badge className="bg-[var(--semantic-error)] text-white text-xs mb-2">URGENT</Badge>
                  )}
                </div>
              </div>

              {/* Message content */}
              <div className="text-base leading-relaxed text-[var(--semantic-text-secondary)]">
                {selectedNotification.notification.message}
              </div>

              {/* Metadata card */}
              <div className="p-4 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
                <div className="text-sm text-[var(--semantic-text-secondary)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Type:</span>
                    <Badge className="bg-[var(--semantic-text-tertiary)] text-white text-xs">
                      {selectedNotification.notification.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Status:</span>
                    <Badge className={cn(
                      'text-xs',
                      selectedNotification.isRead
                        ? 'bg-[var(--semantic-success-bg)] text-[var(--semantic-success-dark)]'
                        : 'bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)]'
                    )}>
                      {selectedNotification.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Priority:</span>
                    <Badge className={cn(
                      'text-xs',
                      selectedNotification.notification.isUrgent
                        ? 'bg-[var(--semantic-error-bg)] text-[var(--semantic-error-dark)]'
                        : 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)]'
                    )}>
                      {selectedNotification.notification.isUrgent ? 'Urgent' : 'Normal'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </LoomOSDetailPane>
      </div>
    </ErrorBoundary>
  );
}
