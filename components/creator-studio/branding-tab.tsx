'use client';

import { useRouter } from 'next/navigation';
import {
  Palette,
  Paintbrush,
  Type,
  Droplet,
  ExternalLink,
  Sparkles,
  Layout,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function BrandingTab() {
  const router = useRouter();

  const brandingTools = [
    {
      id: 'brandy',
      name: 'Brandy - Logo Designer',
      description: 'Design custom logos and brand assets for your platform',
      icon: Palette,
      path: '/dashboard/apps/brandy',
      color: 'from-teal-500 to-orange-500',
      features: [
        'Logo design and creation',
        'Custom typography selection',
        'Color palette management',
        'Icon and shape tools',
        'Export to PNG and SVG',
        'Project management'
      ],
      status: 'Available'
    },
    {
      id: 'palette',
      name: 'Color Palette',
      description: 'Manage the global color scheme for your entire platform',
      icon: Droplet,
      path: '/api/admin/palette',
      color: 'from-blue-500 to-purple-500',
      features: [
        'Primary and secondary colors',
        'Accent color configuration',
        'Dark mode support',
        'Semantic color tokens',
        'Real-time preview',
        'Export CSS variables'
      ],
      status: 'API Only'
    },
    {
      id: 'typography',
      name: 'Typography System',
      description: 'Configure fonts and text styles across the platform',
      icon: Type,
      path: null,
      color: 'from-gray-500 to-slate-600',
      features: [
        'Font family selection',
        'Heading styles (H1-H6)',
        'Body text configuration',
        'Font weight and sizing',
        'Line height control',
        'Letter spacing'
      ],
      status: 'Coming Soon'
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Branding & Visual Identity</h2>
              <p className="text-sm text-muted-foreground">
                Design and customize your platform's visual appearance
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-950/20 dark:to-fuchsia-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              Platform Branding Suite
            </CardTitle>
            <CardDescription>
              Create a cohesive visual identity for your community management platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The Branding suite allows you to customize every visual aspect of your platform:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Layout className="h-4 w-4 text-violet-600 mt-0.5" />
                <span><strong>Logos & Assets:</strong> Design custom logos and export brand assets</span>
              </li>
              <li className="flex items-start gap-2">
                <Droplet className="h-4 w-4 text-violet-600 mt-0.5" />
                <span><strong>Color Schemes:</strong> Define your platform's color palette</span>
              </li>
              <li className="flex items-start gap-2">
                <Type className="h-4 w-4 text-violet-600 mt-0.5" />
                <span><strong>Typography:</strong> Configure fonts and text styles</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Branding Tools */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Branding Tools</h3>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {brandingTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{tool.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={tool.status === 'Available' ? 'default' : 'secondary'}>
                        {tool.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                        Features
                      </p>
                      <ul className="text-sm space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-violet-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {tool.path && (
                      <Button
                        className="w-full"
                        onClick={() => router.push(tool.path)}
                        disabled={tool.status !== 'Available'}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open {tool.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/apps/brandy')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Design a New Logo
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <Paintbrush className="h-4 w-4 mr-2" />
              Update Color Palette
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <Type className="h-4 w-4 mr-2" />
              Configure Typography
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
