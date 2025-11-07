
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Palette,
  Type,
  Square,
  Circle,
  Star,
  Image as ImageIcon,
  Download,
  Save,
  Folder,
  Sparkles,
  Undo,
  Redo,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Layers,
  Settings,
  Zap,
  Grid,
  Plus,
  X,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ErrorBoundary } from '@/components/common';
import { toastError, toastCRUD } from '@/lib/toast-helpers';
import { 
  DesktopAppWrapper,
  WebOSActionButton,
  WebOSEmptyState,
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';

interface LogoProject {
  id: string;
  name: string;
  businessName: string;
  tagline?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontSize: number;
  fontFamily: string;
  iconType?: 'circle' | 'square' | 'star' | 'custom';
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
}

const FONT_FAMILIES = [
  { value: 'Titillium Web', label: 'Titillium Web' },
  { value: 'Cambo', label: 'Cambo' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
];

const COLOR_PALETTES = [
  { name: 'Brandy', colors: ['#2A4A4D', '#C87137', '#E8C8A0', '#FFFFFF'] },
  { name: 'Ocean', colors: ['#006994', '#00A8E8', '#76CDCE', '#FFFFFF'] },
  { name: 'Forest', colors: ['#2D5016', '#6A994E', '#A7C957', '#FFFFFF'] },
  { name: 'Sunset', colors: ['#D62828', '#F77F00', '#FCBF49', '#FFFFFF'] },
  { name: 'Purple', colors: ['#4A148C', '#7B1FA2', '#BA68C8', '#FFFFFF'] },
  { name: 'Monochrome', colors: ['#1A1A1A', '#4A4A4A', '#9E9E9E', '#FFFFFF'] },
];

export default function BrandyApp() {
  const { data: session } = useSession() || {};
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [projects, setProjects] = useState<LogoProject[]>([]);
  const [currentProject, setCurrentProject] = useState<LogoProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [showGrid, setShowGrid] = useState(true);
  
  // Design state
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2A4A4D');
  const [secondaryColor, setSecondaryColor] = useState('#C87137');
  const [accentColor, setAccentColor] = useState('#E8C8A0');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Titillium Web');
  const [iconType, setIconType] = useState<'circle' | 'square' | 'star' | 'custom' | 'none'>('circle');

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Redraw canvas when design changes
  useEffect(() => {
    if (canvasRef.current) {
      drawLogo();
    }
  }, [businessName, tagline, primaryColor, secondaryColor, accentColor, backgroundColor, fontSize, fontFamily, iconType, showGrid]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/brandy/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      // Load from localStorage as fallback
      const saved = localStorage.getItem('brandyProjects');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async () => {
    if (!businessName.trim()) {
      toastError('Please enter a business name');
      return;
    }

    try {
      setIsSaving(true);
      const project: LogoProject = {
        id: currentProject?.id || `project-${Date.now()}`,
        name: `${businessName} Logo`,
        businessName,
        tagline,
        colorScheme: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
        },
        fontSize,
        fontFamily,
        iconType: iconType !== 'none' ? iconType : undefined,
        backgroundColor,
        createdAt: currentProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/brandy/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const savedProject = await response.json();
        setCurrentProject(savedProject);
        setProjects(prev => {
          const existing = prev.find(p => p.id === savedProject.id);
          if (existing) {
            return prev.map(p => p.id === savedProject.id ? savedProject : p);
          }
          return [...prev, savedProject];
        });
        toastCRUD.created('Project');
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('Save error:', error);
      // Fallback to localStorage
      const project: LogoProject = {
        id: currentProject?.id || `project-${Date.now()}`,
        name: `${businessName} Logo`,
        businessName,
        tagline,
        colorScheme: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
        },
        fontSize,
        fontFamily,
        iconType: iconType !== 'none' ? iconType : undefined,
        backgroundColor,
        createdAt: currentProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedProjects = projects.filter(p => p.id !== project.id);
      updatedProjects.push(project);
      setProjects(updatedProjects);
      setCurrentProject(project);
      localStorage.setItem('brandyProjects', JSON.stringify(updatedProjects));
      toastCRUD.created('Project (saved locally)');
    } finally {
      setIsSaving(false);
    }
  };

  const loadProject = (project: LogoProject) => {
    setCurrentProject(project);
    setBusinessName(project.businessName);
    setTagline(project.tagline || '');
    setPrimaryColor(project.colorScheme.primary);
    setSecondaryColor(project.colorScheme.secondary);
    setAccentColor(project.colorScheme.accent);
    setFontSize(project.fontSize);
    setFontFamily(project.fontFamily);
    setIconType(project.iconType || 'none');
    setBackgroundColor(project.backgroundColor);
    setActiveTab('design');
  };

  const newProject = () => {
    setCurrentProject(null);
    setBusinessName('');
    setTagline('');
    setPrimaryColor('#2A4A4D');
    setSecondaryColor('#C87137');
    setAccentColor('#E8C8A0');
    setBackgroundColor('#FFFFFF');
    setFontSize(48);
    setFontFamily('Titillium Web');
    setIconType('circle');
    setActiveTab('design');
  };

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/brandy/projects?id=${projectId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        if (currentProject?.id === projectId) {
          newProject();
        }
        toastCRUD.deleted('Project');
      }
    } catch (error) {
      // Fallback to localStorage
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('brandyProjects', JSON.stringify(updatedProjects));
      if (currentProject?.id === projectId) {
        newProject();
      }
      toastCRUD.deleted('Project');
    }
  };

  const applyPalette = (palette: typeof COLOR_PALETTES[0]) => {
    setPrimaryColor(palette.colors[0] || '#000000');
    setSecondaryColor(palette.colors[1] || '#ffffff');
    setAccentColor(palette.colors[2] || '#888888');
    setBackgroundColor(palette.colors[3] || '#f0f0f0');
  };

  const exportLogo = (format: 'png' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `${businessName || 'logo'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toastCRUD.created('PNG export');
    } else {
      // Simple SVG export
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <rect width="800" height="600" fill="${backgroundColor}"/>
          ${iconType !== 'none' ? `
            <circle cx="200" cy="300" r="80" fill="${primaryColor}"/>
          ` : ''}
          <text x="400" y="280" font-family="${fontFamily}" font-size="${fontSize}" fill="${primaryColor}" text-anchor="middle">
            ${businessName}
          </text>
          ${tagline ? `
            <text x="400" y="340" font-family="${fontFamily}" font-size="${fontSize * 0.4}" fill="${secondaryColor}" text-anchor="middle">
              ${tagline}
            </text>
          ` : ''}
        </svg>
      `;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = `${businessName || 'logo'}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      toastCRUD.created('SVG export');
    }
  };

  const drawLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw icon
    if (iconType !== 'none') {
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      
      if (iconType === 'circle') {
        ctx.arc(centerX - 200, centerY, 80, 0, Math.PI * 2);
      } else if (iconType === 'square') {
        ctx.rect(centerX - 280, centerY - 80, 160, 160);
      } else if (iconType === 'star') {
        drawStar(ctx, centerX - 200, centerY, 5, 80, 40);
      }
      
      ctx.fill();
    }

    // Draw business name
    ctx.fillStyle = primaryColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(businessName || 'Your Business', centerX + 50, centerY - 20);

    // Draw tagline
    if (tagline) {
      ctx.fillStyle = secondaryColor;
      ctx.font = `${fontSize * 0.4}px ${fontFamily}`;
      ctx.fillText(tagline, centerX + 50, centerY + 40);
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  return (
    <ErrorBoundary>
      <DesktopAppWrapper
        title="Brandy: Logo Designer"
        icon={<Palette className="w-5 h-5" />}
        gradient={APP_COLORS.brandy?.light || 'from-teal-600 via-teal-700 to-orange-600'}
        toolbar={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={newProject}
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={saveProject}
              disabled={isSaving || !businessName}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="flex h-full">
          {/* Sidebar - Projects & Tools */}
          <div className="w-80 border-r border-border bg-muted/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="design">
                  <Palette className="w-4 h-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="projects">
                  <Folder className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="flex-1 m-0 p-4 space-y-4 overflow-auto">
                {/* Business Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Business Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="businessName" className="text-xs">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter business name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagline" className="text-xs">Tagline (Optional)</Label>
                      <Input
                        id="tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Your slogan"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Typography */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Typography
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="fontFamily" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fontSize" className="text-xs">Font Size: {fontSize}px</Label>
                      <Slider
                        id="fontSize"
                        value={[fontSize]}
                        onValueChange={([val]) => setFontSize(val || 48)}
                        min={24}
                        max={96}
                        step={2}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="primaryColor" className="text-xs">Primary</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor" className="text-xs">Secondary</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accentColor" className="text-xs">Accent</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="accentColor"
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="backgroundColor" className="text-xs">Background</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs mb-2 block">Color Palettes</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {COLOR_PALETTES.map((palette) => (
                          <Button
                            key={palette.name}
                            variant="outline"
                            size="sm"
                            onClick={() => applyPalette(palette)}
                            className="h-auto p-2 flex flex-col items-start gap-1"
                          >
                            <span className="text-xs font-medium">{palette.name}</span>
                            <div className="flex gap-1">
                              {palette.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-sm border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Icon */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Square className="w-4 h-4" />
                      Icon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 'none' as const, icon: X, label: 'None' },
                        { value: 'circle' as const, icon: Circle, label: 'Circle' },
                        { value: 'square' as const, icon: Square, label: 'Square' },
                        { value: 'star' as const, icon: Star, label: 'Star' },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={iconType === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setIconType(option.value)}
                          className="flex flex-col items-center gap-1 h-auto py-2"
                        >
                          <option.icon className="w-4 h-4" />
                          <span className="text-xs">{option.label}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportLogo('png')}
                      disabled={!businessName}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportLogo('svg')}
                      disabled={!businessName}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export SVG
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="flex-1 m-0 p-4 overflow-auto">
                <div className="space-y-2">
                  {projects.length === 0 ? (
                    <WebOSEmptyState
                      icon={<Folder className="w-12 h-12" />}
                      title="No Projects"
                      description="Create your first logo project"
                      action={
                        <Button onClick={newProject} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          New Project
                        </Button>
                      }
                    />
                  ) : (
                    projects.map((project) => (
                      <Card
                        key={project.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          currentProject?.id === project.id && "ring-2 ring-primary"
                        )}
                        onClick={() => loadProject(project)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{project.businessName}</h4>
                              {project.tagline && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {project.tagline}
                                </p>
                              )}
                              <div className="flex items-center gap-1 mt-2">
                                <div
                                  className="w-4 h-4 rounded-sm border"
                                  style={{ backgroundColor: project.colorScheme.primary }}
                                />
                                <div
                                  className="w-4 h-4 rounded-sm border"
                                  style={{ backgroundColor: project.colorScheme.secondary }}
                                />
                                <div
                                  className="w-4 h-4 rounded-sm border"
                                  style={{ backgroundColor: project.colorScheme.accent }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete project "${project.businessName}"?`)) {
                                  deleteProject(project.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="border-b border-border p-2 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid className={cn("w-4 h-4 mr-2", showGrid && "text-primary")} />
                  Grid
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {businessName || 'Untitled Project'}
                </Badge>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 bg-muted/5">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border-2 border-border rounded-lg shadow-xl bg-white"
                />
                {!businessName && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        Enter your business name to start
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DesktopAppWrapper>
    </ErrorBoundary>
  );
}
