

'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, useDragControls, type PanInfo } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  X,
  Pin,
  Settings,
  GripVertical,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDesktopWidgets, type DesktopWidget } from '@/lib/desktop-widget-store';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface DesktopWidgetCardProps {
  widget: DesktopWidget;
  children: ReactNode;
  onSettingsClick?: () => void;
}

export function DesktopWidgetCard({
  widget,
  children,
  onSettingsClick,
}: DesktopWidgetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  const {
    updatePosition,
    updateSize,
    removeWidget,
    toggleCollapse,
    togglePin,
    bringToFront,
    selectWidget,
    selectedWidgetId,
  } = useDesktopWidgets();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const isSelected = selectedWidgetId === widget.id;
  
  // Handle click to bring to front and select
  const handleClick = () => {
    bringToFront(widget.id);
    selectWidget(widget.id);
  };
  
  // Handle drag end
  const handleDragEnd = (_: any, info: PanInfo) => {
    const newX = widget.position.x + info.offset.x;
    const newY = widget.position.y + info.offset.y;
    
    // Constrain to viewport
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - widget.size.width));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - widget.size.height));
    
    updatePosition(widget.id, { x: constrainedX, y: constrainedY });
    setIsDragging(false);
  };
  
  // Handle resize (simplified - from bottom-right corner)
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = widget.size.width;
    const startHeight = widget.size.height;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newWidth = Math.max(280, Math.min(startWidth + deltaX, 600));
      const newHeight = Math.max(200, Math.min(startHeight + deltaY, 800));
      
      updateSize(widget.id, { width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Deselect when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        if (selectedWidgetId === widget.id) {
          selectWidget(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [widget.id, selectedWidgetId, selectWidget]);
  
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          ref={cardRef}
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'fixed backdrop-blur-xl rounded-xl overflow-hidden',
            'transition-all duration-200',
            isDragging && 'opacity-80 scale-105 cursor-grabbing',
            isResizing && 'select-none'
          )}
          style={{
            left: widget.position.x,
            top: widget.position.y,
            width: widget.size.width,
            height: widget.isCollapsed ? 'auto' : widget.size.height,
            zIndex: 50 + widget.order,
            backgroundColor: 'var(--surface-elevated)',
            border: isSelected 
              ? '2px solid var(--brand-primary)' 
              : widget.isPinned 
                ? '1px solid var(--color-warning)' 
                : '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-2xl)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header / Title Bar */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className={cn(
              'px-4 py-2.5 cursor-grab active:cursor-grabbing',
              'flex items-center justify-between gap-3'
            )}
            style={{
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--surface-secondary)',
            }}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <GripVertical 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: 'var(--text-secondary)' }}
              />
              <h3 
                className="text-sm font-semibold truncate capitalize"
                style={{ color: 'var(--text-primary)' }}
              >
                {widget.widgetType}
              </h3>
            </div>
            
            {/* Controls */}
            <div className={cn(
              'flex items-center gap-1 transition-opacity',
              isHovered || isSelected ? 'opacity-100' : 'opacity-0'
            )}>
              {widget.isPinned && (
                <Pin 
                  className="w-3.5 h-3.5 fill-current" 
                  style={{ color: 'var(--color-warning)' }}
                />
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(widget.id);
                }}
                title={widget.isCollapsed ? 'Expand' : 'Collapse'}
              >
                {widget.isCollapsed ? (
                  <Maximize2 className="h-3.5 w-3.5" />
                ) : (
                  <Minimize2 className="h-3.5 w-3.5" />
                )}
              </Button>
              
              {onSettingsClick && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSettingsClick();
                  }}
                  title="Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeWidget(widget.id);
                }}
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          {/* Content Area */}
          {!widget.isCollapsed && (
            <div className="h-[calc(100%-48px)] overflow-hidden">
              {children}
            </div>
          )}
          
          {/* Resize Handle */}
          {!widget.isCollapsed && (
            <div
              onMouseDown={handleResizeMouseDown}
              className={cn(
                'absolute bottom-0 right-0 w-6 h-6 cursor-se-resize',
                'transition-opacity',
                isHovered || isSelected ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div 
                className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 rounded-br" 
                style={{ borderColor: 'var(--border-medium)' }}
              />
            </div>
          )}
        </motion.div>
      </ContextMenuTrigger>
      
      {/* Context Menu */}
      <ContextMenuContent>
        <ContextMenuItem onClick={() => toggleCollapse(widget.id)}>
          {widget.isCollapsed ? (
            <>
              <Maximize2 className="mr-2 h-4 w-4" />
              Expand
            </>
          ) : (
            <>
              <Minimize2 className="mr-2 h-4 w-4" />
              Collapse
            </>
          )}
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => togglePin(widget.id)}>
          <Pin className={cn(
            'mr-2 h-4 w-4',
            widget.isPinned && 'fill-current'
          )} />
          {widget.isPinned ? 'Unpin' : 'Pin'}
        </ContextMenuItem>
        
        {onSettingsClick && (
          <ContextMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </ContextMenuItem>
        )}
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          onClick={() => {
            // Reset to default size and position
            const defaults = {
              position: { x: window.innerWidth - 420, y: 120 },
              size: { width: 360, height: 480 },
            };
            updatePosition(widget.id, defaults.position);
            updateSize(widget.id, defaults.size);
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Position & Size
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          onClick={() => removeWidget(widget.id)}
          className="text-destructive focus:text-destructive"
        >
          <X className="mr-2 h-4 w-4" />
          Close Widget
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
