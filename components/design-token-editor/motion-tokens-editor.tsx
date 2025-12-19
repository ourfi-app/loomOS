'use client';

import { useState } from 'react';
import { useDesignTokenStore } from '@/lib/design-token-store';
import { Slider } from './slider';

export function MotionTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDurationChange = (key: string, value: number) => {
    updateTokenCategory('motion', { [key]: `${value}ms` });
  };

  const handleEasingChange = (key: string, value: string) => {
    updateTokenCategory('motion', { [key]: value });
  };

  const durationFast = parseInt(tokens.motion.durationFast);
  const durationNormal = parseInt(tokens.motion.durationNormal);
  const durationSlow = parseInt(tokens.motion.durationSlow);

  const easingPresets = [
    { label: 'Standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    { label: 'Spring', value: 'cubic-bezier(0.42, 0, 0.58, 1)' },
    { label: 'Ease In', value: 'cubic-bezier(0.4, 0, 1, 1)' },
    { label: 'Ease Out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
    { label: 'Ease In Out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    { label: 'Linear', value: 'linear' },
  ];

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), Math.max(durationFast, durationNormal, durationSlow));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Motion Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure animation durations and easing functions
        </p>
      </div>

      {/* Duration Tokens */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Animation Duration
        </h3>
        
        <div className="space-y-6">
          {[
            { key: 'durationFast', label: 'Fast Duration', value: durationFast, min: 50, max: 300 },
            { key: 'durationNormal', label: 'Normal Duration', value: durationNormal, min: 100, max: 400 },
            { key: 'durationSlow', label: 'Slow Duration', value: durationSlow, min: 200, max: 600 },
          ].map((duration) => (
            <div key={duration.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {duration.label}
                </label>
                <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {duration.value}ms
                </span>
              </div>
              <Slider
                value={duration.value}
                onChange={(value) => handleDurationChange(duration.key, value)}
                min={duration.min}
                max={duration.max}
                step={10}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Easing Functions */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Easing Functions
        </h3>
        
        <div className="space-y-6">
          {['easeStandard', 'easeSpring'].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {key === 'easeStandard' ? 'Standard Easing' : 'Spring Easing'}
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {easingPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleEasingChange(key, preset.value)}
                    className="px-3 py-2 rounded text-sm transition-all"
                    style={{
                      background: tokens.motion[key as keyof typeof tokens.motion] === preset.value
                        ? 'var(--semantic-primary)'
                        : 'transparent',
                      color: tokens.motion[key as keyof typeof tokens.motion] === preset.value
                        ? 'white'
                        : 'var(--text-primary)',
                      border: '1px solid var(--semantic-border-medium)',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              
              <input
                type="text"
                value={tokens.motion[key as keyof typeof tokens.motion]}
                onChange={(e) => handleEasingChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded border font-mono text-sm"
                style={{
                  background: 'var(--semantic-surface-base)',
                  border: '1px solid var(--semantic-border-medium)',
                  color: 'var(--text-primary)',
                }}
                placeholder="cubic-bezier(0.4, 0, 0.2, 1)"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animation Preview */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--semantic-surface-base)',
          border: '1px solid var(--semantic-border-light)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Animation Preview
        </h3>
        
        <button
          onClick={triggerAnimation}
          className="px-4 py-2 rounded mb-6"
          style={{
            background: 'var(--semantic-primary)',
            color: 'white',
          }}
        >
          Trigger Animations
        </button>
        
        <div className="space-y-6">
          {/* Fast animation */}
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Fast ({durationFast}ms)
            </p>
            <div
              className="h-12 rounded flex items-center justify-center"
              style={{
                background: 'var(--semantic-primary)',
                transform: isAnimating ? 'translateX(200px)' : 'translateX(0)',
                transition: `transform ${durationFast}ms ${tokens.motion.easeStandard}`,
                maxWidth: 'calc(100% - 200px)',
              }}
            >
              <span className="text-white text-sm">Fast</span>
            </div>
          </div>
          
          {/* Normal animation */}
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Normal ({durationNormal}ms)
            </p>
            <div
              className="h-12 rounded flex items-center justify-center"
              style={{
                background: 'var(--semantic-accent)',
                transform: isAnimating ? 'translateX(200px)' : 'translateX(0)',
                transition: `transform ${durationNormal}ms ${tokens.motion.easeStandard}`,
                maxWidth: 'calc(100% - 200px)',
              }}
            >
              <span className="text-white text-sm">Normal</span>
            </div>
          </div>
          
          {/* Slow animation */}
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Slow ({durationSlow}ms)
            </p>
            <div
              className="h-12 rounded flex items-center justify-center"
              style={{
                background: 'var(--semantic-tertiary)',
                transform: isAnimating ? 'translateX(200px)' : 'translateX(0)',
                transition: `transform ${durationSlow}ms ${tokens.motion.easeSpring}`,
                maxWidth: 'calc(100% - 200px)',
              }}
            >
              <span className="text-white text-sm">Slow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
