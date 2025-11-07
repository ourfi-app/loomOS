'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Star,
  Send,
  Trash2,
  Inbox as InboxIcon,
  Reply,
  Archive,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import {
  WebOSNavigationPane,
  WebOSDetailPane,
  WebOSListItemEnhanced,
  WebOSEmptyState,
  WebOSLoadingState,
} from '@/components/webos';
import { useMessages, useMessageMutation } from '@/hooks/use-api';
import { toastError, toastCRUD } from '@/lib/toast-helpers';
import { Label } from '@/components/ui/label';

interface Folder {
  id: string;
  name: string;
  icon: any;
}

export default function MessagesTab() {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '' });

  const { data: messagesData, isLoading, mutate: refreshMessages } = useMessages();
  const messageMutation = useMessageMutation();

  const messages = messagesData?.messages || [];

  const folders: Folder[] = [
    { id: 'inbox', name: 'Inbox', icon: InboxIcon },
    { id: 'starred', name: 'Starred', icon: Star },
    { id: 'sent', name: 'Sent', icon: Send },
    { id: 'archive', name: 'Archive', icon: Archive },
    { id: 'trash', name: 'Trash', icon: Trash2 },
  ];

  const navItems = folders.map(folder => ({
    id: folder.id,
    label: folder.name,
    icon: <folder.icon className="h-4 w-4" />,
    active: selectedFolder === folder.id,
    onClick: () => setSelectedFolder(folder.id),
  }));

  const handleSend = async () => {
    if (!composeForm.subject || !composeForm.body) {
      toastError('Please fill in all fields');
      return;
    }

    try {
      await messageMutation.send({
        subject: composeForm.subject,
        body: composeForm.body,
        recipientIds: [], // Add recipient selection logic
      });
      setComposeForm({ to: '', subject: '', body: '' });
      setShowComposer(false);
      refreshMessages();
      toastCRUD.created('Message sent');
    } catch (error) {
      toastError('Failed to send message');
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div className="h-full flex">
      {/* Folders Navigation */}
      <WebOSNavigationPane title="FOLDERS" items={navItems} />

      {/* Messages List */}
      <div className="w-96 flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {folders.find(f => f.id === selectedFolder)?.name || 'Inbox'}
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => refreshMessages()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => setShowComposer(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Compose
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <WebOSLoadingState message="Loading messages..." />
          ) : messages.length === 0 ? (
            <WebOSEmptyState
              icon={<Mail className="w-12 h-12" />}
              title="No messages"
              description="Your inbox is empty"
            />
          ) : (
            <div>
              {messages.map((message: any, index: number) => {
                const isRead = message.recipients?.some((r: any) => r.isRead);
                const isStarred = message.recipients?.some((r: any) => r.isStarred);

                return (
                  <WebOSListItemEnhanced
                    key={message.id}
                    selected={selectedMessage?.id === message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowComposer(false);
                    }}
                    animationIndex={index}
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-sm truncate", !isRead && "font-semibold")}>
                            {message.sender?.name}
                          </span>
                          {isStarred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatMessageDate(message.sentAt || message.createdAt)}
                          </span>
                        </div>
                        <p className={cn("text-sm truncate mb-1", !isRead && "font-medium")}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {message.body}
                        </p>
                      </div>
                    </div>
                  </WebOSListItemEnhanced>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Message Detail or Composer */}
      <div className="flex-1 flex flex-col bg-background">
        {showComposer ? (
          // Composer
          <>
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">New Message</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowComposer(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSend}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4 max-w-3xl">
                <div>
                  <Label>To</Label>
                  <Input
                    placeholder="Select recipients..."
                    value={composeForm.to}
                    onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input
                    placeholder="Message subject"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your message..."
                    value={composeForm.body}
                    onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                    rows={12}
                  />
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          // Message Detail
          <WebOSDetailPane
            title={selectedMessage?.subject}
            subtitle={selectedMessage?.sender?.name}
            actions={
              selectedMessage ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : undefined
            }
            isEmpty={!selectedMessage}
            emptyIcon={<Mail className="w-16 h-16" />}
            emptyMessage="No message selected"
            emptySubMessage="Select a message from the list or compose a new one"
          >
            {selectedMessage && (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedMessage.sender?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedMessage.sender?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMessage.sender?.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(selectedMessage.sentAt || selectedMessage.createdAt), 'PPp')}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
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
