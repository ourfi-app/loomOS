
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Command, Clock, Star, Zap, FileText, Users, 
  Calendar, MessageSquare, Settings, TrendingUp, ArrowRight,
  Sparkles, Hash, AtSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllApps, searchApps, type AppDefinition } from '@/lib/enhanced-app-registry';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'app' | 'action' | 'contact' | 'document' | 'suggestion';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  gradient?: string;
  score?: number;
}

interface IntelligentSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntelligentSearch({ isOpen, onClose }: IntelligentSearchProps) {
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Get current time for context-aware suggestions
  const currentHour = new Date().getHours();
  const isWorkingHours = currentHour >= 9 && currentHour < 17;
  const isEvening = currentHour >= 17 || currentHour < 6;

  // Get context-aware suggestions
  const getContextSuggestions = useCallback((): SearchResult[] => {
    const suggestions: SearchResult[] = [];
    
    if (isWorkingHours) {
      suggestions.push({
        id: 'suggest-calendar',
        type: 'suggestion',
        title: 'Check Today\'s Schedule',
        subtitle: 'You have 2 upcoming meetings',
        icon: <Calendar className="w-5 h-5 text-[var(--semantic-primary)]" />,
        action: () => router.push('/dashboard/apps/calendar'),
        score: 0.9,
      });
    }
    
    if (isEvening) {
      suggestions.push({
        id: 'suggest-messages',
        type: 'suggestion',
        title: 'Catch up on Messages',
        subtitle: '3 unread conversations',
        icon: <MessageSquare className="w-5 h-5 text-[var(--semantic-accent)]" />,
        action: () => router.push('/dashboard/messages'),
        score: 0.85,
      });
    }

    // Add trending suggestions
    suggestions.push({
      id: 'suggest-directory',
      type: 'suggestion',
      title: 'Browse Resident Directory',
      subtitle: 'Connect with your neighbors',
      icon: <Users className="w-5 h-5 text-teal-400" />,
      action: () => router.push('/dashboard/directory'),
      score: 0.7,
    });

    return suggestions;
  }, [isWorkingHours, isEvening, router]);

  // Quick actions
  const quickActions: SearchResult[] = useMemo(() => [
    {
      id: 'action-new-message',
      type: 'action',
      title: 'Send New Message',
      subtitle: 'Start a conversation',
      icon: <MessageSquare className="w-5 h-5 text-[var(--semantic-accent)]" />,
      action: () => {
        router.push('/dashboard/messages');
        onClose();
      },
    },
    {
      id: 'action-create-task',
      type: 'action',
      title: 'Create Task',
      subtitle: 'Add to your to-do list',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      action: () => {
        router.push('/dashboard/apps/tasks');
        onClose();
      },
    },
    {
      id: 'action-book-amenity',
      type: 'action',
      title: 'Book Amenity',
      subtitle: 'Reserve community spaces',
      icon: <Calendar className="w-5 h-5 text-[var(--semantic-primary)]" />,
      action: () => {
        router.push('/dashboard/building-services');
        onClose();
      },
    },
    {
      id: 'action-view-docs',
      type: 'action',
      title: 'View Documents',
      subtitle: 'Access community files',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      action: () => {
        router.push('/dashboard/documents');
        onClose();
      },
    },
  ], [router, onClose]);

  // Search results
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) {
      return [...getContextSuggestions(), ...quickActions].slice(0, 8);
    }

    const results: SearchResult[] = [];
    
    // Search apps
    const apps = searchApps(query);
    results.push(...apps.slice(0, 5).map((app): SearchResult => ({
      id: app.id,
      type: 'app',
      title: app.title,
      subtitle: app.description,
      icon: <app.icon className="w-5 h-5" />,
      action: () => {
        router.push(app.path);
        addToRecentSearches(query);
        onClose();
      },
      gradient: app.gradient,
      score: 1.0,
    })));

    // Add quick actions if they match
    const matchingActions = quickActions.filter(action => 
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
    results.push(...matchingActions);

    // Sort by score
    return results.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [query, getContextSuggestions, quickActions, router, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const selectedResult = searchResults[selectedIndex];
        if (selectedResult) {
          e.preventDefault();
          selectedResult.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-start justify-center pt-32"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Box */}
          <div className="bg-background/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search apps, actions, and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-lg text-foreground placeholder-muted-foreground outline-none"
                autoFocus
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded text-[10px] font-mono">Esc</kbd>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!query && recentSearches.length > 0 && (
                <div className="px-5 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Recent</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 ? (
                <div className="px-5 py-12 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No results found</p>
                </div>
              ) : (
                <div className="py-2">
                  {!query && (
                    <div className="px-5 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Suggested for You</span>
                      </div>
                    </div>
                  )}
                  {searchResults.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={result.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-4 px-5 py-3 transition-all",
                        index === selectedIndex 
                          ? "bg-primary/10 border-l-2 border-primary" 
                          : "hover:bg-muted/50 border-l-2 border-transparent"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        result.gradient 
                          ? `bg-gradient-to-br ${result.gradient}` 
                          : "bg-muted"
                      )}>
                        {result.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {result.title}
                        </div>
                        {result.subtitle && (
                          <div className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                      {result.type === 'suggestion' && (
                        <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                      {result.type === 'action' && (
                        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↵</kbd>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-4 px-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                <span>Search by tag</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AtSign className="w-3 h-3" />
                <span>Find contacts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Command className="w-3 h-3" />
                <span>Use commands</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
