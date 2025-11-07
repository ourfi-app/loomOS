'use client';

import { useState } from 'react';
import { Plus, Grid3x3, X, Settings2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDesktopWidgets } from '@/lib/desktop-widget-store';
import { cn } from '@/lib/utils';
import {
  MdCheckCircle,
  MdStickyNote2,
  MdNotifications,
  MdEmail,
  MdDashboard,
  MdTrendingUp,
} from 'react-icons/md';

interface WidgetOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'productivity' | 'communication' | 'information';
}

const AVAILABLE_WIDGETS: WidgetOption[] = [
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'Quick access to your tasks and to-do lists',
    icon: MdCheckCircle,
    category: 'productivity',
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'View and create quick notes',
    icon: MdStickyNote2,
    category: 'productivity',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Stay updated with real-time notifications',
    icon: MdNotifications,
    category: 'communication',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Quick inbox preview and actions',
    icon: MdEmail,
    category: 'communication',
  },
  {
    id: 'stats',
    name: 'Quick Stats',
    description: 'Dashboard overview and key metrics',
    icon: MdDashboard,
    category: 'information',
  },
  {
    id: 'activity',
    name: 'Activity Feed',
    description: 'Recent activity and updates',
    icon: MdTrendingUp,
    category: 'information',
  },
];

export function DesktopWidgetManager() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { widgets, addWidget, removeWidget, clearAllWidgets, resetAllWidgets } = useDesktopWidgets();

  const activeWidgetTypes = widgets.map(w => w.widgetType);
  
  const filteredWidgets = selectedCategory === 'all'
    ? AVAILABLE_WIDGETS
    : AVAILABLE_WIDGETS.filter(w => w.category === selectedCategory);

  const handleAddWidget = (widgetId: string) => {
    addWidget(widgetId);
  };

  const handleRemoveWidget = (widgetId: string) => {
    const widget = widgets.find(w => w.widgetType === widgetId);
    if (widget) {
      removeWidget(widget.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Floating button removed - widgets are managed via desktop context menu (right-click) */}
      {/* <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-50 h-12 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Grid3x3 className="h-4 w-4 mr-2" />
          Manage Widgets
          {widgets.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {widgets.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger> */}
      
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Desktop Widgets
          </DialogTitle>
          <DialogDescription>
            Add, remove, and manage your desktop widgets. Widgets appear on your desktop for quick access to information.
          </DialogDescription>
        </DialogHeader>

        {/* Active Widgets Section */}
        {widgets.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Active Widgets ({widgets.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllWidgets}
                className="h-8 text-destructive hover:text-destructive"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {widgets.map(widget => {
                const widgetOption = AVAILABLE_WIDGETS.find(w => w.id === widget.widgetType);
                if (!widgetOption) return null;
                const Icon = widgetOption.icon;
                
                return (
                  <div
                    key={widget.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{widgetOption.name}</span>
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="ml-1 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 pb-2 border-b">
          {(['all', 'productivity', 'communication', 'information'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Available Widgets Grid */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredWidgets.map(widget => {
              const Icon = widget.icon;
              const isActive = activeWidgetTypes.includes(widget.id);
              
              return (
                <Card
                  key={widget.id}
                  className={cn(
                    'p-4 transition-all hover:shadow-md cursor-pointer',
                    isActive && 'ring-2 ring-primary'
                  )}
                  onClick={() => isActive ? handleRemoveWidget(widget.id) : handleAddWidget(widget.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          isActive ? 'bg-primary/10' : 'bg-muted'
                        )}>
                          <Icon className={cn(
                            'h-5 w-5',
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          )} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">{widget.name}</h4>
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {widget.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <button
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {isActive ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllWidgets}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
