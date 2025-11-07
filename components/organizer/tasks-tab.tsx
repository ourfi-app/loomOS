'use client';

import { useState } from 'react';
import {
  ListTodo,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  Star,
  Inbox,
  CalendarClock,
  FolderOpen,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  WebOSNavigationPane,
  WebOSListItemEnhanced,
  WebOSDetailPane,
  WebOSEmptyState,
  WebOSLoadingState,
} from '@/components/webos';
import { useTasks, useTaskMutations } from '@/hooks/use-api';
import { toastError, toastCRUD } from '@/lib/toast-helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TaskList {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

export default function TasksTab() {
  const [selectedListId, setSelectedListId] = useState('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    category: 'general',
    dueDate: '',
  });

  const filters = {
    status: selectedListId === 'completed' ? 'COMPLETED' : selectedListId === 'todo' ? 'TODO' : undefined,
    priority: selectedListId === 'high-priority' ? 'HIGH' : undefined,
  };

  const { data: tasksData, isLoading, mutate: refetchTasks } = useTasks(filters);
  const taskMutations = useTaskMutations();

  const tasks = tasksData || [];

  const filteredTasks = tasks.filter((task: any) => {
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const taskLists: TaskList[] = [
    { id: 'all', name: 'All Tasks', icon: <ListTodo className="h-4 w-4" /> },
    { id: 'todo', name: 'To Do', icon: <Circle className="h-4 w-4" /> },
    { id: 'completed', name: 'Completed', icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: 'high-priority', name: 'High Priority', icon: <Flag className="h-4 w-4" /> },
    { id: 'starred', name: 'Starred', icon: <Star className="h-4 w-4" /> },
    { id: 'today', name: 'Today', icon: <CalendarClock className="h-4 w-4" /> },
  ];

  const navItems = taskLists.map(list => ({
    id: list.id,
    label: list.name,
    icon: list.icon,
    active: selectedListId === list.id,
    onClick: () => setSelectedListId(list.id),
  }));

  const handleCreateTask = async () => {
    if (!editForm.title.trim()) {
      toastError('Please enter a task title');
      return;
    }

    try {
      await taskMutations.create({
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
        priority: editForm.priority,
        category: editForm.category,
        dueDate: editForm.dueDate || undefined,
      });
      setEditForm({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        category: 'general',
        dueDate: '',
      });
      setIsCreating(false);
      refetchTasks();
      toastCRUD.created('Task');
    } catch (error) {
      toastError('Failed to create task');
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask || !editForm.title.trim()) {
      toastError('Please enter a task title');
      return;
    }

    try {
      await taskMutations.update(selectedTask.id, {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        category: editForm.category,
        dueDate: editForm.dueDate || undefined,
      });
      setIsEditing(false);
      refetchTasks();
      toastCRUD.updated('Task');
    } catch (error) {
      toastError('Failed to update task');
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      await taskMutations.update(task.id, {
        status: task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED',
        completedAt: task.status === 'COMPLETED' ? null : new Date().toISOString(),
      });
      refetchTasks();
    } catch (error) {
      toastError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskMutations.delete(taskId);
      setSelectedTask(null);
      refetchTasks();
      toastCRUD.deleted('Task');
    } catch (error) {
      toastError('Failed to delete task');
    }
  };

  const startEditing = () => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title,
        description: selectedTask.description || '',
        status: selectedTask.status,
        priority: selectedTask.priority,
        category: selectedTask.category,
        dueDate: selectedTask.dueDate || '',
      });
      setIsEditing(true);
    }
  };

  const startCreating = () => {
    setEditForm({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'general',
      dueDate: '',
    });
    setIsCreating(true);
    setSelectedTask(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-full flex">
      {/* Lists Navigation */}
      <WebOSNavigationPane title="LISTS" items={navItems} />

      {/* Tasks List */}
      <div className="w-96 flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {taskLists.find(l => l.id === selectedListId)?.name || 'All Tasks'}
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => refetchTasks()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={startCreating}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <WebOSLoadingState message="Loading tasks..." />
          ) : filteredTasks.length === 0 ? (
            <WebOSEmptyState
              icon={<ListTodo className="w-12 h-12" />}
              title="No tasks"
              description="Create your first task to get started"
              action={
                <Button onClick={startCreating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              }
            />
          ) : (
            <div>
              {filteredTasks.map((task: any, index: number) => (
                <WebOSListItemEnhanced
                  key={task.id}
                  selected={selectedTask?.id === task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  animationIndex={index}
                >
                  <div className="flex items-start gap-3 px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task);
                      }}
                      className="mt-0.5"
                    >
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-sm font-medium truncate",
                            task.status === 'COMPLETED' && "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </span>
                        {task.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </WebOSListItemEnhanced>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Task Details/Editor */}
      <div className="flex-1 flex flex-col bg-background">
        {isCreating || isEditing ? (
          // Edit Mode
          <>
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">{isCreating ? 'New Task' : 'Edit Task'}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={isCreating ? handleCreateTask : handleUpdateTask}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4 max-w-2xl">
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="Task title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Add details..."
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select value={editForm.priority} onValueChange={(v) => setEditForm({ ...editForm, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          // View Mode
          <WebOSDetailPane
            title={selectedTask?.title}
            subtitle={selectedTask?.category}
            actions={
              selectedTask ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={startEditing}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Delete this task?')) {
                        handleDeleteTask(selectedTask.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : undefined
            }
            isEmpty={!selectedTask}
            emptyIcon={<ListTodo className="w-16 h-16" />}
            emptyMessage="No task selected"
            emptySubMessage="Select a task from the list or create a new one"
          >
            {selectedTask && (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleComplete(selectedTask)}
                      className="flex-shrink-0"
                    >
                      {selectedTask.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {selectedTask.status === 'COMPLETED' ? 'Completed' : 'Not completed'}
                    </span>
                  </div>

                  {selectedTask.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Description
                      </h3>
                      <p className="text-sm whitespace-pre-wrap">{selectedTask.description}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Priority
                      </h3>
                      <Badge className={getPriorityColor(selectedTask.priority)}>
                        <Flag className="h-3 w-3 mr-1" />
                        {selectedTask.priority}
                      </Badge>
                    </div>

                    {selectedTask.dueDate && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Due Date
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Category
                      </h3>
                      <Badge variant="outline">{selectedTask.category}</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
                    <div>Created: {new Date(selectedTask.createdAt).toLocaleString()}</div>
                    <div>Updated: {new Date(selectedTask.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </WebOSDetailPane>
        )}
      </div>
    </div>
  );
}
