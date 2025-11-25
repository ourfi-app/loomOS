'use client';

import { motion } from 'framer-motion';
import { MdSearch } from 'react-icons/md';
import { Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppEmptyStateProps } from '../types';
import { EMPTY_STATE_MESSAGES } from '../utils/constants';
import { emptyStateVariants } from '../utils/animations';

export function AppEmptyState({
  type,
  searchQuery,
  onClearSearch,
}: AppEmptyStateProps) {
  const getMessage = () => {
    return EMPTY_STATE_MESSAGES[type];
  };

  const getIcon = () => {
    switch (type) {
      case 'favorites':
        return <Star className="w-14 h-14 mb-4 opacity-20" />;
      case 'recent':
        return <Clock className="w-14 h-14 mb-4 opacity-20" />;
      case 'search':
      case 'category':
      default:
        return <MdSearch className="w-14 h-14 mb-4 opacity-20" />;
    }
  };

  const message = getMessage();

  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      style={{ color: 'var(--webos-text-tertiary)' }}
      className="flex flex-col items-center justify-center h-full text-center py-12"
    >
      {getIcon()}
      <p 
        className="text-lg font-medium mb-2" 
        style={{ color: 'var(--webos-text-secondary)' }}
      >
        {message.title}
      </p>
      <p className="text-sm max-w-xs">
        {message.description}
      </p>
      {type === 'search' && searchQuery && onClearSearch && (
        <button
          onClick={onClearSearch}
          style={{
            backgroundColor: 'var(--webos-surface-hover)',
            color: 'var(--webos-text-secondary)'
          }}
          className={cn(
            'mt-4 px-4 py-2 rounded-lg',
            'hover:bg-[var(--webos-surface-active)]',
            'text-sm transition-colors'
          )}
        >
          Clear Search
        </button>
      )}
    </motion.div>
  );
}
