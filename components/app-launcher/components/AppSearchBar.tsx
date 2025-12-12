'use client';

import { MdSearch, MdClear } from 'react-icons/md';
import { cn } from '@/lib/utils';
import type { AppSearchBarProps } from '../types';
import { SEARCH_CONFIG, A11Y_LABELS } from '../utils/constants';

export function AppSearchBar({
  value,
  onChange,
  onClear,
  placeholder = SEARCH_CONFIG.placeholder,
  autoFocus = true,
  className,
}: AppSearchBarProps) {
  return (
    <div className={cn('relative flex-1', className)}>
      <MdSearch 
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" 
        style={{ color: 'var(--webos-icon-default)' }}
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        aria-label={A11Y_LABELS.searchInput}
        style={{
          backgroundColor: 'var(--glass-white-95)',
          borderColor: 'var(--glass-black-15)',
          color: 'var(--chrome-dark)',
        }}
        className={cn(
          'w-full h-10 sm:h-11',
          'pl-10 pr-10',
          'rounded-full border',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          'transition-all',
          'placeholder:text-gray-500'
        )}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label={A11Y_LABELS.clearSearch}
          style={{ color: 'var(--webos-icon-default)' }}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'p-1.5 rounded-full',
            'hover:bg-gray-100',
            'transition-colors'
          )}
        >
          <MdClear className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
