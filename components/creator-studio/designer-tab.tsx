'use client';

import { useRouter } from 'next/navigation';
import {
  Wrench,
  Layout,
  Layers,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Sparkles,
  Zap,
  Grid,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DesignerTab() {
  const router = useRouter();

  const designerFeatures = [
    {
      icon: Layout,
      title: 'Visual App Builder',
      description: 'Drag-and-drop interface for creating app layouts'
    },
    {
      icon: Layers,
      title: 'Multi-Pane Layouts',
      description: '1, 2, and 3-pane layouts for different app types'
    },
    {
      icon: Grid,
      title: 'Component Library',
      description: 'Pre-built components for navigation, lists, and details'
    },
    {
      icon: Code,
      title: 'Code Generation',
      description: 'Export production-ready React code'
    },
    {
      icon: Smartphone,
      title: 'Responsive Preview',
      description: 'Test designs on mobile, tablet, and desktop'
    },
    {
      icon: FileCode,
      title: 'Template Gallery',
      description: 'Start from email, calendar, tasks, and more'
    },
  ];

  const templates = [
    {
      name: 'Email Client',
      description: '3-pane layout with folders, message list, and detail view',
      icon: Layout,
      panes: 3
    },
    {
      name: 'Calendar App',
      description: '3-pane with mini calendar, timeline, and event details',
      icon: Layout,
      panes: 3
    },
    {
      name: 'Task Manager',
      description: '3-pane for task lists, priorities, and task details',
      icon: Layout,
      panes: 3
    },
    {
      name: 'Notes App',
      description: '3-pane with categories, note list, and editor',
      icon: Layout,
      panes: 3
    },
    {
      name: 'Contacts',
      description: '2-pane with contact list and detail view',
      icon: Layout,
      panes: 2
    },
    {
      name: 'Settings',
      description: '2-pane with navigation and settings panels',
      icon: Layout,
      panes: 2
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">App Designer</h2>
              <p className="text-sm text-muted-foreground">
                Build custom LoomOS-style applications with visual tools
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="border-[var(--semantic-accent-light)] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--semantic-accent)]" />
              Visual Application Builder
            </CardTitle>
            <CardDescription>
              Create professional LoomOS-style apps without writing code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The App Designer is a powerful visual tool for creating custom applications with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {designerFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <feature.icon className="h-4 w-4 text-[var(--semantic-accent)] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Start</h3>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--semantic-warning)]" />
                  Launch App Designer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Open the full App Designer to create new applications, customize layouts, and export code.
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/dashboard/apps/designer')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open App Designer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* App Templates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pre-Built Templates</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {templates.map((template, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <template.icon className="h-4 w-4 text-[var(--semantic-accent)]" />
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.panes}-Pane
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">What You Can Build</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Monitor className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Desktop Applications</p>
                  <p className="text-xs text-muted-foreground">
                    Full-featured apps with navigation, lists, and detail views
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Tablet className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Responsive Layouts</p>
                  <p className="text-xs text-muted-foreground">
                    Designs that adapt to any screen size automatically
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Code className="h-5 w-5 text-[var(--semantic-accent)] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Production-Ready Code</p>
                  <p className="text-xs text-muted-foreground">
                    Export clean React/TypeScript code ready for deployment
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
