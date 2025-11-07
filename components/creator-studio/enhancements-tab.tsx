'use client';

import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  Wifi,
  Filter,
  Workflow,
  Calendar,
  Smartphone,
  Keyboard,
  Move,
  ExternalLink,
  Settings,
  Code,
  Rocket,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function EnhancementsTab() {
  const router = useRouter();

  const platformFeatures = [
    {
      id: 'websockets',
      icon: Wifi,
      title: 'Real-time WebSocket Updates',
      description: 'Live synchronization across all connected clients',
      status: 'active',
      category: 'Core',
      enabled: true
    },
    {
      id: 'advanced-filters',
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Sophisticated filtering with multiple conditions',
      status: 'active',
      category: 'Data',
      enabled: true
    },
    {
      id: 'workflows',
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'Create automated workflows with triggers and actions',
      status: 'active',
      category: 'Automation',
      enabled: true
    },
    {
      id: 'calendar-sync',
      icon: Calendar,
      title: 'External Calendar Integration',
      description: 'Sync with Google Calendar, Outlook, and more',
      status: 'active',
      category: 'Integration',
      enabled: true
    },
    {
      id: 'mobile-menus',
      icon: Smartphone,
      title: 'Mobile-Optimized Menus',
      description: 'Touch-friendly context menus and actions',
      status: 'active',
      category: 'UX',
      enabled: true
    },
    {
      id: 'keyboard-shortcuts',
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Navigate and control the app with keyboard',
      status: 'active',
      category: 'UX',
      enabled: true
    },
    {
      id: 'drag-drop',
      icon: Move,
      title: 'Drag and Drop',
      description: 'Move items between different apps',
      status: 'beta',
      category: 'UX',
      enabled: false
    },
  ];

  const betaFeatures = [
    {
      id: 'ai-assistant-v2',
      icon: Sparkles,
      title: 'AI Assistant v2',
      description: 'Enhanced AI with context awareness and learning',
      enabled: false
    },
    {
      id: 'voice-commands',
      icon: Settings,
      title: 'Voice Commands',
      description: 'Control the platform with voice input',
      enabled: false
    },
    {
      id: 'plugin-api',
      icon: Code,
      title: 'Plugin API',
      description: 'Developer API for creating custom plugins',
      enabled: false
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Feature Enhancements</h2>
              <p className="text-sm text-muted-foreground">
                Manage advanced features and experimental capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-pink-600" />
              Platform Capabilities
            </CardTitle>
            <CardDescription>
              Enable or disable advanced features to customize your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enhancements provide powerful capabilities that extend the core functionality of your platform.
              You can enable experimental features, configure automation, and fine-tune user experience.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push('/dashboard/apps/enhancements')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full Enhancements Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Active Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Features</h3>
            <Badge variant="secondary">{platformFeatures.filter(f => f.enabled).length} enabled</Badge>
          </div>
          <div className="space-y-3">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${feature.enabled ? 'bg-pink-100 dark:bg-pink-900/20' : 'bg-muted'}`}>
                          <Icon className={`h-4 w-4 ${feature.enabled ? 'text-pink-600' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{feature.title}</h4>
                            <Badge variant={feature.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {feature.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {feature.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={feature.enabled} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Beta Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Beta Features</h3>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              <Flag className="h-3 w-3 mr-1" />
              Experimental
            </Badge>
          </div>
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Beta features are experimental and may change. Enable at your own risk.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {betaFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="flex items-center justify-between p-3 bg-white dark:bg-black/20 rounded-lg border border-yellow-200/50">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <Switch checked={feature.enabled} disabled />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Feature Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">By Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Core', 'Data', 'Automation', 'Integration', 'UX'].map(category => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <Badge variant="secondary">
                    {platformFeatures.filter(f => f.category === category).length}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Features</span>
                <Badge variant="secondary">{platformFeatures.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active</span>
                <Badge>{platformFeatures.filter(f => f.enabled).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Beta</span>
                <Badge variant="secondary">{betaFeatures.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/apps/enhancements')}>
              <Zap className="h-4 w-4 mr-2" />
              Configure Workflows
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/apps/enhancements')}>
              <Keyboard className="h-4 w-4 mr-2" />
              Customize Keyboard Shortcuts
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/apps/enhancements')}>
              <Filter className="h-4 w-4 mr-2" />
              Manage Saved Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
