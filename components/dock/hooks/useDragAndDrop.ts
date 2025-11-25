/**
 * useDragAndDrop Hook
 * 
 * Handles drag-and-drop functionality for dock items and looms
 */

import { useState, useCallback } from 'react';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { useLoomStore } from '@/lib/loom-store';
import { toast } from 'sonner';
import type { UseDragAndDropReturn } from '../types';
import { TOAST_MESSAGES } from '../utils/constants';
import { findAppIndex, reorderArray } from '../utils/dockHelpers';

export function useDragAndDrop(
  dockApps: any[],
  enableDragAndDrop: boolean = true
): UseDragAndDropReturn {
  const { reorderDock, dockAppIds } = useAppPreferences();
  const { createLoom, looms } = useLoomStore();

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback(
    (itemId: string) => {
      if (!enableDragAndDrop) return;
      setDraggedItemId(itemId);
    },
    [enableDragAndDrop]
  );

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
    setDropTargetId(null);
  }, []);

  /**
   * Handle drag over dock (for looms)
   */
  const handleDockDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!enableDragAndDrop) return;

      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    },
    [enableDragAndDrop]
  );

  /**
   * Handle drag leave dock
   */
  const handleDockDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  /**
   * Handle drop on dock (for looms - dragging cards to create looms)
   */
  const handleDockDrop = useCallback(
    (e: React.DragEvent) => {
      if (!enableDragAndDrop) return;

      e.preventDefault();
      setIsDragOver(false);

      const cardId = e.dataTransfer.getData('text/plain');
      const context = e.dataTransfer.getData('application/loom-context');
      const title = e.dataTransfer.getData('application/loom-title');

      if (cardId && context && title) {
        // Check if this card is already in a loom
        if (looms.some(loom => loom.cardIds.includes(cardId))) {
          toast.info('Already Pinned', {
            description: 'This card is already pinned as a loom',
          });
          return;
        }

        // Create the loom
        createLoom([cardId], context, title);

        toast.success(
          TOAST_MESSAGES.loomCreated(title).title,
          {
            description: TOAST_MESSAGES.loomCreated(title).description,
          }
        );
      }
    },
    [enableDragAndDrop, looms, createLoom]
  );

  /**
   * Handle drop on item (for reordering dock items)
   */
  const handleItemDrop = useCallback(
    (draggedId: string, targetId: string) => {
      if (!enableDragAndDrop) return;
      if (draggedId === targetId) return;

      const draggedIndex = findAppIndex(dockApps, draggedId);
      const targetIndex = findAppIndex(dockApps, targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Only allow reordering pinned apps
      const isPinnedDragged = dockAppIds.includes(draggedId);
      const isPinnedTarget = dockAppIds.includes(targetId);

      if (!isPinnedDragged || !isPinnedTarget) {
        toast.info('Cannot Reorder', {
          description: 'Only pinned apps can be reordered',
        });
        return;
      }

      // Reorder the dock
      const newOrder = reorderArray(dockAppIds, draggedIndex, targetIndex);
      reorderDock(newOrder);

      toast.success('Reordered', {
        description: 'Dock order updated',
      });

      handleDragEnd();
    },
    [enableDragAndDrop, dockApps, dockAppIds, reorderDock, handleDragEnd]
  );

  return {
    draggedItemId,
    dropTargetId,
    isDragOver,
    handleDragStart,
    handleDragEnd,
    handleDockDragOver,
    handleDockDragLeave,
    handleDockDrop,
    handleItemDrop,
  };
}
