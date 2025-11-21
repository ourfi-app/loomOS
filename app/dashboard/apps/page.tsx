// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Calendar,
  CheckSquare,
  FileText,
  Palette,
  Search,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  DollarSign,
  PieChart,
  Brush
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { hasAdminAccess } from '@/lib/auth';

interface ProductivityApp {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
  color: string;
  category: string;
  features: string[];
  isNew?: boolean;
  rating?: number;
  requiresAdmin?: boolean;
}

const PRODUCTIVITY_APPS: ProductivityApp[] = [
  {
    id: 'email',
    title: 'Email',
    description: 'Full-featured email client',
    longDescription: 'Professional email client with LoomOS-style three-pane layout. Manage multiple accounts, organize folders, and handle attachments seamlessly.',
    icon: <Mail className="h-8 w-8" />,
    path: '/dashboard/apps/email',
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    color: 'text-[var(--semantic-primary)]',
    category: 'Communication',
    features: [
      'Three-pane LoomOS layout',
      'Multiple account support',
      'Folder organization',
      'Attachment handling',
      'Search and filters'
    ],
    rating: 4.8,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description: 'Events and scheduling',
    longDescription: 'Comprehensive calendar with day, week, month, and year views. Manage events, appointments, and reminders with color-coded categories.',
    icon: <Calendar className="h-8 w-8" />,
    path: '/dashboard/apps/calendar',
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    color: 'text-emerald-500',
    category: 'Productivity',
    features: [
      'Multiple view modes',
      'Event management',
      'Color-coded categories',
      'Reminders and notifications',
      'Timeline view'
    ],
    rating: 4.9,
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Task management and todos',
    longDescription: 'Organize your work with a powerful task management system. Set priorities, due dates, and track progress across projects.',
    icon: <CheckSquare className="h-8 w-8" />,
    path: '/dashboard/apps/tasks',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    color: 'text-violet-500',
    category: 'Productivity',
    features: [
      'Task creation and editing',
      'Priority levels',
      'Due date tracking',
      'Project grouping',
      'Progress indicators'
    ],
    rating: 4.7,
  },
  {
    id: 'notes',
    title: 'Notes',
    description: 'Note-taking and memos',
    longDescription: 'Simple yet powerful note-taking with rich text formatting. Organize notes with folders and tags for quick access.',
    icon: <FileText className="h-8 w-8" />,
    path: '/dashboard/apps/notes',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    color: 'text-amber-500',
    category: 'Productivity',
    features: [
      'Rich text editing',
      'Folder organization',
      'Tag system',
      'Quick capture',
      'Export options'
    ],
    rating: 4.6,
  },
  {
    id: 'designer',
    title: 'App Designer',
    description: 'Create custom apps visually',
    longDescription: 'Visual app builder for creating LoomOS-style applications. Choose templates, customize layouts, and export production-ready code.',
    icon: <Palette className="h-8 w-8" />,
    path: '/dashboard/apps/designer',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    color: 'text-[var(--semantic-accent)]',
    category: 'Development',
    features: [
      'Visual app builder',
      'Pre-built templates',
      'Customizable layouts',
      'Code generation',
      'Live preview'
    ],
    isNew: true,
    rating: 5.0,
    requiresAdmin: true,
  },
  {
    id: 'brandy',
    title: 'Brandy Logo Designer',
    description: 'Professional logo and brand design',
    longDescription: 'Create stunning logos and brand assets with an intuitive visual design tool. Perfect for building your community brand identity.',
    icon: <Brush className="h-8 w-8" />,
    path: '/dashboard/apps/brandy',
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    color: 'text-[var(--semantic-accent)]',
    category: 'Design',
    features: [
      'Visual design canvas',
      'Shape and text tools',
      'Layer management',
      'Export to multiple formats',
      'Template gallery'
    ],
    rating: 4.8,
  },
  {
    id: 'enhancements',
    title: 'System Enhancements',
    description: 'Advanced features and integrations',
    longDescription: 'Explore and configure advanced system features including real-time updates, keyboard shortcuts, workflow automation, and external integrations.',
    icon: <Zap className="h-8 w-8" />,
    path: '/dashboard/apps/enhancements',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    color: 'text-[var(--semantic-warning)]',
    category: 'System',
    features: [
      'Real-time WebSocket updates',
      'Keyboard shortcuts',
      'Workflow automation',
      'Calendar integration',
      'Mobile-optimized UI'
    ],
    rating: 4.9,
    requiresAdmin: true,
  },
  {
    id: 'accounting',
    title: 'Accounting',
    description: 'Financial tracking and reporting',
    longDescription: 'Comprehensive accounting system for community finances. Track transactions, generate reports, and maintain financial records with ease.',
    icon: <DollarSign className="h-8 w-8" />,
    path: '/dashboard/apps/accounting',
    gradient: 'from-blue-400 via-cyan-500 to-teal-500',
    color: 'text-[var(--semantic-primary)]',
    category: 'Finance',
    features: [
      'Transaction management',
      'Financial reports',
      'Income and expenses',
      'Chart of accounts',
      'Export capabilities'
    ],
    rating: 4.7,
  },
  {
    id: 'budgeting',
    title: 'Budgeting',
    description: 'Budget planning and monitoring',
    longDescription: 'Plan and monitor community budgets with detailed tracking and visual progress indicators. Set limits and receive alerts for overspending.',
    icon: <PieChart className="h-8 w-8" />,
    path: '/dashboard/apps/budgeting',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    color: 'text-[var(--semantic-success)]',
    category: 'Finance',
    features: [
      'Budget creation',
      'Spending tracking',
      'Progress visualization',
      'Category limits',
      'Alerts and notifications'
    ],
    rating: 4.6,
  },
];

export default function AppsLauncherPage() {
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ProductivityApp | null>(null);
  const [filteredApps, setFilteredApps] = useState(PRODUCTIVITY_APPS);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = PRODUCTIVITY_APPS.filter(app => {
      // Filter out admin apps if user is not admin (SUPER_ADMIN bypasses all restrictions)
      if (app.requiresAdmin && !hasAdminAccess((session?.user as any)?.role)) {
        return false;
      }
      
      // Search filter
      if (query) {
        return (
          app.title.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
    setFilteredApps(filtered);
  }, [searchQuery, session]);

  const handleAppClick = (app: ProductivityApp) => {
    setSelectedApp(app);
  };

  const handleLaunchApp = (path: string) => {
    toast.success('Launching app...');
    router.push(path);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-[var(--semantic-border-light)] bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">Productivity Apps</h1>
            <p className="text-[var(--semantic-text-secondary)] mt-1">
              Professional tools to enhance your workflow
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--semantic-text-tertiary)]" />
          <Input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[var(--semantic-border-medium)]"
          />
        </div>
      </div>

      {/* App Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--semantic-surface-hover)] flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-[var(--semantic-text-tertiary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--semantic-text-primary)] mb-2">No apps found</h3>
            <p className="text-[var(--semantic-text-secondary)] max-w-sm">
              Try adjusting your search terms or browse all available apps
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredApps.map((app) => (
              <Card
                key={app.id}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-[var(--semantic-border-light)]"
                onClick={() => handleAppClick(app)}
              >
                {/* Gradient Background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity',
                  app.gradient
                )} />

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      'flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br shadow-md',
                      app.gradient
                    )}>
                      <div className="text-white">
                        {app.icon}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {app.isNew && (
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                          New
                        </Badge>
                      )}
                      {/* Show deprecation badge from registry */}
                      {(() => {
                        const registryApp = Object.values(require('@/lib/enhanced-app-registry').APP_REGISTRY).find(
                          (a: any) => a.path === app.path
                        );
                        return registryApp?.isDeprecated ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
                            Deprecated
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-text-secondary)]">
                      {app.title}
                    </h3>
                    <p className="text-sm text-[var(--semantic-text-secondary)] line-clamp-2">
                      {app.description}
                    </p>

                    {/* Rating */}
                    {app.rating && (
                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-[var(--semantic-warning)]" />
                          <span className="ml-1 text-sm font-medium text-[var(--semantic-text-secondary)]">
                            {app.rating}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--semantic-text-tertiary)]">•</span>
                        <span className="text-xs text-[var(--semantic-text-tertiary)]">{app.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Launch Button */}
                  <Button
                    className={cn(
                      'w-full mt-4 bg-gradient-to-r shadow-md hover:shadow-lg transition-all',
                      app.gradient
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchApp(app.path);
                    }}
                  >
                    Launch App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* App Detail Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApp(null)}
        >
          <Card
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-6">
                <div className={cn(
                  'flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br shadow-lg flex-shrink-0',
                  selectedApp.gradient
                )}>
                  <div className="text-white">
                    {selectedApp.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
                      {selectedApp.title}
                    </h2>
                    {selectedApp.isNew && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        New
                      </Badge>
                    )}
                    {/* Show deprecation badge from registry */}
                    {(() => {
                      const registryApp = Object.values(require('@/lib/enhanced-app-registry').APP_REGISTRY).find(
                        (a: any) => a.path === selectedApp.path
                      );
                      return registryApp?.isDeprecated ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
                          Deprecated
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                  <p className="text-[var(--semantic-text-secondary)] mb-3">{selectedApp.description}</p>
                  {selectedApp.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-[var(--semantic-warning)]" />
                        <span className="ml-1 font-semibold text-[var(--semantic-text-primary)]">
                          {selectedApp.rating}
                        </span>
                      </div>
                      <span className="text-[var(--semantic-text-tertiary)]">•</span>
                      <span className="text-sm text-[var(--semantic-text-secondary)]">{selectedApp.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)] mb-2">About</h3>
                <p className="text-[var(--semantic-text-secondary)] leading-relaxed">
                  {selectedApp.longDescription}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)] mb-3">Features</h3>
                <ul className="space-y-2">
                  {selectedApp.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className={cn(
                        'flex items-center justify-center w-5 h-5 rounded-full mt-0.5',
                        selectedApp.color
                      )}>
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-[var(--semantic-text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  className={cn(
                    'flex-1 bg-gradient-to-r shadow-md hover:shadow-lg transition-all',
                    selectedApp.gradient
                  )}
                  onClick={() => handleLaunchApp(selectedApp.path)}
                >
                  Launch {selectedApp.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
