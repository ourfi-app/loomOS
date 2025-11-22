'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Mail, Star, Send, Trash2, Inbox as InboxIcon, Reply, Forward, 
  Paperclip, Archive, RefreshCw, Edit3, Clock, AlertCircle, Plus, 
  Check, X, ChevronRight, Users, User, Building2, MoreHorizontal,
  ArrowLeft, Search, Command, CheckSquare, Square, Keyboard
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ErrorBoundary, VirtualList } from '@/components/common';
import { MessageListSkeleton } from '@/components/common/skeleton-screens';
import { toastSuccess, toastError, toastInfo, toastCRUD, toastValidationError } from '@/lib/toast-helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessages, useMessageMutation } from '@/hooks/use-api';
import { useDeepLinkSelection } from '@/hooks/use-deep-link';
import {
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSListItem,
  LoomOSListDivider,
  LoomOSAppHeader
} from '@/components/webos';


interface Message {
  id: string;
  subject: string;
  body: string;
  sender: { id: string; name: string; email: string; };
  recipients: Array<{ isRead: boolean; isStarred: boolean; user: { id: string; name: string; } }>;
  status: string;
  priority: string;
  hasAttachments: boolean;
  sentAt: string;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  icon: any;
  count?: number;
  type?: 'system' | 'custom';
}

type ComposerMode = 'new' | 'reply' | 'forward';

export default function MessagesPage() {
  const session = useSession()?.data;
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the enhanced hook for data fetching
  const { 
    data: messagesData, 
    isLoading, 
    error,
    mutate: refreshMessages 
  } = useMessages();
  
  const messages = messagesData?.messages || [];
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  // Deep Link Support: Auto-select message when navigating from notifications
  useDeepLinkSelection({
    items: messages,
    onSelect: setSelectedMessage,
    enabled: messages.length > 0,
  });
  
  // View state
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>('new');
  
  // Composition state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composePriority, setComposePriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [isSending, setIsSending] = useState(false);

  // Desktop enhancements - Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Desktop enhancements - Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Folder definitions with proper counts
  const systemFolders: Folder[] = [
    { 
      id: 'inbox', 
      name: 'All Inboxes', 
      icon: InboxIcon, 
      count: messages.filter(m => m.status === 'SENT' && m.sender.email !== session?.user?.email).length,
      type: 'system'
    },
    { 
      id: 'starred', 
      name: 'Starred', 
      icon: Star, 
      count: messages.filter(m => m.recipients[0]?.isStarred).length,
      type: 'system'
    },
    { 
      id: 'sent', 
      name: 'Sent', 
      icon: Send, 
      count: messages.filter(m => m.status === 'SENT' && m.sender.email === session?.user?.email).length,
      type: 'system'
    },
    { 
      id: 'archived', 
      name: 'Archived', 
      icon: Archive, 
      count: 0,
      type: 'system'
    },
  ];

  useEffect(() => {
    filterMessages();
  }, [messages, selectedFolder, searchQuery, session]);

  const filterMessages = () => {
    let filtered = messages;

    // Filter by folder
    if (selectedFolder === 'inbox') {
      filtered = filtered.filter(m => m.status === 'SENT' && m.sender.email !== session?.user?.email);
    } else if (selectedFolder === 'starred') {
      filtered = filtered.filter(m => m.recipients[0]?.isStarred);
    } else if (selectedFolder === 'sent') {
      filtered = filtered.filter(m => m.sender.email === session?.user?.email);
    } else if (selectedFolder === 'archived') {
      filtered = [];
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.subject.toLowerCase().includes(query) ||
        m.body.toLowerCase().includes(query) ||
        m.sender.name.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  };

  const handleRefresh = () => {
    refreshMessages();
    toastInfo('Refreshing messages...');
  };

  const handleCompose = (mode: ComposerMode = 'new', message?: Message) => {
    setComposerMode(mode);
    
    if (mode === 'reply' && message) {
      setComposeTo(message.sender.email);
      setComposeSubject(message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`);
      setComposeBody(`\n\n--- Original Message ---\nFrom: ${message.sender.name}\nDate: ${format(parseISO(message.sentAt || message.createdAt), 'PPpp')}\n\n${message.body}`);
    } else if (mode === 'forward' && message) {
      setComposeTo('');
      setComposeSubject(message.subject.startsWith('Fwd: ') ? message.subject : `Fwd: ${message.subject}`);
      setComposeBody(`\n\n--- Forwarded Message ---\nFrom: ${message.sender.name}\nDate: ${format(parseISO(message.sentAt || message.createdAt), 'PPpp')}\nSubject: ${message.subject}\n\n${message.body}`);
    } else {
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setComposePriority('NORMAL');
    }
    
    setShowComposer(true);
  };

  const handleCancelCompose = () => {
    setShowComposer(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setComposePriority('NORMAL');
  };

  // Use mutation hooks
  const messageMutations = useMessageMutation();

  const handleSendMessage = async () => {
    if (!composeTo || !composeSubject || !composeBody) {
      toastValidationError('Please fill in all fields');
      return;
    }

    setIsSending(true);
    try {
      await messageMutations.sendMessage({
        recipientEmails: composeTo.split(',').map(e => e.trim()),
        subject: composeSubject,
        body: composeBody,
        priority: composePriority,
      });
      
      toastCRUD.created('Message');
      handleCancelCompose();
      refreshMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toastError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageMutations.markAsRead(messageId);
      refreshMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
      toastError('Failed to mark as read');
    }
  };

  const toggleStar = async (messageId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const currentStarred = message.recipients[0]?.isStarred;
    try {
      await messageMutations.toggleStar(messageId, !currentStarred);
      refreshMessages();
      toastSuccess(currentStarred ? 'Removed from starred' : 'Added to starred');
    } catch (error) {
      console.error('Error toggling star:', error);
      toastError('Failed to update starred status');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await messageMutations.deleteMessage(messageId);
      refreshMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      toastCRUD.deleted('Message');
    } catch (error) {
      console.error('Error deleting message:', error);
      toastError('Failed to delete message');
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.recipients[0]?.isRead) {
      markAsRead(message.id);
    }
  };

  // Desktop enhancements - Bulk selection handlers
  const toggleSelection = useCallback((id: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (next.size === 0) {
        setSelectionMode(false);
      } else if (!selectionMode) {
        setSelectionMode(true);
      }
      return next;
    });
  }, [selectionMode]);

  const selectAll = useCallback(() => {
    if (selectedIds.size === filteredMessages.length) {
      setSelectedIds(new Set());
      setSelectionMode(false);
    } else {
      setSelectedIds(new Set(filteredMessages.map(m => m.id)));
      setSelectionMode(true);
    }
  }, [filteredMessages, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  // Bulk actions
  const bulkMarkAsRead = useCallback(async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map(id => messageMutations.markAsRead(id)));
      refreshMessages();
      toastSuccess(`Marked ${ids.length} message${ids.length > 1 ? 's' : ''} as read`);
      clearSelection();
    } catch (error) {
      console.error('Error marking as read:', error);
      toastError('Failed to mark messages as read');
    }
  }, [selectedIds, clearSelection, refreshMessages, messageMutations]);

  const bulkStar = useCallback(async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map(id => messageMutations.toggleStar(id, true)));
      refreshMessages();
      toastSuccess(`Starred ${ids.length} message${ids.length > 1 ? 's' : ''}`);
      clearSelection();
    } catch (error) {
      console.error('Error starring messages:', error);
      toastError('Failed to star messages');
    }
  }, [selectedIds, clearSelection, refreshMessages, messageMutations]);

  const bulkUnstar = useCallback(async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map(id => messageMutations.toggleStar(id, false)));
      refreshMessages();
      toastSuccess(`Unstarred ${ids.length} message${ids.length > 1 ? 's' : ''}`);
      clearSelection();
    } catch (error) {
      console.error('Error unstarring messages:', error);
      toastError('Failed to unstar messages');
    }
  }, [selectedIds, clearSelection, refreshMessages, messageMutations]);

  const bulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map(id => messageMutations.deleteMessage(id)));
      refreshMessages();
      toastSuccess(`Deleted ${ids.length} message${ids.length > 1 ? 's' : ''}`);
      clearSelection();
      if (selectedMessage && ids.includes(selectedMessage.id)) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
      toastError('Failed to delete messages');
    }
  }, [selectedIds, selectedMessage, clearSelection, refreshMessages, messageMutations]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        showComposer
      ) {
        // Allow Escape and Cmd/Ctrl+Enter in composer
        if (showComposer && e.key === 'Escape') {
          handleCancelCompose();
          return;
        }
        if (showComposer && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          handleSendMessage();
          return;
        }
        return;
      }

      // Cmd/Ctrl combinations
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n': // New message
            e.preventDefault();
            handleCompose('new');
            break;
          case 'f': // Focus search
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
          case 'r': // Refresh
            e.preventDefault();
            handleRefresh();
            break;
          case 'a': // Select all
            e.preventDefault();
            selectAll();
            break;
        }
        return;
      }

      // Single key shortcuts
      switch (e.key) {
        case '?':
          e.preventDefault();
          setShowKeyboardHelp(true);
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          handleCompose('new');
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (filteredMessages.length > 0) {
            setFocusedIndex(prev => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (filteredMessages.length > 0) {
            setFocusedIndex(prev => Math.min(filteredMessages.length - 1, prev + 1));
          }
          break;
        case 'Enter':
        case 'ArrowRight':
          if (filteredMessages.length > 0) {
            e.preventDefault();
            const message = filteredMessages[focusedIndex];
            if (message) {
              handleSelectMessage(message);
            }
          }
          break;
        case 'r':
        case 'R':
          if (selectedMessage) {
            e.preventDefault();
            handleCompose('reply', selectedMessage);
          }
          break;
        case 'f':
        case 'F':
          if (selectedMessage) {
            e.preventDefault();
            handleCompose('forward', selectedMessage);
          }
          break;
        case 's':
        case 'S':
          if (selectedMessage) {
            e.preventDefault();
            toggleStar(selectedMessage.id);
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedMessage && !showComposer) {
            e.preventDefault();
            deleteMessage(selectedMessage.id);
          }
          break;
        case 'Escape':
          if (selectionMode) {
            clearSelection();
          } else if (searchQuery) {
            setSearchQuery('');
          } else if (selectedMessage) {
            setSelectedMessage(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showComposer, 
    selectedMessage, 
    filteredMessages, 
    focusedIndex, 
    selectedFolder,
    systemFolders,
    selectionMode,
    searchQuery,
  ]);

  // Auto-scroll to focused message
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < filteredMessages.length) {
      const element = document.querySelector(`[data-message-index="${focusedIndex}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [focusedIndex, filteredMessages.length]);

  const getMessageDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = parseISO(message.sentAt || message.createdAt);
      let groupKey = 'OLDER';
      
      if (isToday(date)) {
        groupKey = 'TODAY';
      } else if (isYesterday(date)) {
        groupKey = 'YESTERDAY';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey]!.push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(filteredMessages);
  const currentFolder = systemFolders.find(f => f.id === selectedFolder);
  
  // Flatten the grouped messages for virtual scrolling
  type ListItem = { type: 'divider'; groupName: string } | { type: 'message'; message: Message };
  
  const flattenedMessages: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];
    const groupOrder = ['TODAY', 'YESTERDAY', 'OLDER'];
    
    groupOrder.forEach(groupName => {
      const groupMessages = messageGroups[groupName];
      if (groupMessages && groupMessages.length > 0) {
        items.push({ type: 'divider', groupName });
        groupMessages.forEach(message => {
          items.push({ type: 'message', message });
        });
      }
    });
    
    return items;
  }, [messageGroups]);

  // Build navigation items
  const navItems = systemFolders.map(folder => ({
    id: folder.id,
    label: folder.name,
    icon: <folder.icon className="w-4 h-4" />,
    count: folder.count,
    active: selectedFolder === folder.id,
    onClick: () => setSelectedFolder(folder.id),
  }));

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Keyboard shortcuts button */}
      <button
        onClick={() => setShowKeyboardHelp(true)}
        className="p-2 hover:bg-[var(--semantic-surface-hover)] rounded-lg transition-colors"
        aria-label="Keyboard shortcuts (Press ?)"
      >
        <Keyboard className="w-4 h-4" />
      </button>
      
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="p-2 hover:bg-[var(--semantic-surface-hover)] rounded-lg transition-colors disabled:opacity-50"
        aria-label="Refresh"
      >
        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
      </button>
      
      <Button
        onClick={() => handleCompose('new')}
        size="sm"
      >
        <Edit3 className="w-4 h-4 mr-2" />
        Compose
      </Button>
    </div>
  );

  // Detail pane actions
  const detailActions = selectedMessage && (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); toggleStar(selectedMessage.id); }}
        className="p-2 hover:bg-[var(--semantic-surface-hover)] rounded-lg transition-colors"
        aria-label={selectedMessage.recipients[0]?.isStarred ? 'Unstar' : 'Star'}
      >
        <Star className={cn(
          'w-4 h-4',
          selectedMessage.recipients[0]?.isStarred && 'fill-yellow-400 text-[var(--semantic-warning)]'
        )} />
      </button>
      <button
        onClick={() => handleCompose('reply', selectedMessage)}
        className="p-2 hover:bg-[var(--semantic-surface-hover)] rounded-lg transition-colors"
        aria-label="Reply"
      >
        <Reply className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleCompose('forward', selectedMessage)}
        className="p-2 hover:bg-[var(--semantic-surface-hover)] rounded-lg transition-colors"
        aria-label="Forward"
      >
        <Forward className="w-4 h-4" />
      </button>
      <button
        onClick={() => void deleteMessage(selectedMessage.id)}
        className="p-2 hover:bg-[var(--semantic-error-bg)] text-[var(--semantic-error)] rounded-lg transition-colors"
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  // Desktop window menu bar items
  const menuBar = [
    {
      label: 'Message',
      items: [
        {
          label: 'New Message',
          shortcut: 'C',
          onClick: () => handleCompose('new'),
        },
        { separator: true },
        {
          label: 'Reply',
          shortcut: 'R',
          onClick: () => selectedMessage && handleCompose('reply', selectedMessage),
          disabled: !selectedMessage,
        },
        {
          label: 'Forward',
          shortcut: 'F',
          onClick: () => selectedMessage && handleCompose('forward', selectedMessage),
          disabled: !selectedMessage,
        },
        { separator: true },
        {
          label: 'Delete',
          shortcut: 'Del',
          onClick: () => selectedMessage && deleteMessage(selectedMessage.id),
          disabled: !selectedMessage,
        },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: 'Refresh',
          shortcut: 'Ctrl+R',
          onClick: handleRefresh,
        },
        { separator: true },
        {
          label: 'Toggle Selection Mode',
          shortcut: 'Ctrl+S',
          onClick: () => setSelectionMode(!selectionMode),
        },
      ],
    },
    {
      label: 'Selection',
      items: [
        {
          label: 'Select All',
          shortcut: 'Ctrl+A',
          onClick: selectAll,
        },
        {
          label: 'Clear Selection',
          shortcut: 'Esc',
          onClick: clearSelection,
          disabled: selectedIds.size === 0,
        },
        { separator: true },
        {
          label: 'Mark as Read',
          onClick: bulkMarkAsRead,
          disabled: selectedIds.size === 0,
        },
        {
          label: 'Star',
          onClick: bulkStar,
          disabled: selectedIds.size === 0,
        },
        {
          label: 'Unstar',
          onClick: bulkUnstar,
          disabled: selectedIds.size === 0,
        },
        { separator: true },
        {
          label: 'Delete Selected',
          onClick: bulkDelete,
          disabled: selectedIds.size === 0,
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'Keyboard Shortcuts',
          shortcut: '?',
          onClick: () => setShowKeyboardHelp(true),
        },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <div 
        className="h-full flex overflow-hidden"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
          {/* Navigation Pane - Folders */}
          <LoomOSNavigationPane
            title="FOLDERS"
            items={navItems}
          />

        {/* Message List Pane */}
        <div 
          className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden"
          style={{
            borderRight: '1px solid var(--webos-border-primary)',
            background: 'var(--webos-bg-white)'
          }}
        >
          {/* Header */}
          <div 
            style={{
              borderBottom: '1px solid var(--webos-border-primary)',
              background: 'var(--webos-bg-secondary)'
            }}
          >
            <div className="h-16 px-6 flex items-center justify-between">
              <div>
                <h2 
                  className="font-light text-lg tracking-tight"
                  style={{ color: 'var(--webos-text-primary)' }}
                >
                  {currentFolder?.name || 'Messages'}
                </h2>
                <p 
                  className="text-xs font-light"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                >
                  {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}
                </p>
              </div>
            </div>
            
            {/* Bulk selection toolbar */}
            <AnimatePresence>
              {selectionMode && (
                <motion.div
                  className="h-14 px-6 bg-[var(--semantic-primary-subtle)] border-b border-[var(--semantic-primary-light)] flex items-center justify-between"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 56, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={clearSelection}
                      className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                      title="Clear selection"
                    >
                      <X className="w-4 h-4 text-[var(--semantic-text-secondary)]" />
                    </button>
                    <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                      {selectedIds.size} selected
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={bulkMarkAsRead}
                      className="h-8"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={bulkStar}
                      className="h-8"
                    >
                      <Star className="w-3.5 h-3.5 mr-1.5" />
                      Star
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={bulkUnstar}
                      className="h-8"
                    >
                      <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                      Unstar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={bulkDelete}
                      className="h-8"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div 
            className="px-6 py-4"
            style={{
              borderBottom: '1px solid var(--webos-border-primary)',
              background: 'var(--webos-bg-white)'
            }}
          >
            <div className="flex items-center gap-3">
              {/* Select all checkbox */}
              <button
                onClick={selectAll}
                className="p-1.5 hover:bg-[var(--semantic-surface-hover)] rounded transition-colors"
                title={selectedIds.size === filteredMessages.length && filteredMessages.length > 0 ? "Deselect all (Cmd/Ctrl+A)" : "Select all (Cmd/Ctrl+A)"}
              >
                {selectedIds.size === filteredMessages.length && filteredMessages.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-[var(--semantic-primary)]" />
                ) : (
                  <Square className="w-4 h-4 text-[var(--semantic-text-tertiary)]" />
                )}
              </button>
              
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--semantic-text-tertiary)]" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search messages... (Press / or Cmd+F)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[var(--semantic-bg-subtle)] border-[var(--semantic-border-light)]"
                />
              </div>
            </div>
          </div>

          {/* Message List with Virtual Scrolling */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="p-4">
                <MessageListSkeleton count={8} />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Mail className="w-16 h-16 text-[var(--semantic-text-tertiary)] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)] mb-2">
                    No messages
                  </h3>
                  <p className="text-sm text-[var(--semantic-text-tertiary)]">
                    {searchQuery ? 'No messages match your search' : 'Your inbox is empty'}
                  </p>
                </div>
              </div>
            ) : (
              <VirtualList
                items={flattenedMessages}
                estimatedItemHeight={120}
                className="h-full"
                overscan={5}
                renderItem={(item, index) => {
                  // Render divider
                  if (item.type === 'divider') {
                    return (
                      <LoomOSListDivider key={`divider-${item.groupName}`}>
                        {item.groupName}
                      </LoomOSListDivider>
                    );
                  }
                  
                  // Render message
                  const message = item.message;
                  const messageIndex = filteredMessages.findIndex(m => m.id === message.id);
                  const isUnread = !message.recipients[0]?.isRead;
                  const isStarred = message.recipients[0]?.isStarred;
                  const isSelected = selectedMessage?.id === message.id;
                  const isChecked = selectedIds.has(message.id);
                  const isFocused = messageIndex === focusedIndex;
                  
                  return (
                    <ContextMenu key={message.id}>
                      <ContextMenuTrigger asChild>
                        <LoomOSListItem
                          data-message-index={messageIndex}
                          selected={isSelected}
                          checked={isChecked}
                          unread={isUnread}
                          editMode={selectionMode}
                          onClick={() => handleSelectMessage(message)}
                          onDoubleClick={() => handleSelectMessage(message)}
                          onCheck={(checked) => toggleSelection(message.id)}
                          className={cn(isFocused && 'ring-2 ring-blue-500 ring-inset')}
                          animationIndex={messageIndex}
                        >
                          <div className="flex items-start gap-4 px-6 py-4">
                            <Avatar className="w-11 h-11 ring-2 ring-white shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                                {message.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                        
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={cn(
                                    'font-semibold text-sm truncate',
                                    isUnread ? 'text-[var(--semantic-text-primary)]' : 'text-[var(--semantic-text-secondary)]'
                                  )}>
                                    {message.sender.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs text-[var(--semantic-text-tertiary)]">
                                    {getMessageDate(message.sentAt || message.createdAt)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStar(message.id, e);
                                    }}
                                    className="p-1 hover:bg-[var(--semantic-surface-hover)] rounded transition-colors"
                                  >
                                    <Star 
                                      className={cn(
                                        'w-4 h-4',
                                        isStarred 
                                          ? 'fill-yellow-400 text-[var(--semantic-warning)]' 
                                          : 'text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-warning)]'
                                      )} 
                                    />
                                  </button>
                                </div>
                              </div>
                              
                              <div className={cn(
                                'text-sm mb-1 truncate',
                                isUnread ? 'font-semibold text-[var(--semantic-text-primary)]' : 'font-medium text-[var(--semantic-text-secondary)]'
                              )}>
                                {message.subject}
                              </div>
                              
                              <div className="text-xs text-[var(--semantic-text-tertiary)] line-clamp-2">
                                {message.body}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2">
                                {message.hasAttachments && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    <Paperclip className="w-3 h-3 mr-1" />
                                    Attachment
                                  </Badge>
                                )}
                                {message.priority !== 'NORMAL' && (
                                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {message.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </LoomOSListItem>
                      </ContextMenuTrigger>
                      
                      <ContextMenuContent className="w-64">
                        <ContextMenuItem onClick={() => handleCompose('reply', message)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                          <span className="ml-auto text-xs text-[var(--semantic-text-tertiary)]">R</span>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => handleCompose('forward', message)}>
                          <Forward className="w-4 h-4 mr-2" />
                          Forward
                          <span className="ml-auto text-xs text-[var(--semantic-text-tertiary)]">F</span>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={(e) => { e.stopPropagation(); toggleStar(message.id); }}>
                          <Star className={cn("w-4 h-4 mr-2", isStarred && "fill-yellow-400 text-[var(--semantic-warning)]")} />
                          {isStarred ? 'Unstar' : 'Star'}
                          <span className="ml-auto text-xs text-[var(--semantic-text-tertiary)]">S</span>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => markAsRead(message.id)}>
                          <Check className="w-4 h-4 mr-2" />
                          Mark as Read
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem 
                          onClick={(e) => { e.stopPropagation(); deleteMessage(message.id); }}
                          className="text-[var(--semantic-error)] focus:text-[var(--semantic-error)]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                          <span className="ml-auto text-xs text-[var(--semantic-text-tertiary)]">Del</span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                }}
              />
            )}
          </div>
        </div>

        {/* Detail Pane */}
        <LoomOSDetailPane
          title={selectedMessage?.subject}
          subtitle={selectedMessage ? `From: ${selectedMessage.sender.name} • ${format(parseISO(selectedMessage.sentAt || selectedMessage.createdAt), 'MMM d, yyyy')}` : undefined}
          actions={detailActions}
          isEmpty={!selectedMessage}
          emptyIcon={<Mail size={64} />}
          emptyMessage="No message selected"
          emptySubMessage="Select a message from the list to view its content"
        >
          {selectedMessage && (
            <div className="flex flex-col">
              {/* Sender Info */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[var(--semantic-border-light)]">
                <Avatar className="w-14 h-14 ring-4 ring-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-lg font-semibold">
                    {selectedMessage.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-[var(--semantic-text-primary)]">
                    {selectedMessage.sender.name}
                  </div>
                  <div className="text-sm text-[var(--semantic-text-tertiary)]">
                    {selectedMessage.sender.email}
                  </div>
                  <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">
                    {format(parseISO(selectedMessage.sentAt || selectedMessage.createdAt), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                  </div>
                  
                  {/* Recipients */}
                  {selectedMessage.recipients.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-[var(--semantic-text-tertiary)]">To:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedMessage.recipients.slice(0, 3).map((recipient, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {recipient.user.name}
                          </Badge>
                        ))}
                        {selectedMessage.recipients.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{selectedMessage.recipients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Badge */}
              {selectedMessage.priority !== 'NORMAL' && (
                <div className="mb-6">
                  <Badge variant="destructive" className="text-sm px-3 py-1.5">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {selectedMessage.priority} Priority
                  </Badge>
                </div>
              )}

              {/* Message Body */}
              <div className="prose prose-sm max-w-none">
                {selectedMessage.body.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-[var(--semantic-text-secondary)] leading-relaxed">
                    {paragraph || '\u00A0'}
                  </p>
                ))}
              </div>

              {/* Attachments Placeholder */}
              {selectedMessage.hasAttachments && (
                <div className="mt-8 p-4 bg-[var(--semantic-bg-subtle)] rounded-lg border border-[var(--semantic-border-light)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)]">
                    <Paperclip className="w-4 h-4" />
                    <span className="font-medium">Attachments</span>
                  </div>
                  <p className="text-xs text-[var(--semantic-text-tertiary)] mt-2">
                    Attachment support coming soon
                  </p>
                </div>
              )}

              {/* Quick Actions Footer */}
              <div className="mt-8 pt-6 border-t border-[var(--semantic-border-light)] flex items-center justify-center gap-3">
                <Button
                  onClick={() => handleCompose('reply', selectedMessage)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCompose('forward', selectedMessage)}
                >
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </Button>
              </div>
            </div>
          )}
        </LoomOSDetailPane>

        {/* Composer Overlay */}
        <AnimatePresence>
          {showComposer && (
            <motion.div
              className="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelCompose}
            >
              <motion.div
                className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--semantic-border-light)]">
                  <h2 className="text-xl font-semibold">
                    {composerMode === 'new' && 'New Message'}
                    {composerMode === 'reply' && 'Reply'}
                    {composerMode === 'forward' && 'Forward'}
                  </h2>
                  <button
                    onClick={handleCancelCompose}
                    className="text-[var(--semantic-text-tertiary)] hover:text-[var(--semantic-text-secondary)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[var(--semantic-text-secondary)]">To</label>
                      <Input
                        type="text"
                        placeholder="Recipient email(s), separated by commas"
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--semantic-text-secondary)]">Subject</label>
                      <Input
                        type="text"
                        placeholder="Message subject"
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--semantic-text-secondary)]">Priority</label>
                      <Select value={composePriority} onValueChange={(value: any) => setComposePriority(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--semantic-text-secondary)]">Message</label>
                      <Textarea
                        placeholder="Type your message..."
                        value={composeBody}
                        onChange={(e) => setComposeBody(e.target.value)}
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-[var(--semantic-border-light)] bg-[var(--semantic-bg-subtle)]">
                  <Button
                    variant="outline"
                    onClick={handleCancelCompose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Dialog */}
        <Dialog open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-2">General</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>New message</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">C</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Search</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">/</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Refresh</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">Cmd/Ctrl+R</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Select all</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">Cmd/Ctrl+A</kbd>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Navigation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Previous/Next message</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">↑/↓</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Open message</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">Enter</kbd>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reply</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">R</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Forward</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">F</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Star/Unstar</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">S</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delete</span>
                      <kbd className="px-2 py-1 bg-[var(--semantic-surface-hover)] border border-[var(--semantic-border-medium)] rounded text-xs">Del</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}
