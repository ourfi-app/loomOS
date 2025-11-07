
'use client';

import { useState, useEffect } from 'react';
import { StickyNote, Plus, Search, Pin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function NotesWidget() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    // Refresh every 10 minutes
    const interval = setInterval(fetchNotes, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Board Meeting Notes',
          content: 'Topics discussed: Budget approval, new security measures, pool renovation timeline, parking policy updates...',
          color: 'yellow',
          isPinned: true,
          tags: ['meeting', 'important'],
          createdAt: '2024-10-15',
          updatedAt: '2024-10-20',
        },
        {
          id: '2',
          title: 'Maintenance Requests',
          content: 'Kitchen sink leak - called plumber\nHallway light bulb replacement - unit 304\nGym equipment inspection due next month',
          color: 'blue',
          isPinned: true,
          tags: ['maintenance', 'todo'],
          createdAt: '2024-10-18',
          updatedAt: '2024-10-19',
        },
        {
          id: '3',
          title: 'Community Event Ideas',
          content: 'Summer BBQ\nHoliday party\nBook club\nYoga classes\nMovie nights',
          color: 'green',
          isPinned: false,
          tags: ['events', 'social'],
          createdAt: '2024-10-10',
          updatedAt: '2024-10-10',
        },
        {
          id: '4',
          title: 'WiFi Password',
          content: 'Network: Montrecott_Guest\nPassword: Welcome2024!\nShared with: Unit 205, Unit 302',
          color: 'purple',
          isPinned: false,
          tags: ['reference', 'tech'],
          createdAt: '2024-10-05',
          updatedAt: '2024-10-05',
        },
      ];

      setNotes(mockNotes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (noteId: string) => {
    router.push(`/dashboard/apps/notes?id=${noteId}`);
  };

  const handleViewAll = () => {
    router.push('/dashboard/apps/notes');
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'green': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'purple': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'pink': return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
      default: return 'bg-muted/30 border-border/50';
    }
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const regularNotes = notes.filter(n => !n.isPinned);

  if (loading) {
    return (
      <Card className="h-full bg-card/60 backdrop-blur-sm border-border/30">
        <div className="p-4 space-y-3">
          <div className="h-5 bg-muted/50 rounded animate-pulse w-1/3" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
            <StickyNote className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Notes</h3>
            <p className="text-xs text-muted-foreground">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/apps/notes?action=search')}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Search notes"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleViewAll}
            className="text-xs text-primary hover:underline"
          >
            View All
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <StickyNote className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No notes yet</p>
              <button className="mt-2 text-xs text-primary hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Create your first note
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {pinnedNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleNoteClick(note.id)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:shadow-md group",
                          getColorClasses(note.color)
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold line-clamp-1">
                              {note.title}
                            </h4>
                            <Pin className="w-3 h-3 text-primary flex-shrink-0 fill-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {note.content}
                          </p>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {note.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1.5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Notes */}
              {regularNotes.length > 0 && (
                <div className="space-y-1">
                  {pinnedNotes.length > 0 && (
                    <div className="px-2 text-xs font-medium text-muted-foreground">
                      Recent
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {regularNotes.slice(0, 4).map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleNoteClick(note.id)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:shadow-md",
                          getColorClasses(note.color)
                        )}
                      >
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold line-clamp-1">
                            {note.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {note.content}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border/30 bg-muted/20">
        <button
          onClick={() => router.push('/dashboard/apps/notes?action=new')}
          className="w-full py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>
    </Card>
  );
}
