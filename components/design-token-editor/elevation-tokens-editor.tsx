'use client';

import { useDesignTokenStore } from '@/lib/design-token-store';

export function ElevationTokensEditor() {
  const { tokens, updateTokenCategory } = useDesignTokenStore();

  const handleShadowChange = (key: string, value: string) => {
    updateTokenCategory('elevation', { [key]: value });
  };

  const shadowTokens = [
    { key: 'shadowSm', label: 'Small Shadow', preset: '0 2px 4px rgba(0, 0, 0, 0.08)' },
    { key: 'shadowMd', label: 'Medium Shadow', preset: '0 4px 12px rgba(0, 0, 0, 0.12)' },
    { key: 'shadowLg', label: 'Large Shadow', preset: '0 8px 24px rgba(0, 0, 0, 0.15)' },
    { key: 'shadowXl', label: 'Extra Large Shadow', preset: '0 16px 48px rgba(0, 0, 0, 0.18)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Elevation Tokens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure shadow values for depth and elevation
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
          {shadowTokens.map((token) => {
            const currentValue = tokens.elevation[token.key as keyof typeof tokens.elevation];
            
            return (
              <div key={token.key}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {token.label}
                </label>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => handleShadowChange(token.key, e.target.value)}
                    className="w-full px-3 py-2 rounded border font-mono text-sm"
                    style={{
                      background: 'var(--semantic-surface-base)',
                      border: '1px solid var(--semantic-border-medium)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder={token.preset}
                  />
                  
                  <button
                    onClick={() => handleShadowChange(token.key, token.preset)}
                    className="text-xs px-3 py-1 rounded"
                    style={{
                      background: 'transparent',
                      color: 'var(--semantic-primary)',
                      border: '1px solid var(--semantic-border-medium)',
                    }}
                  >
                    Reset to preset
                  </button>
                  
                  {/* Visual preview */}
                  <div
                    className="w-full h-32 rounded flex items-center justify-center"
                    style={{
                      background: 'var(--semantic-surface-base)',
                      boxShadow: currentValue,
                    }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Shadow Preview
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
