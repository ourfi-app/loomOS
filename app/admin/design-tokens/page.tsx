'use client';

import { useState, useEffect } from 'react';
import { AdminRouteGuard } from '@/components/admin-route-guard';
import { useDesignTokenStore, applyTokensToDocument, DEFAULT_TOKENS } from '@/lib/design-token-store';
import { ColorTokensEditor } from '@/components/design-token-editor/color-tokens-editor';
import { SpacingTokensEditor } from '@/components/design-token-editor/spacing-tokens-editor';
import { TypographyTokensEditor } from '@/components/design-token-editor/typography-tokens-editor';
import { ElevationTokensEditor } from '@/components/design-token-editor/elevation-tokens-editor';
import { GlassmorphismTokensEditor } from '@/components/design-token-editor/glassmorphism-tokens-editor';
import { MotionTokensEditor } from '@/components/design-token-editor/motion-tokens-editor';
import { RadiusTokensEditor } from '@/components/design-token-editor/radius-tokens-editor';
import { PaletteSelector } from '@/components/palette-selector';
import { COLOR_PALETTES, getPaletteById } from '@/lib/color-palettes';
import { Download, RotateCcw, Save, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DesignTokensPage() {
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState('default');
  const { tokens, setTokens, resetToDefaults, exportTokens } = useDesignTokenStore();

  // Apply tokens to document on mount and when tokens change
  useEffect(() => {
    applyTokensToDocument(tokens);
  }, [tokens]);

  const handleSave = () => {
    // Save to localStorage (already handled by zustand persist)
    toast.success('Design tokens saved successfully!', {
      icon: <Save className="h-4 w-4" />,
      duration: 2000,
    });
  };

  const handleExport = () => {
    const css = exportTokens();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-design-tokens.css';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Design tokens exported!', {
      icon: <Download className="h-4 w-4" />,
      duration: 2000,
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all design tokens to defaults?')) {
      resetToDefaults();
      toast.success('Design tokens reset to defaults', {
        icon: <RotateCcw className="h-4 w-4" />,
        duration: 2000,
      });
    }
  };

  const handlePaletteSelect = (paletteId: string) => {
    setSelectedPaletteId(paletteId);
    const palette = getPaletteById(paletteId);
    
    // Update color tokens with palette colors
    setTokens({
      colors: {
        ...tokens.colors,
        primary: palette.colors.primary,
        secondary: palette.colors.secondary,
        accent: palette.colors.accent,
        success: palette.colors.success,
        warning: palette.colors.warning,
        error: palette.colors.error,
      },
    });
    
    toast.success(`Applied ${palette.name} palette`, {
      duration: 2000,
    });
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'palette', label: 'Color Palettes', icon: '🎭' },
    { id: 'spacing', label: 'Spacing', icon: '📏' },
    { id: 'typography', label: 'Typography', icon: '✍️' },
    { id: 'elevation', label: 'Elevation', icon: '📦' },
    { id: 'glassmorphism', label: 'Glassmorphism', icon: '✨' },
    { id: 'motion', label: 'Motion', icon: '🎬' },
    { id: 'radius', label: 'Border Radius', icon: '⭕' },
  ];

  return (
    <AdminRouteGuard>
      <div className="min-h-screen" style={{
        background: 'var(--semantic-bg-base)',
        color: 'var(--text-primary)',
      }}>
        {/* Header */}
        <div className="sticky top-0 z-50" style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(var(--blur-xl))',
          borderBottom: '1px solid var(--semantic-border-light)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Design Token Customization
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Customize the visual design tokens for your loomOS instance
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: previewMode ? 'var(--semantic-primary)' : 'transparent',
                    color: previewMode ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${previewMode ? 'var(--semantic-primary)' : 'var(--semantic-border-medium)'}`,
                  }}
                >
                  <Eye className="h-4 w-4" />
                  {previewMode ? 'Exit Preview' : 'Preview'}
                </button>
                
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--semantic-border-medium)',
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--semantic-border-medium)',
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export CSS
                </button>
                
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: 'var(--semantic-primary)',
                    color: 'white',
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-[73px] z-40" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(var(--blur-md))',
          borderBottom: '1px solid var(--semantic-border-light)',
        }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-3 transition-all whitespace-nowrap"
                  style={{
                    borderBottom: activeTab === tab.id
                      ? '2px solid var(--semantic-primary)'
                      : '2px solid transparent',
                    color: activeTab === tab.id
                      ? 'var(--semantic-primary)'
                      : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? '500' : '400',
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {!previewMode ? (
            <div className="space-y-6">
              {activeTab === 'colors' && <ColorTokensEditor />}
              {activeTab === 'palette' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Choose a Color Palette
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Select a pre-made color palette to apply to your design tokens
                  </p>
                  <PaletteSelector
                    palettes={COLOR_PALETTES}
                    selectedPaletteId={selectedPaletteId}
                    onSelect={handlePaletteSelect}
                  />
                </div>
              )}
              {activeTab === 'spacing' && <SpacingTokensEditor />}
              {activeTab === 'typography' && <TypographyTokensEditor />}
              {activeTab === 'elevation' && <ElevationTokensEditor />}
              {activeTab === 'glassmorphism' && <GlassmorphismTokensEditor />}
              {activeTab === 'motion' && <MotionTokensEditor />}
              {activeTab === 'radius' && <RadiusTokensEditor />}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Preview Mode
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                This is a preview of how your design tokens look. The entire interface is using your custom tokens.
              </p>
              
              {/* Preview Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card Preview */}
                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'var(--semantic-surface-base)',
                    boxShadow: 'var(--shadow-card)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Card Component
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
                    This card uses your custom tokens for spacing, colors, shadows, and border radius.
                  </p>
                </div>

                {/* Button Preview */}
                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'var(--semantic-surface-base)',
                    boxShadow: 'var(--shadow-card)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Buttons
                  </h3>
                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 rounded"
                      style={{
                        background: 'var(--semantic-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="w-full px-4 py-2 rounded"
                      style={{
                        background: 'var(--semantic-accent)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>

                {/* Glass Preview */}
                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, var(--glass-opacity))',
                    backdropFilter: `blur(var(--blur-xl)) var(--backdrop-saturate)`,
                    boxShadow: 'var(--shadow-glass)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Glassmorphism
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
                    This element showcases the glassmorphism effect with custom blur and saturation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
