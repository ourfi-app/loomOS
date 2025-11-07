
import { Mail, Calendar, CheckSquare, FileText, Users, Settings, Bell, Plus, Edit, Trash2, Search } from 'lucide-react';

export interface AppTemplate {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'communication' | 'organization' | 'social' | 'custom';
  icon: any;
  color: string;
  screenshot?: string;
  paneLayout: '1-pane' | '2-pane' | '3-pane';
  features: string[];
  designPatterns: {
    hasStatusBar: boolean;
    hasHeader: boolean;
    hasToolbar: boolean;
    hasGestureArea: boolean;
    headerStyle: 'gradient' | 'flat' | 'minimal';
    pane1Style?: 'list' | 'navigation' | 'folders';
    pane2Style?: 'list' | 'grid' | 'timeline';
    pane3Style?: 'detail' | 'form' | 'content';
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export const APP_TEMPLATES: Record<string, AppTemplate> = {
  email: {
    id: 'email',
    name: 'Email',
    description: 'Full-featured email client with folders, inbox, and message viewing',
    category: 'communication',
    icon: Mail,
    color: '#5BB9EA',
    screenshot: '/wireframe-example-email-app-a1.png',
    paneLayout: '3-pane',
    features: [
      'Multiple account support',
      'Folder navigation',
      'Message list with search',
      'Rich message detail view',
      'Compose and reply',
      'Attachment support'
    ],
    designPatterns: {
      hasStatusBar: true,
      hasHeader: true,
      hasToolbar: true,
      hasGestureArea: true,
      headerStyle: 'gradient',
      pane1Style: 'folders',
      pane2Style: 'list',
      pane3Style: 'detail'
    },
    colorScheme: {
      primary: '#5BB9EA',
      secondary: '#F18825',
      accent: '#EF5350',
      background: '#EAEAEA',
      surface: '#FFFFFF',
      text: '#222222'
    }
  },
  
  calendar: {
    id: 'calendar',
    name: 'Calendar',
    description: 'Event calendar with mini calendar, day agenda, and event details',
    category: 'productivity',
    icon: Calendar,
    color: '#5BB9EA',
    screenshot: '/wireframe-example-calendar.png',
    paneLayout: '3-pane',
    features: [
      'Mini calendar navigation',
      'Day/Week/Month/Year views',
      'Timeline event list',
      'Event detail panel',
      'Quick event creation',
      'Color-coded categories'
    ],
    designPatterns: {
      hasStatusBar: true,
      hasHeader: true,
      hasToolbar: true,
      hasGestureArea: true,
      headerStyle: 'gradient',
      pane1Style: 'navigation',
      pane2Style: 'timeline',
      pane3Style: 'detail'
    },
    colorScheme: {
      primary: '#5BB9EA',
      secondary: '#FFA726',
      accent: '#EF5350',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#222222'
    }
  },
  
  tasks: {
    id: 'tasks',
    name: 'Tasks',
    description: 'Task management with lists, projects, and swipe actions',
    category: 'productivity',
    icon: CheckSquare,
    color: '#8E44AD',
    screenshot: '/wireframe-example-tasks-app-b1.png',
    paneLayout: '2-pane',
    features: [
      'Multiple task lists',
      'Project organization',
      'Swipe to complete/delete',
      'Due date management',
      'Priority levels',
      'Search and filter'
    ],
    designPatterns: {
      hasStatusBar: true,
      hasHeader: true,
      hasToolbar: true,
      hasGestureArea: true,
      headerStyle: 'flat',
      pane1Style: 'list',
      pane2Style: 'list',
      pane3Style: 'detail'
    },
    colorScheme: {
      primary: '#8E44AD',
      secondary: '#3498DB',
      accent: '#E74C3C',
      background: '#ECF0F1',
      surface: '#FFFFFF',
      text: '#2C3E50'
    }
  },
  
  memos: {
    id: 'memos',
    name: 'Memos',
    description: 'Note-taking app with grid view and color coding',
    category: 'productivity',
    icon: FileText,
    color: '#F39C12',
    screenshot: '/wireframe-example-memos-app-c1.png',
    paneLayout: '1-pane',
    features: [
      'Grid view layout',
      'Color-coded memos',
      'Quick creation',
      'Search functionality',
      'Rich text editing',
      'Touch-friendly interface'
    ],
    designPatterns: {
      hasStatusBar: true,
      hasHeader: true,
      hasToolbar: false,
      hasGestureArea: true,
      headerStyle: 'minimal',
      pane2Style: 'grid'
    },
    colorScheme: {
      primary: '#F39C12',
      secondary: '#E67E22',
      accent: '#16A085',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#2C3E50'
    }
  },
  
  contacts: {
    id: 'contacts',
    name: 'Contacts',
    description: 'Contact management with groups and detailed profiles',
    category: 'social',
    icon: Users,
    color: '#27AE60',
    paneLayout: '3-pane',
    features: [
      'Contact groups',
      'Alphabetical directory',
      'Quick search',
      'Detailed contact cards',
      'Communication history',
      'Favorites'
    ],
    designPatterns: {
      hasStatusBar: true,
      hasHeader: true,
      hasToolbar: true,
      hasGestureArea: true,
      headerStyle: 'gradient',
      pane1Style: 'navigation',
      pane2Style: 'list',
      pane3Style: 'detail'
    },
    colorScheme: {
      primary: '#27AE60',
      secondary: '#2ECC71',
      accent: '#3498DB',
      background: '#ECF0F1',
      surface: '#FFFFFF',
      text: '#2C3E50'
    }
  },
  
  blank: {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a customizable blank template',
    category: 'custom',
    icon: Plus,
    color: '#95A5A6',
    paneLayout: '3-pane',
    features: [
      'Fully customizable',
      'Choose your layout',
      'Design your own UI',
      'Add custom features',
      'Set your own colors',
      'Build from ground up'
    ],
    designPatterns: {
      hasStatusBar: true,
      hasHeader: true,
      hasToolbar: true,
      hasGestureArea: true,
      headerStyle: 'gradient',
      pane1Style: 'navigation',
      pane2Style: 'list',
      pane3Style: 'detail'
    },
    colorScheme: {
      primary: '#95A5A6',
      secondary: '#7F8C8D',
      accent: '#34495E',
      background: '#ECF0F1',
      surface: '#FFFFFF',
      text: '#2C3E50'
    }
  }
};

export interface DesignedApp {
  id: string;
  name: string;
  description: string;
  templateId: string;
  customizations: {
    colorScheme?: Partial<AppTemplate['colorScheme']>;
    paneLayout?: '1-pane' | '2-pane' | '3-pane';
    designPatterns?: Partial<AppTemplate['designPatterns']>;
    icon?: string;
    features?: string[];
  };
  created: string;
  lastModified: string;
  isPublished: boolean;
}

export function getTemplateById(id: string): AppTemplate | undefined {
  return APP_TEMPLATES[id];
}

export function getAllTemplates(): AppTemplate[] {
  return Object.values(APP_TEMPLATES);
}

export function getTemplatesByCategory(category: string): AppTemplate[] {
  return Object.values(APP_TEMPLATES).filter(template => template.category === category);
}

export const DESIGN_PATTERNS = {
  statusBar: {
    name: 'Status Bar',
    description: 'Shows system information like time, battery, and connectivity',
    required: true
  },
  header: {
    name: 'Header',
    description: 'Main app title and branding area',
    required: true
  },
  toolbar: {
    name: 'Toolbar',
    description: 'Bottom action buttons for primary functions',
    required: false
  },
  gestureArea: {
    name: 'Gesture Area',
    description: 'LoomOS-style gesture navigation bar',
    required: true
  }
};

export const PANE_STYLES = {
  list: {
    name: 'List View',
    description: 'Vertical scrolling list of items',
    bestFor: ['Email messages', 'Contacts', 'Tasks', 'Notifications']
  },
  grid: {
    name: 'Grid View',
    description: 'Card-based grid layout',
    bestFor: ['Photos', 'Memos', 'Apps', 'Gallery']
  },
  timeline: {
    name: 'Timeline View',
    description: 'Chronological event display',
    bestFor: ['Calendar', 'Activity feed', 'History']
  },
  navigation: {
    name: 'Navigation',
    description: 'Folder or category navigation',
    bestFor: ['File browser', 'Settings', 'Menu']
  },
  folders: {
    name: 'Folders',
    description: 'Hierarchical folder structure',
    bestFor: ['Email accounts', 'File system', 'Documents']
  },
  detail: {
    name: 'Detail View',
    description: 'Detailed information display',
    bestFor: ['Message content', 'Contact info', 'Event details']
  },
  form: {
    name: 'Form View',
    description: 'Input fields and forms',
    bestFor: ['Compose', 'Edit', 'Settings']
  },
  content: {
    name: 'Content View',
    description: 'Rich content display',
    bestFor: ['Articles', 'Documents', 'Media']
  },
  'dashboard-grid': {
    name: 'Dashboard Grid',
    description: 'Grid of widgets and cards for dashboards',
    bestFor: ['Dashboards', 'Analytics', 'Home screens', 'Overview pages']
  },
  kanban: {
    name: 'Kanban Board',
    description: 'Column-based card layout for task management',
    bestFor: ['Project management', 'Workflows', 'Task boards']
  },
  table: {
    name: 'Data Table',
    description: 'Sortable and filterable data table',
    bestFor: ['Reports', 'Data management', 'Admin panels']
  },
  'split-view': {
    name: 'Split View',
    description: 'Divided view with resizable sections',
    bestFor: ['Code editors', 'Comparisons', 'Multi-document']
  },
  carousel: {
    name: 'Carousel View',
    description: 'Swipeable horizontal carousel',
    bestFor: ['Image galleries', 'Product showcases', 'Onboarding']
  },
  'inbox-style': {
    name: 'Inbox Style',
    description: 'Email-like inbox with preview and actions',
    bestFor: ['Messages', 'Notifications', 'Updates']
  },
  'card-stack': {
    name: 'Card Stack',
    description: 'Stacked cards with swipe gestures',
    bestFor: ['Dating apps', 'Flash cards', 'Reviews']
  },
  'masonry': {
    name: 'Masonry Layout',
    description: 'Pinterest-style dynamic grid',
    bestFor: ['Image galleries', 'Blog posts', 'Mixed content']
  }
};

export const COLOR_SCHEMES = {
  blue: {
    name: 'Ocean Blue',
    primary: '#3498DB',
    secondary: '#2980B9',
    accent: '#1ABC9C',
    background: '#ECF0F1',
    surface: '#FFFFFF',
    text: '#2C3E50'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#9B59B6',
    secondary: '#8E44AD',
    accent: '#E91E63',
    background: '#F3E5F5',
    surface: '#FFFFFF',
    text: '#4A148C'
  },
  green: {
    name: 'Forest Green',
    primary: '#27AE60',
    secondary: '#229954',
    accent: '#F39C12',
    background: '#E8F6F3',
    surface: '#FFFFFF',
    text: '#145A32'
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#E67E22',
    secondary: '#D35400',
    accent: '#F39C12',
    background: '#FEF5E7',
    surface: '#FFFFFF',
    text: '#784212'
  },
  red: {
    name: 'Cherry Red',
    primary: '#E74C3C',
    secondary: '#C0392B',
    accent: '#FF6B6B',
    background: '#FADBD8',
    surface: '#FFFFFF',
    text: '#641E16'
  },
  gray: {
    name: 'Modern Gray',
    primary: '#7F8C8D',
    secondary: '#5D6D7E',
    accent: '#34495E',
    background: '#ECF0F1',
    surface: '#FFFFFF',
    text: '#2C3E50'
  }
};
