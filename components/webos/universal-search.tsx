'use client';

import { useState, useEffect, useRef } from 'react';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { 
  Search, 
  X, 
  Home,
  Users,
  FileText,
  Zap,
  Mail,
  Calendar,
  CreditCard,
  Settings,
  MessageSquare,
  Building,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

// Search result interface
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: 'Apps' | 'Contacts' | 'Content' | 'Actions';
  icon: any;
  path?: string;
  action?: () => void;
}

// Tab types
type SearchTab = 'ALL' | 'APPS' | 'CONTACTS' | 'CONTENT' | 'ACTIONS';

export function UniversalSearch() {
  const { isOpen, closeSearch } = useUniversalSearch();
  const { data: session } = useSession() || {};
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Mock search data - Replace with real search functionality
  const allSearchResults: SearchResult[] = [
    // Apps
    { id: 'home', title: 'Dashboard', description: 'Return to home', category: 'Apps', icon: Home, path: '/dashboard' },
    { id: 'directory', title: 'Residents Directory', description: 'View all residents', category: 'Apps', icon: Users, path: '/dashboard/directory' },
    { id: 'documents', title: 'Documents', description: 'Browse documents', category: 'Apps', icon: FileText, path: '/dashboard/documents' },
    { id: 'payments', title: 'Payments', description: 'Manage payments', category: 'Apps', icon: CreditCard, path: '/dashboard/payments' },
    { id: 'messages', title: 'Messages', description: 'View messages', category: 'Apps', icon: MessageSquare, path: '/dashboard/messages' },
    { id: 'calendar', title: 'Calendar', description: 'View calendar', category: 'Apps', icon: Calendar, path: '/dashboard/apps/calendar' },
    { id: 'email', title: 'Email', description: 'Check email', category: 'Apps', icon: Mail, path: '/dashboard/apps/email' },
    { id: 'marketplace', title: 'Marketplace', description: 'Browse marketplace', category: 'Apps', icon: Building, path: '/dashboard/marketplace' },
    { id: 'settings', title: 'Settings', description: 'App settings', category: 'Apps', icon: Settings, path: '/dashboard/profile' },
    
    // Contacts
    { id: 'contact1', title: 'John Smith', description: 'Unit 101 • john@example.com', category: 'Contacts', icon: Users },
    { id: 'contact2', title: 'Sarah Johnson', description: 'Unit 205 • sarah@example.com', category: 'Contacts', icon: Users },
    { id: 'contact3', title: 'Mike Davis', description: 'Unit 312 • mike@example.com', category: 'Contacts', icon: Users },
    
    // Content
    { id: 'doc1', title: 'Building Rules', description: 'Community guidelines', category: 'Content', icon: FileText, path: '/dashboard/documents' },
    { id: 'doc2', title: 'Meeting Minutes', description: 'Board meeting notes', category: 'Content', icon: FileText, path: '/dashboard/documents' },
    { id: 'doc3', title: 'Maintenance Schedule', description: 'Upcoming maintenance', category: 'Content', icon: FileText, path: '/dashboard/documents' },
    
    // Actions
    { id: 'action1', title: 'New Message', description: 'Send a message', category: 'Actions', icon: MessageSquare, action: () => router.push('/dashboard/messages') },
    { id: 'action2', title: 'Make Payment', description: 'Pay your dues', category: 'Actions', icon: CreditCard, action: () => router.push('/dashboard/payments') },
    { id: 'action3', title: 'Book Amenity', description: 'Reserve facility', category: 'Actions', icon: Calendar, action: () => router.push('/dashboard/marketplace') },
    { id: 'action4', title: 'View Notifications', description: 'Check alerts', category: 'Actions', icon: Bell, action: () => router.push('/dashboard/notifications') },
  ];

  // Filter results based on query and active tab
  const getFilteredResults = () => {
    let filtered = allSearchResults;

    // Filter by tab
    if (activeTab !== 'ALL') {
      filtered = filtered.filter(result => result.category === activeTab.charAt(0) + activeTab.slice(1).toLowerCase());
    }

    // Filter by query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(lowerQuery) ||
        result.description?.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  };

  const filteredResults = getFilteredResults();

  // Group results by category for ALL tab
  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.path) {
      router.push(result.path);
    }
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    closeSearch();
    setQuery('');
    setSelectedIndex(0);
    setActiveTab('ALL');
  };

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="webos-just-type-backdrop"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="webos-just-type-modal">
        {/* Search Input */}
        <div className="webos-just-type-header">
          <div className="flex items-center flex-1 gap-3">
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--webos-text-secondary)' }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Just type..."
              className="webos-just-type-input"
            />
          </div>
          <button
            onClick={handleClose}
            className="webos-just-type-close"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="webos-just-type-tabs">
          {(['ALL', 'APPS', 'CONTACTS', 'CONTENT', 'ACTIONS'] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'webos-just-type-tab',
                activeTab === tab && 'webos-just-type-tab-active'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="webos-just-type-results">
          {filteredResults.length === 0 ? (
            <div className="webos-just-type-empty">
              <Search className="w-16 h-16 mb-4" style={{ color: 'var(--webos-text-muted)' }} />
              <p className="text-base font-light" style={{ color: 'var(--webos-text-primary)' }}>
                {query.trim() ? 'No results found' : 'Start typing to search...'}
              </p>
              <p className="text-sm font-light mt-2" style={{ color: 'var(--webos-text-secondary)' }}>
                {query.trim() ? 'Try a different search term' : 'Search apps, contacts, documents, and more'}
              </p>
            </div>
          ) : activeTab === 'ALL' ? (
            // Show grouped results for ALL tab
            <div className="webos-just-type-results-list">
              {Object.entries(groupedResults).map(([category, results]) => (
                <div key={category} className="webos-just-type-category">
                  <div className="webos-just-type-category-title">{category.toUpperCase()}</div>
                  {results.map((result, index) => {
                    const globalIndex = filteredResults.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          'webos-just-type-result',
                          selectedIndex === globalIndex && 'webos-just-type-result-selected'
                        )}
                      >
                        <div className="webos-just-type-result-icon">
                          <result.icon className="w-5 h-5" />
                        </div>
                        <div className="webos-just-type-result-content">
                          <div className="webos-just-type-result-title">{result.title}</div>
                          {result.description && (
                            <div className="webos-just-type-result-description">{result.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            // Show flat list for specific tab
            <div className="webos-just-type-results-list">
              {filteredResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    'webos-just-type-result',
                    selectedIndex === index && 'webos-just-type-result-selected'
                  )}
                >
                  <div className="webos-just-type-result-icon">
                    <result.icon className="w-5 h-5" />
                  </div>
                  <div className="webos-just-type-result-content">
                    <div className="webos-just-type-result-title">{result.title}</div>
                    {result.description && (
                      <div className="webos-just-type-result-description">{result.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard Hints */}
        <div className="webos-just-type-footer">
          <div className="text-xs font-light" style={{ color: 'var(--webos-text-tertiary)' }}>
            <kbd className="webos-kbd">↑</kbd>
            <kbd className="webos-kbd">↓</kbd>
            <span className="mx-2">to navigate</span>
            <kbd className="webos-kbd">Enter</kbd>
            <span className="mx-2">to select</span>
            <kbd className="webos-kbd">Esc</kbd>
            <span className="mx-2">to close</span>
          </div>
        </div>
      </div>
    </>
  );
}
