// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft, Save, Eye, Download, Upload, Palette, Layout,
  Settings, Plus, Trash2, Copy, Play, Code, Layers, Grid,
  Smartphone, Tablet, Monitor, ChevronRight, Check, X, FileCode,
  Folder, FolderOpen, FileText, Sparkles, Zap, Box, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, Info, Search, Filter, MoreVertical
} from 'lucide-react';
import DragDropCanvas from '@/components/designer/drag-drop-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { APP_TEMPLATES, COLOR_SCHEMES, PANE_STYLES, type AppTemplate, type DesignedApp } from '@/lib/app-designer-templates';
import { AppCodeGenerator, ColorCustomization, LayoutCustomization } from '@/lib/app-code-generator';
import { ValidationPanel } from '@/components/designer/validation-panel';
import { TestingPanel } from '@/components/designer/testing-panel';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { ErrorBoundary } from '@/components/common';
import { APP_COLORS } from '@/lib/app-design-system';

// Types for our designer state
interface DesignerState {
  id: string;
  template: AppTemplate | null;
  name: string;
  description: string;
  paneLayout: '1-pane' | '2-pane' | '3-pane';
  colorScheme: string;
  designPatterns: {
    hasStatusBar: boolean;
    hasHeader: boolean;
    hasToolbar: boolean;
    hasGestureArea: boolean;
    headerStyle: 'gradient' | 'flat' | 'minimal';
    pane1Style?: string;
    pane2Style?: string;
    pane3Style?: string;
  };
  customizations: {
    features: string[];
    customColors?: Record<string, string>;
  };
  lastModified: Date;
}

export default function AppDesigner() {
  const router = useRouter();
  const session = useSession()?.data;
  
  // Navigation state
  const [activeView, setActiveView] = useState<'templates' | 'my-apps' | 'components' | 'import'>('templates');
  const [activeSection, setActiveSection] = useState<'design' | 'preview' | 'code' | 'export' | 'testing'>('design');
  
  // Designer state
  const [currentApp, setCurrentApp] = useState<DesignerState | null>(null);
  const [savedApps, setSavedApps] = useState<DesignedApp[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'smartphone' | 'tablet' | 'desktop'>('desktop');
  const [searchQuery, setSearchQuery] = useState('');

  // Component builder state
  const [generatedComponentCode, setGeneratedComponentCode] = useState('');
  const [activeComponentBuilderTab, setActiveComponentBuilderTab] = useState<'canvas' | 'code'>('canvas');
  
  // Import state
  const [availableApps, setAvailableApps] = useState<Array<{ slug: string; name: string; path: string }>>([]);
  const [analyzingApp, setAnalyzingApp] = useState<string | null>(null);
  const [importedAppData, setImportedAppData] = useState<any>(null);
  
  // Advanced customization state
  const [colorCustomization, setColorCustomization] = useState<ColorCustomization>({
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
  });
  
  const [isApplying, setIsApplying] = useState(false);
  const [livePreview, setLivePreview] = useState(true);
  
  // Load saved apps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('designer-apps');
    if (saved) {
      try {
        setSavedApps(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved apps:', e);
      }
    }
  }, []);
  
  // Load available apps when import view is opened
  useEffect(() => {
    if (activeView === 'import' && availableApps.length === 0) {
      loadAvailableApps();
    }
  }, [activeView]);
  
  const loadAvailableApps = async () => {
    // List of all available apps
    const apps = [
      { slug: 'calendar', name: 'Calendar', path: '/dashboard/apps/calendar' },
      { slug: 'messages', name: 'Messages', path: '/dashboard/apps/messages' },
      { slug: 'tasks', name: 'Tasks', path: '/dashboard/apps/tasks' },
      { slug: 'notes', name: 'Notes', path: '/dashboard/apps/notes' },
      { slug: 'documents', name: 'Documents', path: '/dashboard/documents' },
      { slug: 'directory', name: 'Directory', path: '/dashboard/directory' },
      { slug: 'chat', name: 'Chat', path: '/dashboard/chat' },
      { slug: 'household', name: 'My Household', path: '/dashboard/household' },
      { slug: 'profile', name: 'Profile', path: '/dashboard/profile' },
      { slug: 'payments', name: 'Payments', path: '/dashboard/payments' },
      { slug: 'building-services', name: 'Building Services', path: '/dashboard/building-services' },
      { slug: 'notifications', name: 'Notifications', path: '/dashboard/notifications' },
      { slug: 'marketplace', name: 'Marketplace', path: '/dashboard/marketplace' },
      { slug: 'help', name: 'Help', path: '/dashboard/help' },
      { slug: 'admin', name: 'Admin Dashboard', path: '/dashboard/admin' },
      { slug: 'accounting', name: 'Accounting', path: '/dashboard/accounting' },
      { slug: 'budgeting', name: 'Budgeting', path: '/dashboard/budgeting' },
    ];
    setAvailableApps(apps);
  };
  
  const importExistingApp = async (slug: string) => {
    setAnalyzingApp(slug);
    try {
      const response = await fetch(`/api/designer/analyze-app?slug=${slug}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze app');
      }

      const appData = await response.json();

      // Validate the response data
      if (!appData.name || !appData.layout || !appData.components) {
        throw new Error('Invalid app data received');
      }

      // Normalize layout type (handle 'custom' case)
      let layoutType: '1-pane' | '2-pane' | '3-pane' = appData.layout.type;
      if (layoutType !== '1-pane' && layoutType !== '2-pane' && layoutType !== '3-pane') {
        // Default to 3-pane for custom or unknown layouts
        layoutType = '3-pane';
      }

      setImportedAppData(appData);

      // Convert to designer state
      // Set default pane styles based on layout type
      let paneStyles: { pane1Style?: string; pane2Style?: string; pane3Style?: string } = {};
      if (layoutType === '3-pane') {
        paneStyles = {
          pane1Style: 'navigation',
          pane2Style: 'list',
          pane3Style: 'detail',
        };
      } else if (layoutType === '2-pane') {
        paneStyles = {
          pane1Style: 'list',
          pane2Style: 'detail',
        };
      } else {
        paneStyles = {
          pane2Style: 'list',
        };
      }

      const newApp: DesignerState = {
        id: `imported-${slug}-${Date.now()}`,
        template: null, // No template, it's imported
        name: appData.name,
        description: appData.description || '',
        paneLayout: layoutType,
        colorScheme: 'blue',
        designPatterns: {
          hasStatusBar: appData.components?.hasStatusBar ?? true,
          hasHeader: appData.components?.hasHeader ?? true,
          hasToolbar: appData.components?.hasToolbar ?? false,
          hasGestureArea: appData.components?.hasGestureArea ?? true,
          headerStyle: 'gradient',
          ...paneStyles,
        },
        customizations: {
          features: appData.features || [],
          customColors: appData.colors || {},
        },
        lastModified: new Date(),
      };

      setCurrentApp(newApp);
      setActiveView('templates'); // Switch to templates view to show the design editor
      setActiveSection('design');
      toast.success(`Imported ${appData.name} successfully!`);
    } catch (error) {
      console.error('Failed to import app:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import app';
      toast.error(errorMessage);
    } finally {
      setAnalyzingApp(null);
    }
  };

  // Helper functions
  const createNewApp = (template: AppTemplate) => {
    const newApp: DesignerState = {
      id: `app-${Date.now()}`,
      template,
      name: template.name,
      description: template.description,
      paneLayout: template.paneLayout,
      colorScheme: 'blue',
      designPatterns: { ...template.designPatterns },
      customizations: {
        features: [...template.features],
      },
      lastModified: new Date(),
    };
    setCurrentApp(newApp);
    setSelectedTemplate(template);
    setActiveSection('design');
  };

  const saveApp = () => {
    if (!currentApp) return;
    
    const colorSchemeObj = COLOR_SCHEMES[currentApp.colorScheme as keyof typeof COLOR_SCHEMES];
    const appToSave: DesignedApp = {
      id: currentApp.id,
      name: currentApp.name,
      description: currentApp.description,
      templateId: currentApp.template?.id || 'blank',
      customizations: {
        colorScheme: colorSchemeObj,
        paneLayout: currentApp.paneLayout,
        designPatterns: currentApp.designPatterns as any,
        features: currentApp.customizations.features,
      },
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isPublished: false,
    };

    const updated = [...savedApps.filter(a => a.id !== appToSave.id), appToSave];
    setSavedApps(updated);
    localStorage.setItem('designer-apps', JSON.stringify(updated));
    toast.success('App saved successfully!');
  };

  const loadApp = (app: DesignedApp) => {
    const template = APP_TEMPLATES[app.templateId as keyof typeof APP_TEMPLATES];
    if (!template) return;

    const loadedApp: DesignerState = {
      id: app.id,
      template,
      name: app.name,
      description: app.description,
      paneLayout: app.customizations.paneLayout || '3-pane',
      colorScheme: Object.keys(COLOR_SCHEMES).find(
        key => {
          const scheme = COLOR_SCHEMES[key as keyof typeof COLOR_SCHEMES];
          const savedScheme = app.customizations.colorScheme;
          return savedScheme && scheme && 'name' in scheme && 'name' in savedScheme && scheme.name === savedScheme.name;
        }
      ) || 'blue',
      designPatterns: {
        hasStatusBar: app.customizations.designPatterns?.hasStatusBar ?? true,
        hasHeader: app.customizations.designPatterns?.hasHeader ?? true,
        hasToolbar: app.customizations.designPatterns?.hasToolbar ?? true,
        hasGestureArea: app.customizations.designPatterns?.hasGestureArea ?? true,
        headerStyle: app.customizations.designPatterns?.headerStyle || 'gradient',
        pane1Style: app.customizations.designPatterns?.pane1Style as string,
        pane2Style: app.customizations.designPatterns?.pane2Style as string,
        pane3Style: app.customizations.designPatterns?.pane3Style as string,
      },
      customizations: {
        features: app.customizations.features || [...template.features],
        customColors: app.customizations.colorScheme,
      },
      lastModified: new Date(app.lastModified),
    };
    setCurrentApp(loadedApp);
    setSelectedTemplate(template);
    setActiveView('templates');
    setActiveSection('design');
  };

  const deleteApp = (id: string) => {
    const updated = savedApps.filter(a => a.id !== id);
    setSavedApps(updated);
    localStorage.setItem('designer-apps', JSON.stringify(updated));
    toast.success('App deleted');
  };

  const generateCode = () => {
    if (!currentApp) return '';

    const layout: LayoutCustomization = {
      paneLayout: currentApp.paneLayout,
      headerStyle: currentApp.designPatterns.headerStyle,
      hasStatusBar: currentApp.designPatterns.hasStatusBar,
      hasHeader: currentApp.designPatterns.hasHeader,
      hasToolbar: currentApp.designPatterns.hasToolbar,
      hasGestureArea: currentApp.designPatterns.hasGestureArea,
    };

    return AppCodeGenerator.generateAppCode(
      currentApp.name,
      currentApp.description,
      layout,
      colorCustomization,
      {
        includeComments: true,
        includeTypeScript: true,
        includeApiIntegration: true,
        includeStateManagement: true,
      }
    );
  };

  const applyChanges = async () => {
    if (!currentApp) return;
    
    setIsApplying(true);
    try {
      const code = generateCode();
      const slug = currentApp.name.toLowerCase().replace(/\s+/g, '-');
      
      const response = await fetch('/api/designer/apply-changes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          code,
          fileName: 'page.tsx',
          appName: currentApp.name,
          createApiRoute: true,
          createTypes: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to apply changes');
      }

      const result = await response.json();
      
      toast.success(
        <div>
          <p className="font-semibold">Changes applied successfully!</p>
          <p className="text-xs mt-1">Created: {result.files.join(', ')}</p>
          <p className="text-xs text-[var(--semantic-text-tertiary)] mt-1">Restart dev server to see changes</p>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Failed to apply changes:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to apply changes');
    } finally {
      setIsApplying(false);
    }
  };

  const downloadCode = () => {
    if (!currentApp) return;
    
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentApp.name.replace(/\s+/g, '')}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const copyToClipboard = async () => {
    if (!currentApp) return;
    
    try {
      await navigator.clipboard.writeText(generateCode());
      toast.success('Code copied to clipboard!');
    } catch (e) {
      toast.error('Failed to copy code');
    }
  };

  const filteredTemplates = Object.values(APP_TEMPLATES).filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Standardized layout with DesktopAppWrapper
  return (
    <ErrorBoundary>
      <DesktopAppWrapper
        title={currentApp ? currentApp.name : "App Designer"}
        icon={<Palette className="w-5 h-5" />}
        gradient="from-pink-400 via-rose-500 to-red-500"
      >
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-card to-muted border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {currentApp && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setCurrentApp(null);
                setSelectedTemplate(null);
              }}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          )}
          {!currentApp && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  App Designer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create custom apps with LoomOS design patterns
                </p>
              </div>
            </div>
          )}
          {currentApp && (
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {currentApp.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentApp.description}
              </p>
            </div>
          )}
        </div>
        {currentApp && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="default"
              onClick={applyChanges}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <RefreshCw size={16} className="mr-1 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-1" />
                  Apply to App
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={saveApp}>
              <Save size={16} className="mr-1" />
              Save Design
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* If no app selected, show browser */}
        {!currentApp ? (
          <>
            {/* Navigation Sidebar */}
            <div className="w-60 bg-gradient-to-b from-gray-200 to-gray-300 border-r border-[var(--semantic-border-strong)] flex-shrink-0">
              <div className="p-4 space-y-2">
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeView === 'templates'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveView('templates')}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={20} />
                    <span className="font-medium">Templates</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeView === 'my-apps'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveView('my-apps')}
                >
                  <div className="flex items-center gap-3">
                    <Folder size={20} />
                    <span className="font-medium">My Apps</span>
                    {savedApps.length > 0 && (
                      <Badge className="ml-auto" variant="secondary">{savedApps.length}</Badge>
                    )}
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeView === 'components'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveView('components')}
                >
                  <div className="flex items-center gap-3">
                    <Box size={20} />
                    <span className="font-medium">Components</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeView === 'import'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveView('import')}
                >
                  <div className="flex items-center gap-3">
                    <Upload size={20} />
                    <span className="font-medium">Import Existing</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="p-4 border-b border-[var(--semantic-border-light)] bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--semantic-text-tertiary)]" size={18} />
                  <Input
                    className="pl-10"
                    placeholder={
                      activeView === 'templates' ? 'Search templates...' :
                      activeView === 'my-apps' ? 'Search my apps...' :
                      activeView === 'import' ? 'Search apps to import...' :
                      'Search components...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  {/* Templates View */}
                  {activeView === 'templates' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredTemplates.map((template) => {
                        const IconComponent = template.icon;
                        return (
                          <Card 
                            key={template.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                            onClick={() => createNewApp(template)}
                          >
                            <CardHeader>
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: template.color + '20' }}
                                >
                                  <IconComponent size={24} style={{ color: template.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                                  <div className="flex gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {template.paneLayout}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs capitalize">
                                      {template.category}
                                    </Badge>
                                  </div>
                                  <CardDescription className="text-sm line-clamp-2">
                                    {template.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {template.features.slice(0, 3).map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {template.features.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.features.length - 3} more
                                  </Badge>
                                )}
                              </div>
                              <Button 
                                className="w-full" 
                                size="sm"
                                style={{ backgroundColor: template.color }}
                              >
                                Use Template
                                <ChevronRight size={16} className="ml-2" />
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* My Apps View */}
                  {activeView === 'my-apps' && (
                    <div className="space-y-4">
                      {savedApps.length === 0 ? (
                        <div className="text-center py-16 text-[var(--semantic-text-tertiary)]">
                          <FolderOpen size={64} className="mx-auto mb-6 opacity-50" />
                          <p className="text-xl font-medium mb-2">No saved apps yet</p>
                          <p className="text-sm mb-6">Create your first app from a template</p>
                          <Button onClick={() => setActiveView('templates')}>
                            <Layers size={16} className="mr-2" />
                            Browse Templates
                          </Button>
                        </div>
                      ) : (
                        savedApps.map((app) => {
                          const template = APP_TEMPLATES[app.templateId as keyof typeof APP_TEMPLATES];
                          const IconComponent = template?.icon || Folder;
                          
                          return (
                            <Card key={app.id} className="hover:shadow-md transition-shadow">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div 
                                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                      style={{ backgroundColor: template?.color + '20' || '#e5e7eb' }}
                                    >
                                      <IconComponent size={24} style={{ color: template?.color || '#6b7280' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)] truncate">{app.name}</h3>
                                      <p className="text-sm text-[var(--semantic-text-tertiary)] truncate">{app.description}</p>
                                      <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          {app.customizations.paneLayout}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs capitalize">
                                          {template?.category || 'custom'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <Button size="sm" variant="outline" onClick={() => loadApp(app)}>
                                      <Eye size={16} className="mr-1" />
                                      Open
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => deleteApp(app.id)}>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Components View - Drag-and-Drop Canvas */}
                  {activeView === 'components' && (
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b">
                        <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)] mb-2">Component Builder</h2>
                        <p className="text-[var(--semantic-text-secondary)]">
                          Drag and drop components to build a custom view, then get the code.
                        </p>
                      </div>

                      <Tabs value={activeComponentBuilderTab} onValueChange={(val: any) => setActiveComponentBuilderTab(val)} className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto my-4">
                          <TabsTrigger value="canvas">
                            <Box className="w-4 h-4 mr-2" />
                            Canvas
                          </TabsTrigger>
                          <TabsTrigger value="code">
                            <Code className="w-4 h-4 mr-2" />
                            Generated Code
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="canvas" className="flex-1 p-4">
                          <DragDropCanvas
                            onCodeGenerated={setGeneratedComponentCode}
                          />
                        </TabsContent>

                        <TabsContent value="code" className="flex-1 bg-[var(--semantic-text-primary)] text-[var(--semantic-text-inverse)] rounded-lg m-4">
                          <ScrollArea className="h-[70vh] p-6">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                              {generatedComponentCode || '// Code will appear here after you generate it on the canvas.'}
                            </pre>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                  
                  {/* Import Existing App View */}
                  {activeView === 'import' && (
                    <div className="space-y-4">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)] mb-2">Import Existing App</h2>
                        <p className="text-[var(--semantic-text-secondary)]">
                          Load and modify any existing app in the system
                        </p>
                      </div>

                      {/* Info Banner */}
                      <Card className="bg-[var(--semantic-primary-subtle)] border-[var(--semantic-primary-light)]">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-[var(--semantic-primary)] mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-[var(--semantic-primary-dark)]">
                              <p className="font-medium mb-1">How Import Works</p>
                              <p className="text-[var(--semantic-primary-dark)]">
                                Click any app below to analyze its structure. The designer will extract
                                layout patterns, components, and features, then load them into the design
                                editor where you can customize and modify them.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {availableApps
                          .filter(app => 
                            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.slug.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((app) => (
                          <Card 
                            key={app.slug}
                            className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${
                              analyzingApp === app.slug ? 'opacity-50' : ''
                            }`}
                            onClick={() => importExistingApp(app.slug)}
                          >
                            <CardHeader>
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600"
                                >
                                  {analyzingApp === app.slug ? (
                                    <RefreshCw size={24} className="text-white animate-spin" />
                                  ) : (
                                    <Upload size={24} className="text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-lg mb-1">{app.name}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {app.path}
                                  </CardDescription>
                                  <Badge variant="outline" className="text-xs mt-2">
                                    {app.slug}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Button 
                                className="w-full" 
                                size="sm"
                                disabled={analyzingApp === app.slug}
                              >
                                {analyzingApp === app.slug ? (
                                  <>
                                    <RefreshCw size={16} className="mr-2 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    Import & Edit
                                    <ChevronRight size={16} className="ml-2" />
                                  </>
                                )}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {availableApps.length === 0 && (
                        <div className="text-center py-16 text-[var(--semantic-text-tertiary)]">
                          <Upload size={64} className="mx-auto mb-6 opacity-50" />
                          <p className="text-xl font-medium mb-2">Loading apps...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          // App Designer View
          <>
            {/* Left Sidebar - Sections */}
            <div className="w-60 bg-gradient-to-b from-gray-200 to-gray-300 border-r border-[var(--semantic-border-strong)] flex-shrink-0">
              <div className="p-4 space-y-2">
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === 'design'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveSection('design')}
                >
                  <div className="flex items-center gap-3">
                    <Palette size={20} />
                    <span className="font-medium">Design</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === 'preview'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveSection('preview')}
                >
                  <div className="flex items-center gap-3">
                    <Eye size={20} />
                    <span className="font-medium">Preview</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === 'code'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveSection('code')}
                >
                  <div className="flex items-center gap-3">
                    <Code size={20} />
                    <span className="font-medium">Code</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === 'export'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveSection('export')}
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} />
                    <span className="font-medium">Export</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === 'testing'
                      ? 'bg-white shadow-sm text-[var(--semantic-text-primary)]'
                      : 'text-[var(--semantic-text-secondary)] hover:bg-white/50'
                  }`}
                  onClick={() => setActiveSection('testing')}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <span className="font-medium">Testing</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <ScrollArea className="flex-1">
              <div className="p-8 max-w-7xl mx-auto">
                {/* Design Section */}
                {activeSection === 'design' && (
                  <div className="space-y-6 max-w-3xl">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings size={20} />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="app-name">App Name</Label>
                          <Input
                            id="app-name"
                            value={currentApp.name}
                            onChange={(e) => setCurrentApp({ ...currentApp, name: e.target.value })}
                            placeholder="Enter app name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="app-description">Description</Label>
                          <Textarea
                            id="app-description"
                            value={currentApp.description}
                            onChange={(e) => setCurrentApp({ ...currentApp, description: e.target.value })}
                            placeholder="Describe your app"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Layout size={20} />
                          Layout Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Pane Layout</Label>
                          <Select 
                            value={currentApp.paneLayout} 
                            onValueChange={(val: any) => setCurrentApp({ ...currentApp, paneLayout: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-pane">1-Pane (Mobile/Simple)</SelectItem>
                              <SelectItem value="2-pane">2-Pane (Tablet/Medium)</SelectItem>
                              <SelectItem value="3-pane">3-Pane (Desktop/Complex)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Color Scheme</Label>
                          <Select
                            value={currentApp.colorScheme}
                            onValueChange={(val) => setCurrentApp({ ...currentApp, colorScheme: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded"
                                      style={{ backgroundColor: scheme.primary }}
                                    />
                                    {scheme.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        {/* Pane Style Selectors */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-[var(--semantic-text-primary)] mb-3">Pane Styles</h4>
                            <p className="text-xs text-[var(--semantic-text-tertiary)] mb-4">
                              Customize the style of each pane in your layout
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {/* Pane 1 Style */}
                            {(currentApp.paneLayout === '2-pane' || currentApp.paneLayout === '3-pane') && (
                              <div className="space-y-2">
                                <Label>Pane 1 Style</Label>
                                <Select
                                  value={currentApp.designPatterns.pane1Style || 'navigation'}
                                  onValueChange={(val: any) =>
                                    setCurrentApp({
                                      ...currentApp,
                                      designPatterns: { ...currentApp.designPatterns, pane1Style: val }
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(PANE_STYLES).map(([key, style]) => (
                                      <SelectItem key={key} value={key}>
                                        {style.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-[var(--semantic-text-tertiary)]">
                                  {PANE_STYLES[currentApp.designPatterns.pane1Style as keyof typeof PANE_STYLES]?.description || 'Select a style'}
                                </p>
                              </div>
                            )}

                            {/* Pane 2 Style */}
                            {(currentApp.paneLayout === '2-pane' || currentApp.paneLayout === '3-pane') && (
                              <div className="space-y-2">
                                <Label>Pane 2 Style</Label>
                                <Select
                                  value={currentApp.designPatterns.pane2Style || 'list'}
                                  onValueChange={(val: any) =>
                                    setCurrentApp({
                                      ...currentApp,
                                      designPatterns: { ...currentApp.designPatterns, pane2Style: val }
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(PANE_STYLES).map(([key, style]) => (
                                      <SelectItem key={key} value={key}>
                                        {style.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-[var(--semantic-text-tertiary)]">
                                  {PANE_STYLES[currentApp.designPatterns.pane2Style as keyof typeof PANE_STYLES]?.description || 'Select a style'}
                                </p>
                              </div>
                            )}

                            {/* Pane 3 Style */}
                            {currentApp.paneLayout === '3-pane' && (
                              <div className="space-y-2">
                                <Label>Pane 3 Style</Label>
                                <Select
                                  value={currentApp.designPatterns.pane3Style || 'detail'}
                                  onValueChange={(val: any) =>
                                    setCurrentApp({
                                      ...currentApp,
                                      designPatterns: { ...currentApp.designPatterns, pane3Style: val }
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(PANE_STYLES).map(([key, style]) => (
                                      <SelectItem key={key} value={key}>
                                        {style.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-[var(--semantic-text-tertiary)]">
                                  {PANE_STYLES[currentApp.designPatterns.pane3Style as keyof typeof PANE_STYLES]?.description || 'Select a style'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles size={20} />
                          Design Patterns
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Status Bar</Label>
                              <p className="text-xs text-[var(--semantic-text-tertiary)]">System information bar at top</p>
                            </div>
                            <Switch
                              checked={currentApp.designPatterns.hasStatusBar}
                              onCheckedChange={(checked) => 
                                setCurrentApp({
                                  ...currentApp,
                                  designPatterns: { ...currentApp.designPatterns, hasStatusBar: checked }
                                })
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>App Header</Label>
                              <p className="text-xs text-[var(--semantic-text-tertiary)]">Title and subtitle area</p>
                            </div>
                            <Switch
                              checked={currentApp.designPatterns.hasHeader}
                              onCheckedChange={(checked) => 
                                setCurrentApp({
                                  ...currentApp,
                                  designPatterns: { ...currentApp.designPatterns, hasHeader: checked }
                                })
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Toolbar</Label>
                              <p className="text-xs text-[var(--semantic-text-tertiary)]">Action buttons at bottom</p>
                            </div>
                            <Switch
                              checked={currentApp.designPatterns.hasToolbar}
                              onCheckedChange={(checked) => 
                                setCurrentApp({
                                  ...currentApp,
                                  designPatterns: { ...currentApp.designPatterns, hasToolbar: checked }
                                })
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Gesture Area</Label>
                              <p className="text-xs text-[var(--semantic-text-tertiary)]">LoomOS navigation gestures</p>
                            </div>
                            <Switch
                              checked={currentApp.designPatterns.hasGestureArea}
                              onCheckedChange={(checked) => 
                                setCurrentApp({
                                  ...currentApp,
                                  designPatterns: { ...currentApp.designPatterns, hasGestureArea: checked }
                                })
                              }
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Header Style</Label>
                          <Select 
                            value={currentApp.designPatterns.headerStyle} 
                            onValueChange={(val: any) => 
                              setCurrentApp({
                                ...currentApp,
                                designPatterns: { ...currentApp.designPatterns, headerStyle: val }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gradient">Gradient</SelectItem>
                              <SelectItem value="flat">Flat</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette size={20} />
                          Color Customization
                        </CardTitle>
                        <CardDescription>
                          Customize colors for your app (Phase 2 - Live Editing)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primary-color">Primary Color</Label>
                            <div className="flex gap-2">
                              <Input
                                id="primary-color"
                                type="color"
                                value={colorCustomization.primary}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, primary: e.target.value })}
                                className="w-16 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={colorCustomization.primary}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, primary: e.target.value })}
                                placeholder="#3B82F6"
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="secondary-color">Secondary Color</Label>
                            <div className="flex gap-2">
                              <Input
                                id="secondary-color"
                                type="color"
                                value={colorCustomization.secondary}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, secondary: e.target.value })}
                                className="w-16 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={colorCustomization.secondary}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, secondary: e.target.value })}
                                placeholder="#6366F1"
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="accent-color">Accent Color</Label>
                            <div className="flex gap-2">
                              <Input
                                id="accent-color"
                                type="color"
                                value={colorCustomization.accent}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, accent: e.target.value })}
                                className="w-16 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={colorCustomization.accent}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, accent: e.target.value })}
                                placeholder="#8B5CF6"
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="text-color">Text Color</Label>
                            <div className="flex gap-2">
                              <Input
                                id="text-color"
                                type="color"
                                value={colorCustomization.text}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, text: e.target.value })}
                                className="w-16 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={colorCustomization.text}
                                onChange={(e) => setColorCustomization({ ...colorCustomization, text: e.target.value })}
                                placeholder="#1F2937"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Live Preview</Label>
                            <p className="text-xs text-[var(--semantic-text-tertiary)]">See changes in real-time</p>
                          </div>
                          <Switch
                            checked={livePreview}
                            onCheckedChange={setLivePreview}
                          />
                        </div>
                        
                        {livePreview && (
                          <div className="p-4 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
                            <p className="text-xs text-[var(--semantic-text-tertiary)] mb-3">Color Preview</p>
                            <div className="grid grid-cols-4 gap-2">
                              <div 
                                className="h-16 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                                style={{ backgroundColor: colorCustomization.primary }}
                              >
                                Primary
                              </div>
                              <div 
                                className="h-16 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                                style={{ backgroundColor: colorCustomization.secondary }}
                              >
                                Secondary
                              </div>
                              <div 
                                className="h-16 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                                style={{ backgroundColor: colorCustomization.accent }}
                              >
                                Accent
                              </div>
                              <div 
                                className="h-16 rounded-lg flex items-center justify-center text-xs font-semibold border-2"
                                style={{ 
                                  color: colorCustomization.text,
                                  borderColor: colorCustomization.border 
                                }}
                              >
                                Text
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Preview Section */}
                {activeSection === 'preview' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Live Preview</h2>
                      <div className="flex gap-2">
                        <Button
                          variant={previewDevice === 'smartphone' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice('smartphone')}
                        >
                          <Smartphone size={16} />
                        </Button>
                        <Button
                          variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice('tablet')}
                        >
                          <Tablet size={16} />
                        </Button>
                        <Button
                          variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice('desktop')}
                        >
                          <Monitor size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-xl flex items-center justify-center min-h-[700px]">
                      <div 
                        className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                          previewDevice === 'smartphone' ? 'w-96 h-[700px]' :
                          previewDevice === 'tablet' ? 'w-[700px] h-[900px]' :
                          'w-full max-w-7xl h-[800px]'
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          {/* Status Bar */}
                          {currentApp.designPatterns.hasStatusBar && (
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 text-xs flex justify-between items-center flex-shrink-0">
                              <span className="font-semibold">{currentApp.name}</span>
                              <span>12:30 PM</span>
                            </div>
                          )}

                          {/* Header */}
                          {currentApp.designPatterns.hasHeader && (
                            <div 
                              className="px-6 py-4 border-b flex-shrink-0"
                              style={{ 
                                background: currentApp.designPatterns.headerStyle === 'gradient' 
                                  ? 'linear-gradient(180deg, #FAFAFA 0%, #ECECEC 100%)'
                                  : currentApp.designPatterns.headerStyle === 'flat'
                                  ? '#F5F5F5'
                                  : '#FFFFFF'
                              }}
                            >
                              <h1 className="text-2xl font-light text-[var(--semantic-text-secondary)]">
                                {currentApp.name.toUpperCase()}
                              </h1>
                              <p className="text-sm text-[var(--semantic-text-tertiary)] mt-0.5">{currentApp.description}</p>
                            </div>
                          )}

                          {/* Content Area */}
                          <div className="flex-1 flex overflow-hidden">
                            {currentApp.paneLayout === '3-pane' && previewDevice === 'desktop' && (
                              <>
                                <div className="w-60 bg-gradient-to-b from-gray-200 to-gray-300 border-r p-4 flex-shrink-0">
                                  <div className="space-y-2">
                                    {[1, 2, 3, 4].map((i) => (
                                      <div key={i} className="h-9 bg-white rounded shadow-sm flex items-center px-3">
                                        <div className="w-4 h-4 rounded bg-[var(--semantic-bg-muted)] mr-2"></div>
                                        <div className="h-2 bg-[var(--semantic-bg-muted)] rounded flex-1"></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="w-96 bg-white border-r p-4 flex-shrink-0 overflow-y-auto">
                                  <div className="mb-3">
                                    <div className="h-10 bg-[var(--semantic-surface-hover)] rounded flex items-center px-3">
                                      <div className="w-4 h-4 rounded bg-[var(--semantic-bg-muted)] mr-2"></div>
                                      <div className="h-2 bg-[var(--semantic-bg-muted)] rounded w-32"></div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <div key={i} className="h-20 bg-[var(--semantic-bg-subtle)] rounded-lg p-3 border border-[var(--semantic-border-light)]">
                                        <div className="h-3 bg-[var(--semantic-bg-muted)] rounded w-3/4 mb-2"></div>
                                        <div className="h-2 bg-[var(--semantic-bg-muted)] rounded w-1/2"></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex-1 bg-[var(--semantic-bg-subtle)] p-6 overflow-y-auto">
                                  <div className="h-full bg-white rounded-lg shadow-sm p-6">
                                    <div className="space-y-4">
                                      <div className="h-8 bg-[var(--semantic-bg-muted)] rounded w-2/3"></div>
                                      <div className="h-4 bg-[var(--semantic-surface-hover)] rounded w-1/2"></div>
                                      <div className="h-40 bg-[var(--semantic-bg-subtle)] rounded border-2 border-dashed border-[var(--semantic-border-light)]"></div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-[var(--semantic-surface-hover)] rounded"></div>
                                        <div className="h-24 bg-[var(--semantic-surface-hover)] rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {currentApp.paneLayout === '2-pane' && previewDevice !== 'smartphone' && (
                              <>
                                <div className="w-96 bg-white border-r p-4 flex-shrink-0 overflow-y-auto">
                                  <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <div key={i} className="h-20 bg-[var(--semantic-bg-subtle)] rounded-lg p-3 border border-[var(--semantic-border-light)]">
                                        <div className="h-3 bg-[var(--semantic-bg-muted)] rounded w-3/4 mb-2"></div>
                                        <div className="h-2 bg-[var(--semantic-bg-muted)] rounded w-1/2"></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex-1 bg-[var(--semantic-bg-subtle)] p-6 overflow-y-auto">
                                  <div className="h-full bg-white rounded-lg shadow-sm p-6">
                                    <div className="space-y-4">
                                      <div className="h-8 bg-[var(--semantic-bg-muted)] rounded w-2/3"></div>
                                      <div className="h-4 bg-[var(--semantic-surface-hover)] rounded w-1/2"></div>
                                      <div className="h-40 bg-[var(--semantic-bg-subtle)] rounded"></div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {(currentApp.paneLayout === '1-pane' || previewDevice === 'smartphone') && (
                              <div className="flex-1 bg-white p-4 overflow-y-auto">
                                <div className="space-y-3">
                                  {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-24 bg-[var(--semantic-bg-subtle)] rounded-lg p-3 border border-[var(--semantic-border-light)]">
                                      <div className="h-3 bg-[var(--semantic-bg-muted)] rounded w-3/4 mb-2"></div>
                                      <div className="h-2 bg-[var(--semantic-bg-muted)] rounded w-1/2"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Toolbar */}
                          {currentApp.designPatterns.hasToolbar && (
                            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-3 flex justify-center gap-8 flex-shrink-0">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                  <div className="w-7 h-7 bg-[var(--semantic-text-tertiary)] rounded"></div>
                                  <div className="w-10 h-1 bg-[var(--semantic-text-secondary)] rounded"></div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Gesture Area */}
                          {currentApp.designPatterns.hasGestureArea && (
                            <div className="bg-black py-3 flex justify-center flex-shrink-0">
                              <div className="w-28 h-1 bg-[var(--semantic-text-secondary)] rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Section */}
                {activeSection === 'code' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Generated Code</h2>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}>
                          <Copy size={16} className="mr-2" />
                          Copy
                        </Button>
                        <Button size="sm" onClick={downloadCode}>
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <Card>
                      <CardContent className="p-0">
                        <div className="bg-[var(--semantic-text-primary)] text-[var(--semantic-text-inverse)] p-6 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{generateCode()}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Export Section */}
                {activeSection === 'export' && (
                  <div className="space-y-6 max-w-3xl">
                    <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Export Your App</h2>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Export Options</CardTitle>
                        <CardDescription>
                          Download your app and integrate it into your project
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            className="h-32 flex-col gap-3" 
                            variant="outline"
                            onClick={downloadCode}
                          >
                            <FileCode size={32} />
                            <div className="text-center">
                              <div className="font-semibold text-base">Download TSX</div>
                              <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">React component file</div>
                            </div>
                          </Button>

                          <Button 
                            className="h-32 flex-col gap-3" 
                            variant="outline"
                            onClick={copyToClipboard}
                          >
                            <Copy size={32} />
                            <div className="text-center">
                              <div className="font-semibold text-base">Copy Code</div>
                              <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">To clipboard</div>
                            </div>
                          </Button>

                          <Button 
                            className="h-32 flex-col gap-3" 
                            variant="outline"
                            onClick={saveApp}
                          >
                            <Save size={32} />
                            <div className="text-center">
                              <div className="font-semibold text-base">Save Design</div>
                              <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">To my apps</div>
                            </div>
                          </Button>

                          <Button 
                            className="h-32 flex-col gap-3" 
                            variant="outline"
                            onClick={() => setActiveSection('preview')}
                          >
                            <Eye size={32} />
                            <div className="text-center">
                              <div className="font-semibold text-base">Preview</div>
                              <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">Test the design</div>
                            </div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info size={20} />
                          Integration Guide
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">1. Install Dependencies</h4>
                            <div className="bg-[var(--semantic-text-primary)] text-[var(--semantic-text-inverse)] p-3 rounded font-mono text-xs">
                              yarn add lucide-react
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">2. Copy Component File</h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Download the TSX file and place it in your <code className="bg-[var(--semantic-surface-hover)] px-1.5 py-0.5 rounded">app/</code> directory
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">3. Customize Further</h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              The generated code is a starting point. You can customize colors, add features, and integrate with your data
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">4. Add to Navigation</h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Register your new app in the app registry to make it available in the launcher
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Testing Section */}
                {activeSection === 'testing' && (
                  <div className="space-y-6 max-w-6xl">
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--semantic-text-primary)] mb-2">
                        Testing & Validation
                      </h2>
                      <p className="text-muted-foreground">
                        Automated quality checks, code validation, and component testing
                      </p>
                    </div>

                    <Tabs defaultValue="validation" className="w-full">
                      <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="validation">Code Validation</TabsTrigger>
                        <TabsTrigger value="testing">Component Testing</TabsTrigger>
                      </TabsList>

                      <TabsContent value="validation" className="mt-6">
                        <ValidationPanel 
                          code={generateCode()}
                          onValidate={(result) => {
                            if (result.isValid) {
                              toast.success(`Code validation passed! Score: ${result.score.toFixed(0)}/100`);
                            } else {
                              toast.error(`Code validation found ${result.errors.length} errors`);
                            }
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="testing" className="mt-6">
                        <TestingPanel 
                          code={generateCode()}
                          componentName={currentApp.name}
                          onTestComplete={(suite) => {
                            if (suite.failedTests === 0) {
                              toast.success(`All ${suite.totalTests} tests passed!`);
                            } else {
                              toast.warning(`${suite.failedTests} of ${suite.totalTests} tests failed`);
                            }
                          }}
                        />
                      </TabsContent>
                    </Tabs>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info size={20} />
                          Testing Best Practices
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">
                              1. Validate Before Export
                            </h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Always run code validation before exporting to catch potential issues early
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">
                              2. Fix Critical Errors
                            </h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Address all critical errors and security issues before deploying your app
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">
                              3. Review Warnings
                            </h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Consider addressing warnings to improve code quality and maintainability
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">
                              4. Run Full Test Suite
                            </h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Execute the complete test suite to verify accessibility, performance, and functionality
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-[var(--semantic-text-secondary)] mb-2">
                              5. Download Test Reports
                            </h4>
                            <p className="text-sm text-[var(--semantic-text-secondary)]">
                              Save test reports for documentation and future reference
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
      </DesktopAppWrapper>
    </ErrorBoundary>
  );
}
