'use client';

import { useRouter } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getAppById } from '@/lib/enhanced-app-registry';
import { useLoomStore } from '@/lib/loom-store';

/**
 * Card3DView Component
 *
 * Main desktop view with 3D perspective cards
 * Cards are displayed with a 3D rotateY transform and can be dragged to create looms
 */

interface Card3DProps {
  card: any;
  index: number;
  isActive: boolean;
  isPinned: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

function Card3D({ card, index, isActive, isPinned, onClick, onClose, onDragStart, onDragEnd }: Card3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const app = getAppById(card.icon);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, rotateY: -20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: -100, rotateY: 20 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'card-3d-container flex-shrink-0',
        isPinned && 'pinned',
        isDragging && 'dragging'
      )}
      style={{
        width: '320px',
        height: '520px',
        position: 'relative',
        cursor: isPinned ? 'default' : 'grab',
        transformStyle: 'preserve-3d',
        opacity: isPinned ? 0.3 : isDragging ? 0.5 : 1,
        pointerEvents: isPinned ? 'none' : 'auto',
      }}
      draggable={!isPinned}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
            ? 'var(--shadow-2xl)'
            : 'var(--shadow-xl)',
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
  const { isCardPinned } = useLoomStore();
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

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

  const handleDragStart = (e: React.DragEvent, card: any) => {
    // Don't allow dragging pinned cards
    if (isCardPinned(card.id)) {
      e.preventDefault();
      return;
    }

    setDraggedCardId(card.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);

    // Scrape context from the card
    const app = getAppById(card.icon);
    const context = `[CARD: ${card.title}]\nApp: ${app?.title || card.title}\nPath: ${card.path}\nDescription: ${app?.description || 'No description available'}`;
    e.dataTransfer.setData('application/loom-context', context);
    e.dataTransfer.setData('application/loom-title', card.title);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedCardId(null);
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
      {cards.map((card, index) => {
        const isPinned = isCardPinned(card.id);
        return (
          <Card3D
            key={card.id}
            card={card}
            index={index}
            isActive={card.id === activeCardId}
            isPinned={isPinned}
            onClick={() => handleCardClick(card.id, card.path)}
            onClose={(e) => handleCardClose(e, card.id)}
            onDragStart={(e) => handleDragStart(e, card)}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </div>
  );
}
