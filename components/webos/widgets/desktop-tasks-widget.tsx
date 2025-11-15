
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle2, Circle, Plus, AlertCircle, Filter, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { DesktopWidget } from '@/lib/desktop-widget-store';

interface Task {
  id: string;
  title: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category?: string;
}

interface DesktopTasksWidgetProps {
  widget: DesktopWidget;
}

export function DesktopTasksWidget({ widget }: DesktopTasksWidgetProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'high'>(
    widget.settings.filter || 'all'
  );

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Review monthly budget report',
          dueDate: 'Today',
          priority: 'high',
          completed: false,
          category: 'Finance',
        },
        {
          id: '2',
          title: 'Submit maintenance request form',
          dueDate: 'Tomorrow',
          priority: 'medium',
          completed: false,
          category: 'Property',
        },
        {
          id: '3',
          title: 'RSVP to community BBQ',
          dueDate: 'This week',
          priority: 'low',
          completed: false,
          category: 'Social',
        },
        {
          id: '4',
          title: 'Pay quarterly HOA fees',
          dueDate: 'Next week',
          priority: 'high',
          completed: false,
          category: 'Finance',
        },
      ];

      setTasks(mockTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchTasks, widget.refreshInterval]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'today':
        return tasks.filter(t => t.dueDate === 'Today');
      case 'high':
        return tasks.filter(t => t.priority === 'high');
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const incompleteTasks = filteredTasks.filter(t => !t.completed);
  const highPriorityCount = tasks.filter(t => !t.completed && t.priority === 'high').length;

  const handleTaskToggle = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const handleOpenApp = () => {
    router.push('/dashboard/apps/tasks');
  };

  const priorityColors = {
    high: 'text-[var(--semantic-error)] border-[var(--semantic-error-border)]',
    medium: 'text-[var(--semantic-warning)] border-[var(--semantic-warning-bg)]',
    low: 'text-[var(--semantic-success)] border-[var(--semantic-success-bg)]',
  };

  if (loading) {
    return (
      <div className="h-full p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Stats Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold">{incompleteTasks.length}</p>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleOpenApp}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open App
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {(['all', 'today', 'high'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {f === 'all' && 'All'}
              {f === 'today' && 'Today'}
              {f === 'high' && 'High Priority'}
            </button>
          ))}
        </div>
      </div>

      {/* High Priority Alert */}
      {highPriorityCount > 0 && (
        <div className="mx-4 mt-3 p-2.5 bg-[var(--semantic-error-bg)] dark:bg-red-950/20 rounded-lg flex items-center gap-2 border border-[var(--semantic-error-border)] dark:border-red-900">
          <AlertCircle className="h-3.5 w-3.5 text-[var(--semantic-error)] flex-shrink-0" />
          <span className="text-xs text-[var(--semantic-error-dark)] dark:text-[var(--semantic-error)]">
            {highPriorityCount} high priority {highPriorityCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      )}

      {/* Task List */}
      <ScrollArea className="flex-1 px-2 py-2">
        {incompleteTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No {filter} tasks</p>
          </div>
        ) : (
          <div className="space-y-1">
            {incompleteTasks.map(task => (
              <button
                key={task.id}
                onClick={() => handleTaskToggle(task.id)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg',
                  'hover:bg-accent/50 transition-colors text-left group'
                )}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className={cn('h-5 w-5 flex-shrink-0 mt-0.5', priorityColors[task.priority])} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium',
                    task.completed && 'line-through text-muted-foreground'
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    )}
                    {task.category && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {task.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Quick Add Footer */}
      <div className="p-3 border-t bg-muted/20">
        <Button
          size="sm"
          variant="outline"
          className="w-full h-9"
          onClick={() => router.push('/dashboard/apps/tasks?action=new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Add Task
        </Button>
      </div>
    </div>
  );
}
