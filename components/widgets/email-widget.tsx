
'use client';

import { useState, useEffect } from 'react';
import { Mail, Inbox, Send, Star, Archive, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Email {
  id: string;
  from: string;
  fromInitials: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isPriority: boolean;
  hasAttachment: boolean;
}

export function EmailWidget() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchEmails();
    // Refresh every 2 minutes
    const interval = setInterval(fetchEmails, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockEmails: Email[] = [
        {
          id: '1',
          from: 'Board of Directors',
          fromInitials: 'BD',
          subject: 'Community Meeting This Friday',
          preview: 'Please join us for our monthly board meeting this Friday at 7 PM in the community room...',
          timestamp: '2h ago',
          isRead: false,
          isStarred: true,
          isPriority: true,
          hasAttachment: true,
        },
        {
          id: '2',
          from: 'Property Management',
          fromInitials: 'PM',
          subject: 'Maintenance Schedule Update',
          preview: 'The elevator maintenance has been rescheduled to next Tuesday. We apologize for any...',
          timestamp: '5h ago',
          isRead: false,
          isStarred: false,
          isPriority: false,
          hasAttachment: false,
        },
        {
          id: '3',
          from: 'Sarah Chen',
          fromInitials: 'SC',
          subject: 'Package Pickup Reminder',
          preview: 'Hi! You have a package waiting in the lobby. Please pick it up at your earliest convenience...',
          timestamp: '1d ago',
          isRead: true,
          isStarred: false,
          isPriority: false,
          hasAttachment: false,
        },
        {
          id: '4',
          from: 'Facilities Team',
          fromInitials: 'FT',
          subject: 'Pool Hours Extended',
          preview: 'Great news! Starting next week, pool hours will be extended until 10 PM on weekends...',
          timestamp: '2d ago',
          isRead: true,
          isStarred: false,
          isPriority: false,
          hasAttachment: false,
        },
      ];

      setEmails(mockEmails);
      setUnreadCount(mockEmails.filter(e => !e.isRead).length);
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (emailId: string) => {
    router.push(`/dashboard/apps/email?id=${emailId}`);
  };

  const handleViewAll = () => {
    router.push('/dashboard/apps/email');
  };

  if (loading) {
    return (
      <Card className="h-full bg-card/60 backdrop-blur-sm border-border/30">
        <div className="p-4 space-y-3">
          <div className="h-5 bg-muted/50 rounded animate-pulse w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
            <Mail className="w-5 h-5 text-[var(--semantic-primary)]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Inbox</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleViewAll}
          className="text-xs text-primary hover:underline"
        >
          View All
        </button>
      </div>

      {/* Email List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Inbox className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No emails</p>
            </div>
          ) : (
            emails.map((email) => (
              <button
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={cn(
                  "w-full p-3 rounded-lg transition-all text-left group",
                  "hover:bg-muted/50",
                  !email.isRead && "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10">
                      {email.fromInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm truncate",
                        !email.isRead && "font-semibold"
                      )}>
                        {email.from}
                      </span>
                      {email.isPriority && (
                        <AlertCircle className="w-3 h-3 text-[var(--semantic-error)] flex-shrink-0" />
                      )}
                      {email.isStarred && (
                        <Star className="w-3 h-3 text-[var(--semantic-warning)] fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className={cn(
                      "text-xs truncate",
                      !email.isRead ? "font-medium" : "text-muted-foreground"
                    )}>
                      {email.subject}
                    </p>
                    
                    <p className="text-xs text-muted-foreground truncate">
                      {email.preview}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {email.timestamp}
                    </span>
                    {!email.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t border-border/30 bg-muted/20">
        <div className="flex items-center justify-around text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Inbox className="w-3.5 h-3.5" />
            <span>{emails.length} total</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Send className="w-3.5 h-3.5" />
            <span>Quick reply</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
