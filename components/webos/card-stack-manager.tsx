
/**
 * Card Stack Manager
 * Implements LoomOS-style card-based multitasking
 * Allows users to manage multiple open cards/apps simultaneously
 */

'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Maximize2, Minimize2, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motionSpringPresets } from '@/lib/physics-animations';

export interface Card {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  minimized?: boolean;
  maximized?: boolean;
  zIndex?: number;
}

interface CardStackManagerProps {
  cards: Card[];
  onCardClose?: (id: string) => void;
  onCardMinimize?: (id: string) => void;
  onCardMaximize?: (id: string) => void;
  onCardFocus?: (id: string) => void;
  className?: string;
}

export function CardStackManager({
  cards: initialCards,
  onCardClose,
  onCardMinimize,
  onCardMaximize,
  onCardFocus,
  className = '',
}: CardStackManagerProps) {
  const [cards, setCards] = useState(initialCards);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

  const handleCardClose = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    onCardClose?.(id);
  }, [onCardClose]);

  const handleCardMinimize = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, minimized: !card.minimized } : card
      )
    );
    onCardMinimize?.(id);
  }, [onCardMinimize]);

  const handleCardMaximize = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, maximized: !card.maximized } : card
      )
    );
    onCardMaximize?.(id);
  }, [onCardMaximize]);

  const handleCardFocus = useCallback((id: string) => {
    setFocusedCardId(id);
    onCardFocus?.(id);
    
    // Bring card to front
    setCards((prev) => {
      const maxZ = Math.max(...prev.map((c) => c.zIndex || 0));
      return prev.map((card) =>
        card.id === id ? { ...card, zIndex: maxZ + 1 } : card
      );
    });
  }, [onCardFocus]);

  const handleDragEnd = useCallback((
    id: string,
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Dismiss card if dragged down significantly
    if (info.offset.y > 200) {
      handleCardClose(id);
    }
  }, [handleCardClose]);

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-40', className)}>
      <AnimatePresence>
        {cards.map((card) => {
          if (card.minimized) return null;

          const isMaximized = card.maximized;
          const isFocused = focusedCardId === card.id;

          return (
            <motion.div
              key={card.id}
              className="absolute pointer-events-auto"
              style={{
                zIndex: card.zIndex || 0,
              }}
              initial={isMaximized ? {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
              } : {
                x: 100,
                y: 100,
                width: 600,
                height: 400,
                scale: 0.9,
                opacity: 0,
              }}
              animate={isMaximized ? {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
                scale: 1,
                opacity: 1,
              } : {
                x: 100,
                y: 100,
                width: 600,
                height: 400,
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                y: 20,
              }}
              drag={!isMaximized}
              dragConstraints={{ top: 0, left: 0, right: 600, bottom: 400 }}
              dragElastic={0.1}
              dragMomentum={true}
              onDragEnd={(e, info) => handleDragEnd(card.id, e, info)}
              onClick={() => handleCardFocus(card.id)}
              transition={motionSpringPresets.gentle}
              whileHover={{ scale: isFocused ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={cn(
                'rounded-xl shadow-2xl overflow-hidden bg-white border-2 h-full flex flex-col',
                isFocused ? 'border-orange-500' : 'border-gray-300',
                isMaximized && 'rounded-none'
              )}>
                {/* Card Header */}
                <div
                  className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 flex items-center justify-between border-b border-gray-300 cursor-move"
                  onPointerDown={() => handleCardFocus(card.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {card.icon && (
                      <div className="text-gray-600 flex-shrink-0">
                        {card.icon}
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {card.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardMinimize(card.id);
                      }}
                      className="p-1.5 rounded hover:bg-gray-300 transition-colors"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardMaximize(card.id);
                      }}
                      className="p-1.5 rounded hover:bg-gray-300 transition-colors"
                    >
                      {isMaximized ? (
                        <Minimize2 size={14} className="text-gray-600" />
                      ) : (
                        <Maximize2 size={14} className="text-gray-600" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClose(card.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-100 transition-colors"
                    >
                      <X size={14} className="text-gray-600 hover:text-red-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 overflow-auto">
                  {card.content}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Minimized Cards Bar */}
      {cards.some((card) => card.minimized) && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-full px-4 py-2 shadow-xl flex items-center gap-2">
            <AnimatePresence>
              {cards
                .filter((card) => card.minimized)
                .map((card) => (
                  <motion.button
                    key={card.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCardMinimize(card.id)}
                    className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                    title={card.title}
                    transition={motionSpringPresets.stiff}
                  >
                    {card.icon || card.title[0]}
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
