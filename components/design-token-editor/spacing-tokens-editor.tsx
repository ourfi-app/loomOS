'use client';

import { useDesignTokenStore } from '@/lib/design-token-store';
import { Slider } from './slider';

export function SpacingTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();

  const handleSpacingChange = (key: string, value: number) => {
    updateTokenCategory('spacing', { [key]: `${value}px` });
  };

  const spacingTokens = [
    { key: 'xs', label: 'Extra Small (xs)', min: 2, max: 8, step: 1 },
    { key: 'sm', label: 'Small (sm)', min: 4, max: 16, step: 1 },
    { key: 'md', label: 'Medium (md)', min: 8, max: 20, step: 1 },
    { key: 'lg', label: 'Large (lg)', min: 12, max: 32, step: 2 },
    { key: 'xl', label: 'Extra Large (xl)', min: 16, max: 48, step: 2 },
    { key: '2xl', label: '2X Large (2xl)', min: 24, max: 64, step: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Spacing Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Control the spacing scale used for margins, padding, and gaps
        </p>
      </div>

      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="space-y-6">
          {spacingTokens.map((token) => {
            const currentValue = parseInt(tokens.spacing[token.key as keyof typeof tokens.spacing]);
            
            return (
              <div key={token.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {token.label}
                  </label>
                  <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {currentValue}px
                  </span>
                </div>
                <Slider
                  value={currentValue}
                  onChange={(value) => handleSpacingChange(token.key, value)}
                  min={token.min}
                  max={token.max}
                  step={token.step}
                />
                {/* Visual preview */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    style={{
                      width: `${currentValue}px`,
                      height: '24px',
                      background: 'var(--semantic-primary)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Preview
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
