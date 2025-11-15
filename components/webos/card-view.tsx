
'use client';

import { useEffect, useRef, useState } from 'react';
import { useCardManager as useCardManagerStore, type AppCard } from '@/lib/card-manager-store';
import { Search, X, Maximize2, Minimize2, Minus } from 'lucide-react';
import { getAppById } from '@/lib/enhanced-app-registry';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardViewProps {
  cards: AppCard[];
  appComponents: Record<string, React.ComponentType>;
}

export function CardView({ cards, appComponents }: CardViewProps) {
  const { 
    activeCardId, 
    isMultitaskingView, 
    setActiveCard, 
    closeCard,
    minimizeCard,
    maximizeCard,
  } = useCardManagerStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isMultitaskingView || !containerRef.current) return;

    const container = containerRef.current;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 400 + 32; // card width + gap
      const newCenterIndex = Math.round(scrollLeft / cardWidth);
      setCenterIndex(newCenterIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMultitaskingView]);

  // Filter cards based on search query
  const filteredCards = searchQuery
    ? cards.filter(card => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cards;

  const activeCard = cards.find(c => c.id === activeCardId);

  // Single card view (active card fullscreen)
  if (!isMultitaskingView && activeCard) {
    const AppComponent = appComponents[activeCard.path];
    const appInfo = getAppById(activeCard.icon);
    const Icon = appInfo?.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'absolute inset-0 bg-white flex flex-col',
          activeCard.maximized ? 'rounded-none' : 'rounded-2xl m-4'
        )}
      >
        {/* App Header */}
        <div className={`px-4 py-3 flex items-center justify-between bg-gradient-to-br ${activeCard.color} text-white border-b border-white/10 flex-shrink-0`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h1 className="text-lg font-bold truncate">{activeCard.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => minimizeCard(activeCard.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
              title="Minimize"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => maximizeCard(activeCard.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
              title={activeCard.maximized ? "Restore" : "Maximize"}
            >
              {activeCard.maximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => closeCard(activeCard.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--semantic-error)]/20 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-auto bg-[var(--semantic-bg-subtle)]">
          {AppComponent ? <AppComponent /> : (
            <div className="h-full flex items-center justify-center text-[var(--semantic-text-tertiary)]">
              <div className="text-center">
                {Icon && <Icon className="w-20 h-20 mx-auto mb-4 opacity-30" />}
                <p className="text-lg font-medium text-[var(--semantic-text-tertiary)]">Content not available</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Multitasking view (all cards)
  if (isMultitaskingView) {
    return (
      <div className="webos-card-view">
        {/* Just Type Search Bar */}
        <div className="webos-just-type-bar">
          <div className="webos-just-type-input-wrapper">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--semantic-text-tertiary)] pointer-events-none" />
            <input
              type="text"
              placeholder="Just Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="webos-just-type-input"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--semantic-bg-muted)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--semantic-text-tertiary)]" />
              </button>
            )}
          </div>
        </div>

        {/* Card Container */}
        <div ref={containerRef} className="webos-card-container">
          <AnimatePresence>
            {filteredCards.map((card, index) => {
              const appInfo = getAppById(card.icon);
              const Icon = appInfo?.icon;
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`webos-card-item ${index === centerIndex ? 'center' : ''}`}
                  onClick={() => setActiveCard(card.id)}
                >
                  <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl border border-[var(--semantic-border-light)]">
                    {/* Card Header */}
                    <div className={`px-4 py-3 flex items-center justify-between bg-gradient-to-br ${card.color} text-white border-b border-white/10`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {Icon && (
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                        )}
                        <h3 className="text-sm font-bold truncate">{card.title}</h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeCard(card.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Content Preview */}
                    <div className="flex-1 overflow-hidden relative bg-[var(--semantic-bg-subtle)]">
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--semantic-text-tertiary)]">
                        <div className="text-center">
                          {Icon && <Icon className="w-16 h-16 mx-auto mb-2 opacity-30" />}
                          <p className="text-sm font-medium text-[var(--semantic-text-tertiary)]">Tap to open</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Status */}
                    <div className="px-4 py-2 bg-[var(--semantic-surface-hover)] border-t border-[var(--semantic-border-light)] flex items-center justify-between text-xs text-[var(--semantic-text-secondary)]">
                      <span>{card.minimized ? 'Minimized' : 'Running'}</span>
                      {!card.minimized && (
                        <span className="w-2 h-2 rounded-full bg-[var(--semantic-success)] animate-pulse" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-white text-sm rounded-full backdrop-blur-sm">
            {filteredCards.length} {filteredCards.length === 1 ? 'app' : 'apps'} found
          </div>
        )}
      </div>
    );
  }

  return null;
}
