// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useState } from 'react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { 
  Zap, 
  Filter, 
  Workflow, 
  Calendar as CalendarIcon, 
  Smartphone, 
  Keyboard, 
  Move,
  Wifi
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyboardShortcutsPanel } from '@/components/webos/keyboard-shortcuts-panel';
import { useKeyboardShortcuts } from '@/lib/keyboard-shortcuts';
import { useRealtimeUpdates } from '@/lib/websocket-client';
import { useAdvancedFilter, createFilterGroup } from '@/lib/advanced-filters';
import { useWorkflowAutomation, workflowTemplates } from '@/lib/workflow-automation';
import { useCalendarIntegration } from '@/lib/external-calendar-integration';
import { toast } from 'sonner';

export default function EnhancementsPage() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { isConnected } = useRealtimeUpdates('*');
  const { workflows, createWorkflow } = useWorkflowAutomation();
  const { connectedProviders, connect, disconnect } = useCalendarIntegration();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      action: 'open:shortcuts',
      handler: () => setShowShortcuts(true),
    },
  ]);

  const features = [
    {
      icon: Wifi,
      title: 'Real-time WebSocket Updates',
      description: 'Live synchronization across all connected clients',
      status: isConnected ? 'Connected' : 'Disconnected',
      statusColor: isConnected ? 'bg-[var(--semantic-success)]' : 'bg-[var(--semantic-error)]',
      demo: 'Automatic updates when data changes in any app',
    },
    {
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Sophisticated filtering with multiple conditions',
      status: 'Available',
      statusColor: 'bg-[var(--semantic-primary)]',
      demo: 'Filter with AND/OR operators and save filters',
    },
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'Create automated workflows with triggers and actions',
      status: `${workflows.length} Active`,
      statusColor: 'bg-[var(--semantic-accent)]',
      demo: 'Automate repetitive tasks and notifications',
    },
    {
      icon: CalendarIcon,
      title: 'External Calendar Integration',
      description: 'Sync with Google Calendar, Outlook, and more',
      status: `${connectedProviders.length} Connected`,
      statusColor: 'bg-[var(--semantic-primary)]',
      demo: 'Two-way sync with external calendars',
    },
    {
      icon: Smartphone,
      title: 'Mobile-Optimized Menus',
      description: 'Touch-friendly context menus and actions',
      status: 'Enabled',
      statusColor: 'bg-cyan-500',
      demo: 'Swipe gestures and bottom sheets',
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Navigate and control the app with keyboard',
      status: 'Active',
      statusColor: 'bg-[var(--semantic-accent)]',
      demo: 'Press Ctrl+/ to view all shortcuts',
    },
    {
      icon: Move,
      title: 'Drag and Drop',
      description: 'Move items between different apps',
      status: 'Enabled',
      statusColor: 'bg-[var(--semantic-accent)]',
      demo: 'Drag tasks to calendar, notes to documents',
    },
  ];

  const handleCreateWorkflow = (template: typeof workflowTemplates[0]) => {
    createWorkflow(template);
    toast.success(`Workflow "${template.name}" created successfully`);
  };

  const handleConnectCalendar = async (provider: 'google' | 'outlook' | 'apple') => {
    const success = await connect(provider);
    if (success) {
      toast.success(`Connected to ${provider} calendar`);
    } else {
      toast.error(`Failed to connect to ${provider} calendar`);
    }
  };

  return (
    <>
      <DesktopAppWrapper
        title="Feature Enhancements"
        icon={<Zap className="w-5 h-5" />}
        gradient="from-purple-500 to-pink-500"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <h2 className="text-2xl font-bold mb-2">Advanced Features & Enhancements</h2>
            <p className="text-muted-foreground">
              Explore powerful features that enhance your workflow and productivity
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="integration">Integration</TabsTrigger>
                <TabsTrigger value="ux">UX Features</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{feature.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {feature.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={`${feature.statusColor} text-white border-none`}>
                            {feature.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.demo}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Automation Tab */}
              <TabsContent value="automation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Automation</CardTitle>
                    <CardDescription>
                      Create automated workflows to streamline your tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Workflow Templates</h4>
                      {workflowTemplates.map((template, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium">{template.name}</h5>
                              <p className="text-sm text-muted-foreground mt-1">
                                {template.description}
                              </p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline">
                                  Trigger: {template.trigger.type}
                                </Badge>
                                <Badge variant="outline">
                                  Actions: {template.actions.length}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreateWorkflow(template)}
                            >
                              Create
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {workflows.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Active Workflows ({workflows.length})</h4>
                        {workflows.map((workflow, index) => (
                          <Card key={index} className="p-4 bg-[var(--semantic-success-bg)] dark:bg-green-950/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">{workflow.name}</h5>
                                <p className="text-sm text-muted-foreground">{workflow.description}</p>
                              </div>
                              <Badge className="bg-[var(--semantic-success)] text-white">Active</Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integration Tab */}
              <TabsContent value="integration" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>External Calendar Integration</CardTitle>
                    <CardDescription>
                      Connect your external calendars for two-way synchronization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {['google', 'outlook', 'apple'].map((provider) => {
                        const isConnected = connectedProviders.includes(provider as any);
                        return (
                          <Card key={provider} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <h5 className="font-medium capitalize">{provider} Calendar</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {isConnected ? 'Connected and syncing' : 'Not connected'}
                                  </p>
                                </div>
                              </div>
                              {isConnected ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => disconnect(provider as any)}
                                >
                                  Disconnect
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleConnectCalendar(provider as any)}
                                >
                                  Connect
                                </Button>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Updates</CardTitle>
                    <CardDescription>
                      WebSocket connection for live data synchronization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className={`w-5 h-5 ${isConnected ? 'text-[var(--semantic-success)]' : 'text-[var(--semantic-error)]'}`} />
                        <div>
                          <h5 className="font-medium">Connection Status</h5>
                          <p className="text-sm text-muted-foreground">
                            {isConnected ? 'Connected - Live updates active' : 'Disconnected - Updates paused'}
                          </p>
                        </div>
                      </div>
                      <Badge className={isConnected ? 'bg-[var(--semantic-success)]' : 'bg-[var(--semantic-error)]'}>
                        {isConnected ? 'Live' : 'Offline'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* UX Features Tab */}
              <TabsContent value="ux" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyboard Shortcuts</CardTitle>
                    <CardDescription>
                      Navigate and control the app efficiently with keyboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setShowShortcuts(true)}>
                      <Keyboard className="w-4 h-4 mr-2" />
                      View All Shortcuts
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Drag and Drop</CardTitle>
                    <CardDescription>
                      Move items between apps with drag and drop
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Drag tasks to the calendar to schedule them, drag notes to documents to attach them, 
                      and more. Visual indicators show where you can drop items.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Filtering</CardTitle>
                    <CardDescription>
                      Filter data with complex conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Create sophisticated filters with AND/OR operators, save them for reuse, 
                      and apply them across different views and apps.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mobile Optimization</CardTitle>
                    <CardDescription>
                      Touch-friendly interfaces for mobile devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Mobile-optimized context menus, swipe gestures, bottom sheets, 
                      and responsive layouts for the best mobile experience.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DesktopAppWrapper>

      {/* Keyboard Shortcuts Panel */}
      <KeyboardShortcutsPanel open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}
