'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  ListTodo,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Flag,
  Star,
  CheckCircle2,
  Circle,
  Clock,
  Tag,
  User,
  Edit,
  Trash2,
  X,
  Save,
  ChevronRight,
  MoreVertical,
  FolderOpen,
  Inbox,
  AlertCircle,
  CalendarClock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary, VirtualList, DeprecationNotice } from '@/components/common';
import { TaskListSkeleton } from '@/components/common/skeleton-screens';
import { toastSuccess, toastError, toastValidationError, toastCRUD } from '@/lib/toast-helpers';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import {
  LoomOSNavigationPane,
  LoomOSListPane,
  LoomOSAppHeader,
  LoomOSListItemEnhanced
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useTasks, useTaskMutations } from '@/hooks/use-api';
import { useDeepLinkSelection } from '@/hooks/use-deep-link';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  completedAt?: string | null;
  userId: string;
  assignedTo?: string | null;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskList {
  id: string;
  name: string;
  icon: React.ReactNode;
  category?: string;
  filter?: (tasks: Task[]) => Task[];
}

export default function TasksApp() {
  const session = useSession()?.data;
  const [selectedListId, setSelectedListId] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isInlineAdding, setIsInlineAdding] = useState(false);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    category: 'general',
    dueDate: '',
    tags: [] as string[],
  });

  // Use new hooks
  const { data: tasksData, error: tasksError, isLoading, mutate: refetchTasks } = useTasks();
  const taskMutations = useTaskMutations();
  
  const tasks = tasksData || [];

  // Deep Link Support: Auto-select task when navigating from notifications
  useDeepLinkSelection({
    items: tasks,
    onSelect: setSelectedTask,
    enabled: tasks.length > 0,
  });

  // Task lists configuration
  const taskLists: TaskList[] = [
    {
      id: 'all',
      name: 'All Tasks',
      icon: <ListTodo className="w-4 h-4" />,
      filter: (tasks) => tasks.filter(t => t.status !== 'COMPLETED'),
    },
    {
      id: 'unfiled',
      name: 'Unfiled',
      icon: <Inbox className="w-4 h-4" />,
      category: 'general',
      filter: (tasks) => tasks.filter(t => t.category === 'general' && t.status !== 'COMPLETED'),
    },
    {
      id: 'today',
      name: 'Today',
      icon: <CalendarClock className="w-4 h-4" />,
      filter: (tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tasks.filter(t => {
          if (!t.dueDate || t.status === 'COMPLETED') return false;
          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      },
    },
    {
      id: 'overdue',
      name: 'Overdue',
      icon: <AlertCircle className="w-4 h-4" />,
      filter: (tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(t => {
          if (!t.dueDate || t.status === 'COMPLETED') return false;
          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
      },
    },
    {
      id: 'work',
      name: 'Work',
      icon: <FolderOpen className="w-4 h-4" />,
      category: 'work',
      filter: (tasks) => tasks.filter(t => t.category === 'work' && t.status !== 'COMPLETED'),
    },
    {
      id: 'personal',
      name: 'Personal',
      icon: <User className="w-4 h-4" />,
      category: 'personal',
      filter: (tasks) => tasks.filter(t => t.category === 'personal' && t.status !== 'COMPLETED'),
    },
    {
      id: 'household',
      name: 'Household',
      icon: <FolderOpen className="w-4 h-4" />,
      category: 'household',
      filter: (tasks) => tasks.filter(t => t.category === 'household' && t.status !== 'COMPLETED'),
    },
    {
      id: 'community',
      name: 'Community',
      icon: <FolderOpen className="w-4 h-4" />,
      category: 'community',
      filter: (tasks) => tasks.filter(t => t.category === 'community' && t.status !== 'COMPLETED'),
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4" />,
      filter: (tasks) => tasks.filter(t => t.status === 'COMPLETED'),
    },
  ];

  const priorityLevels = [
    { value: 'LOW', label: 'Low', color: 'text-gray-500' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-blue-500' },
    { value: 'HIGH', label: 'High', color: 'text-orange-500' },
    { value: 'URGENT', label: 'Urgent', color: 'text-red-500' },
  ];

  useEffect(() => {
    if (isInlineAdding && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [isInlineAdding]);

  // Show error toast if tasks failed to load
  useEffect(() => {
    if (tasksError) {
      toastError(tasksError);
    }
  }, [tasksError]);

  const getCurrentList = () => {
    return taskLists.find(list => list.id === selectedListId) || taskLists[0];
  };

  const getFilteredTasks = () => {
    const currentList = getCurrentList();
    let filtered = (currentList && currentList.filter) ? currentList.filter(tasks) : tasks;
    
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const handleQuickAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const currentList = getCurrentList();
      const category = currentList?.category || 'general';
      
      const response = await taskMutations.createTask({
        title: newTaskTitle,
        status: 'TODO',
        priority: 'MEDIUM',
        category: category,
      });

      if (response.success) {
        await refetchTasks();
        setNewTaskTitle('');
        setIsInlineAdding(false);
        toastCRUD.created('Task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toastError('Failed to create task');
    }
  };

  const handleCreateTaskWithDetails = () => {
    const currentList = getCurrentList();
    setIsCreating(true);
    setEditForm({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: currentList?.category || 'general',
      dueDate: '',
      tags: [],
    });
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setIsCreating(false);
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || '',
      tags: task.tags,
    });
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = async () => {
    try {
      if (!editForm.title.trim()) {
        toastValidationError('Please enter a title for the task');
        return;
      }

      if (isCreating) {
        const response = await taskMutations.createTask(editForm);

        if (response.success) {
          await refetchTasks();
          setIsTaskDialogOpen(false);
          toastCRUD.created('Task');
        }
      } else if (selectedTask) {
        const response = await taskMutations.updateTask(selectedTask.id, editForm);

        if (response.success) {
          await refetchTasks();
          setSelectedTask(null);
          setIsTaskDialogOpen(false);
          toastCRUD.updated('Task');
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toastError('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await taskMutations.deleteTask(taskId);

      if (response.success) {
        await refetchTasks();
        setSelectedTask(null);
        setIsTaskDialogOpen(false);
        toastCRUD.deleted('Task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toastError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      const response = await taskMutations.toggleComplete(task.id, task);

      if (response.success) {
        await refetchTasks();
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toastError('Failed to update task');
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = priorityLevels.find((pl) => pl.value === priority);
    return p?.color || 'text-gray-500';
  };

  const formatDueDate = (dueDate: string | null | undefined) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'TODAY';
    } else if (taskDate < today) {
      return 'OVERDUE';
    } else {
      return format(date, 'MMM d');
    }
  };

  const filteredTasks = getFilteredTasks();
  const incompleteCount = filteredTasks.filter(t => t.status !== 'COMPLETED').length;
  const currentList = getCurrentList();

  // Menu items for the app window
  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Task', icon: <Plus size={14} />, onClick: handleCreateTaskWithDetails },
        { label: 'Refresh', icon: <RefreshCw size={14} />, onClick: () => refetchTasks() },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Edit Task', icon: <Edit size={14} />, onClick: () => { if (selectedTask) handleEditTask(selectedTask); }, disabled: !selectedTask },
        { label: 'Delete Task', icon: <Trash2 size={14} />, onClick: () => { if (selectedTask) handleDeleteTask(selectedTask.id); }, disabled: !selectedTask },
        { label: 'Toggle Complete', icon: <CheckCircle2 size={14} />, onClick: () => { if (selectedTask) handleToggleComplete(selectedTask); }, disabled: !selectedTask },
      ],
    },
    {
      label: 'View',
      items: taskLists.map(list => ({
        label: list.name,
        onClick: () => setSelectedListId(list.id),
      })),
    },
  ];

  // Build navigation items with count instead of badge
  const navItemsForPane = taskLists.map(list => {
    const taskCount = list.filter ? list.filter(tasks).length : 0;
    return {
      id: list.id,
      label: list.name,
      icon: list.icon,
      count: taskCount,
      active: selectedListId === list.id,
      onClick: () => setSelectedListId(list.id),
    };
  });

  return (
    <ErrorBoundary>
      {/* Deprecation Notice */}
      <DeprecationNotice
        app={APP_REGISTRY['tasksApp']}
        prominent
        permanent
        className="border-b border-gray-200"
      />

      {/* Tasks Content */}
        <div className="h-full flex flex-col overflow-hidden">
      <LoomOSAppHeader
        appName="Tasks"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 h-9 bg-white/50 border-0 rounded-full"
              />
            </div>
            <Button
              size="sm"
              onClick={handleCreateTaskWithDetails}
              className="webos-pebble h-9"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Pane - Lists */}
        <LoomOSNavigationPane
          title="LISTS"
          items={navItemsForPane}
        />

        {/* Main Tasks Pane */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-sm font-semibold text-gray-700">
              {currentList?.name?.toUpperCase() || 'TASKS'} ({incompleteCount} incomplete)
            </h2>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4">
                <TaskListSkeleton count={8} />
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {/* Inline Task Addition */}
                {!isInlineAdding ? (
                  <button
                    onClick={() => setIsInlineAdding(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-orange-400 transition-colors" />
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      + Add task
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-orange-200">
                    <div className="w-5 h-5 rounded border-2 border-gray-300" />
                    <Input
                      ref={inlineInputRef}
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickAddTask();
                        } else if (e.key === 'Escape') {
                          setIsInlineAdding(false);
                          setNewTaskTitle('');
                        }
                      }}
                      onBlur={() => {
                        if (!newTaskTitle.trim()) {
                          setIsInlineAdding(false);
                        }
                      }}
                      placeholder="Task title..."
                      className="flex-1 border-0 focus-visible:ring-0 px-0 h-auto"
                    />
                  </div>
                )}

                {/* Task List with Virtual Scrolling */}
                {filteredTasks.length === 0 && !isInlineAdding ? (
                  <div className="flex items-center justify-center py-12 text-gray-400">
                    <div className="text-center">
                      <p className="text-sm mb-2">No tasks in this list</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCreateTaskWithDetails}
                      >
                        Add your first task
                      </Button>
                    </div>
                  </div>
                ) : filteredTasks.length > 0 ? (
                  <VirtualList
                    items={filteredTasks}
                    renderItem={(task, index) => {
                      const isCompleted = task.status === 'COMPLETED';
                      const dueDateLabel = formatDueDate(task.dueDate);
                      const isOverdue = dueDateLabel === 'OVERDUE';
                      const isToday = dueDateLabel === 'TODAY';

                      return (
                        <LoomOSListItemEnhanced
                          key={task.id}
                          onClick={() => handleEditTask(task)}
                          animationIndex={index}
                          className={cn(isCompleted && 'opacity-60')}
                        >
                          <div className="group flex items-start gap-3 px-4 py-3">
                            {/* Checkbox */}
                            <button
                              onClick={(e) => handleToggleComplete(task, e)}
                              className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
                            >
                              <div
                                className={cn(
                                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                                  isCompleted
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-orange-400'
                                )}
                              >
                                {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                            </button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={cn(
                                    'font-medium text-sm text-gray-800 dark:text-gray-200',
                                    isCompleted && 'line-through text-gray-500'
                                  )}
                                >
                                  {task.title}
                                </h4>
                                {task.priority !== 'MEDIUM' && !isCompleted && (
                                  <Flag className={cn('w-3 h-3 flex-shrink-0', getPriorityColor(task.priority))} />
                                )}
                              </div>

                              {/* Due Date */}
                              {dueDateLabel && !isCompleted && (
                                <div
                                  className={cn(
                                    'text-xs mt-1 font-medium',
                                    isOverdue && 'text-red-500',
                                    isToday && 'text-orange-500',
                                    !isOverdue && !isToday && 'text-gray-500'
                                  )}
                                >
                                  {dueDateLabel}
                                </div>
                              )}

                              {/* Completed Date */}
                              {isCompleted && task.completedAt && (
                                <div className="text-xs text-gray-500 mt-1">
                                  ✓ Completed {format(new Date(task.completedAt), 'MMM d')}
                                </div>
                              )}
                            </div>

                            {/* More Options */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </LoomOSListItemEnhanced>
                      );
                    }}
                    estimatedItemHeight={75}
                    className="h-full"
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Edit/Create Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create Task' : 'Edit Task'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Enter task title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Add a description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">List</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Unfiled</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="household">Household</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editForm.priority}
                  onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              />
            </div>

            {!isCreating && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {!isCreating && selectedTask && (
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTask} className="webos-pebble">
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Create' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </ErrorBoundary>
  );
}
