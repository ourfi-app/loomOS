'use client';

import { useDesignTokenStore } from '@/lib/design-token-store';
import { ColorPicker } from './color-picker';

export function ColorTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();

  const handleColorChange = (key: string, value: string) => {
    updateTokenCategory('colors', { [key]: value });
  };

  const colorGroups = [
    {
      title: 'Brand Colors',
      description: 'Primary brand colors used throughout the interface',
      colors: [
        { key: 'primary', label: 'Primary', description: 'Main brand color' },
        { key: 'secondary', label: 'Secondary', description: 'Secondary brand color' },
        { key: 'accent', label: 'Accent', description: 'Accent highlights' },
      ],
    },
    {
      title: 'Status Colors',
      description: 'Colors for conveying status and feedback',
      colors: [
        { key: 'success', label: 'Success', description: 'Success states' },
        { key: 'warning', label: 'Warning', description: 'Warning states' },
        { key: 'error', label: 'Error', description: 'Error states' },
      ],
    },
    {
      title: 'Text Colors',
      description: 'Colors for text content',
      colors: [
        { key: 'textPrimary', label: 'Primary Text', description: 'Main text color' },
        { key: 'textSecondary', label: 'Secondary Text', description: 'Supporting text' },
      ],
    },
    {
      title: 'Background Colors',
      description: 'Background and surface colors',
      colors: [
        { key: 'bgBase', label: 'Base Background', description: 'Main background' },
        { key: 'bgSurface', label: 'Surface', description: 'Cards and surfaces' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Color Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Customize the color palette for your design system
        </p>
      </div>

      {colorGroups.map((group) => (
        <div
          key={group.title}
          className="p-6 rounded-lg"
          style={{
            background: 'var(--semantic-surface-base)',
            border: '1px solid var(--semantic-border-light)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {group.title}
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {group.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.colors.map((color) => (
              <div key={color.key}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {color.label}
                </label>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {color.description}
                </p>
                <ColorPicker
                  value={tokens.colors[color.key as keyof typeof tokens.colors]}
                  onChange={(value) => handleColorChange(color.key, value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
