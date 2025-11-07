'use client';

import { useRouter } from 'next/navigation';
import {
  Store,
  Download,
  Plug,
  Package,
  Star,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  RefreshCw,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MarketplaceTab() {
  const router = useRouter();

  const marketplaceFeatures = [
    {
      icon: Store,
      title: 'App Library',
      description: 'Browse and install community-built applications'
    },
    {
      icon: Download,
      title: 'One-Click Install',
      description: 'Install apps instantly with a single click'
    },
    {
      icon: RefreshCw,
      title: 'Auto Updates',
      description: 'Keep apps up-to-date automatically'
    },
    {
      icon: Star,
      title: 'Ratings & Reviews',
      description: 'See community feedback on each app'
    },
    {
      icon: Shield,
      title: 'Verified Apps',
      description: 'Security-reviewed and platform-compatible apps'
    },
    {
      icon: Package,
      title: 'Dependency Management',
      description: 'Automatic handling of app dependencies'
    },
  ];

  const appCategories = [
    {
      name: 'Communication',
      count: 12,
      icon: '💬',
      examples: 'Chat, Email, Messaging'
    },
    {
      name: 'Productivity',
      count: 18,
      icon: '✅',
      examples: 'Tasks, Notes, Calendar'
    },
    {
      name: 'Community',
      count: 8,
      icon: '👥',
      examples: 'Directory, Events, Forums'
    },
    {
      name: 'Finance',
      count: 6,
      icon: '💰',
      examples: 'Payments, Accounting, Invoicing'
    },
    {
      name: 'Utilities',
      count: 15,
      icon: '🔧',
      examples: 'Settings, Tools, Admin'
    },
    {
      name: 'Entertainment',
      count: 5,
      icon: '🎮',
      examples: 'Games, Media, Social'
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">App Marketplace</h2>
              <p className="text-sm text-muted-foreground">
                Extend your platform with community-built applications
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Platform Extension Marketplace
            </CardTitle>
            <CardDescription>
              Install, manage, and configure third-party applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The Marketplace gives you access to a growing library of applications:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marketplaceFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <feature.icon className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-5 w-5 text-emerald-600" />
                  Browse Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Explore all available apps, filter by category, and see ratings.
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/dashboard/marketplace')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Marketplace
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  Manage Installed Apps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  View, update, and configure your installed applications.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/dashboard/marketplace?tab=installed')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  My Apps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* App Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">App Categories</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {appCategories.map((category, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/marketplace?category=${category.name.toLowerCase()}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <Badge variant="secondary">{category.count} apps</Badge>
                  </div>
                  <h4 className="font-semibold mb-1">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.examples}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Integration Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Package className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Native Apps</p>
                  <p className="text-xs text-muted-foreground">
                    Fully integrated apps built specifically for this platform
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Plug className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">External Integrations</p>
                  <p className="text-xs text-muted-foreground">
                    Connect to third-party services via API (Stripe, SendGrid, etc.)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Coming Soon</p>
                  <p className="text-xs text-muted-foreground">
                    Plugin API for developers to build custom extensions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Total Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">64</p>
              <p className="text-xs text-muted-foreground mt-1">
                Available in marketplace
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Verified Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">48</p>
              <p className="text-xs text-muted-foreground mt-1">
                Security reviewed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Active Developers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contributing to ecosystem
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
