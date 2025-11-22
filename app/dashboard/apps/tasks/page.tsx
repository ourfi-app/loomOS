'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Filter,
  Star,
  Calendar,
  User,
  AlertCircle,
  ListTodo,
} from 'lucide-react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  user?: {
    name: string;
    email: string;
  };
  assignedToUser?: {
    name: string;
    email: string;
  };
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  DONE: CheckCircle2,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('all');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const url = filter !== 'all' 
        ? `/api/tasks?status=${filter.toLowerCase()}`
        : '/api/tasks';
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 
                     currentStatus === 'TODO' ? 'IN_PROGRESS' : 'DONE';
    
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const getStatusCounts = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: tasks.filter(t => t.status === 'DONE').length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <DesktopAppWrapper
        title="Tasks"
        icon={<ListTodo className="w-5 h-5" />}
        gradient="from-purple-500 to-pink-500"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title="Tasks"
      icon={<ListTodo className="w-5 h-5" />}
      gradient="from-purple-500 to-pink-500"
      toolbar={
        <>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </>
      }
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.total}</div>
                <p className="text-xs text-muted-foreground">All active tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Do</CardTitle>
                <Circle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.todo}</div>
                <p className="text-xs text-muted-foreground">Ready to start</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.inProgress}</div>
                <p className="text-xs text-muted-foreground">Currently working</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.done}</div>
                <p className="text-xs text-muted-foreground">Finished tasks</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              <Filter className="h-4 w-4 mr-2" />
              All Tasks
            </Button>
            <Button
              variant={filter === 'TODO' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('TODO')}
            >
              <Circle className="h-4 w-4 mr-2" />
              To Do
            </Button>
            <Button
              variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('IN_PROGRESS')}
            >
              <Clock className="h-4 w-4 mr-2" />
              In Progress
            </Button>
            <Button
              variant={filter === 'DONE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('DONE')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </Button>
          </div>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {filter === 'all' ? 'All your tasks' : `${filter.replace('_', ' ').toLowerCase()} tasks`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No tasks found</p>
                    <p className="text-sm">Create a new task to get started</p>
                  </div>
                ) : (
                  tasks.map((task) => {
                    const StatusIcon = statusIcons[task.status];
                    const isDone = task.status === 'DONE';
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-all",
                          isDone && "opacity-60"
                        )}
                      >
                        <div className="flex items-center pt-1">
                          <Checkbox
                            checked={isDone}
                            onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                            className="h-5 w-5"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(
                                  "font-medium truncate",
                                  isDone && "line-through"
                                )}>
                                  {task.title}
                                </h3>
                                {task.isFavorite && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              
                              {task.description && (
                                <p className={cn(
                                  "text-sm text-muted-foreground line-clamp-2 mb-2",
                                  isDone && "line-through"
                                )}>
                                  {task.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 items-center">
                                <Badge className={priorityColors[task.priority]} variant="secondary">
                                  {task.priority}
                                </Badge>
                                
                                <Badge variant="outline" className="gap-1">
                                  <StatusIcon className="h-3 w-3" />
                                  {task.status.replace('_', ' ')}
                                </Badge>

                                {task.category && (
                                  <Badge variant="secondary">
                                    {task.category}
                                  </Badge>
                                )}

                                {task.dueDate && (
                                  <div className={cn(
                                    "flex items-center gap-1 text-xs",
                                    isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"
                                  )}>
                                    {isOverdue && <AlertCircle className="h-3 w-3" />}
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}

                                {task.assignedToUser && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    {task.assignedToUser.name || task.assignedToUser.email}
                                  </div>
                                )}
                              </div>

                              {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 rounded-full bg-muted"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
