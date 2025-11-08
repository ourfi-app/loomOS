'use client';

import { useRouter } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getAppById } from '@/lib/enhanced-app-registry';

/**
 * Card3DView Component
 *
 * Main desktop view with 3D perspective cards
 * Cards are displayed with a 3D rotateY transform and can be stacked
 */

interface Card3DProps {
  card: any;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
}

function Card3D({ card, index, isActive, onClick, onClose }: Card3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const app = getAppById(card.icon);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, rotateY: -20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: -100, rotateY: 20 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card-3d-container flex-shrink-0"
      style={{
        width: '320px',
        height: '520px',
        position: 'relative',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className={cn(
          'card-3d-inner w-full h-full rounded-xl overflow-hidden',
          'bg-background/95 backdrop-blur-sm',
          'border border-border/50 flex flex-col',
          'transition-all duration-400 ease-out'
        )}
        style={{
          transform: isHovered
            ? 'rotateY(-5deg) scale(1)'
            : 'rotateY(-12deg) scale(0.9)',
          boxShadow: isHovered
            ? '0 20px 50px rgba(0, 0, 0, 0.2)'
            : '0 15px 40px rgba(0, 0, 0, 0.15)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Card Header */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5',
            'border-b border-border/50 bg-muted/30'
          )}
        >
          <span className="font-medium text-sm text-foreground">{card.title}</span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>

        {/* Card Content Preview */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="flex flex-col items-center justify-center h-full text-center">
            {app?.icon && (
              <div
                className={cn(
                  'w-20 h-20 rounded-2xl mb-4 flex items-center justify-center',
                  'bg-gradient-to-br shadow-lg',
                  card.color || 'from-gray-500 to-gray-700'
                )}
              >
                {typeof app.icon === 'function' && (
                  <app.icon className="w-10 h-10 text-white" />
                )}
              </div>
            )}
            <h3 className="text-2xl font-extralight text-foreground/60 uppercase tracking-wide mb-4">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {app?.description || 'Application preview'}
            </p>
          </div>
        </div>

        {/* AI Action Button */}
        <div className="p-4 border-t border-border/50">
          <button
            className={cn(
              'w-full flex items-center justify-center gap-2 px-3 py-2',
              'text-sm font-normal rounded-md',
              'bg-muted/50 hover:bg-muted border border-border/50',
              'transition-colors'
            )}
            onClick={(e) => {
              e.stopPropagation();
              // Future: AI assistant integration
              console.log('AI action for:', card.id);
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
        )}
      </div>
    </motion.div>
  );
}

export function Card3DView() {
  const router = useRouter();
  const { cards, closeCard, activeCardId, setActiveCard } = useCardManager();

  const handleCardClick = (cardId: string, path: string) => {
    setActiveCard(cardId);
    router.push(path);
  };

  const handleCardClose = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    closeCard(cardId);

    // If no cards left, stay on dashboard
    if (cards.length === 1) {
      router.push('/dashboard');
    }
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <div
      className="card-3d-switcher-area fixed left-0 w-full flex items-center gap-8 px-16 overflow-x-auto overflow-y-hidden"
      style={{
        top: '150px',
        bottom: '120px',
        perspective: '2500px',
        perspectiveOrigin: 'center center',
        scrollbarWidth: 'thin',
      }}
    >
      {cards.map((card, index) => (
        <Card3D
          key={card.id}
          card={card}
          index={index}
          isActive={card.id === activeCardId}
          onClick={() => handleCardClick(card.id, card.path)}
          onClose={(e) => handleCardClose(e, card.id)}
        />
      ))}
    </div>
  );
}
