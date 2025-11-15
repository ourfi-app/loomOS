'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Inbox, Send, Star, Trash2, ExternalLink, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { DesktopWidget } from '@/lib/desktop-widget-store';

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
}

interface DesktopEmailWidgetProps {
  widget: DesktopWidget;
}

export function DesktopEmailWidget({ widget }: DesktopEmailWidgetProps) {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>(
    widget.settings.filter || 'all'
  );

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockEmails: Email[] = [
        {
          id: '1',
          from: 'Building Management',
          subject: 'Scheduled Maintenance - Elevator',
          snippet: 'Please be informed that elevator maintenance will take place next Tuesday...',
          timestamp: '2m ago',
          isRead: false,
          isStarred: true,
          hasAttachment: false,
        },
        {
          id: '2',
          from: 'Community Board',
          subject: 'Monthly Newsletter - December 2024',
          snippet: 'This month\'s highlights include the holiday party, new amenities...',
          timestamp: '1h ago',
          isRead: false,
          isStarred: false,
          hasAttachment: true,
        },
        {
          id: '3',
          from: 'Security Team',
          subject: 'New Access Code System',
          snippet: 'We are upgrading our access control system. Your new code is...',
          timestamp: '3h ago',
          isRead: true,
          isStarred: false,
          hasAttachment: false,
        },
        {
          id: '4',
          from: 'Maintenance Request',
          subject: 'Your Request #1234 has been completed',
          snippet: 'The HVAC repair in your unit has been completed. Please verify...',
          timestamp: '1d ago',
          isRead: true,
          isStarred: false,
          hasAttachment: false,
        },
        {
          id: '5',
          from: 'Finance Department',
          subject: 'Monthly HOA Statement Available',
          snippet: 'Your statement for November 2024 is now available for download...',
          timestamp: '2d ago',
          isRead: false,
          isStarred: true,
          hasAttachment: true,
        },
      ];

      setEmails(mockEmails);
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchEmails, widget.refreshInterval]);

  const filteredEmails = emails.filter(email => {
    if (filter === 'unread') return !email.isRead;
    if (filter === 'starred') return email.isStarred;
    return true;
  });

  const unreadCount = emails.filter(e => !e.isRead).length;

  const handleEmailClick = (emailId: string) => {
    // Mark as read
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isRead: true } : email
    ));
    router.push(`/dashboard/messages?email=${emailId}`);
  };

  const handleToggleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  if (loading) {
    return (
      <div className="h-full p-4 space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Inbox
            </p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => router.push('/dashboard/messages')}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {(['all', 'unread', 'starred'] as const).map(f => (
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
              {f === 'unread' && 'Unread'}
              {f === 'starred' && 'Starred'}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <ScrollArea className="flex-1 p-2">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No {filter} emails</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEmails.map(email => (
              <button
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-colors group relative',
                  'hover:bg-accent/50',
                  !email.isRead && 'bg-primary/5'
                )}
              >
                <div className="flex items-start gap-2">
                  {/* Unread Indicator */}
                  <div className="flex items-start pt-1.5">
                    {!email.isRead && (
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={cn(
                        'text-sm truncate',
                        !email.isRead && 'font-semibold'
                      )}>
                        {email.from}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {email.timestamp}
                      </span>
                    </div>

                    <p className={cn(
                      'text-sm truncate mb-1',
                      !email.isRead ? 'font-medium' : 'text-muted-foreground'
                    )}>
                      {email.subject}
                    </p>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {email.snippet}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {email.hasAttachment && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          📎
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Star Button */}
                  <button
                    onClick={(e) => handleToggleStar(email.id, e)}
                    className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                    title={email.isStarred ? 'Unstar' : 'Star'}
                  >
                    <Star
                      className={cn(
                        'h-4 w-4',
                        email.isStarred
                          ? 'fill-yellow-400 text-[var(--semantic-warning)]'
                          : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                      )}
                    />
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Quick Action Footer */}
      <div className="p-3 border-t bg-muted/20">
        <Button
          size="sm"
          variant="outline"
          className="w-full h-9"
          onClick={() => router.push('/dashboard/messages?compose=true')}
        >
          <Send className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </div>
    </div>
  );
}
