// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, TrendingUp, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllApps, type AppDefinition } from '@/lib/enhanced-app-registry';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface QuickAppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onAppSelect?: (app: AppDefinition) => void;
}

export function QuickAppSwitcher({ isOpen, onClose, onAppSelect }: QuickAppSwitcherProps) {
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load recent apps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-apps');
    if (saved) {
      setRecentApps(JSON.parse(saved));
    }
  }, []);

  // Get all apps
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const allApps = useMemo(() => getAllApps(isAdmin), [isAdmin]);

  // Get recent app objects
  const recentAppObjects = useMemo(() => {
    return recentApps
      .map(id => allApps.find(app => app.id === id))
      .filter(Boolean) as AppDefinition[];
  }, [recentApps, allApps]);

  // Get suggested apps (top rated or frequently used)
  const suggestedApps = useMemo(() => {
    return allApps
      .filter(app => !recentApps.includes(app.id))
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 6);
  }, [allApps, recentApps]);

  // Combined list for keyboard navigation
  const combinedApps = useMemo(() => {
    return [...recentAppObjects, ...suggestedApps];
  }, [recentAppObjects, suggestedApps]);

  const handleAppSelect = (app: AppDefinition) => {
    // Update recent apps
    const updated = [app.id, ...recentApps.filter(id => id !== app.id)].slice(0, 8);
    setRecentApps(updated);
    localStorage.setItem('recent-apps', JSON.stringify(updated));

    if (onAppSelect) {
      onAppSelect(app);
    } else {
      router.push(app.path);
    }
    onClose();
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, combinedApps.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const cols = 4;
        const currentRow = Math.floor(selectedIndex / cols);
        const currentCol = selectedIndex % cols;
        const newCol = e.key === 'ArrowRight' 
          ? Math.min(currentCol + 1, cols - 1)
          : Math.max(currentCol - 1, 0);
        const newIndex = currentRow * cols + newCol;
        if (newIndex < combinedApps.length) {
          setSelectedIndex(newIndex);
        }
      } else if (e.key === 'Enter') {
        const selectedApp = combinedApps[selectedIndex];
        if (selectedApp) {
          e.preventDefault();
          handleAppSelect(selectedApp);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedApps, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl bg-background/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-xl font-semibold text-foreground">Quick App Switcher</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Recent Apps */}
            {recentAppObjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Recent Apps
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {recentAppObjects.map((app, index) => (
                    <button
                      key={app.id}
                      onClick={() => handleAppSelect(app)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "group flex flex-col items-center gap-3 p-4 rounded-xl transition-all",
                        index === selectedIndex
                          ? "bg-primary/10 border-2 border-primary scale-105"
                          : "bg-muted/30 hover:bg-muted/50 border-2 border-transparent"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center transition-transform",
                        "bg-gradient-to-br shadow-lg",
                        app.gradient
                      )}>
                        <app.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate w-full">
                          {app.title}
                        </div>
                        {app.averageRating && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-[var(--semantic-warning)]" />
                            <span className="text-xs text-muted-foreground">
                              {app.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Apps */}
            {suggestedApps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Suggested Apps
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {suggestedApps.map((app, index) => {
                    const actualIndex = recentAppObjects.length + index;
                    return (
                      <button
                        key={app.id}
                        onClick={() => handleAppSelect(app)}
                        onMouseEnter={() => setSelectedIndex(actualIndex)}
                        className={cn(
                          "group flex flex-col items-center gap-3 p-4 rounded-xl transition-all",
                          actualIndex === selectedIndex
                            ? "bg-primary/10 border-2 border-primary scale-105"
                            : "bg-muted/30 hover:bg-muted/50 border-2 border-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center transition-transform",
                          "bg-gradient-to-br shadow-lg",
                          app.gradient
                        )}>
                          <app.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground truncate w-full">
                            {app.title}
                          </div>
                          {app.averageRating && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-[var(--semantic-warning)]" />
                              <span className="text-xs text-muted-foreground">
                                {app.averageRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↑↓←→</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↵</kbd>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
