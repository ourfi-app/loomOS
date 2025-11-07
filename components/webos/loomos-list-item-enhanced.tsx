
'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Trash2, 
  Archive, 
  GripVertical, 
  Mail, 
  Paperclip, 
  Flag, 
  Forward,
  Check
} from 'lucide-react';

export type BadgeType = 'unread' | 'forwarded' | 'flagged' | 'attachment' | 'important';

export interface BadgeConfig {
  type: BadgeType;
  color?: string;
}

export interface LoomOSListItemEnhancedProps {
  children: ReactNode;
  selected?: boolean;
  checked?: boolean;
  unread?: boolean;
  editMode?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onCheck?: (checked: boolean) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  swipeActions?: ReactNode;
  badges?: BadgeConfig[];
  className?: string;
  animationIndex?: number;
}

/**
 * LoomOS List Item Enhanced
 * 
 * Enhanced list item with edit mode, drag handles, status badges, and multi-select.
 * Reference: list-items-editing.png, lists-deleting-items-2.png
 * 
 * @example
 * <LoomOSListItemEnhanced
 *   editMode={isEditing}
 *   draggable
 *   unread
 *   badges={[{ type: "attachment" }, { type: "important" }]}
 *   onSwipeLeft={() => archive()}
 * >
 *   {content}
 * </LoomOSListItemEnhanced>
 */
export function LoomOSListItemEnhanced({
  children,
  selected,
  checked,
  unread,
  editMode,
  draggable,
  onClick,
  onDoubleClick,
  onContextMenu,
  onCheck,
  onSwipeLeft,
  onSwipeRight,
  onDragStart,
  onDrop,
  swipeActions,
  badges = [],
  className,
  animationIndex = 0,
}: LoomOSListItemEnhancedProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (editMode || !e.touches[0]) return; // Disable swipe in edit mode
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (editMode || (!onSwipeLeft && !onSwipeRight) || !e.touches[0]) return;
    
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchCurrentX.current;
    
    // Only allow swiping in the direction that has a handler
    if (diff > 0 && onSwipeLeft) {
      setSwipeOffset(-Math.min(diff, 120));
    } else if (diff < 0 && onSwipeRight) {
      setSwipeOffset(-Math.max(diff, -120));
    }
  };

  const handleTouchEnd = () => {
    if (editMode) return;
    
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

  // Close swipe actions when clicking outside
  useEffect(() => {
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

  const handleClick = () => {
    if (editMode && onCheck) {
      onCheck(!checked);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        'relative overflow-hidden',
        className
      )}
    >
      {/* Swipe Actions Background */}
      {(onSwipeLeft || onSwipeRight) && (
        <div className={cn(
          'absolute inset-y-0 flex items-center',
          swipeOffset < 0 ? 'right-0' : 'left-0'
        )}>
          {swipeActions || (
            <>
              {onSwipeRight && swipeOffset > 0 && (
                <button 
                  className="h-full px-6 bg-green-500 text-white flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetSwipe();
                  }}
                  aria-label="Archive"
                >
                  <Archive className="w-5 h-5" />
                </button>
              )}
              {onSwipeLeft && swipeOffset < 0 && (
                <button 
                  className="h-full px-6 bg-red-500 text-white flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetSwipe();
                  }}
                  aria-label="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Main Item Content */}
      <div
        className={cn(
          'relative flex items-center gap-3 px-4 py-3 border-b',
          'bg-white dark:bg-neutral-900',
          'border-neutral-200 dark:border-neutral-700',
          'transition-all duration-200',
          
          // Interactive states
          !editMode && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800',
          selected && 'bg-neutral-100 dark:bg-neutral-800',
          unread && 'font-semibold',
          
          // Drag & drop
          draggable && editMode && 'cursor-move'
        )}
        onClick={handleClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        draggable={draggable && editMode}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiped || editMode ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* Edit Mode: Drag Handle */}
        {editMode && draggable && (
          <div className="flex-shrink-0 text-neutral-400 dark:text-neutral-500 cursor-move">
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        {/* Edit Mode: Checkbox */}
        {editMode && onCheck && (
          <div className="flex-shrink-0">
            <button
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center',
                'transition-colors',
                checked 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-neutral-300 dark:border-neutral-600'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onCheck(!checked);
              }}
              aria-label={checked ? 'Unselect item' : 'Select item'}
              aria-checked={checked}
              role="checkbox"
            >
              {checked && <Check className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Unread Indicator */}
        {unread && !editMode && (
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" aria-label="Unread" />
        )}

        {/* Item Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Status Badges */}
        {badges.length > 0 && !editMode && (
          <div className="flex-shrink-0 flex items-center gap-1">
            {badges.map((badge, index) => (
              <StatusBadge key={index} type={badge.type} color={badge.color} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Status Badge Component
 */
function StatusBadge({ type, color }: BadgeConfig) {
  const icons: Record<BadgeType, { icon: typeof Mail; label: string }> = {
    unread: { icon: Mail, label: 'Unread' },
    forwarded: { icon: Forward, label: 'Forwarded' },
    flagged: { icon: Flag, label: 'Flagged' },
    attachment: { icon: Paperclip, label: 'Has attachment' },
    important: { icon: Flag, label: 'Important' }
  };

  const config = icons[type];
  const Icon = config.icon;

  const defaultColors: Record<BadgeType, string> = {
    unread: 'text-blue-500',
    forwarded: 'text-purple-500',
    flagged: 'text-red-500',
    attachment: 'text-neutral-500',
    important: 'text-orange-500'
  };

  return (
    <div 
      className={cn(
        'p-1',
        color || defaultColors[type]
      )}
      aria-label={config.label}
      title={config.label}
    >
      <Icon className="w-4 h-4" />
    </div>
  );
}

LoomOSListItemEnhanced.displayName = 'LoomOSListItemEnhanced';
