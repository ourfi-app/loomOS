'use client';

import { useRouter } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * CardStackView Component
 * 
 * webOS-style card stacking view for switching between open apps.
 * Shows all open apps as cards that can be tapped/clicked to switch.
 * 
 * Desktop: Shows cards in a horizontal row with hover effects
 * Mobile/Tablet: Full webOS card stack experience with swipe gestures
 */
export function CardStackView({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { cards, closeCard, activeCardId, setActiveCard } = useCardManager();
  
  const handleCardClick = (cardId: string, path: string) => {
    setActiveCard(cardId);
    router.push(path);
    onClose();
  };

  const handleCardClose = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    closeCard(cardId);
    
    // If no cards left, go to dashboard
    if (cards.length === 1) {
      router.push('/dashboard');
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="fixed top-4 right-4 z-10"
          variant="ghost"
          size="icon"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Card Stack */}
        <div className="flex gap-6 max-w-7xl mx-auto overflow-x-auto pb-8">
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className={cn(
                  "relative flex-shrink-0 w-80 h-96 rounded-lg overflow-hidden",
                  "bg-background border-2 cursor-pointer",
                  "shadow-2xl transition-all duration-300",
                  card.id === activeCardId ? "border-primary scale-105" : "border-border hover:scale-105"
                )}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: card.id === activeCardId ? 1.05 : 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(card.id, card.path);
                }}
                whileHover={{ scale: 1.1 }}
              >
                {/* Card Header */}
                <div 
                  className={cn(
                    "flex items-center justify-between p-4",
                    "bg-gradient-to-r",
                    card.color || "from-cyan-500 via-blue-500 to-cyan-600"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                      {card.icon?.[0]?.toUpperCase() || '?'}
                    </div>
                    <h3 className="text-white font-semibold truncate">{card.title}</h3>
                  </div>
                  
                  <button
                    onClick={(e) => handleCardClose(e, card.id)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-[var(--semantic-error)] flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Card Preview (Placeholder) */}
                <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{card.icon}</div>
                    <p className="text-sm">{card.title}</p>
                    {card.minimized && (
                      <p className="text-xs mt-2 text-muted-foreground/70">(Minimized)</p>
                    )}
                  </div>
                </div>

                {/* Active indicator */}
                {card.id === activeCardId && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {cards.length === 0 && (
          <div className="text-white text-center">
            <p className="text-xl mb-4">No open apps</p>
            <Button onClick={() => { router.push('/dashboard'); onClose(); }}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
