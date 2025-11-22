
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Layout, Settings, Check, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useDesktopCustomization, PRESET_WALLPAPERS } from '@/lib/desktop-customization-store';
import { cn } from '@/lib/utils';

interface DesktopCustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopCustomizationPanel({ isOpen, onClose }: DesktopCustomizationPanelProps) {
  const { 
    wallpaper, 
    theme, 
    layout,
    setWallpaper,
    setTheme,
    setLayout,
    setThemeMode,
    setFontScale,
    toggleReduceMotion,
    setDockPosition,
    setDockSize,
    toggleStatusBar,
    resetToDefaults,
  } = useDesktopCustomization();
  
  const [activeTab, setActiveTab] = useState('wallpaper');
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Customize Desktop</h2>
                    <p className="text-sm text-muted-foreground">
                      Personalize your workspace
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <div className="border-b px-6 pt-4">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="wallpaper" className="gap-2">
                        <Monitor className="h-4 w-4" />
                        Wallpaper
                      </TabsTrigger>
                      <TabsTrigger value="theme" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Theme
                      </TabsTrigger>
                      <TabsTrigger value="layout" className="gap-2">
                        <Layout className="h-4 w-4" />
                        Layout
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    {/* Wallpaper Tab */}
                    <TabsContent value="wallpaper" className="mt-0 space-y-6">
                      {/* Solid Colors */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Solid Colors
                        </Label>
                        <div className="grid grid-cols-6 gap-3">
                          {PRESET_WALLPAPERS.solid.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => setWallpaper({ type: 'solid', value: preset.value })}
                              className={cn(
                                "aspect-square rounded-lg border-2 transition-all hover:scale-105",
                                wallpaper.type === 'solid' && wallpaper.value === preset.value
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-transparent hover:border-border"
                              )}
                              style={{ backgroundColor: preset.value }}
                              title={preset.name}
                            >
                              {wallpaper.type === 'solid' && wallpaper.value === preset.value && (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Check className="h-6 w-6 text-white drop-shadow-lg" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Gradients */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Gradients
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {PRESET_WALLPAPERS.gradient.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => setWallpaper({ type: 'gradient', value: preset.value })}
                              className={cn(
                                "aspect-video rounded-lg border-2 transition-all hover:scale-105 relative overflow-hidden",
                                wallpaper.type === 'gradient' && wallpaper.value === preset.value
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-transparent hover:border-border"
                              )}
                              style={{ background: preset.value }}
                              title={preset.name}
                            >
                              {wallpaper.type === 'gradient' && wallpaper.value === preset.value && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                  <Check className="h-6 w-6 text-white drop-shadow-lg" />
                                </div>
                              )}
                              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 px-2">
                                {preset.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Image Backgrounds */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Image Backgrounds
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {PRESET_WALLPAPERS.image.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => setWallpaper({ type: 'image', value: preset.value })}
                              className={cn(
                                "aspect-video rounded-lg border-2 transition-all hover:scale-105 relative overflow-hidden",
                                wallpaper.type === 'image' && wallpaper.value === preset.value
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-transparent hover:border-border"
                              )}
                              title={preset.name}
                            >
                              <img 
                                src={preset.thumbnail} 
                                alt={preset.name}
                                className="h-full w-full object-cover"
                              />
                              {wallpaper.type === 'image' && wallpaper.value === preset.value && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                  <Check className="h-6 w-6 text-white drop-shadow-lg" />
                                </div>
                              )}
                              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 px-2">
                                {preset.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Wallpaper Effects */}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Blur: {wallpaper.blur}</Label>
                          </div>
                          <Slider
                            value={[wallpaper.blur]}
                            onValueChange={([value]) => setWallpaper({ blur: value })}
                            min={0}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Dim: {wallpaper.dim}%</Label>
                          </div>
                          <Slider
                            value={[wallpaper.dim]}
                            onValueChange={([value]) => setWallpaper({ dim: value })}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Theme Tab */}
                    <TabsContent value="theme" className="mt-0 space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Theme Mode
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['light', 'dark', 'auto'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setThemeMode(mode)}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all capitalize",
                                theme.mode === mode
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label>Font Scale: {theme.fontScale.toFixed(1)}x</Label>
                          <Slider
                            value={[theme.fontScale]}
                            onValueChange={([value]) => value !== undefined && setFontScale(value)}
                            min={0.8}
                            max={1.2}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Reduce Motion</Label>
                            <p className="text-sm text-muted-foreground">
                              Minimize animations
                            </p>
                          </div>
                          <Switch
                            checked={theme.reduceMotion}
                            onCheckedChange={toggleReduceMotion}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Layout Tab */}
                    <TabsContent value="layout" className="mt-0 space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Dock Position
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {(['top', 'bottom'] as const).map((position) => (
                            <button
                              key={position}
                              onClick={() => setDockPosition(position)}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all capitalize",
                                layout.dockPosition === position
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {position}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Dock Size
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                              key={size}
                              onClick={() => setDockSize(size)}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all capitalize",
                                layout.dockSize === size
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label>Widget Transparency: {layout.widgetTransparency}%</Label>
                          <Slider
                            value={[layout.widgetTransparency]}
                            onValueChange={([value]) => setLayout({ widgetTransparency: value })}
                            min={70}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Animation Speed: {layout.windowAnimationSpeed.toFixed(1)}x</Label>
                          <Slider
                            value={[layout.windowAnimationSpeed]}
                            onValueChange={([value]) => setLayout({ windowAnimationSpeed: value })}
                            min={0.5}
                            max={2.0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Status Bar Visible</Label>
                          <Switch
                            checked={layout.statusBarVisible}
                            onCheckedChange={toggleStatusBar}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t bg-muted/30">
                <Button variant="outline" onClick={() => resetToDefaults()}>
                  Reset to Defaults
                </Button>
                <Button onClick={onClose}>
                  Apply & Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
