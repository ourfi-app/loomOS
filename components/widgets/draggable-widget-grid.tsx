
'use client';

import { useEffect, useState } from 'react';
import RGL, { WidthProvider, type Layout } from 'react-grid-layout';
import { useWidgetLayout, type WidgetLayout } from '@/lib/widget-layout-store';
import { getEnabledWidgets } from '@/lib/widget-registry';
import { WeatherWidget } from './weather-widget';
import { CalendarWidget } from './calendar-widget';
import { FeedWidget } from './feed-widget';
import { EmailWidget } from './email-widget';
import { TasksWidget } from './tasks-widget';
import { NotesWidget } from './notes-widget';
import { NotificationsWidget } from './notifications-widget';
import { FloatingLayoutControls } from './floating-layout-controls';
import { cn } from '@/lib/utils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(RGL.Responsive) as any;

interface DraggableWidgetGridProps {
  className?: string;
}

export function DraggableWidgetGrid({ className }: DraggableWidgetGridProps) {
  const { isEditMode, layouts, updateLayouts } = useWidgetLayout();
  const [mounted, setMounted] = useState(false);
  const widgets = getEnabledWidgets();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (!isEditMode) return;
    
    const MAX_COLS = 12; // Match grid columns
    
    const updatedLayouts: WidgetLayout[] = newLayout.map(item => {
      const existing = layouts.find(l => l.i === item.i);
      
      // Clamp values to ensure they stay within boundaries
      const clampedX = Math.max(0, Math.min(item.x, MAX_COLS - item.w));
      const clampedY = Math.max(0, item.y);
      const clampedW = Math.max(
        existing?.minW || 2,
        Math.min(item.w, existing?.maxW || MAX_COLS, MAX_COLS - clampedX)
      );
      const clampedH = Math.max(
        existing?.minH || 2,
        Math.min(item.h, existing?.maxH || 15)
      );
      
      return {
        i: item.i,
        x: clampedX,
        y: clampedY,
        w: clampedW,
        h: clampedH,
        minW: existing?.minW,
        minH: existing?.minH,
        maxW: existing?.maxW,
        maxH: existing?.maxH,
        static: existing?.static,
      };
    });
    
    updateLayouts(updatedLayouts);
  };

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'weather':
        return <WeatherWidget />;
      case 'calendar':
        return <CalendarWidget />;
      case 'feed':
        return <FeedWidget />;
      case 'email':
        return <EmailWidget />;
      case 'tasks':
        return <TasksWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'notifications':
        return <NotificationsWidget />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return null;
  }

  // Convert our layouts to react-grid-layout format
  const gridLayouts = layouts.map(layout => ({
    ...layout,
    static: !isEditMode, // Make all widgets static when not in edit mode
  }));

  return (
    <>
      {/* Floating Controls */}
      <FloatingLayoutControls />
      
      <div className={cn('h-full w-full relative', className)}>
        {/* Visual boundary indicator - only visible in edit mode */}
        {isEditMode && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <div 
              className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-lg"
              style={{
                top: '8px',
                bottom: '80px',
                left: '32px',
                right: '32px',
              }}
            />
          </div>
        )}
        
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: gridLayouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          isBounded={true} // Keep widgets within container boundaries
          compactType="vertical" // Enable vertical compacting to nudge widgets
          preventCollision={false} // Allow widgets to push others out of the way
          margin={[16, 16]}
          containerPadding={[32, 8]} // [horizontal, vertical] - Minimal top padding since search bar has dedicated space
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
          transformScale={1}
        >
          {gridLayouts.map((layout) => (
            <div
              key={layout.i}
              className={cn(
                'relative overflow-hidden transition-all duration-200',
                isEditMode && 'ring-2 ring-primary/30 rounded-xl'
              )}
            >
              {/* Drag Handle - Only visible in edit mode */}
              {isEditMode && (
                <div className="drag-handle absolute top-0 left-0 right-0 h-8 bg-primary/10 backdrop-blur-sm cursor-move flex items-center justify-center z-50 rounded-t-xl border-b border-primary/20">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                  </div>
                </div>
              )}
              
              {/* Widget Content */}
              <div className={cn(
                'h-full w-full',
                isEditMode && 'pt-8'
              )}>
                {renderWidget(layout.i)}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </>
  );
}
