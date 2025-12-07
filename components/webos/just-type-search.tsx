'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { 
  Search, 
  X, 
  Command,
  ArrowUp,
  ArrowDown,
  CornerDownLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Category type for filtering
type CategoryType = 'ALL' | 'Navigation' | 'Financial' | 'Documents' | 'Communication' | 'Apps' | 'Settings' | 'Admin';

export function JustTypeSearch() {
  const { isOpen, closeSearch, search, searchableItems, initialQuery } = useUniversalSearch();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get unique categories
  const categories = ['ALL', ...new Set(searchableItems.map(item => item.category))];

  // Filter and search results
  const getFilteredResults = useCallback(() => {
    let results = query.trim() ? search(query) : searchableItems;
    
    if (activeCategory !== 'ALL') {
      results = results.filter(item => item.category === activeCategory);
    }
    
    return results;
  }, [query, activeCategory, search, searchableItems]);

  const filteredResults = getFilteredResults();

  // Group results by category for ALL tab
  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, typeof filteredResults>);

  // Handle result click
  const handleResultClick = useCallback((result: typeof filteredResults[0]) => {
    if (result.action) {
      result.action();
    } else if (result.path) {
      router.push(result.path);
    }
    closeSearch();
    setQuery('');
    setSelectedIndex(0);
    setActiveCategory('ALL');
  }, [router, closeSearch]);

  // Handle close
  const handleClose = useCallback(() => {
    closeSearch();
    setQuery('');
    setSelectedIndex(0);
    setActiveCategory('ALL');
  }, [closeSearch]);

  // Focus input when opened and set initial query
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleResultClick(filteredResults[selectedIndex]);
          }
          break;
        case 'Tab':
          e.preventDefault();
          // Cycle through categories
          const currentIndex = categories.indexOf(activeCategory);
          const nextIndex = (currentIndex + 1) % categories.length;
          setActiveCategory(categories[nextIndex] as CategoryType);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, activeCategory, categories, handleClose, handleResultClick]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="just-type-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Search Container - Anchored to top */}
      <div className="just-type-container">
        {/* Search Bar */}
        <div className="just-type-search-bar">
          <div className="just-type-search-input-wrapper">
            <Search className="just-type-search-icon" size={20} aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Just type to search apps, contacts, files, and more..."
              className="just-type-input"
              aria-label="Universal search"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="just-type-clear-button"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="just-type-close-button"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="just-type-categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as CategoryType)}
              className={cn(
                'just-type-category-tab',
                activeCategory === category && 'just-type-category-tab-active'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="just-type-results" ref={resultsRef}>
          {filteredResults.length === 0 ? (
            <div className="just-type-empty">
              <Search className="just-type-empty-icon" size={48} />
              <p className="just-type-empty-title">
                {query.trim() ? 'No results found' : 'Start typing to search...'}
              </p>
              <p className="just-type-empty-description">
                {query.trim() 
                  ? 'Try different keywords or browse by category' 
                  : 'Search for apps, contacts, documents, and more'}
              </p>
            </div>
          ) : activeCategory === 'ALL' ? (
            // Show grouped results for ALL tab
            <div className="just-type-results-list">
              {Object.entries(groupedResults).map(([category, results]) => (
                <div key={category} className="just-type-category-group">
                  <div className="just-type-category-title">{category}</div>
                  {results.map((result) => {
                    const globalIndex = filteredResults.indexOf(result);
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        data-index={globalIndex}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          'just-type-result-item',
                          selectedIndex === globalIndex && 'just-type-result-item-selected'
                        )}
                      >
                        <div className="just-type-result-icon">
                          {Icon && <Icon size={20} />}
                        </div>
                        <div className="just-type-result-content">
                          <div className="just-type-result-title">{result.title}</div>
                          {result.description && (
                            <div className="just-type-result-description">{result.description}</div>
                          )}
                        </div>
                        {selectedIndex === globalIndex && (
                          <div className="just-type-result-badge">
                            <CornerDownLeft size={14} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            // Show flat list for specific category
            <div className="just-type-results-list">
              {filteredResults.map((result, index) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.id}
                    data-index={index}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      'just-type-result-item',
                      selectedIndex === index && 'just-type-result-item-selected'
                    )}
                  >
                    <div className="just-type-result-icon">
                      {Icon && <Icon size={20} />}
                    </div>
                    <div className="just-type-result-content">
                      <div className="just-type-result-title">{result.title}</div>
                      {result.description && (
                        <div className="just-type-result-description">{result.description}</div>
                      )}
                    </div>
                    {selectedIndex === index && (
                      <div className="just-type-result-badge">
                        <CornerDownLeft size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Keyboard Hints */}
        <div className="just-type-footer">
          <div className="just-type-keyboard-hints">
            <span className="just-type-hint">
              <kbd className="just-type-kbd"><ArrowUp size={12} /></kbd>
              <kbd className="just-type-kbd"><ArrowDown size={12} /></kbd>
              <span className="just-type-hint-text">Navigate</span>
            </span>
            <span className="just-type-hint">
              <kbd className="just-type-kbd"><CornerDownLeft size={12} /></kbd>
              <span className="just-type-hint-text">Select</span>
            </span>
            <span className="just-type-hint">
              <kbd className="just-type-kbd">Tab</kbd>
              <span className="just-type-hint-text">Category</span>
            </span>
            <span className="just-type-hint">
              <kbd className="just-type-kbd">Esc</kbd>
              <span className="just-type-hint-text">Close</span>
            </span>
          </div>
          <div className="just-type-shortcut-hint">
            <kbd className="just-type-kbd">
              <Command size={12} />
            </kbd>
            <kbd className="just-type-kbd">K</kbd>
            <span className="just-type-hint-text">to open</span>
          </div>
        </div>
      </div>
    </>
  );
}
