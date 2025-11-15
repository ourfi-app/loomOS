
'use client';

import { LayoutGrid, Lock, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useWidgetLayout } from '@/lib/widget-layout-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { WIDGET_REGISTRY } from '@/lib/widget-registry';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function FloatingLayoutControls() {
  const { isEditMode, toggleEditMode, resetToDefault, layouts, addWidget, removeWidget } = useWidgetLayout();
  const [isOpen, setIsOpen] = useState(false);

  // Get available widgets that are not currently on the dashboard
  const availableWidgets = Object.values(WIDGET_REGISTRY).filter(
    widget => !layouts.some(layout => layout.i === widget.id)
  );

  // Get current widgets on the dashboard
  const currentWidgets = layouts.map(layout => {
    const widget = WIDGET_REGISTRY[layout.i];
    return { id: layout.i, title: widget?.title || layout.i };
  }).filter(w => w.id !== 'search-assistant'); // Don't allow removing search assistant

  const handleAddWidget = (widgetId: string) => {
    addWidget(widgetId);
    setIsOpen(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    removeWidget(widgetId);
  };

  return (
    <div className="fixed top-48 right-8 z-40 flex flex-col gap-2">
      {/* Edit Mode Toggle */}
      <Button
        variant="default"
        size="icon"
        onClick={toggleEditMode}
        className={cn(
          'relative h-10 w-10 rounded-full shadow-lg transition-all backdrop-blur-sm',
          isEditMode
            ? 'bg-primary hover:bg-primary/90'
            : 'bg-background/80 hover:bg-background border border-border'
        )}
        title={isEditMode ? 'Lock Layout' : 'Edit Layout'}
      >
        {isEditMode ? (
          <Lock className="h-5 w-5" />
        ) : (
          <LayoutGrid className="h-5 w-5" />
        )}
        {isEditMode && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--semantic-primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--semantic-primary)]"></span>
          </span>
        )}
      </Button>

      {/* Widget Management - Only show in edit mode */}
      {isEditMode && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
          {/* Add Widget */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg bg-[var(--semantic-success)] hover:bg-[var(--semantic-success-dark)]"
                title="Add Widget"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Widget</DialogTitle>
                <DialogDescription>
                  Choose a widget to add to your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4">
                {availableWidgets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All available widgets are already on your dashboard
                  </p>
                ) : (
                  availableWidgets.map(widget => {
                    const Icon = widget.icon;
                    return (
                      <button
                        key={widget.id}
                        onClick={() => handleAddWidget(widget.id)}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                      >
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{widget.title}</p>
                          {widget.description && (
                            <p className="text-sm text-muted-foreground">
                              {widget.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Remove Widget */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg bg-[var(--semantic-error)] hover:bg-[var(--semantic-error-dark)]"
                title="Remove Widget"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="space-y-2">
                <p className="text-sm font-medium">Remove Widget</p>
                <p className="text-xs text-muted-foreground">
                  Click a widget to remove it from your dashboard
                </p>
                {currentWidgets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No removable widgets
                  </p>
                ) : (
                  <div className="grid gap-2 mt-3">
                    {currentWidgets.map(widget => (
                      <button
                        key={widget.id}
                        onClick={() => handleRemoveWidget(widget.id)}
                        className="flex items-center gap-2 p-2 rounded-md border hover:bg-destructive hover:text-destructive-foreground transition-colors text-left text-sm"
                      >
                        <Trash2 className="h-4 w-4 flex-shrink-0" />
                        {widget.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Reset Layout */}
          <Button
            variant="default"
            size="icon"
            onClick={resetToDefault}
            className="h-10 w-10 rounded-full shadow-lg bg-[var(--semantic-primary)] hover:bg-[var(--semantic-primary-dark)]"
            title="Reset Layout"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
