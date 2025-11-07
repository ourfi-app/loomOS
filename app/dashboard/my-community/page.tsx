
'use client';

import { useState } from 'react';
import { FileText, Users, MessageSquare } from 'lucide-react';
import { DocumentsTab } from '@/components/my-community/documents-tab';
import { DirectoryTab } from '@/components/my-community/directory-tab';
import { PostsTab } from '@/components/my-community/posts-tab';
import { LoomOSNavigationPane } from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';

export default function MyCommunityPage() {
  const [activeSection, setActiveSection] = useState<'posts' | 'documents' | 'directory'>('posts');

  const navItems = [
    {
      id: 'posts',
      label: 'Posts',
      icon: <MessageSquare className="h-5 w-5" />,
      active: activeSection === 'posts',
      onClick: () => setActiveSection('posts')
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-5 w-5" />,
      active: activeSection === 'documents',
      onClick: () => setActiveSection('documents')
    },
    {
      id: 'directory',
      label: 'Directory',
      icon: <Users className="h-5 w-5" />,
      active: activeSection === 'directory',
      onClick: () => setActiveSection('directory')
    },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      <LoomOSNavigationPane
        title="My Community"
        items={navItems}
      />

      <div className="flex-1 bg-white overflow-y-auto p-6">
        {activeSection === 'posts' && <PostsTab />}
        {activeSection === 'documents' && <DocumentsTab />}
        {activeSection === 'directory' && <DirectoryTab />}
      </div>
    </div>
  );
}
