
'use client';

import { DraggableWidgetGrid } from './draggable-widget-grid';

interface WidgetContainerProps {
  className?: string;
}

/**
 * @deprecated Use DraggableWidgetGrid directly instead.
 * This component is maintained for backward compatibility only.
 * 
 * The DraggableWidgetGrid provides:
 * - Drag-and-drop widget rearrangement
 * - Resizable widgets
 * - Edit mode for customization
 * - All widgets from widget-registry
 */
export function WidgetContainer({ className }: WidgetContainerProps) {
  return <DraggableWidgetGrid className={className} />;
}
