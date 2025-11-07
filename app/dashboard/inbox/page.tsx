'use client';

import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  Inbox as InboxIcon
} from 'lucide-react';
import {
  WebOSNavigationPane,
  DesktopAppWrapper
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

// Import the individual app components
import dynamic from 'next/dynamic';

// Dynamically import the heavy components to improve initial load
const MessagesTab = dynamic(() => import('@/components/inbox/messages-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const ChatTab = dynamic(() => import('@/components/inbox/chat-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const EmailTab = dynamic(() => import('@/components/inbox/email-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

type TabType = 'messages' | 'chat' | 'email';

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<TabType>('messages');

  const navItems = [
    {
      id: 'messages',
      label: 'Messages',
      icon: <Mail className="h-5 w-5" />,
      active: activeTab === 'messages',
      onClick: () => setActiveTab('messages')
    },
    {
      id: 'chat',
      label: 'Assistant',
      icon: <MessageSquare className="h-5 w-5" />,
      active: activeTab === 'chat',
      onClick: () => setActiveTab('chat')
    },
    {
      id: 'email',
      label: 'Email',
      icon: <Send className="h-5 w-5" />,
      active: activeTab === 'email',
      onClick: () => setActiveTab('email')
    },
  ];

  const appDef = APP_REGISTRY['inbox'];
  const InboxAppIcon = appDef?.icon;

  return (
    <DesktopAppWrapper
      title={appDef?.title || 'Inbox'}
      icon={InboxAppIcon ? <InboxAppIcon className="w-5 h-5" /> : <InboxIcon className="w-5 h-5" />}
      gradient={appDef?.gradient || 'from-blue-500 to-cyan-500'}
    >
      <div className="h-full flex overflow-hidden">
        <WebOSNavigationPane
          title="Inbox"
          items={navItems}
        />

        <div className="flex-1 bg-background overflow-hidden">
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'chat' && <ChatTab />}
          {activeTab === 'email' && <EmailTab />}
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
