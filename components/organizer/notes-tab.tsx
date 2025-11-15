'use client';

import { useState } from 'react';
import {
  FileText,
  Star,
  Archive,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Heart,
  Lightbulb,
  Briefcase,
  Home,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  LoomOSListItemEnhanced,
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSEmptyState,
  LoomOSLoadingState,
} from '@/components/webos';
import { useNotes, useNoteMutations } from '@/hooks/use-api';
import { toastError, toastCRUD } from '@/lib/toast-helpers';

interface NoteCategory {
  id: string;
  name: string;
  icon: any;
}

export default function NotesTab() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const filters = {
    category: selectedCategory !== 'all' && selectedCategory !== 'favorites' && selectedCategory !== 'archived'
      ? selectedCategory
      : undefined,
    favorite: selectedCategory === 'favorites' ? true : undefined,
    archived: selectedCategory === 'archived' ? true : undefined,
  };

  const { data: notesData, error, isLoading, mutate: refetchNotes } = useNotes(filters);
  const noteMutations = useNoteMutations();

  const notes = notesData || [];

  const categories: NoteCategory[] = [
    { id: 'all', name: 'All Notes', icon: FileText },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'personal', name: 'Personal', icon: Heart },
    { id: 'work', name: 'Work', icon: Briefcase },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb },
    { id: 'home', name: 'Home', icon: Home },
    { id: 'archived', name: 'Archived', icon: Archive },
  ];

  const navItems = categories.map(category => ({
    id: category.id,
    label: category.name,
    icon: <category.icon className="h-4 w-4" />,
    count: category.id === 'all' ? notes.length : undefined,
    active: selectedCategory === category.id,
    onClick: () => setSelectedCategory(category.id),
  }));

  const handleCreateNote = async () => {
    if (!editForm.title.trim()) {
      toastError('Please enter a title');
      return;
    }

    try {
      await noteMutations.create({
        title: editForm.title,
        content: editForm.content,
        category: selectedCategory === 'all' || selectedCategory === 'favorites' || selectedCategory === 'archived'
          ? 'personal'
          : selectedCategory,
      });
      setEditForm({ title: '', content: '' });
      setIsCreating(false);
      refetchNotes();
      toastCRUD.created('Note');
    } catch (error) {
      toastError('Failed to create note');
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote || !editForm.title.trim()) {
      toastError('Please enter a title');
      return;
    }

    try {
      await noteMutations.update(selectedNote.id, {
        title: editForm.title,
        content: editForm.content,
      });
      setIsEditing(false);
      refetchNotes();
      toastCRUD.updated('Note');
    } catch (error) {
      toastError('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await noteMutations.delete(noteId);
      setSelectedNote(null);
      refetchNotes();
      toastCRUD.deleted('Note');
    } catch (error) {
      toastError('Failed to delete note');
    }
  };

  const handleToggleFavorite = async (note: any) => {
    try {
      await noteMutations.update(note.id, { isFavorite: !note.isFavorite });
      refetchNotes();
    } catch (error) {
      toastError('Failed to update note');
    }
  };

  const startEditing = () => {
    if (selectedNote) {
      setEditForm({ title: selectedNote.title, content: selectedNote.content });
      setIsEditing(true);
    }
  };

  const startCreating = () => {
    setEditForm({ title: '', content: '' });
    setIsCreating(true);
    setSelectedNote(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditForm({ title: '', content: '' });
  };

  return (
    <div className="h-full flex">
      {/* Categories Navigation */}
      <LoomOSNavigationPane title="CATEGORIES" items={navItems} />

      {/* Notes List */}
      <div className="w-80 flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {categories.find(c => c.id === selectedCategory)?.name || 'All Notes'}
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => refetchNotes()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={startCreating}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <LoomOSLoadingState message="Loading notes..." />
          ) : notes.length === 0 ? (
            <LoomOSEmptyState
              icon={<FileText className="w-12 h-12" />}
              title="No notes"
              description="Create your first note to get started"
              action={
                <Button onClick={startCreating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              }
            />
          ) : (
            <div>
              {notes.map((note: any, index: number) => (
                <LoomOSListItemEnhanced
                  key={note.id}
                  selected={selectedNote?.id === note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  animationIndex={index}
                >
                  <div className="flex items-start gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{note.title}</span>
                        {note.isFavorite && <Star className="w-3 h-3 text-[var(--semantic-warning)] fill-yellow-500" />}
                        {note.isPinned && <span className="text-xs">📌</span>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {note.content || 'No content'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {note.category && (
                          <Badge variant="secondary" className="text-xs">
                            {note.category}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </LoomOSListItemEnhanced>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Note Details/Editor */}
      <div className="flex-1 flex flex-col bg-background">
        {isCreating || isEditing ? (
          // Edit Mode
          <>
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">{isCreating ? 'New Note' : 'Edit Note'}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={isCreating ? handleCreateNote : handleUpdateNote}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4 max-w-3xl">
                <div>
                  <Input
                    placeholder="Note title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
                  />
                </div>
                <Textarea
                  placeholder="Start typing..."
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="min-h-[400px] border-0 px-0 focus-visible:ring-0 resize-none"
                />
              </div>
            </div>
          </>
        ) : (
          // View Mode
          <LoomOSDetailPane
            title={selectedNote?.title}
            subtitle={selectedNote ? new Date(selectedNote.updatedAt).toLocaleString() : undefined}
            actions={
              selectedNote ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(selectedNote)}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        selectedNote.isFavorite && "fill-yellow-500 text-[var(--semantic-warning)]"
                      )}
                    />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={startEditing}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Delete this note?')) {
                        handleDeleteNote(selectedNote.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : undefined
            }
            isEmpty={!selectedNote}
            emptyIcon={<FileText className="w-16 h-16" />}
            emptyMessage="No note selected"
            emptySubMessage="Select a note from the list or create a new one"
          >
            {selectedNote && (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedNote.content || 'No content'}</p>
                  </div>
                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </LoomOSDetailPane>
        )}
      </div>
    </div>
  );
}
