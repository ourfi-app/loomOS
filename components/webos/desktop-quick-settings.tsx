
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sun, Moon, Volume2, VolumeX, Bell, BellOff, 
  Wifi, Settings, Monitor, Keyboard, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useDesktopCustomization } from '@/lib/desktop-customization-store';

interface DesktopQuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullSettings: () => void;
}

export function DesktopQuickSettings({ 
  isOpen, 
  onClose,
  onOpenFullSettings,
}: DesktopQuickSettingsProps) {
  const { theme: themeMode, setTheme } = useTheme();
  const { layout, togglePerformanceMonitor } = useDesktopCustomization();
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(75);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(themeMode === 'dark');
  
  useEffect(() => {
    setIsDarkMode(themeMode === 'dark');
  }, [themeMode]);
  
  const toggleDarkMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setTheme(newMode);
    setIsDarkMode(!isDarkMode);
  };
  
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
            className="fixed inset-0 z-[90]"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 z-[91] w-96"
          >
            <div className="bg-background/95 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Quick Settings</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Display Controls */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <span>Brightness</span>
                      </div>
                      <span className="text-muted-foreground">{brightness}%</span>
                    </div>
                    <Slider
                      value={[brightness]}
                      onValueChange={([value]) => value !== undefined && setBrightness(value)}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {volume > 0 ? (
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Volume</span>
                      </div>
                      <span className="text-muted-foreground">{volume}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={([value]) => value !== undefined && setVolume(value)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="h-px bg-border" />
                
                {/* Quick Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Sun className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Toggle theme
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {notificationsEnabled ? (
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <div className="text-sm font-medium">Notifications</div>
                        <div className="text-xs text-muted-foreground">
                          {notificationsEnabled ? 'On' : 'Off'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Performance Monitor</div>
                        <div className="text-xs text-muted-foreground">
                          Show system stats
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={layout.showPerformanceMonitor}
                      onCheckedChange={togglePerformanceMonitor}
                    />
                  </div>
                </div>
                
                <div className="h-px bg-border" />
                
                {/* System Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-[var(--semantic-success)]" />
                      <span>Network Status</span>
                    </div>
                    <span className="text-muted-foreground">Connected</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span>Display Mode</span>
                    </div>
                    <span className="text-muted-foreground">Desktop</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-4 w-4 text-muted-foreground" />
                      <span>Keyboard Layout</span>
                    </div>
                    <span className="text-muted-foreground">US</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t bg-muted/30">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between" 
                  onClick={() => {
                    onClose();
                    onOpenFullSettings();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Full Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
