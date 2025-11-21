'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loomOSTheme, animations } from '@/lib/loomos-design-system';
import { cn } from '@/lib/utils';

export interface SearchResult {
  id: string;
  type: 'app' | 'contact' | 'file' | 'action' | 'web' | 'recent';
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  action?: () => void;
  metadata?: Record<string, unknown>;
}

export interface JustTypeProps {
  onSearch?: (query: string) => SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showRecentSearches?: boolean;
}

/**
 * JustType
 *
 * The signature loomOS universal search feature.
 * Breaking down app silos by allowing users to search across:
 * - Applications
 * - Contacts
 * - Files
 * - Actions
 * - Web content
 * - Recent items
 *
 * Liberation principle: Users shouldn't need to remember which app
 * contains what they're looking for. Just type and find anything.
 */
export function JustType({
  onSearch,
  onResultSelect,
  placeholder = 'Just type to search apps, contacts, files...',
  className,
  autoFocus = false,
  showRecentSearches = true,
}: JustTypeProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches) {
      const saved = localStorage.getItem('loomos-recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, [showRecentSearches]);

  // Save recent search
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((q) => q !== searchQuery)].slice(0, 10);
      localStorage.setItem('loomos-recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle search query change
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(0);

      if (value.trim()) {
        // Perform search
        const searchResults = onSearch?.(value) || defaultSearch(value);
        setResults(searchResults);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    },
    [onSearch]
  );

  // Handle result selection
  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(query);
      onResultSelect?.(result);
      result.action?.();
      setQuery('');
      setResults([]);
      setIsOpen(false);
    },
    [query, saveRecentSearch, onResultSelect]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || results.length === 0) {
        if (e.key === 'Escape') {
          setQuery('');
          setIsOpen(false);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setQuery('');
          setResults([]);
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, selectedIndex, handleResultSelect]
  );

  // Focus input on mount if autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={cn('loomos-just-type relative', className)}>
      {/* Search Input */}
      <motion.div
        className="relative"
        variants={animations.searchBar}
        initial="initial"
        animate="animate"
      >
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--semantic-text-tertiary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'loomos-search-input w-full',
            'pl-12 pr-4 py-3',
            'bg-white border-2 border-[var(--semantic-border-light)]',
            'rounded-2xl',
            'text-base text-[var(--semantic-text-primary)] placeholder-gray-400',
            'focus:outline-none focus:border-[var(--semantic-primary)] focus:ring-4 focus:ring-blue-500/20',
            'transition-all duration-200',
            'shadow-lg'
          )}
        />

        {/* Clear Button */}
        {query && (
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-text-secondary)]"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            className={cn(
              'loomos-search-results absolute top-full mt-2 left-0 right-0',
              'bg-white rounded-2xl shadow-2xl border border-[var(--semantic-border-light)]',
              'overflow-hidden',
              'max-h-96 overflow-y-auto'
            )}
            style={{ zIndex: loomOSTheme.zIndex.popover }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {results.map((result, index) => (
              <SearchResultItem
                key={result.id}
                result={result}
                isSelected={index === selectedIndex}
                onClick={() => handleResultSelect(result)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches (when input is focused but empty) */}
      {showRecentSearches && !query && recentSearches.length > 0 && isOpen && (
        <AnimatePresence>
          <motion.div
            className={cn(
              'loomos-recent-searches absolute top-full mt-2 left-0 right-0',
              'bg-white rounded-2xl shadow-xl border border-[var(--semantic-border-light)]',
              'p-4'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="text-xs font-semibold text-[var(--semantic-text-tertiary)] mb-2">Recent Searches</div>
            <div className="space-y-1">
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--semantic-surface-hover)] text-sm text-[var(--semantic-text-secondary)]"
                  onClick={() => handleQueryChange(recent)}
                >
                  {recent}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

/**
 * SearchResultItem
 *
 * Individual search result item with icon, title, and subtitle
 */
interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

function SearchResultItem({ result, isSelected, onClick }: SearchResultItemProps) {
  const typeColors = {
    app: loomOSTheme.colors.accent,
    contact: loomOSTheme.colors.primary,
    file: loomOSTheme.colors.activity.notes,
    action: loomOSTheme.colors.success,
    web: loomOSTheme.colors.activity.email,
    recent: loomOSTheme.colors.chrome.light,
  };

  const typeLabels = {
    app: 'App',
    contact: 'Contact',
    file: 'File',
    action: 'Action',
    web: 'Web',
    recent: 'Recent',
  };

  return (
    <motion.button
      className={cn(
        'loomos-search-result w-full px-4 py-3 flex items-center gap-3',
        'hover:bg-[var(--semantic-bg-subtle)] transition-colors',
        'border-b border-[var(--semantic-border-light)] last:border-b-0',
        isSelected && 'bg-[var(--semantic-primary-subtle)]'
      )}
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: result.color || typeColors[result.type] }}
      >
        {result.icon || <DefaultIcon type={result.type} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="font-medium text-[var(--semantic-text-primary)] truncate">{result.title}</div>
        {result.subtitle && (
          <div className="text-sm text-[var(--semantic-text-tertiary)] truncate">{result.subtitle}</div>
        )}
      </div>

      {/* Type Badge */}
      <div className="text-xs font-medium text-[var(--semantic-text-tertiary)] uppercase tracking-wide flex-shrink-0">
        {typeLabels[result.type]}
      </div>
    </motion.button>
  );
}

/**
 * Default icon based on result type
 */
function DefaultIcon({ type }: { type: SearchResult['type'] }) {
  const icons = {
    app: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
      </svg>
    ),
    contact: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    file: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    action: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    web: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    recent: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return icons[type];
}

/**
 * Default search function (placeholder)
 * In a real implementation, this would search across all data sources
 */
function defaultSearch(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase();

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: 'email-app',
      type: 'app',
      title: 'Email',
      subtitle: 'Check your messages',
    },
    {
      id: 'calendar-app',
      type: 'app',
      title: 'Calendar',
      subtitle: 'View your schedule',
    },
    {
      id: 'tasks-app',
      type: 'app',
      title: 'Tasks',
      subtitle: 'Manage your todos',
    },
  ];

  return mockResults.filter(
    (result) =>
      result.title.toLowerCase().includes(lowerQuery) ||
      result.subtitle?.toLowerCase().includes(lowerQuery)
  );
}
