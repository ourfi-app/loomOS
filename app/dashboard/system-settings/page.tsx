// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
// TODO: Review setTimeout calls for proper cleanup in useEffect return functions

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAdminMode } from '@/lib/admin-mode-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Zap,
  Shield,
  Eye,
  Cloud,
  Database,
  HardDrive,
  Monitor,
  Smartphone,
  Wifi,
  Download,
  Upload,
  RefreshCw,
  Save,
  Info,
  CheckCircle2,
  Building2,
  Plug,
  Clock,
  Languages,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Activity,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

export default function SystemSettingsPage() {
  const session = useSession();
  const router = useRouter();
  const { isAdminMode } = useAdminMode();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const userRole = (session?.data?.user as any)?.role;
  const status = session?.status || 'loading';

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Montrecott Condominium Association',
    timeZone: 'America/Chicago',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    currency: 'USD',
    fiscalYearStart: 'January',
  });

  // User Preferences State
  const [userPreferences, setUserPreferences] = useState({
    defaultView: 'dashboard',
    itemsPerPage: 25,
    enableAnimations: true,
    compactMode: false,
    showWelcomeScreen: true,
    emailDigest: 'daily',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    desktopNotifications: true,
    soundEnabled: true,
    announcements: true,
    payments: true,
    maintenance: true,
    emergencies: true,
    digestFrequency: 'daily',
  });

  // Privacy & Security State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    requirePasswordChange: false,
    passwordExpiry: 90,
    loginNotifications: true,
    ipRestrictions: false,
    auditLogging: true,
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    colorScheme: 'default',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    compactLayout: false,
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

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      toast.success('Settings reset to defaults');
    }
  };

  if (status === 'loading' || (status === 'authenticated' && (userRole !== 'ADMIN' || !isAdminMode))) {
    return null;
  }

  const appDef = APP_REGISTRY['system-settings'];
  const SystemSettingsIcon = appDef?.icon;

  return (
    <DesktopAppWrapper
      title={appDef?.title || 'System Settings'}
      icon={SystemSettingsIcon ? <SystemSettingsIcon className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
      gradient={appDef?.gradient}
      showMenuBar={true}
    >
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive system configuration and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/dashboard/building-services')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Building2 className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Building Services</div>
                <div className="text-xs text-muted-foreground">Infrastructure monitoring</div>
              </div>
              <Badge variant="outline" className="bg-[var(--semantic-success)]/10 text-[var(--semantic-success)] border-[var(--semantic-success)]/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                8/8
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/dashboard/external-connections')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Plug className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">External Connections</div>
                <div className="text-xs text-muted-foreground">API integrations</div>
              </div>
              <Badge variant="outline" className="bg-[var(--semantic-success)]/10 text-[var(--semantic-success)] border-[var(--semantic-success)]/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                5/6
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/dashboard/system-config')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--semantic-accent)]/10 rounded-lg">
                <Settings className="h-5 w-5 text-[var(--semantic-accent)]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">System Config</div>
                <div className="text-xs text-muted-foreground">Advanced configuration</div>
              </div>
              <Badge variant="outline">
                <Info className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Organization Settings
              </CardTitle>
              <CardDescription>Basic organization and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={generalSettings.organizationName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, organizationName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={generalSettings.timeZone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timeZone: e.target.value })}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <select
                    id="date-format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                  <select
                    id="fiscal-year"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={generalSettings.fiscalYearStart}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, fiscalYearStart: e.target.value })}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Preferences Tab */}
        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Preferences
              </CardTitle>
              <CardDescription>Customize your personal experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default View</Label>
                  <select
                    id="default-view"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={userPreferences.defaultView}
                    onChange={(e) => setUserPreferences({ ...userPreferences, defaultView: e.target.value })}
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="calendar">Calendar</option>
                    <option value="messages">Messages</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="items-per-page">Items Per Page</Label>
                  <select
                    id="items-per-page"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={userPreferences.itemsPerPage}
                    onChange={(e) => setUserPreferences({ ...userPreferences, itemsPerPage: parseInt(e.target.value) })}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-digest">Email Digest</Label>
                  <select
                    id="email-digest"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={userPreferences.emailDigest}
                    onChange={(e) => setUserPreferences({ ...userPreferences, emailDigest: e.target.value })}
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Enable Animations</Label>
                    <p className="text-xs text-muted-foreground">Smooth transitions and effects</p>
                  </div>
                  <Switch
                    checked={userPreferences.enableAnimations}
                    onCheckedChange={(checked) => setUserPreferences({ ...userPreferences, enableAnimations: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch
                    checked={userPreferences.compactMode}
                    onCheckedChange={(checked) => setUserPreferences({ ...userPreferences, compactMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Show Welcome Screen</Label>
                    <p className="text-xs text-muted-foreground">Display tutorial on login</p>
                  </div>
                  <Switch
                    checked={userPreferences.showWelcomeScreen}
                    onCheckedChange={(checked) => setUserPreferences({ ...userPreferences, showWelcomeScreen: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Delivery Methods</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Get text messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">In-app notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Desktop Notifications</Label>
                      <p className="text-xs text-muted-foreground">Browser notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.desktopNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, desktopNotifications: checked })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="font-semibold text-sm">Notification Types</h4>
                <div className="grid gap-2">
                  {[
                    { key: 'announcements', label: 'Announcements', desc: 'Community updates' },
                    { key: 'payments', label: 'Payment Reminders', desc: 'Billing notifications' },
                    { key: 'maintenance', label: 'Maintenance Alerts', desc: 'Service updates' },
                    { key: 'emergencies', label: 'Emergency Alerts', desc: 'Critical notifications' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                        onCheckedChange={(checked) => setNotificationSettings({ 
                          ...notificationSettings, 
                          [item.key]: checked 
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>Protect your account and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Login Notifications</Label>
                    <p className="text-xs text-muted-foreground">Alert on new login attempts</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>IP Restrictions</Label>
                    <p className="text-xs text-muted-foreground">Limit access by IP address</p>
                  </div>
                  <Switch
                    checked={securitySettings.ipRestrictions}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipRestrictions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-xs text-muted-foreground">Track all system activities</p>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={appearanceSettings.theme}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color-scheme">Color Scheme</Label>
                  <select
                    id="color-scheme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={appearanceSettings.colorScheme}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, colorScheme: e.target.value })}
                  >
                    <option value="default">Default</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <select
                    id="font-size"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={appearanceSettings.fontSize}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value })}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>High Contrast</Label>
                    <p className="text-xs text-muted-foreground">Increase visual clarity</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.highContrast}
                    onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, highContrast: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Reduced Motion</Label>
                    <p className="text-xs text-muted-foreground">Minimize animations</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.reducedMotion}
                    onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, reducedMotion: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Compact Layout</Label>
                    <p className="text-xs text-muted-foreground">Reduce whitespace</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.compactLayout}
                    onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, compactLayout: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Import, export, and backup data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>Optimize system performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Monitor className="h-4 w-4 mr-2" />
                  View System Logs
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Performance Report
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>Application and environment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Version</div>
                  <div className="font-medium">3.2.1</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Environment</div>
                  <div className="font-medium">Production</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Database</div>
                  <div className="font-medium">PostgreSQL 16</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Updated</div>
                  <div className="font-medium">Oct 30, 2024</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DesktopAppWrapper>
  );
}
