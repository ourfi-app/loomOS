/**
 * DockItemContextMenu Component
 * 
 * Context menu for dock items with various actions
 */

'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Maximize2,
  Minimize2,
  X,
  Info,
  Pin,
  PinOff,
  PlayCircle,
  Replace,
} from 'lucide-react';
import type { DockItemContextMenuProps } from '../types';
import { A11Y_LABELS } from '../utils/constants';

export function DockItemContextMenu({
  app,
  status,
  position,
  canCustomize,
  onAction,
  children,
}: DockItemContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        className="w-56"
        aria-label={A11Y_LABELS.contextMenu(app.title)}
      >
        {/* Open/Restore Action */}
        <ContextMenuItem onClick={() => onAction(app, status.isMinimized ? 'restore' : 'open')}>
          {status.isMinimized ? (
            <>
              <Maximize2 className="mr-2 h-4 w-4" />
              <span>Restore {app.title}</span>
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              <span>Open {app.title}</span>
            </>
          )}
        </ContextMenuItem>

        {/* Quit Action (only if running or minimized) */}
        {(status.isRunning || status.isMinimized) && (
          <ContextMenuItem onClick={() => onAction(app, 'quit')}>
            <X className="mr-2 h-4 w-4" />
            <span>Quit {app.title}</span>
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {/* Pin/Unpin Actions */}
        {status.isPinned ? (
          <>
            {canCustomize && (
              <>
                <ContextMenuItem onClick={() => onAction(app, 'replace')}>
                  <Replace className="mr-2 h-4 w-4" />
                  <span>Replace in Dock</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onAction(app, 'unpin')}>
                  <PinOff className="mr-2 h-4 w-4" />
                  <span>Unpin from Dock</span>
                </ContextMenuItem>
              </>
            )}
          </>
        ) : (
          <ContextMenuItem onClick={() => onAction(app, 'pin')}>
            <Pin className="mr-2 h-4 w-4" />
            <span>Pin to Dock</span>
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {/* App Info */}
        <ContextMenuItem onClick={() => onAction(app, 'info')}>
          <Info className="mr-2 h-4 w-4" />
          <span>App Info</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
