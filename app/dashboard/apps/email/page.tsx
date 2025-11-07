
'use client';

import React, { useState } from 'react';
import {
  Mail,
  Star,
  Send,
  FileText,
  Archive,
  Users,
  Inbox,
  Reply,
  Forward,
  Trash2,
  Search,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Paperclip,
  MoreVertical,
  Settings,
  Download,
  Printer,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  WebOSMultiPaneLayout,
  WebOSPane,
  WebOSPaneHeader,
  WebOSPaneContent,
  WebOSPaneFooter,
} from '@/components/webos/multi-pane-layout';
import { WebOSListItem, WebOSListItemContent } from '@/components/webos/webos-list-item';
import { WebOSEmptyState } from '@/components/webos/webos-empty-state';
import { WebOSSearchBar } from '@/components/webos/webos-search-bar';
import { ErrorBoundary } from '@/components/common';
import { APP_COLORS } from '@/lib/app-design-system';
import { cn } from '@/lib/utils';

// Email data types
interface Email {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body?: string;
  time: string;
  date: string;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
  recipients?: string;
  folder: string;
  account: string;
}

// Sample email data
const emails: Email[] = [
  {
    id: 1,
    from: 'Board President',
    fromEmail: 'president@montrecott.com',
    subject: 'Important: Annual Meeting Notice',
    preview: 'The annual homeowners meeting will be held on November 15th at 7:00 PM in the community room...',
    body: `Dear Residents,

The annual homeowners meeting will be held on November 15th at 7:00 PM in the community room. This is an important meeting where we will:

• Review the 2025 budget
• Elect new board members
• Discuss ongoing maintenance projects
• Address resident concerns

Please plan to attend. Light refreshments will be served.

Best regards,
John Smith
Board President`,
    time: '12:34 PM',
    date: 'Oct 22',
    unread: true,
    starred: false,
    hasAttachment: false,
    recipients: 'All Residents',
    folder: 'inbox',
    account: 'montrecott',
  },
  {
    id: 2,
    from: 'Maintenance Team',
    fromEmail: 'maintenance@montrecott.com',
    subject: 'Elevator Maintenance Schedule',
    preview: 'Please be advised that elevator maintenance will be performed this week...',
    body: `Dear Residents,

Please be advised that elevator maintenance will be performed this week according to the following schedule:

Monday: Building A elevators - 9:00 AM to 5:00 PM
Tuesday: Building B elevators - 9:00 AM to 5:00 PM

We apologize for any inconvenience and appreciate your understanding.

Best regards,
Maintenance Team`,
    time: '9:32 AM',
    date: 'Oct 22',
    unread: true,
    starred: false,
    hasAttachment: false,
    recipients: 'All Residents',
    folder: 'inbox',
    account: 'montrecott',
  },
  {
    id: 3,
    from: 'Treasurer',
    fromEmail: 'treasurer@montrecott.com',
    subject: 'Q4 Assessment Reminder',
    preview: 'This is a friendly reminder that Q4 assessments are due by October 31st...',
    body: `Dear Homeowners,

This is a friendly reminder that Q4 assessments are due by October 31st. Please ensure your payment is submitted on time to avoid late fees.

You can pay online through the resident portal or mail a check to:

Montrecott HOA
1907 Montrose Ave
Chicago, IL 60613

Thank you for your prompt payment.

Best regards,
Sarah Johnson
Treasurer`,
    time: '7:59 AM',
    date: 'Oct 22',
    unread: false,
    starred: true,
    hasAttachment: true,
    recipients: 'All Homeowners',
    folder: 'inbox',
    account: 'montrecott',
  },
  {
    id: 4,
    from: 'Security',
    fromEmail: 'security@montrecott.com',
    subject: 'New Access Codes',
    preview: 'New building access codes have been distributed. Please update your records...',
    body: `Dear Residents,

New building access codes have been distributed. Please update your records and ensure you destroy any notes with the old codes.

The new codes are effective immediately. If you did not receive your new code, please contact the management office.

Thank you,
Security Team`,
    time: '10:15 AM',
    date: 'Oct 21',
    unread: false,
    starred: false,
    hasAttachment: false,
    recipients: 'All Residents',
    folder: 'inbox',
    account: 'montrecott',
  },
  {
    id: 5,
    from: 'Association Manager',
    fromEmail: 'manager@montrecott.com',
    subject: 'Holiday Party Planning',
    preview: 'We are excited to announce our annual holiday party on December 15th...',
    body: `Dear Neighbors,

We are excited to announce our annual holiday party on December 15th at 6:00 PM in the community room!

Please RSVP by December 1st so we can plan accordingly. Feel free to bring a dish to share.

Looking forward to celebrating with everyone!

Best regards,
Lisa Martinez
Association Manager`,
    time: '3:45 PM',
    date: 'Oct 21',
    unread: false,
    starred: false,
    hasAttachment: false,
    recipients: 'All Residents',
    folder: 'inbox',
    account: 'montrecott',
  },
];

interface Folder {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  starred?: boolean;
}

interface AccountFolder extends Folder {
  expanded?: boolean;
  subfolders?: Folder[];
}

export default function EmailApp() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('all-inboxes');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<Record<string, boolean>>({
    montrecott: true,
  });

  // Favorites
  const favorites: Folder[] = [
    { id: 'all-inboxes', label: 'All Inboxes', icon: Mail, count: 3 },
    { id: 'community', label: 'Community Board', icon: Users, count: 2 },
    { id: 'maintenance', label: 'Maintenance', icon: FileText, count: 1 },
    { id: 'finance', label: 'Finance', icon: Mail, count: 0 },
  ];

  // Account folders
  const accounts: AccountFolder[] = [
    {
      id: 'montrecott',
      label: 'Montrecott Email',
      icon: Mail,
      expanded: expandedAccounts['montrecott'],
      subfolders: [
        { id: 'inbox', label: 'Inbox', icon: Inbox, count: 3 },
        { id: 'sent', label: 'Sent', icon: Send },
        { id: 'drafts', label: 'Drafts', icon: FileText },
        { id: 'archived', label: 'Archived', icon: Archive },
        { id: 'starred', label: 'Starred', icon: Star, starred: true },
        { id: 'trash', label: 'Trash', icon: Trash2 },
      ],
    },
  ];

  // Filter emails based on selected folder
  const getFilteredEmails = () => {
    let filtered = emails;

    if (selectedFolder === 'all-inboxes') {
      filtered = emails.filter((e) => e.folder === 'inbox');
    } else if (selectedFolder === 'starred') {
      filtered = emails.filter((e) => e.starred);
    } else {
      filtered = emails.filter((e) => e.folder === selectedFolder);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredEmails = getFilteredEmails();
  const unreadCount = filteredEmails.filter((e) => e.unread).length;

  // Group emails by date
  const groupEmailsByDate = (emails: Email[]) => {
    const today = new Date().toDateString();
    const groups: Record<string, Email[]> = {};

    emails.forEach((email) => {
      const emailDate = new Date(email.date + ', 2025').toDateString();
      const label = emailDate === today ? 'TODAY' : email.date.toUpperCase();
      if (!groups[label]) {
        groups[label] = [];
      }
      const group = groups[label];
      if (group) {
        group.push(email);
      }
    });

    return groups;
  };

  const emailGroups = groupEmailsByDate(filteredEmails);

  const toggleAccount = (accountId: string) => {
    setExpandedAccounts((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    setSelectedEmail(null);
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleStarEmail = (emailId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would update the backend
    console.log('Toggle star for email:', emailId);
  };

  const handleDeleteEmail = (emailId: number) => {
    console.log('Delete email:', emailId);
    setSelectedEmail(null);
  };

  const handleArchiveEmail = (emailId: number) => {
    console.log('Archive email:', emailId);
    setSelectedEmail(null);
  };

  // Menu items for the app window
  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Message', icon: <Plus size={14} />, onClick: () => console.log('New Message') },
        { label: 'Save', icon: <Download size={14} />, onClick: () => console.log('Save') },
        { label: 'Print', icon: <Printer size={14} />, onClick: () => console.log('Print') },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Reply', icon: <Reply size={14} />, onClick: () => console.log('Reply') },
        { label: 'Forward', icon: <Forward size={14} />, onClick: () => console.log('Forward') },
        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => console.log('Delete') },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Refresh', icon: <RefreshCw size={14} />, onClick: () => console.log('Refresh') },
        { label: 'Show Folders', onClick: () => console.log('Show Folders') },
      ],
    },
    {
      label: 'Mailbox',
      items: [
        { label: 'Get New Mail', icon: <RefreshCw size={14} />, onClick: () => console.log('Get New Mail') },
        { label: 'Archive', icon: <Archive size={14} />, onClick: () => console.log('Archive') },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col bg-[var(--webos-bg-primary)]">
          <WebOSMultiPaneLayout className="flex-1">
          {/* Pane 1: Navigation (Folders & Accounts) */}
          <WebOSPane type="navigation" className="w-[240px]">
            <WebOSPaneHeader title="FOLDERS" />
            
            <WebOSPaneContent>
              {/* Favorites Section */}
              <div className="py-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => handleFolderSelect(fav.id)}
                    className={cn(
                      'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors border-b border-[var(--webos-divider)]',
                      selectedFolder === fav.id
                        ? 'bg-[var(--webos-accent-selected)] text-white'
                        : 'hover:bg-[var(--webos-accent-hover)]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <fav.icon size={16} />
                      <span className="text-[var(--webos-text-base)]">{fav.label}</span>
                    </div>
                    {fav.count !== undefined && fav.count > 0 && (
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-bold',
                          selectedFolder === fav.id
                            ? 'bg-white text-gray-800'
                            : 'bg-gray-500 text-white'
                        )}
                      >
                        {fav.count}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Accounts Section */}
              <div className="mt-4">
                <div className="px-4 py-2 text-[11px] font-bold tracking-wider text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200">
                  ACCOUNTS
                </div>
                
                {accounts.map((account) => (
                  <div key={account.id}>
                    {/* Account Header */}
                    <div
                      onClick={() => toggleAccount(account.id)}
                      className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-[var(--webos-accent-hover)] transition-colors border-b border-[var(--webos-divider)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <account.icon size={16} />
                        <span className="text-[var(--webos-text-base)]">{account.label}</span>
                      </div>
                      {account.expanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>

                    {/* Subfolders */}
                    {account.expanded && account.subfolders && (
                      <div className="ml-4">
                        {account.subfolders.map((folder) => (
                          <div
                            key={folder.id}
                            onClick={() => handleFolderSelect(folder.id)}
                            className={cn(
                              'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors border-b border-[var(--webos-divider)]',
                              selectedFolder === folder.id
                                ? 'bg-[var(--webos-accent-selected)] text-white'
                                : 'hover:bg-[var(--webos-accent-hover)]'
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <folder.icon size={14} />
                              <span className="text-sm">{folder.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {folder.count !== undefined && folder.count > 0 && (
                                <span
                                  className={cn(
                                    'text-xs px-1.5 py-0.5 rounded-full font-bold',
                                    selectedFolder === folder.id
                                      ? 'bg-white text-gray-800'
                                      : 'bg-gray-500 text-white'
                                  )}
                                >
                                  {folder.count}
                                </span>
                              )}
                              {folder.starred && (
                                <Star size={12} className="fill-orange-500 text-orange-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </WebOSPaneContent>

            <WebOSPaneFooter>
              <div className="flex items-center justify-center gap-2 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  title="Settings"
                >
                  <MoreVertical size={18} />
                </Button>
              </div>
            </WebOSPaneFooter>
          </WebOSPane>

          {/* Pane 2: Email List */}
          <WebOSPane type="list" className="w-[320px]">
            <WebOSPaneHeader
              title={favorites.find((f) => f.id === selectedFolder)?.label || 'Inbox'}
              actions={
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white font-bold">
                    {unreadCount}
                  </span>
                </div>
              }
            />

            <div className="px-4 py-3 border-b border-[var(--webos-divider)]">
              <WebOSSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search emails..."
              />
            </div>

            <WebOSPaneContent>
              {filteredEmails.length === 0 ? (
                <WebOSEmptyState
                  icon={<Mail size={48} />}
                  title="No emails"
                  description="No emails found in this folder"
                />
              ) : (
                <>
                  {Object.entries(emailGroups).map(([dateLabel, groupEmails]) => (
                    <div key={dateLabel}>
                      {/* Date Header */}
                      <div className="px-4 py-2 text-[11px] font-bold text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 sticky top-0 z-10">
                        {dateLabel}
                      </div>

                      {/* Email Items */}
                      {groupEmails.map((email) => (
                        <WebOSListItem
                          key={email.id}
                          selected={selectedEmail?.id === email.id}
                          unread={email.unread}
                          onClick={() => handleEmailSelect(email)}
                          onSwipeLeft={() => handleDeleteEmail(email.id)}
                          onSwipeRight={() => handleArchiveEmail(email.id)}
                        >
                          <WebOSListItemContent
                            title={
                              <div className="flex items-center justify-between gap-2 w-full">
                                <span className={cn(email.unread && 'font-bold')}>{email.from}</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {email.hasAttachment && (
                                    <Paperclip size={12} className="text-gray-500" />
                                  )}
                                  <button
                                    onClick={(e) => handleStarEmail(email.id, e)}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <Star
                                      size={12}
                                      className={cn(
                                        email.starred
                                          ? 'fill-orange-500 text-orange-500'
                                          : 'text-gray-400'
                                      )}
                                    />
                                  </button>
                                </div>
                              </div>
                            }
                            subtitle={
                              <>
                                <div className="font-medium text-sm mb-0.5">{email.subject}</div>
                                <div className="text-sm">{email.preview}</div>
                              </>
                            }
                            meta={
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {email.time}
                              </span>
                            }
                          />
                        </WebOSListItem>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </WebOSPaneContent>

            <WebOSPaneFooter>
              <div className="flex items-center justify-center gap-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  title="Compose"
                >
                  <Plus size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={18} />
                </Button>
              </div>
            </WebOSPaneFooter>
          </WebOSPane>

          {/* Pane 3: Email Detail */}
          <WebOSPane type="detail">
            {selectedEmail ? (
              <>
                {/* Email Header */}
                <div className="px-6 py-5 border-b border-[var(--webos-divider)] bg-gradient-to-b from-gray-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-2xl">{selectedEmail.from[0]}</span>
                      </div>

                      {/* Sender Info */}
                      <div>
                        <div className="text-xl font-bold text-gray-800 mb-1">
                          {selectedEmail.from}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedEmail.fromEmail}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {selectedEmail.date}, {selectedEmail.time}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleStarEmail(selectedEmail.id, e)}
                        className="text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <Star
                          size={20}
                          className={cn(
                            selectedEmail.starred && 'fill-orange-500 text-orange-500'
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Mark unread
                      </Button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmail.subject}
                    </h2>
                  </div>

                  {/* Recipients */}
                  {selectedEmail.recipients && (
                    <div className="flex items-start gap-2 text-sm bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                      <span className="font-bold text-gray-700 flex-shrink-0">TO:</span>
                      <span className="text-gray-600">{selectedEmail.recipients}</span>
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <WebOSPaneContent>
                  <div className="px-6 py-6">
                    <div className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
                      {selectedEmail.body || selectedEmail.preview}
                    </div>
                  </div>
                </WebOSPaneContent>

                {/* Action Footer */}
                <WebOSPaneFooter>
                  <div className="flex items-center gap-3 py-3 px-5">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Reply size={16} className="mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Reply size={16} className="mr-2 scale-x-[-1]" />
                      Reply All
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward size={16} className="mr-2" />
                      Forward
                    </Button>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveEmail(selectedEmail.id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Archive size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmail(selectedEmail.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </WebOSPaneFooter>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <WebOSEmptyState
                  icon={<Mail size={48} />}
                  title="Nothing selected"
                  description="Select an email to view its contents"
                />
              </div>
            )}
          </WebOSPane>
          </WebOSMultiPaneLayout>
      </div>
    </ErrorBoundary>
  );
}
