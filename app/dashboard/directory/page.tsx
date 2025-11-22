// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RequestDirectoryUpdateDialog } from '@/components/request-directory-update-dialog';
import { ErrorBoundary, VirtualList } from '@/components/common';
import { DirectoryCardSkeleton } from '@/components/common/skeleton-screens';
import { toastError } from '@/lib/toast-helpers';
import { useDirectoryData } from '@/hooks/use-api';
import {
  LoomOSListItem,
  LoomOSGroupBox,
  LoomOSListDivider
} from '@/components/webos';

import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Home,
  Shield,
  Hammer,
  Heart,
  Droplets,
  PartyPopper,
  Loader2,
  Menu,
  Plus,
  RefreshCw,
  ChevronRight,
  PawPrint,
  Baby,
  UserPlus,
  Building,
  Calendar,
  Bed,
  Bath,
  Maximize,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { hasBoardAccess } from '@/lib/auth';
import { APP_COLORS } from '@/lib/app-design-system';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string | null;
  color?: string | null;
}

interface Child {
  id: string;
  name: string;
  age?: number | null;
  grade?: string | null;
}

interface AdditionalResident {
  id: string;
  name: string;
  relationship: string;
  email?: string | null;
  phone?: string | null;
  isEmergencyContact: boolean;
}

interface PropertyUnit {
  building: string | null;
  floor: number | null;
  squareFootage: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
}

interface CommitteeMembership {
  id: string;
  position: string | null;
  committee: {
    id: string;
    name: string;
    type: string;
  };
}

interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  unitNumber: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  pets: Pet[];
  children: Child[];
  additionalResidents: AdditionalResident[];
  propertyUnit: PropertyUnit | null;
  committeeMemberships: CommitteeMembership[];
}

interface CommitteeMember {
  id: string;
  position: string | null;
  bio: string | null;
  user: User;
}

interface Committee {
  id: string;
  name: string;
  description: string | null;
  type: string;
  email: string | null;
  members: CommitteeMember[];
}

const committeeIcons: Record<string, any> = {
  board: Shield,
  architectural: Hammer,
  welcoming: Heart,
  water: Droplets,
  social: PartyPopper
};

type ViewMode = 'committees' | 'residents';
type SortBy = 'name' | 'unit' | 'moveIn';
type FilterType = 'all' | 'board' | 'committees' | 'pets' | 'children';

export default function DirectoryPage() {
  const session = useSession()?.data;
  
  // Use the new directory hook
  const { committees, residents, isLoading, error, refetch } = useDirectoryData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('committees');
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [selectedResident, setSelectedResident] = useState<User | null>(null);
  const [showPane1, setShowPane1] = useState(true);
  const [showPane2, setShowPane2] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  
  const isAdmin = session?.user?.role === 'ADMIN';

  // Auto-select first committee when data loads
  useEffect(() => {
    if (committees.length > 0 && !selectedCommittee && viewMode === 'committees') {
      setSelectedCommittee(committees[0]);
    }
  }, [committees, selectedCommittee, viewMode]);

  // Handle responsive pane visibility
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setShowPane1(false);
        setShowPane2(false);
      } else if (width < 900) {
        setShowPane1(false);
        setShowPane2(true);
      } else {
        setShowPane1(true);
        setShowPane2(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      toastError('Failed to load directory data');
    }
  }, [error]);

  // Get unique buildings and floors
  const buildings = [...new Set(residents.map(r => r.propertyUnit?.building).filter(Boolean))].sort();
  const floors = [...new Set(residents.map(r => r.propertyUnit?.floor).filter(Boolean))].sort((a, b) => (a || 0) - (b || 0));

  // Filter residents
  let filteredResidents = residents.filter(resident => {
    // Search filter
    const matchesSearch = 
      resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Building/Floor filter
    if (selectedBuilding && resident.propertyUnit?.building !== selectedBuilding) return false;
    if (selectedFloor !== null && resident.propertyUnit?.floor !== selectedFloor) return false;

    // Type filter (SUPER_ADMIN bypasses all restrictions)
    if (filterType === 'board' && !hasBoardAccess(resident.role)) return false;
    if (filterType === 'committees' && resident.committeeMemberships.length === 0) return false;
    if (filterType === 'pets' && resident.pets.length === 0) return false;
    if (filterType === 'children' && resident.children.length === 0) return false;

    return true;
  });

  // Sort residents
  filteredResidents.sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = (a.name || `${a.firstName} ${a.lastName}`).toLowerCase();
      const nameB = (b.name || `${b.firstName} ${b.lastName}`).toLowerCase();
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'unit') {
      const unitA = a.unitNumber || '';
      const unitB = b.unitNumber || '';
      return unitA.localeCompare(unitB);
    }
    if (sortBy === 'moveIn') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const filteredCommittees = committees.filter(committee =>
    committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    committee.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      const parts = user.name.split(' ');
      return parts.length > 1 && parts[0] && parts[1]
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : user.name.slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="h-full bg-webos-background p-6">
        <DirectoryCardSkeleton count={8} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="flex h-full w-full overflow-hidden"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
          {/* Pane 1: Navigation */}
          {showPane1 && (
          <div 
            className="w-60 flex flex-col flex-shrink-0 overflow-y-auto"
            style={{
              background: 'var(--webos-bg-secondary)',
              borderRight: '1px solid var(--webos-border-primary)'
            }}
          >
            <div 
              className="px-3 py-2 text-xs font-light uppercase tracking-wider"
              style={{
                color: 'var(--webos-text-tertiary)',
                background: 'var(--webos-bg-tertiary)',
                borderBottom: '1px solid var(--webos-border-primary)'
              }}
            >
              DIRECTORY
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* View Mode Toggles */}
              <button
                onClick={() => {
                  setViewMode('committees');
                  if (committees.length > 0) setSelectedCommittee(committees[0]);
                  setSelectedResident(null);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 border-b border-webos-divider transition-colors',
                  viewMode === 'committees'
                    ? 'bg-webos-active text-white' 
                    : 'hover:bg-webos-hover'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-5 h-5 border-2 rounded flex items-center justify-center',
                    viewMode === 'committees' ? 'border-white' : 'border-webos-text'
                  )}>
                    <Shield size={11} />
                  </div>
                  <span className="text-base font-normal">Committees</span>
                </div>
                <Badge className={cn(
                  'px-2 py-0.5 text-xs font-bold rounded-full',
                  viewMode === 'committees'
                    ? 'bg-white text-webos-text' 
                    : 'bg-webos-badge text-white'
                )}>
                  {committees.length}
                </Badge>
              </button>

              <button
                onClick={() => {
                  setViewMode('residents');
                  setSelectedCommittee(null);
                  setSelectedResident(null);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 border-b border-webos-divider transition-colors',
                  viewMode === 'residents'
                    ? 'bg-webos-active text-white' 
                    : 'hover:bg-webos-hover'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-5 h-5 border-2 rounded flex items-center justify-center',
                    viewMode === 'residents' ? 'border-white' : 'border-webos-text'
                  )}>
                    <Users size={11} />
                  </div>
                  <span className="text-base font-normal">All Residents</span>
                </div>
                <Badge className={cn(
                  'px-2 py-0.5 text-xs font-bold rounded-full',
                  viewMode === 'residents'
                    ? 'bg-white text-webos-text' 
                    : 'bg-webos-badge text-white'
                )}>
                  {residents.length}
                </Badge>
              </button>

              {/* Resident Filters */}
              {viewMode === 'residents' && (
                <>
                  <div className="webos-list-header mt-3">FILTERS</div>
                  
                  {/* Filter Type */}
                  <button
                    onClick={() => setFilterType('all')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      filterType === 'all' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <span>Show All</span>
                    {filterType === 'all' && <ChevronRight size={14} />}
                  </button>
                  
                  <button
                    onClick={() => setFilterType('board')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      filterType === 'board' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={14} />
                      <span>Board Members</span>
                    </div>
                    {filterType === 'board' && <ChevronRight size={14} />}
                  </button>
                  
                  <button
                    onClick={() => setFilterType('committees')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      filterType === 'committees' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Committee Members</span>
                    </div>
                    {filterType === 'committees' && <ChevronRight size={14} />}
                  </button>
                  
                  <button
                    onClick={() => setFilterType('pets')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      filterType === 'pets' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <PawPrint size={14} />
                      <span>Pet Owners</span>
                    </div>
                    {filterType === 'pets' && <ChevronRight size={14} />}
                  </button>
                  
                  <button
                    onClick={() => setFilterType('children')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      filterType === 'children' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Baby size={14} />
                      <span>Families with Children</span>
                    </div>
                    {filterType === 'children' && <ChevronRight size={14} />}
                  </button>

                  {/* Building Filter */}
                  {buildings.length > 0 && (
                    <>
                      <div className="webos-list-header mt-3">BUILDING</div>
                      <button
                        onClick={() => setSelectedBuilding(null)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                          selectedBuilding === null ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                        )}
                      >
                        <span>All Buildings</span>
                        {selectedBuilding === null && <ChevronRight size={14} />}
                      </button>
                      {buildings.map((building) => (
                        <button
                          key={building}
                          onClick={() => setSelectedBuilding(building as string)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                            selectedBuilding === building ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Building size={14} />
                            <span>{building}</span>
                          </div>
                          {selectedBuilding === building && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Floor Filter */}
                  {floors.length > 0 && (
                    <>
                      <div className="webos-list-header mt-3">FLOOR</div>
                      <button
                        onClick={() => setSelectedFloor(null)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                          selectedFloor === null ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                        )}
                      >
                        <span>All Floors</span>
                        {selectedFloor === null && <ChevronRight size={14} />}
                      </button>
                      {floors.map((floor) => (
                        <button
                          key={floor}
                          onClick={() => setSelectedFloor(floor as number)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                            selectedFloor === floor ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                          )}
                        >
                          <span>Floor {floor}</span>
                          {selectedFloor === floor && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Sort By */}
                  <div className="webos-list-header mt-3">SORT BY</div>
                  <button
                    onClick={() => setSortBy('name')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      sortBy === 'name' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <span>Name</span>
                    {sortBy === 'name' && <ChevronRight size={14} />}
                  </button>
                  <button
                    onClick={() => setSortBy('unit')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      sortBy === 'unit' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <span>Unit Number</span>
                    {sortBy === 'unit' && <ChevronRight size={14} />}
                  </button>
                  <button
                    onClick={() => setSortBy('moveIn')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 border-b border-webos-divider transition-colors text-sm',
                      sortBy === 'moveIn' ? 'bg-webos-active text-white' : 'hover:bg-webos-hover'
                    )}
                  >
                    <span>Move-in Date</span>
                    {sortBy === 'moveIn' && <ChevronRight size={14} />}
                  </button>
                </>
              )}
            </div>
            
            <div className="webos-toolbar">
              {[Menu, Plus, RefreshCw].map((Icon, i) => (
                <button 
                  key={i} 
                  className="webos-toolbar-button"
                  onClick={() => i === 2 && refetch()}
                  title={['Menu', 'Add', 'Refresh'][i]}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pane 2: List */}
        {showPane2 && (
          <div className="flex-1 bg-white flex flex-col border-r border-[var(--semantic-border-light)] min-w-[320px] overflow-hidden">
            <div className="px-4 py-3 bg-[var(--semantic-bg-subtle)] border-b border-[var(--semantic-border-light)]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-webos-text rounded flex items-center justify-center">
                    {viewMode === 'committees' ? <Shield size={11} /> : <Users size={11} />}
                  </div>
                  <span className="text-base font-bold text-webos-text capitalize">
                    {viewMode === 'committees' ? 'Committees' : 'All Residents'}
                  </span>
                </div>
                <Badge className="bg-webos-badge text-white px-2 py-0.5 text-xs font-bold rounded-full">
                  {viewMode === 'committees' ? filteredCommittees.length : filteredResidents.length}
                </Badge>
              </div>
              
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="webos-search-input"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-webos-badge pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {viewMode === 'committees' ? (
                <>
                  {filteredCommittees.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-webos-badge">
                      <div className="text-center">
                        <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-base">No committees found</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <LoomOSListDivider>ACTIVE COMMITTEES</LoomOSListDivider>
                      <VirtualList
                        items={filteredCommittees}
                        renderItem={(committee) => {
                          const IconComponent = committeeIcons[committee.type] || Users;
                          const isSelected = selectedCommittee?.id === committee.id;
                          
                          return (
                            <LoomOSListItem
                              key={committee.id}
                              selected={isSelected}
                              onClick={() => setSelectedCommittee(committee)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  'w-8 h-8 rounded flex items-center justify-center flex-shrink-0',
                                  isSelected ? 'bg-white/20' : 'bg-webos-avatar'
                                )}>
                                  <IconComponent size={16} className={isSelected ? 'text-white' : 'text-webos-text'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-base font-semibold truncate">
                                    {committee.name}
                                  </div>
                                  {committee.description && (
                                    <div className={cn(
                                      'text-sm truncate',
                                      isSelected ? 'text-white/80' : 'text-webos-badge'
                                    )}>
                                      {committee.description}
                                    </div>
                                  )}
                                </div>
                                <Badge className={cn(
                                  'px-2 py-0.5 text-xs font-bold rounded-full flex-shrink-0',
                                  isSelected 
                                    ? 'bg-white text-webos-text' 
                                    : 'bg-webos-badge text-white'
                                )}>
                                  {committee.members.length}
                                </Badge>
                              </div>
                            </LoomOSListItem>
                          );
                        }}
                        estimatedItemHeight={70}
                        className="h-full"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  {filteredResidents.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-webos-badge">
                      <div className="text-center">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-base">
                          {searchTerm ? 'No residents found' : 'No residents'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <LoomOSListDivider count={filteredResidents.length}>RESIDENTS</LoomOSListDivider>
                      <VirtualList
                        items={filteredResidents}
                        renderItem={(resident) => {
                          const isSelected = selectedResident?.id === resident.id;
                          const isBoardMember = hasBoardAccess(resident.role);
                          
                          return (
                            <LoomOSListItem
                              key={resident.id}
                              selected={isSelected}
                              onClick={() => setSelectedResident(resident)}
                              unread={isBoardMember}
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative flex-shrink-0">
                                  <Avatar className="w-10 h-10 bg-webos-avatar">
                                    <AvatarImage src={resident.image || undefined} />
                                    <AvatarFallback className="text-sm text-webos-text bg-webos-avatar">
                                      {getInitials(resident)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {isBoardMember && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-webos-active rounded-full border-2 border-white flex items-center justify-center">
                                      <Shield size={10} className="text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <div className="text-base font-semibold truncate">
                                      {resident.name || `${resident.firstName} ${resident.lastName}`}
                                    </div>
                                  </div>
                                  <div className={cn(
                                    'text-sm flex items-center gap-2 mb-1',
                                    isSelected ? 'text-white/80' : 'text-webos-badge'
                                  )}>
                                    {resident.unitNumber && (
                                      <div className="flex items-center gap-1">
                                        <Home size={12} />
                                        <span>Unit {resident.unitNumber}</span>
                                      </div>
                                    )}
                                    {resident.propertyUnit?.floor && (
                                      <span className="text-xs">• Floor {resident.propertyUnit.floor}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {resident.committeeMemberships.length > 0 && (
                                      <Badge className={cn(
                                        'text-xs px-1.5 py-0',
                                        isSelected ? 'bg-white/20 text-white' : 'bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)]'
                                      )}>
                                        <Users size={10} className="mr-1" />
                                        {resident.committeeMemberships.length} Committee{resident.committeeMemberships.length > 1 ? 's' : ''}
                                      </Badge>
                                    )}
                                    {resident.pets.length > 0 && (
                                      <Badge className={cn(
                                        'text-xs px-1.5 py-0',
                                        isSelected ? 'bg-white/20 text-white' : 'bg-[var(--semantic-success-bg)] text-[var(--semantic-success-dark)]'
                                      )}>
                                        <PawPrint size={10} className="mr-1" />
                                        {resident.pets.length} Pet{resident.pets.length > 1 ? 's' : ''}
                                      </Badge>
                                    )}
                                    {resident.children.length > 0 && (
                                      <Badge className={cn(
                                        'text-xs px-1.5 py-0',
                                        isSelected ? 'bg-white/20 text-white' : 'bg-[var(--semantic-accent-subtle)] text-[var(--semantic-accent-dark)]'
                                      )}>
                                        <Baby size={10} className="mr-1" />
                                        {resident.children.length} {resident.children.length > 1 ? 'Children' : 'Child'}
                                      </Badge>
                                    )}
                                    {resident.additionalResidents.length > 0 && (
                                      <Badge className={cn(
                                        'text-xs px-1.5 py-0',
                                        isSelected ? 'bg-white/20 text-white' : 'bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)]'
                                      )}>
                                        <UserPlus size={10} className="mr-1" />
                                        +{resident.additionalResidents.length}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </LoomOSListItem>
                          );
                        }}
                        estimatedItemHeight={90}
                        className="h-full"
                      />
                    </>
                  )}
                </>
              )}
            </div>

            <div className="webos-toolbar">
              {session?.user && (
                <RequestDirectoryUpdateDialog
                  user={{
                    id: (session?.user as any).id,
                    name: session?.user.name || null,
                    firstName: (session?.user as any).firstName || null,
                    lastName: (session?.user as any).lastName || null,
                    email: session?.user.email || '',
                    unitNumber: (session?.user as any).unitNumber || null,
                    phone: (session?.user as any).phone || null,
                  }}
                />
              )}
              {[Menu, Plus, RefreshCw].map((Icon, i) => (
                <button 
                  key={i} 
                  className="webos-toolbar-button"
                  onClick={() => i === 2 && refetch()}
                  title={['Options', 'Add', 'Refresh'][i]}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pane 3: Detail */}
        <div className="flex-1 bg-white flex flex-col min-w-0">
          {viewMode === 'committees' && selectedCommittee ? (
            <>
              <div className={cn("px-4 py-3 bg-gradient-to-br border-b border-[var(--semantic-border-light)]", APP_COLORS.directory.light)}>
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="w-13 h-13 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const IconComponent = committeeIcons[selectedCommittee.type] || Users;
                      return <IconComponent size={24} className="text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-white mb-1">
                      {selectedCommittee.name}
                    </div>
                    {selectedCommittee.description && (
                      <div className="text-sm text-white/90 font-light">
                        {selectedCommittee.description}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedCommittee.email && (
                  <div className="bg-white border border-webos-divider rounded-lg px-3.5 py-2.5 text-sm">
                    <div className="flex items-center gap-2.5">
                      <Mail size={16} className="text-webos-badge flex-shrink-0" />
                      <a 
                        href={`mailto:${selectedCommittee.email}`}
                        className="text-webos-text hover:text-webos-active transition-colors truncate"
                      >
                        {selectedCommittee.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="webos-section-header mb-4">
                  MEMBERS ({selectedCommittee.members.length})
                </div>

                {selectedCommittee.members.length === 0 ? (
                  <div className="text-center py-12 text-webos-badge">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No members assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedCommittee.members.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white border border-webos-divider rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12 bg-webos-avatar flex-shrink-0">
                            <AvatarImage src={member.user.image || undefined} />
                            <AvatarFallback className="text-webos-text bg-webos-avatar">
                              {getInitials(member.user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base text-webos-text mb-1">
                              {member.user.name || `${member.user.firstName} ${member.user.lastName}`}
                            </h4>
                            {member.position && (
                              <Badge className="bg-webos-badge text-white text-xs mb-2">
                                {member.position}
                              </Badge>
                            )}
                            <div className="space-y-1.5 text-sm text-webos-badge">
                              {member.user.unitNumber && (
                                <div className="flex items-center gap-1.5">
                                  <Home size={14} />
                                  <span>Unit {member.user.unitNumber}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <Mail size={14} />
                                <a 
                                  href={`mailto:${member.user.email}`}
                                  className="hover:text-webos-active transition-colors truncate"
                                >
                                  {member.user.email}
                                </a>
                              </div>
                              {member.user.phone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone size={14} />
                                  <a 
                                    href={`tel:${member.user.phone}`}
                                    className="hover:text-webos-active transition-colors"
                                  >
                                    {member.user.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                            {member.bio && (
                              <p className="text-sm text-webos-text mt-2 leading-relaxed">
                                {member.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="webos-toolbar opacity-40">
                {[Menu, Plus, RefreshCw].map((Icon, i) => (
                  <button 
                    key={i} 
                    className="webos-toolbar-button-light cursor-not-allowed"
                    disabled
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </>
          ) : viewMode === 'residents' && selectedResident ? (
            <>
              <div className={cn("px-4 py-3 bg-gradient-to-br border-b border-[var(--semantic-border-light)]", APP_COLORS.directory.light)}>
                <div className="flex items-start gap-3.5">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-13 h-13 bg-white/20 backdrop-blur-sm border-2 border-white/30">
                      <AvatarImage src={selectedResident.image || undefined} />
                      <AvatarFallback className="text-xl text-white bg-white/20">
                        {getInitials(selectedResident)}
                      </AvatarFallback>
                    </Avatar>
                    {hasBoardAccess(selectedResident.role) && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white/30 flex items-center justify-center">
                        <Shield size={12} className="text-[var(--semantic-primary)]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-white mb-1">
                      {selectedResident.name || `${selectedResident.firstName} ${selectedResident.lastName}`}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/90 font-light">
                      {selectedResident.unitNumber && (
                        <div className="flex items-center gap-1.5">
                          <Home size={14} />
                          <span>Unit {selectedResident.unitNumber}</span>
                        </div>
                      )}
                      {selectedResident.propertyUnit?.floor && (
                        <div className="flex items-center gap-1.5">
                          <Building size={14} />
                          <span>Floor {selectedResident.propertyUnit.floor}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Since {format(new Date(selectedResident.createdAt), 'MMM yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Contact Information */}
                <div className="webos-section-header mb-4">CONTACT INFORMATION</div>
                <div className="space-y-3 mb-6">
                  <div className="bg-white border border-webos-divider rounded-lg p-4">
                    <div className="flex items-center gap-2.5 mb-1">
                      <Mail size={16} className="text-webos-badge" />
                      <span className="text-sm font-semibold text-webos-text">Email</span>
                    </div>
                    <a 
                      href={`mailto:${selectedResident.email}`}
                      className="text-base text-webos-text hover:text-webos-active transition-colors"
                    >
                      {selectedResident.email}
                    </a>
                  </div>

                  {selectedResident.phone && (
                    <div className="bg-white border border-webos-divider rounded-lg p-4">
                      <div className="flex items-center gap-2.5 mb-1">
                        <Phone size={16} className="text-webos-badge" />
                        <span className="text-sm font-semibold text-webos-text">Phone</span>
                      </div>
                      <a 
                        href={`tel:${selectedResident.phone}`}
                        className="text-base text-webos-text hover:text-webos-active transition-colors"
                      >
                        {selectedResident.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                {selectedResident.propertyUnit && (
                  <>
                    <div className="webos-section-header mb-4">PROPERTY DETAILS</div>
                    <div className="bg-white border border-webos-divider rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedResident.propertyUnit.building && (
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-webos-badge mb-1">
                              <Building size={12} />
                              <span>Building</span>
                            </div>
                            <div className="text-base font-semibold text-webos-text">
                              {selectedResident.propertyUnit.building}
                            </div>
                          </div>
                        )}
                        {selectedResident.propertyUnit.bedrooms && (
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-webos-badge mb-1">
                              <Bed size={12} />
                              <span>Bedrooms</span>
                            </div>
                            <div className="text-base font-semibold text-webos-text">
                              {selectedResident.propertyUnit.bedrooms}
                            </div>
                          </div>
                        )}
                        {selectedResident.propertyUnit.bathrooms && (
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-webos-badge mb-1">
                              <Bath size={12} />
                              <span>Bathrooms</span>
                            </div>
                            <div className="text-base font-semibold text-webos-text">
                              {selectedResident.propertyUnit.bathrooms}
                            </div>
                          </div>
                        )}
                        {selectedResident.propertyUnit.squareFootage && (
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-webos-badge mb-1">
                              <Maximize size={12} />
                              <span>Square Feet</span>
                            </div>
                            <div className="text-base font-semibold text-webos-text">
                              {selectedResident.propertyUnit.squareFootage.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Committee Memberships */}
                {selectedResident.committeeMemberships.length > 0 && (
                  <>
                    <div className="webos-section-header mb-4">COMMITTEE MEMBERSHIPS</div>
                    <div className="space-y-2 mb-6">
                      {selectedResident.committeeMemberships.map((membership) => (
                        <div key={membership.id} className="bg-white border border-webos-divider rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const IconComponent = committeeIcons[membership.committee.type] || Users;
                              return <IconComponent size={16} className="text-webos-badge" />;
                            })()}
                            <div className="flex-1">
                              <div className="text-base font-semibold text-webos-text">
                                {membership.committee.name}
                              </div>
                              {membership.position && (
                                <div className="text-sm text-webos-badge">
                                  {membership.position}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Household Members */}
                {selectedResident.additionalResidents.length > 0 && (
                  <>
                    <div className="webos-section-header mb-4">HOUSEHOLD MEMBERS ({selectedResident.additionalResidents.length})</div>
                    <div className="space-y-2 mb-6">
                      {selectedResident.additionalResidents.map((additionalResident) => (
                        <div key={additionalResident.id} className="bg-white border border-webos-divider rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <UserPlus size={16} className="text-webos-badge mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-base font-semibold text-webos-text">
                                  {additionalResident.name}
                                </div>
                                {additionalResident.isEmergencyContact && (
                                  <Badge className="bg-[var(--semantic-error-bg)] text-[var(--semantic-error-dark)] text-xs px-1.5 py-0">
                                    <AlertCircle size={10} className="mr-1" />
                                    Emergency
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-webos-badge capitalize">
                                {additionalResident.relationship}
                              </div>
                              {isAdmin && (
                                <div className="mt-2 space-y-1 text-sm">
                                  {additionalResident.email && (
                                    <a 
                                      href={`mailto:${additionalResident.email}`}
                                      className="flex items-center gap-1.5 text-webos-text hover:text-webos-active"
                                    >
                                      <Mail size={12} />
                                      <span className="truncate">{additionalResident.email}</span>
                                    </a>
                                  )}
                                  {additionalResident.phone && (
                                    <a 
                                      href={`tel:${additionalResident.phone}`}
                                      className="flex items-center gap-1.5 text-webos-text hover:text-webos-active"
                                    >
                                      <Phone size={12} />
                                      <span>{additionalResident.phone}</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Pets */}
                {selectedResident.pets.length > 0 && (
                  <>
                    <div className="webos-section-header mb-4">PETS ({selectedResident.pets.length})</div>
                    <div className="space-y-2 mb-6">
                      {selectedResident.pets.map((pet) => (
                        <div key={pet.id} className="bg-white border border-webos-divider rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <PawPrint size={16} className="text-webos-badge mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-base font-semibold text-webos-text">
                                {pet.name}
                              </div>
                              <div className="text-sm text-webos-badge capitalize">
                                {pet.breed ? `${pet.breed} ${pet.type}` : pet.type}
                                {pet.color && ` • ${pet.color}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Children */}
                {selectedResident.children.length > 0 && (
                  <>
                    <div className="webos-section-header mb-4">CHILDREN ({selectedResident.children.length})</div>
                    <div className="space-y-2 mb-6">
                      {selectedResident.children.map((child) => (
                        <div key={child.id} className="bg-white border border-webos-divider rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Baby size={16} className="text-webos-badge mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-base font-semibold text-webos-text">
                                {child.name}
                              </div>
                              <div className="text-sm text-webos-badge">
                                {child.age && `Age ${child.age}`}
                                {child.grade && ` • Grade ${child.grade}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="webos-toolbar opacity-40">
                {[Menu, Mail, Phone].map((Icon, i) => (
                  <button 
                    key={i} 
                    className="webos-toolbar-button-light cursor-not-allowed"
                    disabled
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 flex flex-col items-center justify-center text-webos-list-divider">
                <div className="w-35 h-35 mb-5 relative">
                  <div className="absolute inset-0 border-3 border-webos-list-divider"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {viewMode === 'committees' ? (
                      <Shield size={80} className="text-webos-list-divider" />
                    ) : (
                      <Users size={80} className="text-webos-list-divider" />
                    )}
                  </div>
                </div>
                <p className="text-lg font-light">
                  {viewMode === 'committees' 
                    ? 'Select a committee to view details' 
                    : 'Select a resident to view details'}
                </p>
              </div>
              
              <div className="webos-toolbar opacity-40">
                {[Menu, Mail, Phone].map((Icon, i) => (
                  <button 
                    key={i} 
                    className="webos-toolbar-button-light cursor-not-allowed"
                    disabled
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
