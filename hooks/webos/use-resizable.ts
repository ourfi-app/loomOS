
import { useState, useCallback, useEffect, useRef } from 'react';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface ResizableOptions {
  minWidth?: number;
  minHeight?: number;
  onResizeStart?: () => void;
  onResize?: (width: number, height: number, x?: number, y?: number) => void;
  onResizeEnd?: (width: number, height: number, x?: number, y?: number) => void;
}

export function useResizable(options: ResizableOptions = {}) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback((e: MouseEvent, direction: ResizeDirection) => {
    if (!resizeRef.current) return;

    const rect = resizeRef.current.getBoundingClientRect();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    });
    options.onResizeStart?.();
    
    e.preventDefault();
    e.stopPropagation();
  }, [options]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = startSize.x;
    let newY = startSize.y;

    // Calculate new dimensions based on resize direction
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(options.minWidth || 400, startSize.width + deltaX);
    }
    if (resizeDirection.includes('w')) {
      const widthDelta = Math.min(deltaX, startSize.width - (options.minWidth || 400));
      newWidth = startSize.width - widthDelta;
      newX = startSize.x + widthDelta;
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(options.minHeight || 300, startSize.height + deltaY);
    }
    if (resizeDirection.includes('n')) {
      const heightDelta = Math.min(deltaY, startSize.height - (options.minHeight || 300));
      newHeight = startSize.height - heightDelta;
      newY = startSize.y + heightDelta;
    }

    options.onResize?.(newWidth, newHeight, newX, newY);
  }, [isResizing, resizeDirection, startPos, startSize, options]);

  const handleResizeEnd = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = startSize.x;
    let newY = startSize.y;

    if (resizeDirection.includes('e')) {
      newWidth = Math.max(options.minWidth || 400, startSize.width + deltaX);
    }
    if (resizeDirection.includes('w')) {
      const widthDelta = Math.min(deltaX, startSize.width - (options.minWidth || 400));
      newWidth = startSize.width - widthDelta;
      newX = startSize.x + widthDelta;
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(options.minHeight || 300, startSize.height + deltaY);
    }
    if (resizeDirection.includes('n')) {
      const heightDelta = Math.min(deltaY, startSize.height - (options.minHeight || 300));
      newHeight = startSize.height - heightDelta;
      newY = startSize.y + heightDelta;
    }

    setIsResizing(false);
    setResizeDirection(null);
    options.onResizeEnd?.(newWidth, newHeight, newX, newY);
  }, [isResizing, resizeDirection, startPos, startSize, options]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
    return undefined;
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const createResizeHandle = useCallback((direction: ResizeDirection) => {
    return (e: React.MouseEvent) => {
      handleResizeStart(e.nativeEvent, direction);
    };
  }, [handleResizeStart]);

  return {
    resizeRef,
    isResizing,
    createResizeHandle,
  };
}
