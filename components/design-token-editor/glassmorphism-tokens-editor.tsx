'use client';

import { useDesignTokenStore } from '@/lib/design-token-store';
import { Slider } from './slider';

export function GlassmorphismTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();

  const handleBlurChange = (key: string, value: number) => {
    updateTokenCategory('glassmorphism', { [key]: `${value}px` });
  };

  const handleSaturateChange = (value: number) => {
    updateTokenCategory('glassmorphism', { backdropSaturate: `saturate(${value}%)` });
  };

  const handleOpacityChange = (value: number) => {
    updateTokenCategory('glassmorphism', { glassOpacity: String(value / 100) });
  };

  const blurSm = parseInt(tokens.glassmorphism.blurSm);
  const blurMd = parseInt(tokens.glassmorphism.blurMd);
  const blurLg = parseInt(tokens.glassmorphism.blurLg);
  const blurXl = parseInt(tokens.glassmorphism.blurXl);
  const saturate = parseInt(tokens.glassmorphism.backdropSaturate.match(/\d+/)?.[0] || '180');
  const opacity = parseFloat(tokens.glassmorphism.glassOpacity) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Glassmorphism Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure blur, saturation, and opacity for glassmorphism effects
        </p>
      </div>

      {/* Blur Tokens */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Backdrop Blur
        </h3>
        
        <div className="space-y-6">
          {[
            { key: 'blurSm', label: 'Small Blur', value: blurSm, min: 4, max: 16 },
            { key: 'blurMd', label: 'Medium Blur', value: blurMd, min: 8, max: 20 },
            { key: 'blurLg', label: 'Large Blur', value: blurLg, min: 12, max: 32 },
            { key: 'blurXl', label: 'Extra Large Blur', value: blurXl, min: 16, max: 48 },
          ].map((blur) => (
            <div key={blur.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {blur.label}
                </label>
                <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {blur.value}px
                </span>
              </div>
              <Slider
                value={blur.value}
                onChange={(value) => handleBlurChange(blur.key, value)}
                min={blur.min}
                max={blur.max}
                step={1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop Saturation */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Backdrop Saturation
        </h3>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Saturation
            </label>
            <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
              {saturate}%
            </span>
          </div>
          <Slider
            value={saturate}
            onChange={handleSaturateChange}
            min={100}
            max={200}
            step={5}
          />
        </div>
      </div>

      {/* Glass Opacity */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Glass Opacity
        </h3>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Opacity
            </label>
            <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
              {opacity.toFixed(0)}%
            </span>
          </div>
          <Slider
            value={opacity}
            onChange={handleOpacityChange}
            min={0}
            max={100}
            step={5}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 'var(--radius-lg)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="p-8 rounded-lg"
          style={{
            background: `rgba(255, 255, 255, ${opacity / 100})`,
            backdropFilter: `blur(${blurXl}px) saturate(${saturate}%)`,
            border: '1px solid rgba(255, 255, 255, 0.5)',
            maxWidth: '400px',
          }}
        >
          <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Glassmorphism Preview
          </h4>
          <p style={{ color: 'var(--text-secondary)' }}>
            This card demonstrates the glassmorphism effect with your custom blur, saturation, and opacity values.
          </p>
        </div>
      </div>
    </div>
  );
}
