'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebOSJustTypeSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showLabel?: boolean;
}

/**
 * WebOS "Just Type" Search Component
 * 
 * A minimalist search bar inspired by the classic webOS interface.
 * Features:
 * - Clean, simple design with rounded corners
 * - "JUST TYPE" label above search bar
 * - Subtle shadow and focus effects
 * - Fully accessible
 */
export function WebOSJustTypeSearch({
  onSearch,
  placeholder = "Just type to search...",
  className,
  showLabel = true
}: WebOSJustTypeSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  // Focus on mount for immediate typing
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("webos-search-container", className)}>
      {showLabel && (
        <div className="webos-search-label">
          JUST TYPE
        </div>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "webos-search-bar",
            isFocused && "ring-2 ring-webos-accent-blue"
          )}
          aria-label="Search"
        />
        <Search 
          className="webos-search-icon" 
          size={20}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * Minimal Search Bar (without label)
 * Use this for in-app search functionality
 */
export function WebOSSearchBar({
  onSearch,
  placeholder = "Search...",
  className
}: Omit<WebOSJustTypeSearchProps, 'showLabel'>) {
  return (
    <WebOSJustTypeSearch
      onSearch={onSearch}
      placeholder={placeholder}
      className={className}
      showLabel={false}
    />
  );
}
