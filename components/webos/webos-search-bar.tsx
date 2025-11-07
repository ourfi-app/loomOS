
'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebOSSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export function WebOSSearchBar({
  value,
  onChange,
  placeholder = 'Search',
  onFocus,
  onBlur,
  className,
}: WebOSSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('webos-search-input', className)}>
      <Search className="webos-search-input-icon w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        placeholder={placeholder}
        className="webos-input"
      />
      {value && (
        <button
          onClick={handleClear}
          className="webos-search-input-clear"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
