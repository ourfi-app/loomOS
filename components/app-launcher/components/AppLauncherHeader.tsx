'use client';

import { MdClose } from 'react-icons/md';
import { cn } from '@/lib/utils';
import type { AppLauncherHeaderProps } from '../types';
import { AppSearchBar } from './AppSearchBar';
import { A11Y_LABELS } from '../utils/constants';

export function AppLauncherHeader({
  searchQuery,
  onSearchChange,
  onClose,
  totalApps,
}: AppLauncherHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3 flex-shrink-0">
      {/* Title */}
      <h2 
        className="text-xl sm:text-2xl font-light"
        style={{ color: 'var(--webos-text-primary)' }}
      >
        App Store
      </h2>

      {/* Search Bar */}
      <AppSearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onClear={() => onSearchChange('')}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label={A11Y_LABELS.closeButton}
        style={{ 
          backgroundColor: 'var(--webos-surface-hover)',
          color: 'var(--webos-icon-default)'
        }}
        className={cn(
          'p-2 sm:p-2.5 rounded-full',
          'hover:bg-[var(--webos-surface-active)]',
          'transition-colors',
          'flex-shrink-0'
        )}
        title="Close"
      >
        <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
