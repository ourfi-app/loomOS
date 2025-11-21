/**
 * Contacts - webOS-inspired Contact Management
 * Matches the clean, elegant contact view from Palm webOS
 */

'use client';

import { useState, useMemo } from 'react';
import {
  User,
  Users,
  Phone,
  Mail,
  Building2,
  MapPin,
  Plus,
  Search,
  Star,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSListItem,
  LoomOSListDivider,
  DesktopAppWrapper
} from '@/components/webos';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { cn } from '@/lib/utils';

// Mock contacts data (replace with actual API call)
const MOCK_CONTACTS = [
  {
    id: '1',
    name: 'Bella Bartok',
    title: 'Senior Visual Designer',
    team: 'HI Team',
    location: 'Palm',
    email: 'bella.bartok@example.com',
    mobile: '(650) 575-6748',
    work: '(480) 489-8462',
    homeEmail: 'designchops@gmail.com',
    workEmail: 'mark@antoniocreative.com',
    avatar: '/avatars/bella.jpg',
    favorite: true,
    status: 'online'
  },
  {
    id: '2',
    name: 'Angus Black',
    title: 'Product Manager',
    team: 'Product Team',
    location: 'San Francisco',
    email: 'angus.black@example.com',
    mobile: '(415) 123-4567',
    work: '(415) 987-6543',
    avatar: '/avatars/angus.jpg',
    favorite: false,
    status: 'away'
  },
  {
    id: '3',
    name: 'Hieronimus Bosch',
    title: 'Software Engineer',
    team: 'Engineering',
    location: 'New York',
    email: 'h.bosch@example.com',
    mobile: '(212) 555-0100',
    work: '(212) 555-0101',
    avatar: '/avatars/hieronimus.jpg',
    favorite: false,
    status: 'offline'
  },
  {
    id: '4',
    name: 'Dr. Box',
    title: 'Chief Medical Officer',
    team: 'Healthcare',
    location: 'Boston',
    email: 'dr.box@example.com',
    mobile: '(617) 555-0200',
    work: '(617) 555-0201',
    avatar: '/avatars/drbox.jpg',
    favorite: true,
    status: 'online'
  },
  {
    id: '5',
    name: 'Greg Bull',
    title: 'Marketing Director',
    team: 'Marketing',
    location: 'Los Angeles',
    email: 'greg.bull@example.com',
    mobile: '(310) 555-0300',
    work: '(310) 555-0301',
    avatar: '/avatars/greg.jpg',
    favorite: false,
    status: 'online'
  },
  {
    id: '6',
    name: 'Jon Cale',
    title: 'UX Researcher',
    team: 'Design',
    location: 'Seattle',
    email: 'jon.cale@example.com',
    mobile: '(206) 555-0400',
    work: '(206) 555-0401',
    avatar: '/avatars/jon.jpg',
    favorite: false,
    status: 'away'
  },
  {
    id: '7',
    name: 'Joanna Cantrigde',
    title: 'Content Strategist',
    team: 'Marketing',
    location: 'Austin',
    email: 'joanna.c@example.com',
    mobile: '(512) 555-0500',
    work: '(512) 555-0501',
    avatar: '/avatars/joanna.jpg',
    favorite: true,
    status: 'online'
  },
  {
    id: '8',
    name: 'Ray Car',
    title: 'DevOps Engineer',
    team: 'Engineering',
    location: 'Denver',
    email: 'ray.car@example.com',
    mobile: '(303) 555-0600',
    work: '(303) 555-0601',
    avatar: '/avatars/ray.jpg',
    favorite: false,
    status: 'online'
  }
];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites'>('all');

  // Filter contacts
  const filteredContacts = useMemo(() => {
    let filtered = MOCK_CONTACTS;

    // Filter by favorites
    if (selectedFilter === 'favorites') {
      filtered = filtered.filter(c => c.favorite);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.team.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedFilter]);

  // Group contacts alphabetically
  const groupedContacts = useMemo(() => {
    const groups: { [key: string]: typeof MOCK_CONTACTS } = {};
    
    filteredContacts.forEach(contact => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });

    return Object.keys(groups).sort().map(letter => ({
      letter,
      contacts: groups[letter].sort((a, b) => a.name.localeCompare(b.name))
    }));
  }, [filteredContacts]);

  const navItems = [
    {
      id: 'all',
      label: 'All Contacts',
      icon: <Users className="w-4 h-4" />,
      count: MOCK_CONTACTS.length,
      active: selectedFilter === 'all',
      onClick: () => setSelectedFilter('all')
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="w-4 h-4" />,
      count: MOCK_CONTACTS.filter(c => c.favorite).length,
      active: selectedFilter === 'favorites',
      onClick: () => setSelectedFilter('favorites')
    }
  ];

  const appDef = APP_REGISTRY['contacts'] || {
    title: 'Contacts',
    gradient: 'from-teal-500 to-cyan-500'
  };

  return (
    <DesktopAppWrapper
      title="Contacts"
      icon={<Users className="w-5 h-5" />}
      gradient={appDef.gradient}
    >
      <div className="h-full flex overflow-hidden">
        {/* Navigation Pane */}
        <LoomOSNavigationPane
          title="CONTACTS"
          items={navItems}
        />

        {/* Contact List Pane */}
        <div className="w-[280px] flex-shrink-0 border-r border-[var(--semantic-border-light)] flex flex-col bg-[var(--semantic-bg-tertiary)] overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-[var(--semantic-border-light)] bg-[var(--semantic-surface-base)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--semantic-text-tertiary)]" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--semantic-bg-subtle)] border-[var(--semantic-border-light)]"
              />
            </div>
          </div>

          {/* Contact List */}
          <ScrollArea className="flex-1">
            {groupedContacts.map(group => (
              <div key={group.letter}>
                <LoomOSListDivider>{group.letter}</LoomOSListDivider>
                {group.contacts.map((contact, index) => (
                  <LoomOSListItem
                    key={contact.id}
                    selected={selectedContact?.id === contact.id}
                    onClick={() => setSelectedContact(contact)}
                    animationIndex={index}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-sm font-semibold">
                            {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* Status indicator */}
                        <div className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                          contact.status === 'online' && "bg-green-500",
                          contact.status === 'away' && "bg-yellow-500",
                          contact.status === 'offline' && "bg-gray-400"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm text-[var(--semantic-text-primary)] truncate">
                            {contact.name}
                          </span>
                          {contact.favorite && (
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-[var(--semantic-text-tertiary)] truncate">
                          {contact.team}
                        </div>
                      </div>
                    </div>
                  </LoomOSListItem>
                ))}
              </div>
            ))}
          </ScrollArea>

          {/* Add Contact Button */}
          <div className="p-4 border-t border-[var(--semantic-border-light)] bg-[var(--semantic-surface-base)]">
            <Button className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Contact Detail Pane */}
        <LoomOSDetailPane
          title={selectedContact?.name}
          isEmpty={!selectedContact}
          emptyIcon={<User size={64} />}
          emptyMessage="No contact selected"
          emptySubMessage="Select a contact from the list to view details"
        >
          {selectedContact && (
            <div className="flex flex-col items-center">
              {/* Profile Section - webOS Style */}
              <div className="w-full bg-[var(--semantic-surface-base)] rounded-2xl p-8 mb-6 text-center">
                {/* Large Circular Avatar */}
                <div className="flex justify-center mb-4">
                  <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-4xl font-semibold">
                      {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name and Title */}
                <h1 className="text-2xl font-light text-[var(--semantic-text-primary)] mb-1 tracking-tight">
                  {selectedContact.name}
                </h1>
                <p className="text-sm text-[var(--semantic-text-secondary)] mb-1">
                  {selectedContact.title}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-[var(--semantic-text-tertiary)]">
                  <span>{selectedContact.team}</span>
                  <span>•</span>
                  <span>{selectedContact.location}</span>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <Badge 
                    variant={selectedContact.status === 'online' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {selectedContact.status}
                  </Badge>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button size="sm" className="flex-1 max-w-[120px]">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 max-w-[120px]">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>

              {/* Contact Information - webOS Style */}
              <div className="w-full space-y-1">
                {/* Mobile */}
                {selectedContact.mobile && (
                  <div className="flex items-center gap-4 px-6 py-4 bg-[var(--semantic-surface-base)] hover:bg-[var(--semantic-surface-hover)] transition-colors cursor-pointer rounded-xl group">
                    <div className="w-10 h-10 rounded-full bg-[var(--semantic-bg-subtle)] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Phone className="w-5 h-5 text-[var(--semantic-text-secondary)] group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--semantic-text-tertiary)] uppercase tracking-wide mb-0.5">
                        Mobile
                      </div>
                      <div className="text-sm font-medium text-[var(--semantic-text-primary)]">
                        {selectedContact.mobile}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--semantic-text-tertiary)]">
                      •••
                    </div>
                  </div>
                )}

                {/* Work Phone */}
                {selectedContact.work && (
                  <div className="flex items-center gap-4 px-6 py-4 bg-[var(--semantic-surface-base)] hover:bg-[var(--semantic-surface-hover)] transition-colors cursor-pointer rounded-xl group">
                    <div className="w-10 h-10 rounded-full bg-[var(--semantic-bg-subtle)] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Building2 className="w-5 h-5 text-[var(--semantic-text-secondary)] group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--semantic-text-tertiary)] uppercase tracking-wide mb-0.5">
                        Work
                      </div>
                      <div className="text-sm font-medium text-[var(--semantic-text-primary)]">
                        {selectedContact.work}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--semantic-text-tertiary)]">
                      •••
                    </div>
                  </div>
                )}

                {/* Work Email */}
                {selectedContact.workEmail && (
                  <div className="flex items-center gap-4 px-6 py-4 bg-[var(--semantic-surface-base)] hover:bg-[var(--semantic-surface-hover)] transition-colors cursor-pointer rounded-xl group">
                    <div className="w-10 h-10 rounded-full bg-[var(--semantic-bg-subtle)] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Mail className="w-5 h-5 text-[var(--semantic-text-secondary)] group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--semantic-text-tertiary)] uppercase tracking-wide mb-0.5">
                        Work
                      </div>
                      <div className="text-sm font-medium text-[var(--semantic-text-primary)]">
                        {selectedContact.workEmail}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--semantic-text-tertiary)]">
                      •••
                    </div>
                  </div>
                )}

                {/* Home Email */}
                {selectedContact.homeEmail && (
                  <div className="flex items-center gap-4 px-6 py-4 bg-[var(--semantic-surface-base)] hover:bg-[var(--semantic-surface-hover)] transition-colors cursor-pointer rounded-xl group">
                    <div className="w-10 h-10 rounded-full bg-[var(--semantic-bg-subtle)] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Mail className="w-5 h-5 text-[var(--semantic-text-secondary)] group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--semantic-text-tertiary)] uppercase tracking-wide mb-0.5">
                        Home
                      </div>
                      <div className="text-sm font-medium text-[var(--semantic-text-primary)]">
                        {selectedContact.homeEmail}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--semantic-text-tertiary)]">
                      •••
                    </div>
                  </div>
                )}

                {/* Location */}
                {selectedContact.location && (
                  <div className="flex items-center gap-4 px-6 py-4 bg-[var(--semantic-surface-base)] hover:bg-[var(--semantic-surface-hover)] transition-colors cursor-pointer rounded-xl group">
                    <div className="w-10 h-10 rounded-full bg-[var(--semantic-bg-subtle)] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <MapPin className="w-5 h-5 text-[var(--semantic-text-secondary)] group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[var(--semantic-text-tertiary)] uppercase tracking-wide mb-0.5">
                        Location
                      </div>
                      <div className="text-sm font-medium text-[var(--semantic-text-primary)]">
                        {selectedContact.location}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--semantic-text-tertiary)]">
                      •••
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-8 flex items-center gap-3">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </LoomOSDetailPane>
      </div>
    </DesktopAppWrapper>
  );
}
