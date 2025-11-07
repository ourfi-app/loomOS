
import { type IconType } from 'react-icons';
import { 
  MdCalendarToday, 
  MdWbSunny, 
  MdRssFeed, 
  MdDashboard, 
  MdEmail, 
  MdCheckCircle, 
  MdStickyNote2,
  MdNotifications 
} from 'react-icons/md';

export interface WidgetDefinition {
  id: string;
  title: string;
  icon: IconType;
  component: string; // Component name to render
  size: 'small' | 'medium' | 'large';
  category: 'system' | 'app' | 'custom';
  description?: string;
  appId?: string; // Link to app if widget is from an app
  enabled: boolean;
  configurable?: boolean;
  refreshInterval?: number; // in seconds
  requiresAuth?: boolean;
  requiresLocation?: boolean;
  requiresPermission?: string[];
  order?: number; // Display order
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
  // Native App Widgets
  email: {
    id: 'email',
    title: 'Email',
    icon: MdEmail,
    component: 'EmailWidget',
    size: 'medium',
    category: 'app',
    description: 'Recent emails and quick inbox access',
    appId: 'email',
    enabled: true,
    refreshInterval: 120, // 2 minutes
    requiresAuth: true,
    order: 1,
  },
  tasks: {
    id: 'tasks',
    title: 'Tasks',
    icon: MdCheckCircle,
    component: 'TasksWidget',
    size: 'medium',
    category: 'app',
    description: 'Your to-do list and upcoming tasks',
    appId: 'tasks',
    enabled: true,
    refreshInterval: 300, // 5 minutes
    requiresAuth: true,
    order: 2,
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: MdStickyNote2,
    component: 'NotesWidget',
    size: 'medium',
    category: 'app',
    description: 'Quick access to your notes and memos',
    appId: 'notes',
    enabled: true,
    refreshInterval: 600, // 10 minutes
    requiresAuth: true,
    order: 3,
  },
  notifications: {
    id: 'notifications',
    title: 'Notifications',
    icon: MdNotifications,
    component: 'NotificationsWidget',
    size: 'medium',
    category: 'system',
    description: 'Recent notifications and alerts',
    appId: 'notifications',
    enabled: true,
    refreshInterval: 30, // 30 seconds
    requiresAuth: true,
    order: 4,
  },
  
  // System Widgets
  weather: {
    id: 'weather',
    title: 'Weather',
    icon: MdWbSunny,
    component: 'WeatherWidget',
    size: 'small',
    category: 'system',
    description: 'Current weather conditions (available in status bar)',
    enabled: true,
    refreshInterval: 1800, // 30 minutes
    requiresLocation: true,
    order: 5,
  },
  calendar: {
    id: 'calendar',
    title: 'Calendar',
    icon: MdCalendarToday,
    component: 'CalendarWidget',
    size: 'small',
    category: 'app',
    description: 'Monthly calendar view (available in status bar)',
    appId: 'calendar',
    enabled: true,
    refreshInterval: 3600, // 1 hour
    requiresAuth: true,
    order: 6,
  },
  feed: {
    id: 'feed',
    title: 'Activity Feed',
    icon: MdRssFeed,
    component: 'FeedWidget',
    size: 'medium',
    category: 'system',
    description: 'Timeline of events, notifications, and activities',
    enabled: true,
    refreshInterval: 300, // 5 minutes
    requiresAuth: true,
    order: 7,
  },
  integratedDashboard: {
    id: 'integrated-dashboard',
    title: 'Dashboard Overview',
    icon: MdDashboard,
    component: 'IntegratedDashboardWidget',
    size: 'medium',
    category: 'system',
    description: 'Unified view of all app activity and quick stats (deprecated)',
    enabled: false, // Disabled - redundant with other widgets
    refreshInterval: 300, // 5 minutes
    requiresAuth: true,
    order: 8,
  },
};

export function getEnabledWidgets(): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY)
    .filter(widget => widget.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getWidgetById(id: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY[id];
}

export function getWidgetsByCategory(category: string): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY).filter(
    widget => widget.category === category && widget.enabled
  );
}
