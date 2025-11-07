
import { create } from 'zustand';
import { LucideIcon } from 'lucide-react';

export type NotificationTier = 'polite' | 'passive' | 'critical';

export interface NotificationAction {
  label: string;
  handler: () => void;
}

export interface WebOSNotification {
  id: string;
  tier: NotificationTier;
  icon?: LucideIcon;
  title: string;
  message: string;
  actions?: NotificationAction[];
  timestamp: number;
  read?: boolean;
  app?: string;
  type?: string;
}

interface NotificationsState {
  notifications: WebOSNotification[];
  notify: (notification: Omit<WebOSNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
  notifications: [],

  notify: (notification) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: WebOSNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
    };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-dismiss polite notifications after they're added to the queue
    if (notification.tier === 'polite') {
      setTimeout(() => {
        get().dismissNotification(id);
      }, 3000);
    }
  },

  dismissNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));
