'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebOSCard {
  id: string;
  title: string;
  content: ReactNode;
  image?: string;
  onClick?: () => void;
}

interface WebOSCardCarouselProps {
  cards: WebOSCard[];
  className?: string;
  cardWidth?: number;
  gap?: number;
}

/**
 * WebOS Card Carousel Component
 * 
 * A horizontal scrolling card carousel inspired by classic webOS.
 * Features:
 * - Smooth horizontal scrolling
 * - Clean card design with subtle shadows
 * - Optional navigation arrows
 * - Touch/swipe support
 * - Snap scrolling
 */
export function WebOSCardCarousel({
  cards,
  className,
  cardWidth = 320,
  gap = 24
}: WebOSCardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [cards]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = cardWidth + gap;
    const newScrollLeft = scrollRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (cards.length === 0) {
    return (
      <div className={cn("webos-card-carousel", className)}>
        <div className="webos-card text-center py-12">
          <p className="webos-caption">No cards to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 webos-button bg-white/95 backdrop-blur-sm p-2 shadow-lg hover:bg-white"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Card Carousel */}
      <div
        ref={scrollRef}
        className="webos-card-carousel"
        style={{
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: gap
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="webos-card-carousel-item"
            style={{
              width: cardWidth,
              scrollSnapAlign: 'start'
            }}
          >
            <div
              className={cn(
                "webos-card h-full",
                card.onClick && "cursor-pointer"
              )}
              onClick={card.onClick}
            >
              {/* Card Image */}
              {card.image && (
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${card.image})`,
                    borderTopLeftRadius: 'var(--webos-radius-lg)',
                    borderTopRightRadius: 'var(--webos-radius-lg)'
                  }}
                />
              )}
              
              {/* Card Content */}
              <div className="webos-card-body">
                <h3 className="webos-heading-3 mb-3">{card.title}</h3>
                <div className="webos-body text-secondary">
                  {card.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Navigation Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 webos-button bg-white/95 backdrop-blur-sm p-2 shadow-lg hover:bg-white"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

/**
 * Simple WebOS Card Component
 * Use this for individual cards
 */
interface WebOSCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  image?: string;
}

export function WebOSCard({
  title,
  children,
  className,
  onClick,
  image
}: WebOSCardProps) {
  return (
    <div
      className={cn(
        "webos-card",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {image && (
        <div 
          className="h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
            borderTopLeftRadius: 'var(--webos-radius-lg)',
            borderTopRightRadius: 'var(--webos-radius-lg)'
          }}
        />
      )}
      
      {title && (
        <div className="webos-card-header">
          <h3 className="webos-heading-3">{title}</h3>
        </div>
      )}
      
      <div className="webos-card-body">
        {children}
      </div>
    </div>
  );
}
