'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings,
  Cloud,
  Bell,
  Palette,
  Database,
  Key,
  Server,
  Shield,
  Activity,
  Eye,
  RefreshCw,
  Save,
  TestTube,
  Download,
  Upload,
  AlertTriangle,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { 
  DesktopAppWrapper,
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSEmptyState,
  LoomOSListItem,
} from '@/components/webos';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { ErrorBoundary } from '@/components/common';

type SettingItem = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
};

export default function SystemConfigPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const { isAdminMode } = useAdminMode();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('overview');
  const [selectedSetting, setSelectedSetting] = useState<SettingItem | null>(null);
  
  const userRole = (session?.data?.user as any)?.role;

  // Weather settings
  const [weatherSettings, setWeatherSettings] = useState({
    provider: 'wttr.in',
    location: 'Chicago,IL,US',
    units: 'imperial',
    updateInterval: 30,
    showInStatusBar: true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    buildingStatus: true,
    payments: true,
    announcements: true,
    emergencies: true,
  });

  useEffect(() => {
    if (status === 'authenticated' && (userRole !== 'ADMIN' || !isAdminMode)) {
      router.push('/dashboard');
    }
  }, [status, userRole, isAdminMode, router]);

  const saveSettings = () => {
    setLoading(true);
    toast.loading('Saving settings...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Settings saved successfully!');
      setLoading(false);
    }, 1500);
  };

  if (status === 'loading' || (status === 'authenticated' && (userRole !== 'ADMIN' || !isAdminMode))) {
    return null;
  }

  // Get app definition for styling
  const appDef = APP_REGISTRY['system-config'];
  const SystemConfigIcon = appDef?.icon;

  // Settings categories
  const categories = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'advanced', label: 'Advanced', icon: Database },
    { id: 'system', label: 'System', icon: Server },
  ];

  // All settings items
  const settingsItems: SettingItem[] = [
    {
      id: 'weather',
      name: 'Weather Services',
      description: 'Configure weather data source and preferences',
      icon: <Cloud className="w-5 h-5" />,
      category: 'overview',
    },
    {
      id: 'theme',
      name: 'Theme & Appearance',
      description: 'Customize the look and feel',
      icon: <Palette className="w-5 h-5" />,
      category: 'overview',
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      description: 'WCAG 2.2 compliant options',
      icon: <Eye className="w-5 h-5" />,
      category: 'overview',
    },
    {
      id: 'notification-prefs',
      name: 'Notification Preferences',
      description: 'Configure what notifications residents receive',
      icon: <Bell className="w-5 h-5" />,
      category: 'notifications',
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Database configuration and maintenance',
      icon: <Database className="w-5 h-5" />,
      category: 'advanced',
    },
    {
      id: 'security',
      name: 'Security',
      description: 'Security and authentication settings',
      icon: <Shield className="w-5 h-5" />,
      category: 'advanced',
    },
    {
      id: 'system-info',
      name: 'System Information',
      description: 'Application and server details',
      icon: <Server className="w-5 h-5" />,
      category: 'system',
    },
    {
      id: 'performance',
      name: 'System Performance',
      description: 'Resource usage and metrics',
      icon: <Activity className="w-5 h-5" />,
      category: 'system',
    },
    {
      id: 'logs',
      name: 'System Logs',
      description: 'View system activity and errors',
      icon: <Activity className="w-5 h-5" />,
      category: 'system',
    },
  ];

  // Get settings for selected category
  const categorySettings = settingsItems.filter(item => item.category === selectedCategory);

  // Navigation items
  const navigationItems = categories.map(category => ({
    id: category.id,
    label: category.label,
    icon: <category.icon className="w-4 h-4" />,
    count: settingsItems.filter(item => item.category === category.id).length,
    active: selectedCategory === category.id,
    onClick: () => {
      setSelectedCategory(category.id);
      setSelectedSetting(null);
    },
  }));

  // Toolbar actions
  const toolbarActions = (
    <div className="flex items-center gap-2">
      <Button
        icon={<Save className="w-4 h-4" />}
        onClick={saveSettings}
        disabled={loading}
        size="sm"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );

  // Render setting detail
  const renderSettingDetail = () => {
    if (!selectedSetting) return null;

    switch (selectedSetting.id) {
      case 'weather':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weather-location">Location</Label>
              <Input
                id="weather-location"
                value={weatherSettings.location}
                onChange={(e) => setWeatherSettings({ ...weatherSettings, location: e.target.value })}
                placeholder="Chicago,IL,US"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weather-units">Units</Label>
              <select
                id="weather-units"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={weatherSettings.units}
                onChange={(e) => setWeatherSettings({ ...weatherSettings, units: e.target.value })}
              >
                <option value="imperial">Imperial (°F)</option>
                <option value="metric">Metric (°C)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label htmlFor="weather-status-bar">Show in Status Bar</Label>
              <Switch
                id="weather-status-bar"
                checked={weatherSettings.showInStatusBar}
                onCheckedChange={(checked) => setWeatherSettings({ ...weatherSettings, showInStatusBar: checked })}
              />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <TestTube className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Theme settings are managed via the status bar. Click the theme toggle in the top-right corner to switch between light and dark modes.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Palette className="h-4 w-4 mr-2" />
              Advanced Theme Settings
            </Button>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Accessibility options are available via the floating accessibility button. Click it to configure text size, contrast, motion, and more.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Open Accessibility Panel
            </Button>
          </div>
        );

      case 'notification-prefs':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Via SendGrid</p>
              </div>
              <Switch
                checked={notificationSettings.email}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Via Twilio</p>
              </div>
              <Switch
                checked={notificationSettings.sms}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, sms: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">In-app alerts</p>
              </div>
              <Switch
                checked={notificationSettings.push}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Building Status Updates</Label>
                <p className="text-xs text-muted-foreground">Service disruptions and maintenance</p>
              </div>
              <Switch
                checked={notificationSettings.buildingStatus}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, buildingStatus: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Payment Reminders</Label>
                <p className="text-xs text-muted-foreground">Upcoming and overdue payments</p>
              </div>
              <Switch
                checked={notificationSettings.payments}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, payments: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Announcements</Label>
                <p className="text-xs text-muted-foreground">Community updates and news</p>
              </div>
              <Switch
                checked={notificationSettings.announcements}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, announcements: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Emergency Alerts</Label>
                <p className="text-xs text-muted-foreground">Critical safety notifications</p>
              </div>
              <Switch
                checked={notificationSettings.emergencies}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emergencies: checked })}
              />
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Optimize Database
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Backup
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Import Backup
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Key className="h-4 w-4 mr-2" />
              Manage API Keys
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Security Audit
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Session Management
            </Button>
          </div>
        );

      case 'system-info':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 hover:bg-muted/50 rounded">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">3.2.1</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted/50 rounded">
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted/50 rounded">
              <span className="text-muted-foreground">Database:</span>
              <span className="font-medium">PostgreSQL 16</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted/50 rounded">
              <span className="text-muted-foreground">Node Version:</span>
              <span className="font-medium">v20.11.0</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted/50 rounded">
              <span className="text-muted-foreground">Deployed:</span>
              <span className="font-medium">Oct 30, 2024</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted/50 rounded">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">7d 14h 23m</span>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[var(--semantic-success)]" style={{ width: '23%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="font-medium">2.1 GB / 4 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[var(--semantic-warning)]" style={{ width: '52.5%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Disk Usage</span>
                <span className="font-medium">42 GB / 100 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[var(--semantic-primary)]" style={{ width: '42%' }} />
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              View Activity Logs
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View Error Logs
            </Button>
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Select a setting to configure</p>;
    }
  };

  return (
    <ErrorBoundary>
      <DesktopAppWrapper
        title={appDef?.title || 'System Configuration'}
        icon={SystemConfigIcon ? <SystemConfigIcon className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
        gradient={appDef?.gradient}
        toolbar={toolbarActions}
      >
        <div className="h-full flex overflow-hidden">
          {/* Navigation Pane - Categories */}
          <LoomOSNavigationPane
            title="SETTINGS"
            items={navigationItems}
          />

          {/* List Pane - Settings Items */}
          <div className="w-96 flex-shrink-0 border-r border-border flex flex-col bg-background">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-border bg-card/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">
                    {categories.find(c => c.id === selectedCategory)?.label || 'Settings'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {categorySettings.length} {categorySettings.length === 1 ? 'setting' : 'settings'}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings List */}
            <ScrollArea className="flex-1">
              {categorySettings.length === 0 ? (
                <LoomOSEmptyState
                  icon={<Settings className="w-12 h-12" />}
                  title="No settings"
                  description="No settings available in this category"
                />
              ) : (
                <div>
                  {categorySettings.map((setting, index) => (
                    <LoomOSListItem
                      key={setting.id}
                      selected={selectedSetting?.id === setting.id}
                      onClick={() => setSelectedSetting(setting)}
                      animationIndex={index}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                          {setting.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{setting.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{setting.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </LoomOSListItem>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Detail Pane - Setting Configuration */}
          <LoomOSDetailPane
            title={selectedSetting?.name}
            subtitle={selectedSetting?.description}
            isEmpty={!selectedSetting}
            emptyIcon={<Settings className="w-16 h-16" />}
            emptyMessage="No setting selected"
            emptySubMessage="Select a setting from the list to configure"
          >
            {selectedSetting && (
              <ScrollArea className="h-full">
                <div className="px-6 py-6">
                  {renderSettingDetail()}
                </div>
              </ScrollArea>
            )}
          </LoomOSDetailPane>
        </div>
      </DesktopAppWrapper>
    </ErrorBoundary>
  );
}
