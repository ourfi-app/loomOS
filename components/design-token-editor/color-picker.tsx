'use client';

import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <div className="flex gap-2">
        {/* Color swatch */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 rounded border-2 cursor-pointer transition-transform hover:scale-105"
          style={{
            backgroundColor: value,
            borderColor: 'var(--semantic-border-medium)',
          }}
        />
        
        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded border"
          style={{
            background: 'var(--semantic-surface-base)',
            border: '1px solid var(--semantic-border-medium)',
            color: 'var(--text-primary)',
          }}
          placeholder="#000000"
        />
      </div>
      
      {/* Native color picker */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-10">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 h-32 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
