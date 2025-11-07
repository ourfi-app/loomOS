
'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Archive, MoreVertical } from 'lucide-react';

interface LoomOSListItemProps {
  children: ReactNode;
  selected?: boolean;
  unread?: boolean;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeActions?: ReactNode;
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function LoomOSListItem({
  children,
  selected,
  unread,
  onClick,
  onSwipeLeft,
  onSwipeRight,
  swipeActions,
  className,
  draggable,
  onDragStart,
  onDrop,
}: LoomOSListItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onSwipeLeft && !onSwipeRight) return;
    if (!e.touches[0]) return;
    
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchCurrentX.current;
    
    // Only allow swiping in the direction that has a handler
    if (diff > 0 && onSwipeLeft) {
      setSwipeOffset(-diff);
    } else if (diff < 0 && onSwipeRight) {
      setSwipeOffset(-diff);
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchCurrentX.current;
    const threshold = 80; // px
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeLeft) {
        setIsSwiped(true);
        setSwipeOffset(-120);
        onSwipeLeft();
      } else if (diff < 0 && onSwipeRight) {
        setIsSwiped(true);
        setSwipeOffset(120);
        onSwipeRight();
      } else {
        resetSwipe();
      }
    } else {
      resetSwipe();
    }
  };

  const resetSwipe = () => {
    setIsSwiped(false);
    setSwipeOffset(0);
  };

  useEffect(() => {
    // Close swipe actions when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        resetSwipe();
      }
    };

    if (isSwiped) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      if (isSwiped) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isSwiped]);

  return (
    <div
      ref={itemRef}
      className={cn('loomos-list-item-swipeable', className)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className={cn(
          'loomos-list-item',
          selected && 'selected',
          unread && 'unread',
          isSwiped && 'swiped'
        )}
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiped ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
      {(onSwipeLeft || onSwipeRight) && (
        <div className="loomos-list-item-actions">
          {swipeActions || (
            <>
              {onSwipeRight && (
                <button className="p-2">
                  <Archive className="w-5 h-5" />
                </button>
              )}
              {onSwipeLeft && (
                <button className="p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface LoomOSListItemContentProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  meta?: ReactNode;
  avatar?: ReactNode;
  className?: string;
}

export function LoomOSListItemContent({
  title,
  subtitle,
  meta,
  avatar,
  className,
}: LoomOSListItemContentProps) {
  return (
    <>
      {avatar && <div className="flex-shrink-0 mr-3">{avatar}</div>}
      <div className={cn('loomos-list-item-content', className)}>
        <div className="loomos-list-item-title">{title}</div>
        {subtitle && <div className="loomos-list-item-subtitle">{subtitle}</div>}
      </div>
      {meta && <div className="loomos-list-item-meta">{meta}</div>}
    </>
  );
}
