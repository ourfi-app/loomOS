'use client';

import { useDesignTokenStore } from '@/lib/design-token-store';
import { Slider } from './slider';

export function TypographyTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();

  const handleFontSizeChange = (value: number) => {
    updateTokenCategory('typography', { baseFontSize: `${value}px` });
  };

  const handleWeightChange = (key: string, value: number) => {
    updateTokenCategory('typography', { [key]: String(value) });
  };

  const handleLineHeightChange = (key: string, value: number) => {
    updateTokenCategory('typography', { [key]: String(value) });
  };

  const baseFontSize = parseInt(tokens.typography.baseFontSize);
  const fontWeightNormal = parseInt(tokens.typography.fontWeightNormal);
  const fontWeightMedium = parseInt(tokens.typography.fontWeightMedium);
  const fontWeightBold = parseInt(tokens.typography.fontWeightBold);
  const lineHeightNormal = parseFloat(tokens.typography.lineHeightNormal);
  const lineHeightRelaxed = parseFloat(tokens.typography.lineHeightRelaxed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Typography Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure font sizes, weights, and line heights
        </p>
      </div>

      {/* Font Sizes */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Font Size
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Base Font Size
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {baseFontSize}px
              </span>
            </div>
            <Slider
              value={baseFontSize}
              onChange={handleFontSizeChange}
              min={12}
              max={20}
              step={1}
            />
            <p
              className="mt-2"
              style={{
                fontSize: `${baseFontSize}px`,
                color: 'var(--text-primary)',
              }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Font Weights
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Normal Weight
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {fontWeightNormal}
              </span>
            </div>
            <Slider
              value={fontWeightNormal}
              onChange={(value) => handleWeightChange('fontWeightNormal', value)}
              min={100}
              max={900}
              step={100}
            />
            <p
              className="mt-2"
              style={{
                fontWeight: fontWeightNormal,
                color: 'var(--text-primary)',
              }}
            >
              Normal text weight
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Medium Weight
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {fontWeightMedium}
              </span>
            </div>
            <Slider
              value={fontWeightMedium}
              onChange={(value) => handleWeightChange('fontWeightMedium', value)}
              min={100}
              max={900}
              step={100}
            />
            <p
              className="mt-2"
              style={{
                fontWeight: fontWeightMedium,
                color: 'var(--text-primary)',
              }}
            >
              Medium text weight
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Bold Weight
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {fontWeightBold}
              </span>
            </div>
            <Slider
              value={fontWeightBold}
              onChange={(value) => handleWeightChange('fontWeightBold', value)}
              min={100}
              max={900}
              step={100}
            />
            <p
              className="mt-2"
              style={{
                fontWeight: fontWeightBold,
                color: 'var(--text-primary)',
              }}
            >
              Bold text weight
            </p>
          </div>
        </div>
      </div>

      {/* Line Heights */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Line Heights
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Normal Line Height
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {lineHeightNormal.toFixed(2)}
              </span>
            </div>
            <Slider
              value={lineHeightNormal * 100}
              onChange={(value) => handleLineHeightChange('lineHeightNormal', value / 100)}
              min={100}
              max={200}
              step={5}
            />
            <p
              className="mt-2"
              style={{
                lineHeight: lineHeightNormal,
                color: 'var(--text-primary)',
              }}
            >
              This is a multi-line text example to show how line height affects readability.
              The spacing between lines should be comfortable and easy to read.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Relaxed Line Height
              </label>
              <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {lineHeightRelaxed.toFixed(2)}
              </span>
            </div>
            <Slider
              value={lineHeightRelaxed * 100}
              onChange={(value) => handleLineHeightChange('lineHeightRelaxed', value / 100)}
              min={100}
              max={250}
              step={5}
            />
            <p
              className="mt-2"
              style={{
                lineHeight: lineHeightRelaxed,
                color: 'var(--text-primary)',
              }}
            >
              This is a multi-line text example with relaxed line height.
              This is typically used for long-form content where extra breathing room improves readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
