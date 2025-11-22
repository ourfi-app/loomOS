'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Star,
  Pin,
  Archive,
  Search,
  FolderOpen,
  Edit3,
  Trash2,
} from 'lucide-react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

const categoryColors: Record<string, string> = {
  personal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  work: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  ideas: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  project: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [filter]);

  const fetchNotes = async () => {
    try {
      let url = '/api/notes';
      if (filter === 'favorites') {
        url += '?favorite=true';
      } else if (filter === 'archived') {
        url += '?archived=true';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setNotes(data.data || []);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    notes.forEach(note => {
      const category = note.category || 'uncategorized';
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  if (loading) {
    return (
      <DesktopAppWrapper
        title="Notes"
        icon={<FileText className="w-5 h-5" />}
        gradient="from-amber-500 to-orange-500"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title="Notes"
      icon={<FileText className="w-5 h-5" />}
      gradient="from-amber-500 to-orange-500"
      toolbar={
        <>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </>
      }
    >
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Button
                  variant={filter === 'all' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilter('all')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  All Notes
                  <Badge variant="secondary" className="ml-auto">
                    {notes.filter(n => !n.isArchived).length}
                  </Badge>
                </Button>
                <Button
                  variant={filter === 'favorites' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilter('favorites')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Favorites
                  <Badge variant="secondary" className="ml-auto">
                    {notes.filter(n => n.isFavorite).length}
                  </Badge>
                </Button>
                <Button
                  variant={filter === 'archived' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilter('archived')}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archived
                  <Badge variant="secondary" className="ml-auto">
                    {notes.filter(n => n.isArchived).length}
                  </Badge>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {category}
                    <Badge variant="secondary" className="ml-auto">
                      {count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notes.filter(n => !n.isArchived).length}</div>
                  <p className="text-xs text-muted-foreground">Active notes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notes.filter(n => n.isFavorite).length}</div>
                  <p className="text-xs text-muted-foreground">Starred notes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(categoryCounts).length}</div>
                  <p className="text-xs text-muted-foreground">Different categories</p>
                </CardContent>
              </Card>
            </div>

            {/* Notes Grid */}
            <div className="space-y-6">
              {pinnedNotes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Pinned Notes
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}

              {regularNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h3 className="text-sm font-medium mb-3">Other Notes</h3>
                  )}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {regularNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}

              {filteredNotes.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        {searchQuery ? 'No notes found' : 'No notes yet'}
                      </p>
                      <p className="text-sm">
                        {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DesktopAppWrapper>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {note.isFavorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
            {note.isPinned && (
              <Pin className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.content}
        </p>
        
        <div className="flex flex-wrap gap-2 items-center">
          {note.category && (
            <Badge className={categoryColors[note.category] || 'bg-gray-100'} variant="secondary">
              {note.category}
            </Badge>
          )}
          
          {note.tags && note.tags.length > 0 && (
            <>
              {note.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted"
                >
                  #{tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{note.tags.length - 2}
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            {new Date(note.updatedAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
