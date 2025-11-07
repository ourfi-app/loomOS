'use client';

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  FileText,
  ListTodo,
  Sparkles
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
const CalendarTab = dynamic(() => import('@/components/organizer/calendar-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const NotesTab = dynamic(() => import('@/components/organizer/notes-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const TasksTab = dynamic(() => import('@/components/organizer/tasks-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

type TabType = 'calendar' | 'notes' | 'tasks';

export default function OrganizerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  const navItems = [
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon className="h-5 w-5" />,
      active: activeTab === 'calendar',
      onClick: () => setActiveTab('calendar')
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText className="h-5 w-5" />,
      active: activeTab === 'notes',
      onClick: () => setActiveTab('notes')
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <ListTodo className="h-5 w-5" />,
      active: activeTab === 'tasks',
      onClick: () => setActiveTab('tasks')
    },
  ];

  const appDef = APP_REGISTRY['organizer'];
  const OrganizerIcon = appDef?.icon;

  return (
    <DesktopAppWrapper
      title={appDef?.title || 'Organizer'}
      icon={OrganizerIcon ? <OrganizerIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      gradient={appDef?.gradient || 'from-purple-500 to-indigo-500'}
    >
      <div className="h-full flex overflow-hidden">
        <WebOSNavigationPane
          title="Organizer"
          items={navItems}
        />

        <div className="flex-1 bg-background overflow-hidden">
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'tasks' && <TasksTab />}
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
