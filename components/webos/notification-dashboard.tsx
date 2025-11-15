
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Mail, 
  MessageSquare, 
  FileText, 
  Calendar,
  DollarSign,
  Bell,
  BellOff,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { useNotifications } from '@/hooks/webos/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface GroupedNotifications {
  [key: string]: any[];
}

export function NotificationDashboard() {
  const router = useRouter();
  const { notifications, dismissNotification, markAsRead } = useNotifications();
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotifications>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Group notifications by app/type
    const grouped: GroupedNotifications = {};
    notifications.forEach((notification) => {
      const key = notification.app || notification.type || 'Other';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key]!.push(notification);
    });
    setGroupedNotifications(grouped);
  }, [notifications]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'message':
      case 'Messages':
        return MessageSquare;
      case 'email':
      case 'Email':
        return Mail;
      case 'document':
      case 'Documents':
        return FileText;
      case 'calendar':
      case 'Calendar':
        return Calendar;
      case 'payment':
      case 'Payments':
        return DollarSign;
      default:
        return Bell;
    }
  };

  const toggleGroup = (key: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedGroups(newExpanded);
  };

  const markGroupAsRead = (key: string) => {
    groupedNotifications[key]?.forEach((notification) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  const dismissGroup = (key: string) => {
    groupedNotifications[key]?.forEach((notification) => {
      dismissNotification(notification.id);
    });
  };

  const hasUnread = (items: any[]) => {
    return items.some((item) => !item.read);
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Extract deep link from message (format: "... [Link: /path]")
    const message = notification.notification?.message || notification.message || "";
    const linkMatch = message.match(/\[Link: (\/[^\]]+)\]/);
    const deepLink = linkMatch ? linkMatch[1] : null;
    
    if (deepLink) {
      router.push(deepLink);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-8 right-4 w-96 max-h-[600px] bg-[var(--semantic-surface-hover)] rounded-lg shadow-2xl overflow-hidden z-[1060] border border-[var(--semantic-border-light)]"
    >
      {/* Header */}
      <div className="bg-[#080907] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Notifications</h3>
          {notifications.length > 0 && (
            <span className="bg-[#0066CC] text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={() => {
              notifications.forEach((n) => dismissNotification(n.id));
            }}
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[540px] scrollbar-hide">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="py-12 px-4 text-center">
            <BellOff className="w-12 h-12 text-[var(--semantic-text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--semantic-text-secondary)] text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E0E0E0]">
            {Object.entries(groupedNotifications).map(([key, items]) => {
              const Icon = getIconForType(key);
              const isExpanded = expandedGroups.has(key);
              const unreadCount = items.filter((item) => !item.read).length;

              return (
                <div key={key} className="bg-white">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(key)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F0F0F0] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        hasUnread(items) ? "bg-[#0066CC]/10" : "bg-[var(--semantic-surface-hover)]"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          hasUnread(items) ? "text-[#0066CC]" : "text-[var(--semantic-text-secondary)]"
                        )} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{key}</h4>
                        <p className="text-xs text-[var(--semantic-text-secondary)]">
                          {items.length} {items.length === 1 ? 'notification' : 'notifications'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="bg-[#0066CC] text-white text-xs px-2 py-0.5 rounded-full font-medium min-w-[24px] text-center">
                          {unreadCount}
                        </span>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className="w-4 h-4 text-[var(--semantic-text-secondary)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </button>

                  {/* Group Actions (when expanded) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Quick Actions */}
                        {hasUnread(items) && (
                          <div className="px-4 pb-2 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markGroupAsRead(key);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-[#0066CC] bg-[#0066CC]/5 hover:bg-[#0066CC]/10 rounded transition-colors"
                            >
                              <CheckCheck className="w-3 h-3" />
                              Mark All Read
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissGroup(key);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-[#CC0000] bg-[#CC0000]/5 hover:bg-[#CC0000]/10 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Clear All
                            </button>
                          </div>
                        )}

                        {/* Individual Notifications */}
                        <div className="divide-y divide-[#E0E0E0]">
                          {items.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleNotificationClick(notification)}
                              className={cn(
                                "px-4 py-3 hover:bg-[#F0F0F0] transition-colors relative cursor-pointer",
                                !notification.read && "bg-[#0066CC]/5"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h5 className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                                      {notification.title}
                                    </h5>
                                    {!notification.read && (
                                      <div className="w-2 h-2 rounded-full bg-[#0066CC] flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-xs text-[var(--semantic-text-secondary)] mb-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-[var(--semantic-text-tertiary)]">
                                    {formatDistanceToNow(new Date(notification.timestamp || Date.now()), {
                                      addSuffix: true,
                                    })}
                                  </p>

                                  {/* Actions */}
                                  {notification.actions && notification.actions.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                      {notification.actions.map((action: any, actionIndex: number) => (
                                        <button
                                          key={actionIndex}
                                          onClick={() => {
                                            action.handler();
                                            dismissNotification(notification.id);
                                          }}
                                          className="text-xs px-3 py-1.5 bg-[#00AA00] text-white rounded hover:bg-[#00AA00]/90 transition-colors font-medium"
                                        >
                                          {action.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Dismiss Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissNotification(notification.id);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--semantic-bg-muted)] transition-colors text-[var(--semantic-text-secondary)] flex-shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
