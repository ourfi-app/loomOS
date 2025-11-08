
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FileText,
  Star,
  Archive,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Folder,
  Tag,
  Pin,
  Save,
  X,
  Heart,
  Lightbulb,
  Briefcase,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary, DeprecationNotice } from '@/components/common';
import { CardSkeleton } from '@/components/common/skeleton-screens';
import { toastError, toastCRUD } from '@/lib/toast-helpers';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { useNotes, useNoteMutations } from '@/hooks/use-api';
import { useDeepLinkSelection } from '@/hooks/use-deep-link';
import {
  LoomOSListItemEnhanced,
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSActionButton,
  LoomOSEmptyState,
  LoomOSLoadingState
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';

interface NoteCategory {
  id: string;
  name: string;
  icon: any;
  count?: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color?: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NotesApp() {
  const session = useSession()?.data;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  // Use new hooks
  const filters = {
    category: selectedCategory !== 'all' && selectedCategory !== 'favorites' && selectedCategory !== 'archived' 
      ? selectedCategory 
      : undefined,
    favorite: selectedCategory === 'favorites' ? true : undefined,
    archived: selectedCategory === 'archived' ? true : undefined,
  };
  
  const { data: notesData, error: notesError, isLoading, mutate: refetchNotes } = useNotes(filters);
  const noteMutations = useNoteMutations();
  
  const notes = notesData || [];

  // Deep Link Support: Auto-select note when navigating from notifications
  useDeepLinkSelection({
    items: notes,
    onSelect: setSelectedNote,
    enabled: notes.length > 0,
  });

  const categories: NoteCategory[] = [
    { id: 'all', name: 'All Notes', icon: FileText },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'general', name: 'General', icon: Folder },
    { id: 'personal', name: 'Personal', icon: Heart },
    { id: 'work', name: 'Work', icon: Briefcase },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb },
    { id: 'home', name: 'Home', icon: Home },
    { id: 'archived', name: 'Archived', icon: Archive },
  ];

  // Show error toast if notes failed to load
  useEffect(() => {
    if (notesError) {
      toastError(notesError);
    }
  }, [notesError]);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNote = () => {
    setIsCreating(true);
    setIsEditing(true);
    setSelectedNote(null);
    setEditForm({ title: '', content: '' });
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setIsEditing(true);
      setEditForm({ title: selectedNote.title, content: selectedNote.content });
    }
  };

  const handleSaveNote = async () => {
    try {
      if (isCreating) {
        // Create new note
        const response = await noteMutations.createNote({
          title: editForm.title,
          content: editForm.content,
          category: selectedCategory === 'all' || selectedCategory === 'favorites' || selectedCategory === 'archived' 
            ? 'general' 
            : selectedCategory,
        });

        if (response.success) {
          await refetchNotes();
          setSelectedNote(response.data);
          setIsCreating(false);
          setIsEditing(false);
          toastCRUD.created('Note');
        }
      } else if (selectedNote) {
        // Update existing note
        const response = await noteMutations.updateNote(selectedNote.id, {
          title: editForm.title,
          content: editForm.content,
        });

        if (response.success) {
          await refetchNotes();
          setSelectedNote(response.data);
          setIsEditing(false);
          toastCRUD.updated('Note');
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toastError('Failed to save note');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (isCreating) {
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await noteMutations.deleteNote(selectedNote.id);

        if (response.success) {
          await refetchNotes();
          setSelectedNote(null);
          toastCRUD.deleted('Note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        toastError('Failed to delete note');
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedNote) return;

    try {
      const response = await noteMutations.toggleFavorite(selectedNote.id, selectedNote.isFavorite);

      if (response.success) {
        await refetchNotes();
        setSelectedNote(response.data);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toastError('Failed to update favorite');
    }
  };

  const handleTogglePin = async () => {
    if (!selectedNote) return;

    try {
      const response = await noteMutations.togglePin(selectedNote.id, selectedNote.isPinned);

      if (response.success) {
        await refetchNotes(); // Refresh to update order
        setSelectedNote(response.data);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toastError('Failed to pin note');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getFilteredNotes = () => {
    if (!searchQuery) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  };

  const filteredNotes = getFilteredNotes();

  // Navigation items for categories
  const navigationItems = categories.map((category) => {
    const CategoryIcon = category.icon;
    const categoryNotes = category.id === 'all' 
      ? notes
      : category.id === 'favorites'
      ? notes.filter(n => n.isFavorite)
      : category.id === 'archived'
      ? notes.filter(n => n.isArchived)
      : notes.filter(n => n.category === category.id);
    
    return {
      id: category.id,
      label: category.name,
      icon: <CategoryIcon className="w-4 h-4" />,
      count: categoryNotes.length,
      active: selectedCategory === category.id,
      onClick: () => setSelectedCategory(category.id),
    };
  });

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-64 webos-pebble"
        />
      </div>
      <LoomOSActionButton
        icon={<Plus className="w-4 h-4" />}
        onClick={handleCreateNote}
      >
        New Note
      </LoomOSActionButton>
    </div>
  );

  // Detail pane actions
  const detailActions = selectedNote && !isEditing ? (
    <div className="flex items-center gap-2">
      <LoomOSActionButton
        icon={<Edit className="w-4 h-4" />}
        onClick={handleEditNote}
        size="sm"
      >
        Edit
      </LoomOSActionButton>
      <LoomOSActionButton
        icon={<Star className={cn("w-4 h-4", selectedNote.isFavorite && "fill-yellow-400 text-yellow-400")} />}
        onClick={handleToggleFavorite}
        size="sm"
      >
        {selectedNote.isFavorite ? 'Unfavorite' : 'Favorite'}
      </LoomOSActionButton>
      <LoomOSActionButton
        icon={<Pin className={cn("w-4 h-4", selectedNote.isPinned && "fill-primary text-primary")} />}
        onClick={handleTogglePin}
        size="sm"
      >
        {selectedNote.isPinned ? 'Unpin' : 'Pin'}
      </LoomOSActionButton>
      <div className="flex-1" />
      <LoomOSActionButton
        icon={<Trash2 className="w-4 h-4" />}
        onClick={handleDeleteNote}
        variant="danger"
        size="sm"
      >
        Delete
      </LoomOSActionButton>
    </div>
  ) : undefined;

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Deprecation Notice */}
        <DeprecationNotice
          app={APP_REGISTRY['notesApp']}
          prominent
          permanent
          className="border-b border-gray-200"
        />

        <div className="flex-1 flex overflow-hidden">
            {/* Navigation Pane - Categories */}
            <LoomOSNavigationPane
              title="CATEGORIES"
              items={navigationItems}
            />

          {/* List Pane - Notes */}
          <div className="w-96 flex-shrink-0 border-r border-border flex flex-col bg-background">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-border bg-card/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">
                    {categories.find(c => c.id === selectedCategory)?.name || 'Notes'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <ScrollArea className="flex-1">
              {isLoading ? (
                <LoomOSLoadingState message="Loading notes..." />
              ) : filteredNotes.length === 0 ? (
                <LoomOSEmptyState
                  icon={<FileText className="w-12 h-12" />}
                  title="No notes found"
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCreateNote}
                    >
                      Create your first note
                    </Button>
                  }
                />
              ) : (
                <div>
                  {filteredNotes.map((note, index) => (
                    <LoomOSListItemEnhanced
                      key={note.id}
                      selected={selectedNote?.id === note.id}
                      onClick={() => handleNoteClick(note)}
                      animationIndex={index}
                    >
                      <div className="flex items-start gap-3 px-4 py-3">
                        <div className="flex flex-col items-center gap-1 pt-1">
                          {note.isPinned && (
                            <Pin className="w-4 h-4 fill-primary text-primary" />
                          )}
                          {note.isFavorite && (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">
                              {note.title}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatDate(note.updatedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {note.content}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {note.tags.slice(0, 3).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-1.5 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </LoomOSListItemEnhanced>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Detail Pane - Note Content */}
          <LoomOSDetailPane
            title={isCreating ? 'New Note' : selectedNote?.title}
            subtitle={!isCreating && selectedNote ? `Updated ${formatDate(selectedNote.updatedAt)}` : undefined}
            actions={detailActions}
            isEmpty={!selectedNote && !isCreating}
            emptyIcon={<FileText className="w-16 h-16" />}
            emptyMessage="No note selected"
            emptySubMessage="Select a note from the list or create a new one"
          >
            {isEditing ? (
              // Edit Mode
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-border bg-card/30">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="webos-pebble"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNote}
                      className="webos-pebble"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4 max-w-3xl">
                    <div>
                      <Input
                        type="text"
                        placeholder="Note title..."
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="text-2xl font-semibold border-none focus-visible:ring-0 px-0"
                      />
                    </div>
                    <Separator />
                    <div>
                      <Textarea
                        placeholder="Start writing..."
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        className="min-h-[400px] border-none focus-visible:ring-0 px-0 resize-none"
                      />
                    </div>
                  </div>
                </ScrollArea>
              </div>
            ) : selectedNote ? (
              // View Mode
              <ScrollArea className="h-full">
                <div className="px-6 py-6">
                  {/* Metadata */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Created {formatDate(selectedNote.createdAt)}</span>
                      <span>•</span>
                      <Badge variant="secondary">{selectedNote.category}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {selectedNote.content}
                  </div>

                  {/* Tags */}
                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : null}
          </LoomOSDetailPane>
        </div>
      </div>
    </ErrorBoundary>
  );
}
