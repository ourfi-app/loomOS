
'use client';

import { useState, useEffect, useCallback } from 'react';
import { StickyNote, Plus, Pin, ExternalLink, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { DesktopWidget } from '@/lib/desktop-widget-store';

interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  tags?: string[];
  updatedAt: string;
}

interface DesktopNotesWidgetProps {
  widget: DesktopWidget;
}

export function DesktopNotesWidget({ widget }: DesktopNotesWidgetProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Board Meeting Notes',
          content: 'Topics discussed: Budget approval, new security measures, pool renovation timeline...',
          color: 'yellow',
          isPinned: true,
          tags: ['meeting', 'important'],
          updatedAt: '2024-10-20',
        },
        {
          id: '2',
          title: 'Maintenance Requests',
          content: 'Kitchen sink leak - called plumber\nHallway light bulb replacement...',
          color: 'blue',
          isPinned: true,
          tags: ['maintenance'],
          updatedAt: '2024-10-19',
        },
        {
          id: '3',
          title: 'Community Event Ideas',
          content: 'Summer BBQ\nHoliday party\nBook club\nYoga classes',
          color: 'green',
          isPinned: false,
          tags: ['events'],
          updatedAt: '2024-10-10',
        },
      ];

      setNotes(mockNotes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchNotes, widget.refreshInterval]);

  const handleNoteClick = (noteId: string) => {
    router.push(`/dashboard/apps/notes?id=${noteId}`);
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'yellow': return 'bg-[var(--semantic-warning-bg)] dark:bg-yellow-900/20 border-[var(--semantic-warning-bg)] dark:border-yellow-800';
      case 'blue': return 'bg-[var(--semantic-primary-subtle)] dark:bg-[var(--semantic-primary-dark)]/20 border-[var(--semantic-primary-light)] dark:border-blue-800';
      case 'green': return 'bg-[var(--semantic-success-bg)] dark:bg-green-900/20 border-[var(--semantic-success-bg)] dark:border-green-800';
      case 'purple': return 'bg-[var(--semantic-accent-subtle)] dark:bg-purple-900/20 border-[var(--semantic-accent-light)] dark:border-purple-800';
      default: return 'bg-muted/30 border-border/50';
    }
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const regularNotes = notes.filter(n => !n.isPinned);

  if (loading) {
    return (
      <div className="h-full p-4 grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{notes.length} Notes</p>
          <p className="text-xs text-muted-foreground">
            {pinnedNotes.length} pinned
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => router.push('/dashboard/apps/notes')}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Open App
        </Button>
      </div>

      {/* Notes Grid */}
      <ScrollArea className="flex-1 p-2">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <StickyNote className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No notes yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-2">
                {pinnedNotes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => handleNoteClick(note.id)}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all hover:shadow-md',
                      getColorClasses(note.color)
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold line-clamp-1 flex-1">
                        {note.title}
                      </h4>
                      <Pin className="w-3 h-3 text-[var(--semantic-warning)] fill-yellow-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {note.content}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {note.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Regular Notes */}
            {regularNotes.length > 0 && (
              <div className="space-y-2">
                {regularNotes.slice(0, 4).map(note => (
                  <button
                    key={note.id}
                    onClick={() => handleNoteClick(note.id)}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all hover:shadow-md',
                      getColorClasses(note.color)
                    )}
                  >
                    <h4 className="text-sm font-semibold line-clamp-1 mb-2">
                      {note.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Quick Add Footer */}
      <div className="p-3 border-t bg-muted/20">
        <Button
          size="sm"
          variant="outline"
          className="w-full h-9"
          onClick={() => router.push('/dashboard/apps/notes?action=new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>
    </div>
  );
}
