'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Plus,
  Inbox,
  Send,
  Star,
  Trash2,
  Archive,
  Search,
  RefreshCw,
  Paperclip,
  MoreVertical,
} from 'lucide-react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  subject: string;
  body: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  recipients: Array<{
    userId: string;
    isRead: boolean;
    isStarred: boolean;
    isArchived: boolean;
  }>;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function EmailPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'starred' | 'archived'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [folder]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?folder=${folder}`);
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const toggleStar = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/star`, {
        method: 'PATCH',
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const getMessageCounts = () => {
    return {
      inbox: messages.filter(m => 
        !m.recipients[0]?.isArchived && folder === 'inbox'
      ).length,
      sent: messages.length,
      starred: messages.filter(m => m.recipients[0]?.isStarred).length,
      unread: messages.filter(m => !m.recipients[0]?.isRead).length,
    };
  };

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const counts = getMessageCounts();

  if (loading) {
    return (
      <DesktopAppWrapper
        title="Email"
        icon={<Mail className="w-5 h-5" />}
        gradient="from-indigo-500 to-blue-500"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title="Email"
      icon={<Mail className="w-5 h-5" />}
      gradient="from-indigo-500 to-blue-500"
      toolbar={
        <>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchMessages()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Compose
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
                <CardTitle className="text-sm font-medium">Folders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Button
                  variant={folder === 'inbox' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFolder('inbox')}
                >
                  <Inbox className="h-4 w-4 mr-2" />
                  Inbox
                  {counts.unread > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {counts.unread}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={folder === 'sent' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFolder('sent')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Sent
                </Button>
                <Button
                  variant={folder === 'starred' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFolder('starred')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Starred
                  <Badge variant="secondary" className="ml-auto">
                    {counts.starred}
                  </Badge>
                </Button>
                <Button
                  variant={folder === 'archived' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFolder('archived')}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archived
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Unread</span>
                  <span className="font-medium">{counts.unread}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Starred</span>
                  <span className="font-medium">{counts.starred}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inbox</CardTitle>
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.inbox}</div>
                  <p className="text-xs text-muted-foreground">
                    {counts.unread} unread
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sent</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.sent}</div>
                  <p className="text-xs text-muted-foreground">Messages sent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Starred</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.starred}</div>
                  <p className="text-xs text-muted-foreground">Important</p>
                </CardContent>
              </Card>
            </div>

            {/* Messages List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>
                      {folder.charAt(0).toUpperCase() + folder.slice(1)} folder
                    </CardDescription>
                  </div>
                  {filteredMessages.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No messages</p>
                      <p className="text-sm">
                        {searchQuery ? 'No messages match your search' : `Your ${folder} is empty`}
                      </p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => {
                      const recipient = message.recipients[0];
                      const isUnread = !recipient?.isRead;
                      const isStarred = recipient?.isStarred;

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-all cursor-pointer",
                            isUnread && "bg-accent/20"
                          )}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (isUnread) {
                              markAsRead(message.id);
                            }
                          }}
                        >
                          <Checkbox className="mt-1" />
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={undefined} />
                            <AvatarFallback>
                              {message.sender.name?.charAt(0) || message.sender.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className={cn(
                                    "font-medium truncate",
                                    isUnread && "font-semibold"
                                  )}>
                                    {folder === 'sent' ? 
                                      message.recipients.map(r => r.userId).join(', ') : 
                                      message.sender.name || message.sender.email
                                    }
                                  </h3>
                                  {isUnread && (
                                    <Badge variant="default" className="h-5 px-1.5">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p className={cn(
                                  "text-sm truncate",
                                  isUnread ? "font-medium" : "text-muted-foreground"
                                )}>
                                  {message.subject}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(message.id);
                                  }}
                                  className="hover:scale-110 transition-transform"
                                >
                                  <Star 
                                    className={cn(
                                      "h-4 w-4",
                                      isStarred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                    )} 
                                  />
                                </button>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {message.body}
                            </p>

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Paperclip className="h-3 w-3" />
                                <span>{message.attachments.length} attachment(s)</span>
                              </div>
                            )}
                          </div>

                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
