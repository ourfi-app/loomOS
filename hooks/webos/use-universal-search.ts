
import { create } from 'zustand';
import { 
  Home, 
  Users, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings, 
  Building,
  Calendar,
  Bell,
  User,
  Shield,
  Upload,
  LucideIcon
} from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  icon?: LucideIcon;
  path?: string;
  action?: () => void;
  keywords: string[];
}

interface UniversalSearchState {
  isOpen: boolean;
  mode: 'search' | 'ai';
  searchableItems: SearchResult[];
  initialQuery: string;
  openSearch: (initialMode?: 'search' | 'ai', query?: string) => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setMode: (mode: 'search' | 'ai') => void;
  registerSearchable: (item: SearchResult) => void;
  unregisterSearchable: (id: string) => void;
  search: (query: string) => SearchResult[];
}

const defaultSearchableItems: SearchResult[] = [
  // Core Navigation
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'View your dashboard overview',
    category: 'Navigation',
    icon: Home,
    path: '/dashboard',
    keywords: ['home', 'dashboard', 'overview', 'main', 'start'],
  },
  {
    id: 'my-community',
    title: 'My Community',
    description: 'Resident directory and documents',
    category: 'Navigation',
    icon: Users,
    path: '/dashboard/my-community',
    keywords: ['community', 'residents', 'directory', 'neighbors', 'documents', 'people', 'contacts'],
  },
  {
    id: 'my-household',
    title: 'My Household',
    description: 'Manage your household and family members',
    category: 'Navigation',
    icon: Home,
    path: '/dashboard/my-household',
    keywords: ['household', 'family', 'members', 'unit', 'residence', 'home'],
  },
  
  // Financial
  {
    id: 'payments',
    title: 'Payments',
    description: 'Manage your payments and billing',
    category: 'Financial',
    icon: CreditCard,
    path: '/dashboard/payments',
    keywords: ['payment', 'bill', 'pay', 'invoice', 'billing', 'fees', 'dues', 'balance', 'money'],
  },
  
  // Documents & Information
  {
    id: 'documents',
    title: 'Documents',
    description: 'Access community documents and files',
    category: 'Documents',
    icon: FileText,
    path: '/dashboard/documents',
    keywords: ['documents', 'files', 'rules', 'regulations', 'policies', 'bylaws', 'forms', 'papers'],
  },
  
  // Communication
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Get help from your AI assistant',
    category: 'Tools',
    icon: MessageSquare,
    path: '/dashboard/ai-assistant',
    keywords: ['ai', 'assistant', 'help', 'chat', 'bot', 'support', 'ask', 'question'],
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'View and send messages',
    category: 'Communication',
    icon: MessageSquare,
    path: '/dashboard/messages',
    keywords: ['messages', 'inbox', 'chat', 'communicate', 'conversation'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'View your notifications and alerts',
    category: 'Communication',
    icon: Bell,
    path: '/dashboard/notifications',
    keywords: ['notifications', 'alerts', 'messages', 'updates', 'announcements', 'news'],
  },
  
  // Apps
  {
    id: 'calendar',
    title: 'Calendar',
    description: 'View events and schedule',
    category: 'Apps',
    icon: Calendar,
    path: '/dashboard/apps/calendar',
    keywords: ['calendar', 'events', 'schedule', 'meetings', 'appointments', 'dates'],
  },
  {
    id: 'notes',
    title: 'Notes',
    description: 'Create and manage notes',
    category: 'Apps',
    icon: FileText,
    path: '/dashboard/apps/notes',
    keywords: ['notes', 'memos', 'write', 'todo', 'reminders'],
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Access your email',
    category: 'Apps',
    icon: MessageSquare,
    path: '/dashboard/apps/email',
    keywords: ['email', 'mail', 'inbox', 'send', 'compose'],
  },
  
  // Settings & Profile
  {
    id: 'profile',
    title: 'My Profile',
    description: 'Manage your profile and personal info',
    category: 'Settings',
    icon: User,
    path: '/dashboard/profile',
    keywords: ['profile', 'account', 'settings', 'user', 'personal', 'info', 'preferences'],
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    description: 'Configure system preferences',
    category: 'Settings',
    icon: Settings,
    path: '/dashboard/system-settings',
    keywords: ['settings', 'preferences', 'configuration', 'system', 'options'],
  },
  
  // Admin (conditionally visible)
  {
    id: 'admin',
    title: 'Admin Panel',
    description: 'Access admin tools and management',
    category: 'Admin',
    icon: Shield,
    path: '/dashboard/admin',
    keywords: ['admin', 'management', 'board', 'settings', 'control', 'manager', 'administrator'],
  },
  {
    id: 'admin-users',
    title: 'User Management',
    description: 'Manage users and permissions',
    category: 'Admin',
    icon: Users,
    path: '/dashboard/admin/users',
    keywords: ['users', 'residents', 'accounts', 'permissions', 'roles', 'manage'],
  },
  {
    id: 'admin-payments',
    title: 'Payment Management',
    description: 'Manage payments and billing',
    category: 'Admin',
    icon: CreditCard,
    path: '/dashboard/admin/payments',
    keywords: ['payments', 'billing', 'finances', 'revenue', 'collections'],
  },
];

export const useUniversalSearch = create<UniversalSearchState>((set, get) => ({
  isOpen: false,
  mode: 'search',
  searchableItems: defaultSearchableItems,
  initialQuery: '',

  openSearch: (initialMode = 'search', query = '') => set({ isOpen: true, mode: initialMode, initialQuery: query }),
  closeSearch: () => set({ isOpen: false, mode: 'search', initialQuery: '' }),
  toggleSearch: () => set(state => ({ isOpen: !state.isOpen })),
  setMode: (mode) => set({ mode }),

  registerSearchable: (item) => {
    set(state => ({
      searchableItems: [...state.searchableItems.filter(i => i.id !== item.id), item],
    }));
  },

  unregisterSearchable: (id) => {
    set(state => ({
      searchableItems: state.searchableItems.filter(i => i.id !== id),
    }));
  },

  search: (query) => {
    const items = get().searchableItems;
    const lowerQuery = query.toLowerCase();

    return items
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const descriptionMatch = item.description?.toLowerCase().includes(lowerQuery);
        const keywordMatch = item.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerQuery)
        );
        return titleMatch || descriptionMatch || keywordMatch;
      })
      .sort((a, b) => {
        // Prioritize title matches over description/keyword matches
        const aTitle = a.title.toLowerCase().includes(lowerQuery);
        const bTitle = b.title.toLowerCase().includes(lowerQuery);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });
  },
}));
