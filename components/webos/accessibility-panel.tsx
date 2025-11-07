
'use client';

import React from 'react';
import { useAccessibilityStore } from '@/lib/accessibility-store';
import { X, Eye, Volume2, Keyboard, Zap, Layout, RotateCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AccessibilityPanelProps {
  onClose: () => void;
}

export function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const {
    reducedMotion,
    highContrast,
    largeText,
    fontSize,
    keyboardNavigationEnabled,
    screenReaderOptimized,
    focusHighlightEnabled,
    soundEffectsEnabled,
    hapticsEnabled,
    sidebarAlwaysVisible,
    compactMode,
    setReducedMotion,
    setHighContrast,
    setLargeText,
    setFontSize,
    setKeyboardNavigation,
    setScreenReaderOptimized,
    setFocusHighlight,
    setSoundEffects,
    setHaptics,
    setSidebarAlwaysVisible,
    setCompactMode,
    resetToDefaults,
  } = useAccessibilityStore();
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Accessibility Settings</h2>
              <p className="text-sm text-gray-600">Customize your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label="Close accessibility panel"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visual Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Visual</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="reduced-motion" className="text-sm font-medium text-gray-900">
                    Reduced Motion
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Minimize animations and transitions</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="high-contrast" className="text-sm font-medium text-gray-900">
                    High Contrast
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Increase color contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Font Size</Label>
                <RadioGroup value={fontSize} onValueChange={(value: any) => setFontSize(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="font-normal" />
                    <Label htmlFor="font-normal" className="text-sm text-gray-700">Normal (16px)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="font-large" />
                    <Label htmlFor="font-large" className="text-sm text-gray-700">Large (18px)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="x-large" id="font-xlarge" />
                    <Label htmlFor="font-xlarge" className="text-sm text-gray-700">Extra Large (20px)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>
          
          {/* Interaction Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Interaction</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="keyboard-nav" className="text-sm font-medium text-gray-900">
                    Keyboard Navigation
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Enhanced keyboard shortcuts and navigation</p>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={keyboardNavigationEnabled}
                  onCheckedChange={setKeyboardNavigation}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="screen-reader" className="text-sm font-medium text-gray-900">
                    Screen Reader Optimized
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Optimize interface for screen readers</p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={screenReaderOptimized}
                  onCheckedChange={setScreenReaderOptimized}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="focus-highlight" className="text-sm font-medium text-gray-900">
                    Focus Highlight
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Show visible focus indicators</p>
                </div>
                <Switch
                  id="focus-highlight"
                  checked={focusHighlightEnabled}
                  onCheckedChange={setFocusHighlight}
                />
              </div>
            </div>
          </section>
          
          {/* Feedback Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Feedback</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="sound-effects" className="text-sm font-medium text-gray-900">
                    Sound Effects
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Play sounds for actions and notifications</p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={soundEffectsEnabled}
                  onCheckedChange={setSoundEffects}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="haptics" className="text-sm font-medium text-gray-900">
                    Haptic Feedback
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Vibration feedback on touch devices</p>
                </div>
                <Switch
                  id="haptics"
                  checked={hapticsEnabled}
                  onCheckedChange={setHaptics}
                />
              </div>
            </div>
          </section>
          
          {/* Layout Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Layout</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="sidebar-always" className="text-sm font-medium text-gray-900">
                    Always Show Sidebar
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Keep sidebar visible on all screen sizes</p>
                </div>
                <Switch
                  id="sidebar-always"
                  checked={sidebarAlwaysVisible}
                  onCheckedChange={setSidebarAlwaysVisible}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="compact-mode" className="text-sm font-medium text-gray-900">
                    Compact Mode
                  </Label>
                  <p className="text-xs text-gray-600 mt-0.5">Reduce spacing for more content</p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-300 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button onClick={onClose} size="sm">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
