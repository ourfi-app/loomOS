'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { PlayCircle, Star, Pin, PinOff, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppContextMenuProps, AppAction } from '../types';
import { A11Y_LABELS } from '../utils/constants';

export function AppContextMenu({
  app,
  isInDock,
  isFavorite,
  onAction,
  children,
}: AppContextMenuProps) {
  const handleAction = (action: AppAction) => {
    onAction(action);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>

      <ContextMenuContent 
        className="w-56" 
        style={{ 
          backgroundColor: 'var(--webos-surface)',
          borderColor: 'var(--webos-border-light)'
        }}
        aria-label={A11Y_LABELS.contextMenu(app.title)}
      >
        {/* App Info Header */}
        <div 
          className="px-2 py-1.5 border-b mb-1"
          style={{ borderColor: 'var(--webos-border-light)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--webos-text-primary)' }}>
            {app.title}
          </p>
          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--webos-text-tertiary)' }}>
            {app.description}
          </p>
        </div>

        {/* Open Action */}
        <ContextMenuItem onClick={() => handleAction('open')}>
          <PlayCircle className="mr-2 h-4 w-4" />
          <span>Open</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Favorite Action */}
        <ContextMenuItem onClick={() => handleAction(isFavorite ? 'remove-from-favorites' : 'add-to-favorites')}>
          <Star 
            className={cn(
              'mr-2 h-4 w-4',
              isFavorite && 'fill-current text-[var(--semantic-warning)]'
            )} 
          />
          <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
        </ContextMenuItem>

        {/* Dock Action */}
        {!isInDock ? (
          <ContextMenuItem onClick={() => handleAction('add-to-dock')}>
            <Pin className="mr-2 h-4 w-4" />
            <span>Add to Dock</span>
          </ContextMenuItem>
        ) : (
          <ContextMenuItem disabled>
            <PinOff className="mr-2 h-4 w-4" />
            <span>In Dock</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
