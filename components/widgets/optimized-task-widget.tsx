
'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category?: string;
  tags?: string[];
}

// Performance optimization: Memoized task item component
const TaskItem = memo(({ 
  task, 
  onToggle 
}: { 
  task: Task; 
  onToggle: (id: string) => void;
}) => {
  const priorityColors = {
    high: 'text-red-500 border-red-200',
    medium: 'text-yellow-500 border-yellow-200',
    low: 'text-green-500 border-green-200',
  };

  return (
    <button
      onClick={() => onToggle(task.id)}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-lg',
        'hover:bg-accent/50 transition-colors text-left',
        task.completed && 'opacity-50'
      )}
    >
      {task.completed ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
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
        {task.dueDate && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  );
});

TaskItem.displayName = 'TaskItem';

export const OptimizedTasksWidget = memo(() => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

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
          tags: ['urgent', 'admin'],
        },
        {
          id: '2',
          title: 'Submit maintenance request form',
          dueDate: 'Tomorrow',
          priority: 'medium',
          completed: false,
          category: 'Property',
          tags: ['maintenance'],
        },
        {
          id: '3',
          title: 'RSVP to community BBQ',
          dueDate: 'This week',
          priority: 'low',
          completed: false,
          category: 'Social',
          tags: ['event'],
        },
        {
          id: '4',
          title: 'Pay quarterly HOA fees',
          dueDate: 'Next week',
          priority: 'high',
          completed: false,
          category: 'Finance',
          tags: ['payment', 'important'],
        },
        {
          id: '5',
          title: 'Update emergency contact info',
          priority: 'medium',
          completed: true,
          category: 'Personal',
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
    // Refresh every 5 minutes
    const interval = setInterval(fetchTasks, 300000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Performance optimization: Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'today':
        return tasks.filter(t => t.dueDate === 'Today');
      case 'upcoming':
        return tasks.filter(t => t.dueDate && t.dueDate !== 'Today');
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Performance optimization: Memoize stats
  const stats = useMemo(() => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    return {
      total: incompleteTasks.length,
      high: incompleteTasks.filter(t => t.priority === 'high').length,
      today: incompleteTasks.filter(t => t.dueDate === 'Today').length,
    };
  }, [tasks]);

  // Performance optimization: useCallback for handlers
  const handleTaskToggle = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const handleViewAll = useCallback(() => {
    router.push('/dashboard/apps/tasks');
  }, [router]);

  const handleAddTask = useCallback(() => {
    router.push('/dashboard/apps/tasks?action=new');
  }, [router]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Tasks</h3>
          <p className="text-sm text-muted-foreground">
            {stats.total} active {stats.total === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <button
          onClick={handleAddTask}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Add task"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'today', 'upcoming'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      {stats.high > 0 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-400">
            {stats.high} high priority {stats.high === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      )}

      {/* Task List */}
      <ScrollArea className="h-[300px]">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No {filter} tasks</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* View All Button */}
      <button
        onClick={handleViewAll}
        className="w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-accent rounded-lg transition-colors"
      >
        View all tasks
      </button>
    </Card>
  );
});

OptimizedTasksWidget.displayName = 'OptimizedTasksWidget';

// Export as default for lazy loading
export default OptimizedTasksWidget;
