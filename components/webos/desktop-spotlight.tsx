
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Clock, Zap, FileText, MessageSquare, 
  CheckSquare, Users, Calendar, Settings, Camera,
  Moon, Sun, Layout, Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SpotlightResult {
  id: string;
  type: 'app' | 'document' | 'action' | 'recent' | 'suggestion';
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  keyboard?: string;
}

interface DesktopSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopSpotlight({ isOpen, onClose }: DesktopSpotlightProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotlightResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Generate results based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent and suggestions when empty
      setResults([
        {
          id: 'recent-messages',
          type: 'recent',
          title: 'Messages App',
          subtitle: 'Recently opened',
          icon: MessageSquare,
          action: () => router.push('/dashboard/messages'),
        },
        {
          id: 'recent-tasks',
          type: 'recent',
          title: 'Tasks: Review Q4 Budget',
          subtitle: 'Recently viewed',
          icon: CheckSquare,
          action: () => router.push('/dashboard'),
        },
        {
          id: 'recent-doc',
          type: 'recent',
          title: 'Document: Board Meeting Notes.pdf',
          subtitle: 'Recently opened',
          icon: FileText,
          action: () => router.push('/dashboard/documents'),
        },
        {
          id: 'suggest-settings',
          type: 'suggestion',
          title: 'Open System Settings',
          subtitle: 'Configure your system',
          icon: Settings,
          action: () => router.push('/dashboard/system-settings'),
        },
        {
          id: 'suggest-new-task',
          type: 'suggestion',
          title: 'Create New Task',
          subtitle: 'Quick action',
          icon: Plus,
          keyboard: 'Ctrl+T',
        },
      ]);
      return;
    }
    
    // Search through all possible results
    const allResults: SpotlightResult[] = [
      // Apps
      {
        id: 'app-messages',
        type: 'app',
        title: 'Messages',
        subtitle: 'Send and receive messages',
        icon: MessageSquare,
        action: () => router.push('/dashboard/messages'),
      },
      {
        id: 'app-tasks',
        type: 'app',
        title: 'Tasks',
        subtitle: 'Manage your tasks',
        icon: CheckSquare,
        action: () => router.push('/dashboard'),
      },
      {
        id: 'app-documents',
        type: 'app',
        title: 'Documents',
        subtitle: 'View and manage files',
        icon: FileText,
        action: () => router.push('/dashboard/documents'),
      },
      {
        id: 'app-directory',
        type: 'app',
        title: 'Directory',
        subtitle: 'Contact residents',
        icon: Users,
        action: () => router.push('/dashboard/directory'),
      },
      {
        id: 'app-calendar',
        type: 'app',
        title: 'Calendar',
        subtitle: 'Events and appointments',
        icon: Calendar,
        action: () => router.push('/dashboard'),
      },
      {
        id: 'app-settings',
        type: 'app',
        title: 'Settings',
        subtitle: 'System configuration',
        icon: Settings,
        action: () => router.push('/dashboard/system-settings'),
      },
      // Quick Actions
      {
        id: 'action-screenshot',
        type: 'action',
        title: 'Take Screenshot',
        subtitle: 'Capture your screen',
        icon: Camera,
        keyboard: 'Ctrl+Shift+4',
      },
      {
        id: 'action-dark-mode',
        type: 'action',
        title: 'Toggle Dark Mode',
        subtitle: 'Switch theme',
        icon: Moon,
      },
      {
        id: 'action-show-windows',
        type: 'action',
        title: 'Show All Windows',
        subtitle: 'Exposé view',
        icon: Layout,
        keyboard: 'Ctrl+Shift+A',
      },
    ];
    
    // Filter results based on query
    const filtered = allResults.filter(result => {
      const searchText = `${result.title} ${result.subtitle || ''}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    setResults(filtered);
    setSelectedIndex(0);
  }, [query, router]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          e.preventDefault();
          const selectedResult = results[selectedIndex];
          if (selectedResult) {
            selectedResult.action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);
  
  const getResultIcon = (result: SpotlightResult) => {
    const Icon = result.icon;
    return <Icon className="h-5 w-5" />;
  };
  
  const getResultBadge = (type: string) => {
    switch (type) {
      case 'recent':
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Recent</span>
          </div>
        );
      case 'action':
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Action</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          />
          
          {/* Spotlight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-4"
          >
            <div className="bg-background/95 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search everywhere..."
                  className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No results found</p>
                    <p className="text-sm mt-1">Try searching for apps, documents, or actions</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          result.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center gap-4 transition-colors text-left",
                          index === selectedIndex
                            ? "bg-accent"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          result.type === 'action' ? "bg-primary/10 text-primary" : "bg-muted"
                        )}>
                          {getResultIcon(result)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium truncate">{result.title}</div>
                            {getResultBadge(result.type)}
                          </div>
                          {result.subtitle && (
                            <div className="text-sm text-muted-foreground truncate">
                              {result.subtitle}
                            </div>
                          )}
                        </div>
                        {result.keyboard && (
                          <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                            {result.keyboard}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {results.length > 0 && (
                <div className="px-4 py-3 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>↑↓ Navigate</span>
                    <span>↵ Open</span>
                    <span>ESC Close</span>
                  </div>
                  <span>{results.length} results</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
