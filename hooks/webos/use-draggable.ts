
import { useState, useCallback, useEffect, useRef } from 'react';

interface DraggableOptions {
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  handle?: string; // CSS selector for drag handle
}

export function useDraggable(options: DraggableOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Check if clicking on drag handle if specified
    if (options.handle && dragRef.current) {
      const handle = dragRef.current.querySelector(options.handle);
      if (handle && !handle.contains(e.target as Node)) {
        return;
      }
    }

    // Don't start drag on buttons or inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
    options.onDragStart?.();
    
    e.preventDefault();
  }, [options]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    setCurrentPos({ x: e.clientX, y: e.clientY });
    options.onDrag?.(deltaX, deltaY);
  }, [isDragging, startPos, options]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    setIsDragging(false);
    options.onDragEnd?.(deltaX, deltaY);
  }, [isDragging, startPos, options]);

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    element.addEventListener('mousedown', handleMouseDown);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    dragRef,
    isDragging,
  };
}
