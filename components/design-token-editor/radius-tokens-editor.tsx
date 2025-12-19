'use client';

import { useDesignTokenStore } from '@/lib/design-token-store';
import { Slider } from './slider';

export function RadiusTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();

  const handleRadiusChange = (key: string, value: number | string) => {
    updateTokenCategory('radius', { [key]: typeof value === 'number' ? `${value}px` : value });
  };

  const radiusSm = parseInt(tokens.radius.sm);
  const radiusMd = parseInt(tokens.radius.md);
  const radiusLg = parseInt(tokens.radius.lg);
  const radiusXl = parseInt(tokens.radius.xl);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Border Radius Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure border radius values for different component sizes
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
        <div className="space-y-8">
          {[
            { key: 'sm', label: 'Small Radius', value: radiusSm, min: 0, max: 8 },
            { key: 'md', label: 'Medium Radius', value: radiusMd, min: 4, max: 16 },
            { key: 'lg', label: 'Large Radius', value: radiusLg, min: 8, max: 24 },
            { key: 'xl', label: 'Extra Large Radius', value: radiusXl, min: 12, max: 32 },
          ].map((radius) => (
            <div key={radius.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {radius.label}
                </label>
                <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {radius.value}px
                </span>
              </div>
              <Slider
                value={radius.value}
                onChange={(value) => handleRadiusChange(radius.key, value)}
                min={radius.min}
                max={radius.max}
                step={1}
              />
              
              {/* Visual preview */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                {/* Button preview */}
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Button
                  </p>
                  <button
                    className="w-full px-4 py-2"
                    style={{
                      background: 'var(--semantic-primary)',
                      color: 'white',
                      borderRadius: `${radius.value}px`,
                    }}
                  >
                    Button
                  </button>
                </div>
                
                {/* Card preview */}
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Card
                  </p>
                  <div
                    className="w-full h-20 flex items-center justify-center"
                    style={{
                      background: 'var(--semantic-surface-base)',
                      border: '1px solid var(--semantic-border-medium)',
                      borderRadius: `${radius.value}px`,
                    }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Card
                    </span>
                  </div>
                </div>
                
                {/* Input preview */}
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Input
                  </p>
                  <input
                    type="text"
                    placeholder="Input"
                    className="w-full px-3 py-2"
                    style={{
                      background: 'var(--semantic-surface-base)',
                      border: '1px solid var(--semantic-border-medium)',
                      borderRadius: `${radius.value}px`,
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Full radius (pill shape) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Full Radius (Pill)
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {tokens.radius.full}
              </span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Used for pill-shaped buttons and badges
            </p>
            
            {/* Visual preview */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className="px-6 py-2"
                style={{
                  background: 'var(--semantic-primary)',
                  color: 'white',
                  borderRadius: tokens.radius.full,
                }}
              >
                Pill Button
              </button>
              
              <div
                className="px-4 py-1 inline-flex items-center justify-center"
                style={{
                  background: 'var(--semantic-primary-subtle)',
                  color: 'var(--semantic-primary)',
                  borderRadius: tokens.radius.full,
                  width: 'fit-content',
                }}
              >
                <span className="text-sm">Badge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
