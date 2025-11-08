import { type LucideIcon } from 'lucide-react';
import { APP_ICONS, APP_COLORS, type AppIconKey, type AppColorKey } from './app-design-system';

export interface AppDefinition {
  id: string;
  title: string;
  icon: LucideIcon;
  iconKey: AppIconKey;
  colorKey: AppColorKey;
  path: string;
  gradient: string;
  category: 'essentials' | 'personal' | 'community' | 'productivity' | 'admin' | 'settings';
  description?: string;
  keywords?: string[];
  requiresAdmin?: boolean;
  canPinToDock?: boolean;
  hasWidget?: boolean;
  widgetSize?: 'small' | 'medium' | 'large';

  // Enhanced metadata
  longDescription?: string;
  tags?: string[];
  version?: string;
  developer?: string;
  releaseDate?: string;
  lastUpdated?: string;
  screenshots?: string[];
  features?: string[];
  permissions?: string[];
  helpUrl?: string;
  feedbackEnabled?: boolean;
  isNew?: boolean;
  isBeta?: boolean;
  averageRating?: number;
  totalRatings?: number;

  // Deprecation metadata
  isDeprecated?: boolean;
  deprecatedBy?: string; // ID of the app that replaces this one
  deprecationMessage?: string;
  deprecationDate?: string;
  redirectToNew?: boolean; // If true, auto-redirect to the new app
}

/**
 * LoomOS Application Registry
 *
 * CONSOLIDATION STRATEGY (Phase 3 - Completed 2025-11-08)
 * ====================================================
 *
 * The platform has consolidated individual productivity apps into unified hubs
 * to provide a better user experience and reduce context switching.
 *
 * CONSOLIDATION PATTERNS:
 *
 * 1. ORGANIZER HUB - Consolidates productivity apps
 *    - Replaced: calendarApp, notesApp, tasksApp (REMOVED)
 *    - Route: /dashboard/organizer
 *    - Status: Individual apps REMOVED
 *
 * 2. INBOX HUB - Consolidates communication apps
 *    - Replaced: emailApp (REMOVED)
 *    - Route: /dashboard/inbox
 *    - Status: Individual apps REMOVED
 *    - Note: Admin Messages app (/dashboard/messages) remains for admin broadcasts
 *
 * 3. CREATOR STUDIO - Super Admin development hub (NOT a replacement pattern)
 *    - Purpose: Quick access dashboard for platform development tools
 *    - Contains tabs that LINK TO full apps (not replace them):
 *      * Branding tab → Links to /dashboard/apps/brandy
 *      * Designer tab → Links to /dashboard/apps/designer
 *      * Marketplace tab → Links to /dashboard/marketplace
 *      * Enhancements tab → Links to /dashboard/apps/enhancements
 *    - Status: Hub AND individual apps both active (NOT deprecated)
 *    - Reason: Super admins need both quick overview (hub) and full features (apps)
 *
 * DEPRECATION LIFECYCLE (COMPLETED):
 *
 * Phase 1: Soft deprecation ✅
 *   - Individual apps showed deprecation warnings
 *   - Users were encouraged to use consolidated apps
 *
 * Phase 2: Hard deprecation (SKIPPED)
 *   - Skipped directly to Phase 3
 *
 * Phase 3: Complete removal ✅ (Current)
 *   - Individual app routes removed
 *   - Only consolidated apps remain
 */
export const APP_REGISTRY: Record<string, AppDefinition> = {
  // Essentials (Most used core features)
  home: {
    id: 'home',
    title: 'Home',
    icon: APP_ICONS.home,
    iconKey: 'home',
    colorKey: 'home',
    path: '/dashboard',
    gradient: APP_COLORS.home.light,
    category: 'essentials',
    description: 'Your personal dashboard',
    keywords: ['home', 'dashboard', 'start', 'main'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'medium',
    longDescription: 'Your central hub for all community activities. Get a quick overview of important updates, upcoming events, recent announcements, and personalized recommendations. The Home dashboard provides at-a-glance information to keep you connected with your community.',
    tags: ['dashboard', 'overview', 'central', 'quick-access'],
    version: '2.1.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-01-15',
    lastUpdated: '2024-10-10',
    features: [
      'Quick access to all features',
      'Personalized content feed',
      'Recent activity overview',
      'Smart search functionality',
      'Customizable layout'
    ],
    permissions: ['View community data', 'Access personal information'],
    feedbackEnabled: true,
    averageRating: 4.8,
    totalRatings: 142,
  },
  
  assistant: {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: APP_ICONS.assistant,
    iconKey: 'assistant',
    colorKey: 'assistant',
    path: '/dashboard/chat',
    gradient: APP_COLORS.assistant.light,
    category: 'essentials',
    description: 'Get instant help and answers',
    keywords: ['ai', 'assistant', 'chat', 'help', 'support', 'ask'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Your intelligent 24/7 community assistant. Get instant answers to questions about community policies, amenities, services, and more. The AI Assistant can help with everything from finding documents to understanding rules and regulations.',
    tags: ['ai', 'support', 'instant-help', 'smart'],
    version: '3.2.1',
    developer: 'Montrecott Team',
    releaseDate: '2024-03-01',
    lastUpdated: '2024-10-18',
    features: [
      'Natural language understanding',
      'Instant policy lookups',
      'Document search assistance',
      'Community knowledge base',
      'Multi-language support'
    ],
    permissions: ['Access community knowledge', 'View public documents'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 4.9,
    totalRatings: 218,
  },
  
  notifications: {
    id: 'notifications',
    title: 'Notifications',
    icon: APP_ICONS.notifications,
    iconKey: 'notifications',
    colorKey: 'notifications',
    path: '/dashboard/notifications',
    gradient: APP_COLORS.notifications.light,
    category: 'essentials',
    description: 'View your notifications',
    keywords: ['notifications', 'alerts', 'updates', 'messages'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'small',
    longDescription: 'Stay up-to-date with all community activities. Receive real-time notifications about announcements, events, maintenance schedules, payment reminders, and important updates. Customize your notification preferences to get only what matters to you.',
    tags: ['alerts', 'updates', 'real-time', 'customizable'],
    version: '2.0.5',
    developer: 'Montrecott Team',
    releaseDate: '2024-01-20',
    lastUpdated: '2024-09-30',
    features: [
      'Real-time push notifications',
      'Customizable alert preferences',
      'Priority notifications',
      'Notification history',
      'Quick actions'
    ],
    permissions: ['Send notifications'],
    feedbackEnabled: true,
    averageRating: 4.6,
    totalRatings: 176,
  },
  
  // Personal (Your account & finances)
  profile: {
    id: 'profile',
    title: 'My Profile',
    icon: APP_ICONS.profile,
    iconKey: 'profile',
    colorKey: 'profile',
    path: '/dashboard/profile',
    gradient: APP_COLORS.profile.light,
    category: 'personal',
    description: 'Manage your personal information',
    keywords: ['profile', 'account', 'settings', 'personal', 'info'],
    canPinToDock: true,
    hasWidget: false,
    longDescription: 'Manage your personal information, contact details, and account preferences. Update your profile photo, emergency contacts, and communication preferences. Control your privacy settings and manage household members.',
    tags: ['account', 'personal', 'settings', 'privacy'],
    version: '1.9.2',
    developer: 'Montrecott Team',
    releaseDate: '2024-01-10',
    lastUpdated: '2024-10-05',
    features: [
      'Profile photo management',
      'Contact information updates',
      'Privacy controls',
      'Emergency contact management',
      'Communication preferences'
    ],
    permissions: ['Edit personal data', 'Upload photos'],
    feedbackEnabled: true,
    averageRating: 4.7,
    totalRatings: 134,
  },
  
  payments: {
    id: 'payments',
    title: 'My Payments',
    icon: APP_ICONS.payments,
    iconKey: 'payments',
    colorKey: 'payments',
    path: '/dashboard/payments',
    gradient: APP_COLORS.payments.light,
    category: 'personal',
    description: 'View and manage your payments',
    keywords: ['payments', 'billing', 'dues', 'money', 'pay', 'invoice'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'medium',
    longDescription: 'Manage your association dues and payments with ease. View payment history, upcoming bills, and make secure online payments. Set up automatic payments and receive reminders before due dates. Download receipts and track your payment status.',
    tags: ['billing', 'financial', 'secure', 'autopay'],
    version: '2.4.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-02-15',
    lastUpdated: '2024-10-12',
    features: [
      'Secure online payments',
      'Payment history tracking',
      'Automatic payment setup',
      'Payment reminders',
      'Digital receipts'
    ],
    permissions: ['Process payments', 'View financial records'],
    feedbackEnabled: true,
    averageRating: 4.8,
    totalRatings: 203,
  },
  
  // Community (Connect & resources)
  documents: {
    id: 'documents',
    title: 'Documents',
    icon: APP_ICONS.documents,
    iconKey: 'documents',
    colorKey: 'documents',
    path: '/dashboard/documents',
    gradient: APP_COLORS.documents.light,
    category: 'community',
    description: 'Access community documents',
    keywords: ['documents', 'files', 'forms', 'policies', 'rules'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'medium',
    longDescription: 'Access all community documents in one centralized location. Browse building policies, rules and regulations, meeting minutes, forms, and important notices. Download documents or view them online. Advanced search helps you find what you need quickly.',
    tags: ['files', 'policies', 'resources', 'searchable'],
    version: '1.8.3',
    developer: 'Montrecott Team',
    releaseDate: '2024-01-25',
    lastUpdated: '2024-10-08',
    features: [
      'Centralized document library',
      'Advanced search & filters',
      'Online document viewing',
      'Download capabilities',
      'Document categories'
    ],
    permissions: ['View documents', 'Download files'],
    feedbackEnabled: true,
    averageRating: 4.5,
    totalRatings: 128,
  },
  
  directory: {
    id: 'directory',
    title: 'Directory',
    icon: APP_ICONS.directory,
    iconKey: 'directory',
    colorKey: 'directory',
    path: '/dashboard/directory',
    gradient: APP_COLORS.directory.light,
    category: 'community',
    description: 'Connect with neighbors',
    keywords: ['directory', 'residents', 'neighbors', 'contacts', 'people'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'small',
    longDescription: 'Connect with your neighbors and build community relationships. Browse the resident directory, find contact information, and discover who lives around you. Respect privacy settings while staying connected with your community.',
    tags: ['community', 'neighbors', 'social', 'connect'],
    version: '2.2.1',
    developer: 'Montrecott Team',
    releaseDate: '2024-02-01',
    lastUpdated: '2024-09-28',
    features: [
      'Resident search',
      'Contact information',
      'Privacy controls',
      'Unit location finder',
      'Neighbor connections'
    ],
    permissions: ['View resident directory', 'Access contact info'],
    feedbackEnabled: true,
    averageRating: 4.4,
    totalRatings: 156,
  },
  
  marketplace: {
    id: 'marketplace',
    title: 'App Store',
    icon: APP_ICONS.marketplace,
    iconKey: 'marketplace',
    colorKey: 'marketplace',
    path: '/dashboard/marketplace',
    gradient: APP_COLORS.marketplace.light,
    category: 'community',
    description: 'Browse and install apps',
    keywords: ['marketplace', 'apps', 'store', 'extensions', 'add'],
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'Discover and install additional apps to enhance your community experience. Browse curated apps for amenity booking, event management, service requests, and more. Each app is vetted for security and quality.',
    tags: ['extensions', 'add-ons', 'enhance', 'discover'],
    version: '1.5.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-05-01',
    lastUpdated: '2024-10-15',
    features: [
      'Curated app catalog',
      'Easy installation',
      'App ratings & reviews',
      'Security verified apps',
      'Automatic updates'
    ],
    permissions: ['Install apps', 'Manage extensions'],
    feedbackEnabled: true,
    isBeta: true,
    averageRating: 4.3,
    totalRatings: 89,
  },
  
  // Admin (Management tools)
  admin: {
    id: 'admin-panel',
    title: 'Admin Panel',
    icon: APP_ICONS.admin,
    iconKey: 'admin',
    colorKey: 'admin',
    path: '/dashboard/admin',
    gradient: APP_COLORS.admin.light,
    category: 'admin',
    description: 'Manage the community',
    keywords: ['admin', 'management', 'control', 'settings'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Comprehensive tools for community management. Access resident management, payment tracking, announcement creation, and system settings. Monitor community health metrics and manage all administrative tasks from one powerful dashboard.',
    tags: ['management', 'control', 'admin-only', 'powerful'],
    version: '3.0.2',
    developer: 'Montrecott Team',
    releaseDate: '2024-01-05',
    lastUpdated: '2024-10-19',
    features: [
      'User management',
      'Payment oversight',
      'Announcement creation',
      'Analytics dashboard',
      'System configuration'
    ],
    permissions: ['Full system access', 'Manage all users', 'Financial access'],
    feedbackEnabled: true,
    averageRating: 4.9,
    totalRatings: 47,
  },
  
  messages: {
    id: 'messages',
    title: 'Messages',
    icon: APP_ICONS.messages,
    iconKey: 'messages',
    colorKey: 'messages',
    path: '/dashboard/messages',
    gradient: APP_COLORS.messages.light,
    category: 'admin',
    description: 'Send messages to residents',
    keywords: ['messages', 'communication', 'email', 'send', 'notify'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: false,
    longDescription: 'Streamlined communication tools for reaching residents. Send targeted messages, create email campaigns, and manage communication preferences. Track message delivery and engagement metrics to ensure important information reaches everyone.',
    tags: ['communication', 'email', 'admin-only', 'broadcast'],
    version: '1.7.4',
    developer: 'Montrecott Team',
    releaseDate: '2024-02-10',
    lastUpdated: '2024-10-01',
    features: [
      'Bulk messaging',
      'Targeted communications',
      'Delivery tracking',
      'Template library',
      'Engagement analytics'
    ],
    permissions: ['Send mass emails', 'Access resident contacts'],
    feedbackEnabled: true,
    averageRating: 4.6,
    totalRatings: 52,
  },
  
  buildingServices: {
    id: 'building-services',
    title: 'Building Services',
    icon: APP_ICONS.buildingServices,
    iconKey: 'buildingServices',
    colorKey: 'buildingServices',
    path: '/dashboard/building-services',
    gradient: APP_COLORS.buildingServices.light,
    category: 'admin',
    description: 'Monitor building infrastructure',
    keywords: ['building', 'services', 'infrastructure', 'wifi', 'utilities', 'hvac', 'monitoring'],
    requiresAdmin: true,
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'Monitor and configure all building infrastructure services including WiFi, HVAC, water, electricity, security cameras, and more. Get real-time status updates and configure notification preferences for each service.',
    tags: ['infrastructure', 'monitoring', 'utilities', 'admin-only'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Real-time service monitoring',
      'Status notifications',
      'Service provider tracking',
      'Infrastructure health dashboard',
      'Quick status overview'
    ],
    permissions: ['View building systems', 'Configure monitoring'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 8,
  },
  
  externalConnections: {
    id: 'external-connections',
    title: 'External Connections',
    icon: APP_ICONS.externalConnections,
    iconKey: 'externalConnections',
    colorKey: 'externalConnections',
    path: '/dashboard/external-connections',
    gradient: APP_COLORS.externalConnections.light,
    category: 'settings',
    description: 'Manage external API connections',
    keywords: ['api', 'external', 'connections', 'integrations', 'stripe', 'twilio', 'sendgrid'],
    requiresAdmin: true,
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'Manage all external API connections and service integrations. Configure payment providers (Stripe), communication services (Twilio, SendGrid), weather APIs, and analytics. Test connections and monitor service health.',
    tags: ['api', 'integrations', 'external', 'admin-only'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'API connection management',
      'Service configuration',
      'Connection testing',
      'Health monitoring',
      'Provider setup'
    ],
    permissions: ['Manage API connections', 'Configure external services'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 7,
  },
  
  onboarding: {
    id: 'onboarding',
    title: 'Setup Wizard',
    icon: APP_ICONS.onboarding,
    iconKey: 'onboarding',
    colorKey: 'onboarding',
    path: '/onboarding',
    gradient: APP_COLORS.onboarding.light,
    category: 'settings',
    description: 'Complete association setup',
    keywords: ['onboarding', 'setup', 'wizard', 'configuration', 'getting started'],
    requiresAdmin: true,
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'Complete guided setup for your association. Configure basic information, upload documents, connect email services, add board members and residents, and set up financial policies.',
    tags: ['setup', 'configuration', 'wizard', 'admin-only'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Association information setup',
      'Document uploads',
      'Email configuration',
      'Board member management',
      'Resident import',
      'Financial settings'
    ],
    permissions: ['Complete association setup', 'Configure all settings'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },
  
  systemConfig: {
    id: 'system-config',
    title: 'System Config',
    icon: APP_ICONS.systemConfig,
    iconKey: 'systemConfig',
    colorKey: 'systemConfig',
    path: '/dashboard/system-config',
    gradient: APP_COLORS.systemConfig.light,
    category: 'admin',
    description: 'Configure system preferences',
    keywords: ['system', 'configuration', 'settings', 'notifications', 'weather', 'theme', 'accessibility'],
    requiresAdmin: true,
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'Configure system-wide preferences including weather settings, notification preferences, theme customization, accessibility options, database management, and security settings. Access advanced system tools and logs.',
    tags: ['configuration', 'system', 'preferences', 'admin-only'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Weather configuration',
      'Notification preferences',
      'Theme customization',
      'Accessibility settings',
      'Database management',
      'Security tools',
      'System logs'
    ],
    permissions: ['Full system configuration', 'Manage preferences'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 6,
  },
  
  accounting: {
    id: 'accounting',
    title: 'Accounting',
    icon: APP_ICONS.accounting,
    iconKey: 'accounting',
    colorKey: 'accounting',
    path: '/dashboard/accounting',
    gradient: APP_COLORS.accounting.light,
    category: 'admin',
    description: 'Comprehensive financial management',
    keywords: ['accounting', 'finances', 'transactions', 'ledger', 'income', 'expenses', 'reports'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Full-featured accounting system for managing association finances. Track income and expenses, manage chart of accounts, reconcile transactions, handle vendor invoices, and generate comprehensive financial reports. Includes accounts receivable, accounts payable, and detailed transaction history.',
    tags: ['financial', 'accounting', 'ledger', 'admin-only', 'powerful'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Chart of accounts management',
      'Transaction recording and tracking',
      'Accounts receivable management',
      'Accounts payable and invoices',
      'Vendor management',
      'Financial reports and statements',
      'Bank reconciliation',
      'Transaction categorization',
      'Multi-year financial history'
    ],
    permissions: ['Full financial access', 'Manage transactions', 'View reports'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 3,
  },
  
  budgeting: {
    id: 'budgeting',
    title: 'Annual Budget',
    icon: APP_ICONS.budgeting,
    iconKey: 'budgeting',
    colorKey: 'budgeting',
    path: '/dashboard/budgeting',
    gradient: APP_COLORS.budgeting.light,
    category: 'admin',
    description: 'Create and manage annual budgets',
    keywords: ['budget', 'planning', 'forecast', 'annual', 'expenses', 'revenue', 'variance'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Strategic budgeting tool for annual financial planning. Create detailed budgets by category, track actual vs budgeted amounts, analyze variances, and forecast future needs. Includes multi-year comparison, budget approval workflows, and comprehensive variance analysis.',
    tags: ['budget', 'planning', 'financial', 'admin-only', 'strategic'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Annual budget creation',
      'Category-level budgeting',
      'Budget vs actual tracking',
      'Variance analysis',
      'Multi-year comparisons',
      'Budget approval workflow',
      'Forecasting tools',
      'Visual budget reports',
      'Revenue and expense planning'
    ],
    permissions: ['Create budgets', 'Approve budgets', 'View financial data'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 2,
  },
  
  superAdmin: {
    id: 'super-admin',
    title: 'Super Admin',
    icon: APP_ICONS.superAdmin,
    iconKey: 'superAdmin',
    colorKey: 'superAdmin',
    path: '/dashboard/super-admin',
    gradient: APP_COLORS.superAdmin.light,
    category: 'admin',
    description: 'Platform-wide system administration',
    keywords: ['super admin', 'platform', 'tenants', 'organizations', 'users', 'domains', 'api', 'monitoring', 'security'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: false,
    longDescription: 'Comprehensive platform administration interface for super administrators. Manage multiple organizations, configure tenants, oversee all users, set up custom domains, monitor API usage, track system health, and enforce security policies across the entire platform.',
    tags: ['super-admin', 'platform', 'multi-tenant', 'system', 'critical'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2025-01-27',
    lastUpdated: '2025-01-27',
    features: [
      'Multi-tenant organization management',
      'Global user administration',
      'Custom domain configuration',
      'API key management and monitoring',
      'System health monitoring',
      'Security policy enforcement',
      'Platform-wide activity logs',
      'Subscription management',
      'Feature flag control',
      'Cross-organization analytics'
    ],
    permissions: ['Full platform access', 'Manage organizations', 'Manage all users', 'System configuration'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },
  
  residentPortal: {
    id: 'resident-portal',
    title: 'Resident Portal',
    icon: APP_ICONS.residentPortal,
    iconKey: 'residentPortal',
    colorKey: 'residentPortal',
    path: '/dashboard/resident-portal',
    gradient: APP_COLORS.residentPortal.light,
    category: 'community',
    description: 'Public-facing resident website',
    keywords: ['portal', 'public', 'website', 'listings', 'amenities', 'inquiries', 'tours'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'medium',
    longDescription: 'Manage the public-facing resident portal and property website. Publish unit listings for sale or rent, showcase community amenities, manage prospective resident inquiries, and schedule tours. Perfect for attracting new residents and providing information to potential buyers and renters.',
    tags: ['public', 'marketing', 'listings', 'admin-only', 'community'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Property listing management',
      'Unit availability tracking',
      'Amenity showcase',
      'Inquiry management',
      'Tour scheduling',
      'Photo galleries',
      'Virtual tour integration',
      'Contact form management',
      'Lead tracking'
    ],
    permissions: ['Manage listings', 'View inquiries', 'Schedule tours'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },

  appDesigner: {
    id: 'app-designer',
    title: 'App Designer',
    icon: APP_ICONS.marketplace,
    iconKey: 'marketplace',
    colorKey: 'marketplace',
    path: '/dashboard/apps/designer',
    gradient: APP_COLORS.marketplace.light,
    category: 'settings',
    description: 'Create custom apps visually',
    keywords: ['designer', 'builder', 'create', 'custom', 'apps', 'templates', 'webos', 'loom'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: false,
    longDescription: 'Visual app designer for creating custom LoomOS-style applications. Choose from pre-built templates (Email, Calendar, Tasks, Memos, Contacts) or start from scratch. Configure layouts, colors, pane styles, and design patterns. Export production-ready React components with full TypeScript support.',
    tags: ['designer', 'builder', 'visual', 'templates', 'admin-only', 'developer'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-22',
    lastUpdated: '2024-10-22',
    features: [
      'Visual app builder interface',
      'Pre-built app templates (Email, Calendar, Tasks, Memos, Contacts)',
      'Customizable layouts (1-pane, 2-pane, 3-pane)',
      'Color scheme configurator',
      'Pane style selection',
      'Design pattern controls',
      'Live preview on multiple devices',
      'Code generation and export',
      'React component templates',
      'LoomOS design system integration'
    ],
    permissions: ['Create apps', 'Export code', 'Publish apps'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },

  // CONSOLIDATED APPS (Phase 1)
  organizer: {
    id: 'organizer',
    title: 'Organizer',
    icon: APP_ICONS.calendar,
    iconKey: 'calendar',
    colorKey: 'calendar',
    path: '/dashboard/organizer',
    gradient: 'from-purple-500 to-indigo-500',
    category: 'productivity',
    description: 'All-in-one productivity suite',
    keywords: ['organizer', 'calendar', 'notes', 'tasks', 'productivity', 'planner'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Your complete productivity hub combining Calendar, Notes, and Tasks in one unified interface. Seamlessly switch between managing your schedule, capturing ideas, and tracking todos without leaving the app.',
    tags: ['productivity', 'consolidated', 'calendar', 'notes', 'tasks', 'all-in-one'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2025-11-03',
    lastUpdated: '2025-11-03',
    features: [
      'Unified productivity workspace',
      'Calendar with event management',
      'Notes with categories and search',
      'Task lists with priorities',
      'Seamless tab switching',
      'LoomOS-style interface',
      'Quick access to all productivity tools'
    ],
    permissions: ['View calendar', 'Manage events', 'Create notes', 'Manage tasks'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },

  inbox: {
    id: 'inbox',
    title: 'Inbox',
    icon: APP_ICONS.messages,
    iconKey: 'messages',
    colorKey: 'messages',
    path: '/dashboard/inbox',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'essentials',
    description: 'Unified communications center',
    keywords: ['inbox', 'messages', 'chat', 'email', 'communication', 'assistant'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Your complete communications hub combining Messages, AI Assistant, and Email in one unified interface. Manage all your community communications from a single, convenient location.',
    tags: ['communication', 'consolidated', 'messages', 'chat', 'email', 'all-in-one'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2025-11-03',
    lastUpdated: '2025-11-03',
    features: [
      'Unified communication workspace',
      'Message center for resident communications',
      'AI Assistant for instant help',
      'Email integration (coming soon)',
      'Seamless tab switching',
      'LoomOS-style interface',
      'Quick access to all communication tools'
    ],
    permissions: ['Send messages', 'Access AI assistant', 'View email'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },

  'creator-studio': {
    id: 'creator-studio',
    title: 'Creator Studio',
    icon: APP_ICONS.developer,
    iconKey: 'developer',
    colorKey: 'developer',
    path: '/dashboard/creator-studio',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    category: 'settings',
    description: 'Platform customization and development tools',
    keywords: ['creator', 'studio', 'developer', 'branding', 'designer', 'marketplace', 'tools', 'platform', 'customize'],
    requiresAdmin: true,
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'The Creator Studio is your complete platform development and customization hub. Design logos and brand assets, build custom applications with the visual app designer, manage the app marketplace, and configure advanced platform features. This is the central workspace for platform administrators and developers to customize and extend the platform.',
    tags: ['developer', 'consolidated', 'branding', 'design', 'marketplace', 'meta', 'platform-tools'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2025-11-03',
    lastUpdated: '2025-11-03',
    features: [
      'Unified developer workspace',
      'Logo and brand asset designer (Brandy)',
      'Visual app builder and designer',
      'App marketplace management',
      'Platform feature enhancements',
      'Color palette configuration',
      'Tab-based navigation',
      'Super Admin access only'
    ],
    permissions: ['Platform administration', 'App development', 'Brand customization', 'Marketplace management'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },

  help: {
    id: 'help',
    title: 'Help & Support',
    icon: APP_ICONS.help,
    iconKey: 'help',
    colorKey: 'help',
    path: '/dashboard/help',
    gradient: APP_COLORS.help.light,
    category: 'essentials',
    description: 'Get help and learn about features',
    keywords: ['help', 'support', 'faq', 'documentation', 'tutorial', 'guide', 'assist'],
    canPinToDock: true,
    hasWidget: false,
    longDescription: 'Your comprehensive help and support center. Access FAQs, detailed documentation, search for answers, and learn about all features. Get instant help with common questions and access step-by-step guides for all aspects of the community management system.',
    tags: ['support', 'documentation', 'learning', 'faq'],
    version: '2.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-27',
    lastUpdated: '2024-10-27',
    features: [
      'Searchable knowledge base',
      'Frequently Asked Questions',
      'Detailed documentation articles',
      'Category-based navigation',
      'Context-aware help',
      'Quick search functionality',
      'Step-by-step guides'
    ],
    permissions: ['View help content'],
    feedbackEnabled: true,
    averageRating: 4.9,
    totalRatings: 67,
  },

  brandy: {
    id: 'brandy',
    title: 'Brandy',
    icon: APP_ICONS.brandy,
    iconKey: 'brandy',
    colorKey: 'brandy',
    path: '/dashboard/apps/brandy',
    gradient: APP_COLORS.brandy.gradient,
    category: 'productivity',
    description: 'AI-powered logo designer',
    keywords: ['logo', 'design', 'branding', 'graphics', 'ai', 'creative'],
    canPinToDock: true,
    hasWidget: false,
    longDescription: 'Strategic logo design and branding application. Create professional logos with AI assistance, customize colors and typography, export in multiple formats (PNG, SVG), and save your projects. Perfect for businesses, associations, and organizations needing visual identity.',
    tags: ['design', 'branding', 'creative', 'ai', 'logo'],
    version: '1.0.0',
    developer: 'ourfi Team',
    releaseDate: '2025-11-02',
    lastUpdated: '2025-11-02',
    features: [
      'AI-powered design suggestions',
      'Custom color palettes',
      'Typography customization',
      'Icon and shape library',
      'Multiple export formats (PNG, SVG)',
      'Project save and load',
      'Live preview canvas',
      'Responsive design tools'
    ],
    permissions: ['Create designs', 'Export files'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },

  household: {
    id: 'household',
    title: 'My Household',
    icon: APP_ICONS.household,
    iconKey: 'household',
    colorKey: 'household',
    path: '/dashboard/my-household',
    gradient: APP_COLORS.household.light,
    category: 'personal',
    description: 'Manage your household, profile, and payments',
    keywords: ['household', 'family', 'residents', 'pets', 'children', 'unit', 'profile', 'payments'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'medium',
    longDescription: 'Comprehensive household management for your unit. Manage your profile, household members, children, pets, and additional residents. View payment history and make payments. Update contact information, emergency contacts, and household preferences.',
    tags: ['household', 'family', 'personal', 'unit', 'profile'],
    version: '3.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-01-15',
    lastUpdated: '2025-11-03',
    features: [
      'Personal profile management',
      'Household member management',
      'Children and dependents',
      'Pet registration',
      'Additional residents',
      'Payment history and billing',
      'Emergency contacts',
      'Contact preferences'
    ],
    permissions: ['Edit household data', 'Manage members', 'View payments'],
    feedbackEnabled: true,
    averageRating: 4.8,
    totalRatings: 128,
  },

  myCommunity: {
    id: 'my-community',
    title: 'My Community',
    icon: APP_ICONS.community,
    iconKey: 'community',
    colorKey: 'community',
    path: '/dashboard/my-community',
    gradient: APP_COLORS.community.light,
    category: 'community',
    description: 'Community information and resources',
    keywords: ['community', 'directory', 'documents', 'announcements', 'resources'],
    canPinToDock: true,
    hasWidget: true,
    widgetSize: 'large',
    longDescription: 'Your community hub with all essential information in one place. Access the resident directory, browse community documents, read announcements, and discover community resources. Stay connected and informed about your community.',
    tags: ['community', 'information', 'resources', 'hub'],
    version: '2.1.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-02-01',
    lastUpdated: '2024-09-25',
    features: [
      'Resident directory access',
      'Community documents',
      'Announcements feed',
      'Resource library',
      'Committee information',
      'Building policies',
      'Contact management',
      'Community calendar'
    ],
    permissions: ['View community data', 'Access directory'],
    feedbackEnabled: true,
    averageRating: 4.7,
    totalRatings: 108,
  },

  systemSettings: {
    id: 'system-settings',
    title: 'System Settings',
    icon: APP_ICONS.settings,
    iconKey: 'settings',
    colorKey: 'settings',
    path: '/dashboard/system-settings',
    gradient: APP_COLORS.settings.light,
    category: 'settings',
    description: 'Advanced system configuration',
    keywords: ['settings', 'system', 'configuration', 'preferences', 'advanced'],
    requiresAdmin: true,
    canPinToDock: false,
    hasWidget: false,
    longDescription: 'Advanced system settings and configuration. Manage global preferences, security settings, API configurations, and system behavior. For basic settings, use the System Config app.',
    tags: ['settings', 'advanced', 'system', 'admin-only'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2024-10-21',
    lastUpdated: '2024-10-21',
    features: [
      'Advanced configuration',
      'Security settings',
      'API management',
      'System behavior',
      'Performance tuning',
      'Debug tools',
      'System logs'
    ],
    permissions: ['Full system access', 'Modify settings'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 4,
  },

  rolesPermissions: {
    id: 'roles-permissions',
    title: 'Roles & Permissions',
    icon: APP_ICONS.admin,
    iconKey: 'admin',
    colorKey: 'admin',
    path: '/dashboard/admin/roles',
    gradient: 'from-purple-500 to-pink-600',
    category: 'admin',
    description: 'Manage roles and permissions',
    keywords: ['roles', 'permissions', 'access', 'security', 'rbac', 'admin', 'users'],
    requiresAdmin: true,
    canPinToDock: true,
    hasWidget: false,
    widgetSize: undefined,
    longDescription: 'Comprehensive role and permission management system. Create custom roles, assign granular permissions, and control user access across the platform. Supports tenant-level role management for admins and system-wide management for super admins.',
    tags: ['security', 'access control', 'admin-only', 'rbac', 'management'],
    version: '1.0.0',
    developer: 'Montrecott Team',
    releaseDate: '2025-11-01',
    lastUpdated: '2025-11-01',
    features: [
      'Create custom roles',
      'Assign permissions',
      'Manage user access',
      'Role-based access control',
      'Permission categories',
      'Tenant isolation',
      'System-wide management for super admins',
      'Role templates',
      'User assignment tracking'
    ],
    permissions: ['Manage roles', 'Assign permissions', 'View users'],
    feedbackEnabled: true,
    isNew: true,
    averageRating: 5.0,
    totalRatings: 1,
  },
};

// Reimagined Category Definitions - More intuitive groupings
export const CATEGORIES = {
  essentials: {
    id: 'essentials',
    title: 'Essentials',
    icon: APP_ICONS.home,
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    description: 'Core features you use every day',
  },
  personal: {
    id: 'personal',
    title: 'Personal',
    icon: APP_ICONS.household,
    gradient: 'from-indigo-400 via-purple-500 to-violet-500',
    description: 'Your account and finances',
  },
  community: {
    id: 'community',
    title: 'Community',
    icon: APP_ICONS.community,
    gradient: 'from-cyan-400 via-teal-500 to-sky-500',
    description: 'Connect and access resources',
  },
  productivity: {
    id: 'productivity',
    title: 'Productivity',
    icon: APP_ICONS.calendar,
    gradient: 'from-fuchsia-400 via-purple-500 to-pink-500',
    description: 'Work and communication tools',
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: APP_ICONS.settings,
    gradient: 'from-slate-400 via-zinc-500 to-gray-500',
    description: 'System configuration',
  },
  admin: {
    id: 'admin',
    title: 'Admin',
    icon: APP_ICONS.admin,
    gradient: 'from-red-400 via-rose-500 to-pink-500',
    description: 'Management and control',
  },
};

// Helper Functions
export function getAppById(id: string): AppDefinition | undefined {
  return APP_REGISTRY[id];
}

export function getAppsByCategory(category: string): AppDefinition[] {
  return Object.values(APP_REGISTRY).filter(app => app.category === category);
}

export function getAllApps(includeAdmin: boolean = false): AppDefinition[] {
  return Object.values(APP_REGISTRY).filter(app => 
    includeAdmin || !app.requiresAdmin
  );
}

export function searchApps(query: string): AppDefinition[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(APP_REGISTRY).filter(app => 
    app.title.toLowerCase().includes(lowerQuery) ||
    app.description?.toLowerCase().includes(lowerQuery) ||
    app.keywords?.some(kw => kw.includes(lowerQuery))
  );
}

export function getPinnableApps(): AppDefinition[] {
  return Object.values(APP_REGISTRY).filter(app => app.canPinToDock);
}

export function getAppsWithWidgets(): AppDefinition[] {
  return Object.values(APP_REGISTRY).filter(app => app.hasWidget);
}

export function sortApps(apps: AppDefinition[], sortMode: string, appUsage: Record<string, any>): AppDefinition[] {
  switch (sortMode) {
    case 'alphabetical':
      return [...apps].sort((a, b) => a.title.localeCompare(b.title));
    
    case 'recent':
      return [...apps].sort((a, b) => {
        const aUsage = appUsage[a.id]?.lastUsed || 0;
        const bUsage = appUsage[b.id]?.lastUsed || 0;
        return bUsage - aUsage;
      });
    
    case 'frequent':
      return [...apps].sort((a, b) => {
        const aCount = appUsage[a.id]?.useCount || 0;
        const bCount = appUsage[b.id]?.useCount || 0;
        return bCount - aCount;
      });
    
    case 'default':
    default:
      return apps;
  }
}
