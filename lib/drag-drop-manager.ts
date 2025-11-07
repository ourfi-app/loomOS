
/**
 * Drag and Drop Manager
 * Enables dragging items between different apps
 */

import { useState, useCallback, useRef } from 'react';

export type DragData = {
  type: 'task' | 'note' | 'document' | 'contact' | 'event' | 'message';
  id: string;
  title: string;
  data: any;
  sourceApp: string;
};

export type DropZone = {
  id: string;
  app: string;
  accepts: DragData['type'][];
  onDrop: (data: DragData) => void | Promise<void>;
};

class DragDropManager {
  private dragData: DragData | null = null;
  private dropZones: Map<string, DropZone> = new Map();
  private dragListeners: Set<(data: DragData | null) => void> = new Set();

  startDrag(data: DragData) {
    this.dragData = data;
    this.notifyListeners();
  }

  endDrag() {
    this.dragData = null;
    this.notifyListeners();
  }

  getDragData(): DragData | null {
    return this.dragData;
  }

  registerDropZone(zone: DropZone) {
    this.dropZones.set(zone.id, zone);
    return () => {
      this.dropZones.delete(zone.id);
    };
  }

  canDrop(zoneId: string): boolean {
    if (!this.dragData) return false;
    const zone = this.dropZones.get(zoneId);
    return zone ? zone.accepts.includes(this.dragData.type) : false;
  }

  async drop(zoneId: string): Promise<boolean> {
    if (!this.dragData) return false;

    const zone = this.dropZones.get(zoneId);
    if (!zone || !zone.accepts.includes(this.dragData.type)) {
      return false;
    }

    try {
      await zone.onDrop(this.dragData);
      this.endDrag();
      return true;
    } catch (error) {
      console.error('Drop failed:', error);
      this.endDrag();
      return false;
    }
  }

  subscribe(callback: (data: DragData | null) => void) {
    this.dragListeners.add(callback);
    return () => {
      this.dragListeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.dragListeners.forEach(callback => callback(this.dragData));
  }
}

export const dragDropManager = new DragDropManager();

/**
 * Hook for making an item draggable
 */
export function useDraggable(data: DragData) {
  const dragRef = useRef<HTMLElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    dragDropManager.startDrag(data);
    
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    // Add dragging visual feedback
    if (dragRef.current) {
      dragRef.current.style.opacity = '0.5';
    }
  }, [data]);

  const handleDragEnd = useCallback(() => {
    dragDropManager.endDrag();
    
    if (dragRef.current) {
      dragRef.current.style.opacity = '1';
    }
  }, []);

  return {
    dragRef,
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };
}

/**
 * Hook for creating a drop zone
 */
export function useDropZone(zone: Omit<DropZone, 'id'>) {
  const [isOver, setIsOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);
  const dropRef = useRef<HTMLElement>(null);
  const zoneId = useRef(`dropzone-${Math.random().toString(36).substr(2, 9)}`);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const canDropHere = dragDropManager.canDrop(zoneId.current);
    setCanDrop(canDropHere);
    setIsOver(true);

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = canDropHere ? 'move' : 'none';
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    setCanDrop(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await dragDropManager.drop(zoneId.current);
    
    setIsOver(false);
    setCanDrop(false);

    return success;
  }, []);

  // Register drop zone on mount
  useState(() => {
    const fullZone: DropZone = {
      ...zone,
      id: zoneId.current,
    };
    return dragDropManager.registerDropZone(fullZone);
  });

  return {
    dropRef,
    isOver,
    canDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };
}

/**
 * Hook for listening to drag state
 */
export function useDragState() {
  const [dragData, setDragData] = useState<DragData | null>(null);

  useState(() => {
    return dragDropManager.subscribe(setDragData);
  });

  return {
    isDragging: dragData !== null,
    dragData,
  };
}
