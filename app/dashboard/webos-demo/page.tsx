'use client';

import { WebOSJustTypeSearch } from '@/components/webos/webos-just-type-search';
import { WebOSCardCarousel, WebOSCard } from '@/components/webos/webos-card-carousel';
import { Mail, FileText, Calendar, Users, Settings, MessageSquare } from 'lucide-react';

/**
 * WebOS Theme Demo Dashboard
 * 
 * This page demonstrates the webOS theme with:
 * - "JUST TYPE" search functionality
 * - Card-based carousel layout
 * - Clean, minimalist design
 * - Light gray color palette
 */
export default function WebOSDemoPage() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality here
  };

  const demoCards = [
    {
      id: 'mail',
      title: 'Mail',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-600">Meeting tomorrow at 3pm</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Jane Smith</p>
              <p className="text-xs text-gray-600">Project update</p>
            </div>
          </div>
        </div>
      ),
      onClick: () => console.log('Mail clicked')
    },
    {
      id: 'documents',
      title: 'Documents',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Budget 2024.pdf</p>
              <p className="text-xs text-gray-600">Modified 2 days ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Meeting Notes.docx</p>
              <p className="text-xs text-gray-600">Modified yesterday</p>
            </div>
          </div>
        </div>
      ),
      onClick: () => console.log('Documents clicked')
    },
    {
      id: 'calendar',
      title: 'Calendar',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Team Meeting</p>
              <p className="text-xs text-gray-600">Today at 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Project Review</p>
              <p className="text-xs text-gray-600">Tomorrow at 10:00 AM</p>
            </div>
          </div>
        </div>
      ),
      onClick: () => console.log('Calendar clicked')
    },
    {
      id: 'contacts',
      title: 'Contacts',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-600">john@example.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Jane Smith</p>
              <p className="text-xs text-gray-600">jane@example.com</p>
            </div>
          </div>
        </div>
      ),
      onClick: () => console.log('Contacts clicked')
    },
    {
      id: 'messages',
      title: 'Messages',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Sarah Wilson</p>
              <p className="text-xs text-gray-600">Thanks for the update!</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Mike Johnson</p>
              <p className="text-xs text-gray-600">See you tomorrow</p>
            </div>
          </div>
        </div>
      ),
      onClick: () => console.log('Messages clicked')
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--semantic-bg-base)' }}>
      {/* Top Section with Search */}
      <div className="container mx-auto pt-16 pb-12">
        <WebOSJustTypeSearch
          onSearch={handleSearch}
          className="max-w-2xl mx-auto"
        />
      </div>

      {/* Card Carousel Section */}
      <div className="container mx-auto pb-16">
        <WebOSCardCarousel cards={demoCards} />
      </div>

      {/* Additional Content Cards */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WebOSCard title="Settings">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm">Configure your preferences</p>
              </div>
            </div>
          </WebOSCard>

          <WebOSCard title="Recent Activity">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">3 new messages</p>
              <p className="text-sm text-gray-600">2 calendar events</p>
              <p className="text-sm text-gray-600">1 document shared</p>
            </div>
          </WebOSCard>

          <WebOSCard title="Quick Actions">
            <div className="space-y-2">
              <button className="webos-button w-full text-left">
                New Message
              </button>
              <button className="webos-button w-full text-left">
                Create Document
              </button>
              <button className="webos-button w-full text-left">
                Schedule Meeting
              </button>
            </div>
          </WebOSCard>
        </div>
      </div>

      {/* Bottom Dock Icons Section */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="webos-dock">
          <div className="webos-dock-icon">
            <Mail className="w-6 h-6" />
          </div>
          <div className="webos-dock-icon">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="webos-dock-icon">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="webos-dock-icon">
            <FileText className="w-6 h-6" />
          </div>
          <div className="webos-dock-icon">
            <Users className="w-6 h-6" />
          </div>
          <div className="webos-dock-icon">
            <Settings className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
