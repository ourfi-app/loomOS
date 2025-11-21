'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Store, 
  Download, 
  Star, 
  Check, 
  Loader2,
  X,
  Users,
  Shield,
  Info,
  Search,
  TrendingUp,
  RefreshCw,
  Package,
  ArrowUpCircle,
  Bell,
  Clock,
  Sparkles,
  Zap,
  Play,
  Heart,
  Settings as SettingsIcon,
  Briefcase,
  MessageSquare,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';
import { 
  LoomOSListItem,
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSEmptyState,
  LoomOSLoadingState,
  DesktopAppWrapper
} from '@/components/webos';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { ErrorBoundary } from '@/components/common';

interface MarketplaceApp {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  status: string;
  version: string;
  developer: string;
  iconName: string;
  color: string;
  path: string;
  features?: string[];
  permissions?: string[];
  minRole?: string;
  isSystem: boolean;
  installCount: number;
  rating?: number;
  ratingCount: number;
  size?: string;
  releaseDate?: string;
  lastUpdated?: string;
  isFeatured?: boolean;
  updateNotes?: string;
}

interface UserInstalledApp {
  id: string;
  appId: string;
  installedAt: string;
  installedVersion?: string;
  lastUpdatedAt?: string;
  app: MarketplaceApp;
}

interface AppUpdate {
  appId: string;
  appName: string;
  currentVersion: string;
  newVersion: string;
  updateNotes?: string;
}

export default function MarketplacePage() {
  const session = useSession()?.data;
  const [apps, setApps] = useState<MarketplaceApp[]>([]);
  const [installedApps, setInstalledApps] = useState<UserInstalledApp[]>([]);
  const [availableUpdates, setAvailableUpdates] = useState<AppUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [uninstalling, setUninstalling] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCategory || searchQuery) {
      loadApps();
    }
  }, [selectedCategory, searchQuery]);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([
      loadApps(),
      loadInstalledApps(),
      loadUpdates(),
    ]);
    setLoading(false);
  };

  const loadApps = async () => {
    try {
      const response = await fetch(`/api/marketplace/apps?category=${selectedCategory}`);
      if (response.ok) {
        const data = await response.json();
        setApps(data);
      }
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  };

  const loadInstalledApps = async () => {
    try {
      const response = await fetch('/api/marketplace/installed');
      if (response.ok) {
        const data = await response.json();
        setInstalledApps(data);
      }
    } catch (error) {
      console.error('Error loading installed apps:', error);
    }
  };

  const loadUpdates = async () => {
    try {
      const response = await fetch('/api/marketplace/updates');
      if (response.ok) {
        const data = await response.json();
        setAvailableUpdates(data.updates || []);
      }
    } catch (error) {
      console.error('Error loading updates:', error);
    }
  };

  const isInstalled = (appId: string) => {
    return installedApps.some((installed) => installed.appId === appId);
  };

  const hasUpdate = (appId: string) => {
    return availableUpdates.some((update) => update.appId === appId);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    if (!Icon) return Store;
    return Icon;
  };

  const handleInstall = async (app: MarketplaceApp) => {
    setInstalling(app.id);
    try {
      const response = await fetch('/api/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id }),
      });

      if (response.ok) {
        toast.success(`${app.name} installed successfully!`);
        await loadInstalledApps();
      } else {
        toast.error(`Failed to install ${app.name}`);
      }
    } catch (error) {
      console.error('Error installing app:', error);
      toast.error('Installation failed');
    } finally {
      setInstalling(null);
    }
  };

  const handleUpdate = async (app: MarketplaceApp) => {
    setUpdating(app.id);
    try {
      const response = await fetch('/api/marketplace/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id }),
      });

      if (response.ok) {
        toast.success(`${app.name} updated successfully!`);
        await Promise.all([loadInstalledApps(), loadUpdates()]);
      } else {
        toast.error(`Failed to update ${app.name}`);
      }
    } catch (error) {
      console.error('Error updating app:', error);
      toast.error('Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const handleUninstall = async (app: MarketplaceApp) => {
    setUninstalling(app.id);
    try {
      const response = await fetch('/api/marketplace/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id }),
      });

      if (response.ok) {
        toast.success(`${app.name} uninstalled successfully`);
        await loadInstalledApps();
        setSelectedApp(null);
      } else {
        toast.error(`Failed to uninstall ${app.name}`);
      }
    } catch (error) {
      console.error('Error uninstalling app:', error);
      toast.error('Uninstall failed');
    } finally {
      setUninstalling(null);
    }
  };

  // Categories
  const categories = [
    { id: 'ALL', label: 'All Apps', icon: Store },
    { id: 'COMMUNICATION', label: 'Communication', icon: MessageSquare },
    { id: 'PRODUCTIVITY', label: 'Productivity', icon: Briefcase },
    { id: 'COMMUNITY', label: 'Community', icon: Users },
    { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Play },
    { id: 'UTILITIES', label: 'Utilities', icon: SettingsIcon },
    { id: 'LIFESTYLE', label: 'Lifestyle', icon: Heart },
  ];

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'ALL') return apps.length;
    return apps.filter(app => app.category === categoryId).length;
  };

  // Navigation items
  const navigationItems = categories.map(category => ({
    id: category.id,
    label: category.label,
    icon: <category.icon className="w-4 h-4" />,
    count: getCategoryCount(category.id),
    active: selectedCategory === category.id,
    onClick: () => {
      setSelectedCategory(category.id);
      setSelectedApp(null);
    },
  }));

  // Filtered apps
  const filteredApps = useMemo(() => {
    let filtered = apps;

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.shortDescription.toLowerCase().includes(query) ||
        app.longDescription.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [apps, selectedCategory, searchQuery]);

  // Toolbar actions
  const appDef = APP_REGISTRY['marketplace'];
  const MarketplaceIcon = appDef?.icon;

  const toolbarActions = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-64 webos-pebble"
        />
      </div>
      <Button
        icon={<RefreshCw className="w-4 h-4" />}
        onClick={loadInitialData}
        size="sm"
      >
        Refresh
      </Button>
    </div>
  );

  // Detail pane actions
  const detailActions = selectedApp ? (
    <div className="flex items-center gap-2">
      {isInstalled(selectedApp.id) ? (
        <>
          {hasUpdate(selectedApp.id) && (
            <Button
              icon={<ArrowUpCircle className="w-4 h-4" />}
              onClick={() => handleUpdate(selectedApp)}
              disabled={updating === selectedApp.id}
              size="sm"
            >
              {updating === selectedApp.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          )}
          {!selectedApp.isSystem && (
            <Button
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => handleUninstall(selectedApp)}
              disabled={uninstalling === selectedApp.id}
              variant="destructive"
              size="sm"
            >
              {uninstalling === selectedApp.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uninstalling...
                </>
              ) : (
                'Uninstall'
              )}
            </Button>
          )}
        </>
      ) : (
        <Button
          icon={<Download className="w-4 h-4" />}
          onClick={() => handleInstall(selectedApp)}
          disabled={installing === selectedApp.id}
          size="sm"
        >
          {installing === selectedApp.id ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Installing...
            </>
          ) : (
            'Install'
          )}
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <ErrorBoundary>
      <DesktopAppWrapper
        title="App Store"
        icon={MarketplaceIcon ? <MarketplaceIcon className="w-5 h-5" /> : <Store className="w-5 h-5" />}
        gradient={appDef?.gradient}
        toolbar={toolbarActions}
      >
        <div className="h-full flex overflow-hidden">
          {/* Navigation Pane - Categories */}
          <LoomOSNavigationPane
            title="CATEGORIES"
            items={navigationItems}
          />

          {/* List Pane - Apps */}
          <div className="w-96 flex-shrink-0 border-r border-border flex flex-col bg-background">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-border bg-card/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">
                    {categories.find(c => c.id === selectedCategory)?.label || 'All Apps'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
                  </p>
                </div>
              </div>
            </div>

            {/* Apps List */}
            <ScrollArea className="flex-1">
              {loading ? (
                <LoomOSLoadingState message="Loading apps..." />
              ) : filteredApps.length === 0 ? (
                <LoomOSEmptyState
                  icon={<Store className="w-12 h-12" />}
                  title="No apps found"
                  description={searchQuery ? 'Try adjusting your search' : 'No apps available in this category'}
                />
              ) : (
                <div>
                  {filteredApps.map((app, index) => {
                    const Icon = getIcon(app.iconName);
                    const installed = isInstalled(app.id);
                    const updateAvailable = hasUpdate(app.id);

                    return (
                      <LoomOSListItem
                        key={app.id}
                        selected={selectedApp?.id === app.id}
                        onClick={() => setSelectedApp(app)}
                        animationIndex={index}
                      >
                        <div className="flex items-center gap-3 px-4 py-3">
                          {/* App Icon */}
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md',
                              app.color
                            )}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          {/* App Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium truncate">
                                {app.name}
                              </span>
                              {installed && (
                                <CheckCircle className="w-3.5 h-3.5 text-[var(--semantic-success)] flex-shrink-0" />
                              )}
                              {updateAvailable && (
                                <ArrowUpCircle className="w-3.5 h-3.5 text-[var(--semantic-primary)] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {app.shortDescription}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {app.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-[var(--semantic-warning)] fill-yellow-500" />
                                  <span className="text-xs text-muted-foreground">
                                    {app.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {app.isSystem && (
                                <Badge variant="secondary" className="text-xs">System</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </LoomOSListItem>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Detail Pane - App Details */}
          <LoomOSDetailPane
            title={selectedApp?.name}
            subtitle={selectedApp ? `by ${selectedApp.developer}` : undefined}
            actions={detailActions}
            isEmpty={!selectedApp}
            emptyIcon={<Store className="w-16 h-16" />}
            emptyMessage="No app selected"
            emptySubMessage="Select an app from the list to view details"
          >
            {selectedApp && (() => {
              const Icon = getIcon(selectedApp.iconName);
              const installed = isInstalled(selectedApp.id);
              const updateAvailable = hasUpdate(selectedApp.id);

              return (
                <ScrollArea className="h-full">
                  <div className="px-6 py-6 space-y-6">
                    {/* App Header */}
                    <div className="flex items-start gap-4 pb-6 border-b border-border">
                      <div
                        className={cn(
                          'w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                          selectedApp.color
                        )}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{selectedApp.name}</h2>
                        <p className="text-muted-foreground mb-3">{selectedApp.developer}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={installed ? 'default' : 'outline'}>
                            {installed ? 'Installed' : 'Not Installed'}
                          </Badge>
                          {updateAvailable && (
                            <Badge variant="secondary">Update Available</Badge>
                          )}
                          {selectedApp.isSystem && (
                            <Badge variant="secondary">System App</Badge>
                          )}
                          {selectedApp.isFeatured && (
                            <Badge variant="secondary" className="bg-[var(--semantic-warning)]/10 text-[var(--semantic-warning-dark)]">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* App Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {selectedApp.rating && (
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="w-4 h-4 text-[var(--semantic-warning)] fill-yellow-500" />
                            <span className="text-lg font-bold">{selectedApp.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {selectedApp.ratingCount} {selectedApp.ratingCount === 1 ? 'review' : 'reviews'}
                          </p>
                        </div>
                      )}
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold mb-1">{selectedApp.installCount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Installs</p>
                      </div>
                      {selectedApp.size && (
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold mb-1">{selectedApp.size}</div>
                          <p className="text-xs text-muted-foreground">Size</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        About
                      </h3>
                      <p className="text-sm leading-relaxed">{selectedApp.longDescription}</p>
                      <p className="text-sm text-muted-foreground">
                        Version {selectedApp.version}
                      </p>
                    </div>

                    {/* Features */}
                    {selectedApp.features && selectedApp.features.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Features
                        </h3>
                        <ul className="space-y-2">
                          {selectedApp.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-[var(--semantic-success)] mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Permissions */}
                    {selectedApp.permissions && selectedApp.permissions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Permissions
                        </h3>
                        <ul className="space-y-2">
                          {selectedApp.permissions.map((permission, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{permission}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Update Notes */}
                    {updateAvailable && selectedApp.updateNotes && (
                      <div className="space-y-3 p-4 bg-[var(--semantic-primary-subtle)] dark:bg-blue-950/30 rounded-lg border border-[var(--semantic-primary-light)] dark:border-blue-900">
                        <h3 className="text-sm font-semibold text-[var(--semantic-primary-dark)] dark:text-blue-100 uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          What's New
                        </h3>
                        <p className="text-sm text-[var(--semantic-primary-dark)] dark:text-blue-200">{selectedApp.updateNotes}</p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="pt-6 border-t border-border space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">{selectedApp.category}</span>
                      </div>
                      {selectedApp.releaseDate && (
                        <div className="flex justify-between">
                          <span>Released:</span>
                          <span className="font-medium">{new Date(selectedApp.releaseDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedApp.lastUpdated && (
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span className="font-medium">{new Date(selectedApp.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedApp.minRole && (
                        <div className="flex justify-between">
                          <span>Required Role:</span>
                          <span className="font-medium">{selectedApp.minRole}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              );
            })()}
          </LoomOSDetailPane>
        </div>
      </DesktopAppWrapper>
    </ErrorBoundary>
  );
}
