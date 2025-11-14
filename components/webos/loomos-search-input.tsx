'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface LoomOSSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LoomOSSearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}: LoomOSSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--semantic-text-tertiary)]" size={16} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border border-[var(--semantic-border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-text-secondary)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
