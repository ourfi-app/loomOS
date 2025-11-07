
'use client';

import { useState, useEffect } from 'react';
import {
  LoomOSNavigationPane,
  LoomOSListPane,
  LoomOSDetailPane,
  LoomOSActionButton,
  LoomOSEmptyState,
  LoomOSLoadingState,
  DesktopAppWrapper
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';
import { useDeepLink } from '@/hooks/use-deep-link';

import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Bell,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Video,
  Copy,
  Share2,
  Command,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  useKeyboardShortcut, 
  useContextMenu,
  HOVER_EFFECTS,
  FOCUS_RING,
  type KeyboardShortcut,
  type ContextMenuItem
} from '@/lib/desktop-interactions';
import { ContextMenuPortal, KeyboardShortcutsDialog, ErrorBoundary } from '@/components/common';
import { ListItemSkeleton } from '@/components/common/skeleton-screens';
import { toastSuccess, toastError, toastInfo, toastCRUD } from '@/lib/toast-helpers';
import { cn } from '@/lib/utils';
import { useCalendarEvents, useCalendarMutations, type CalendarEvent as APICalendarEvent } from '@/hooks/use-api';
import { useDeepLinkSelection } from '@/hooks/use-deep-link';

// Calendar display type (for UI)
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  category: string;
  color: string;
  reminders?: any[];
  attendees?: any[];
  isRecurring?: boolean;
  recurrence?: string;
}

interface CalendarSource {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  type: 'personal' | 'work' | 'hoa' | 'all';
}

// Calendar sources for filtering
const calendarSources: CalendarSource[] = [
  { id: 'all', name: 'All Events', color: '#6B7280', visible: true, type: 'all' },
  { id: 'personal', name: 'Personal', color: '#5BB9EA', visible: true, type: 'personal' },
  { id: 'hoa', name: 'HOA Events', color: '#F18825', visible: true, type: 'hoa' },
  { id: 'work', name: 'Work', color: '#9C27B0', visible: true, type: 'work' },
];

// Convert API event to UI event format
function convertApiEventToUI(apiEvent: APICalendarEvent): CalendarEvent {
  const startDate = new Date(apiEvent.startDate);
  const endDate = new Date(apiEvent.endDate);
  
  if (apiEvent.startTime) {
    const [startHour, startMin] = apiEvent.startTime.split(':').map(Number);
    startDate.setHours(startHour || 0, startMin || 0);
  }
  
  if (apiEvent.endTime) {
    const [endHour, endMin] = apiEvent.endTime.split(':').map(Number);
    endDate.setHours(endHour || 0, endMin || 0);
  }
  
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description || '',
    startTime: startDate,
    endTime: endDate,
    location: apiEvent.location || undefined,
    category: apiEvent.category,
    color: apiEvent.color,
    reminders: apiEvent.reminders,
    attendees: apiEvent.attendees,
    isRecurring: apiEvent.isRecurring,
    recurrence: apiEvent.recurrence,
  };
}

export default function CalendarApp() {
  // Use new API hooks
  const { data: apiEvents, isLoading, error, refresh } = useCalendarEvents();
  const { createEvent, updateEvent, deleteEvent } = useCalendarMutations();
  
  // Convert API events to UI format
  const events: CalendarEvent[] = (apiEvents || []).map(convertApiEventToUI);
  
  const [calendars, setCalendars] = useState<CalendarSource[]>(calendarSources);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'agenda'>('day');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const loading = isLoading;
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  // Responsive pane visibility
  const [showPane1, setShowPane1] = useState(true);
  const [showPane2, setShowPane2] = useState(true);

  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  // Deep Link Support: Auto-select event when navigating from notifications
  useDeepLinkSelection({
    items: events,
    onSelect: (event) => setSelectedEvent(event),
    enabled: events.length > 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setShowPane1(false);
        setShowPane2(!selectedEvent);
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
  }, [selectedEvent]);

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      description: 'Create new event',
      action: () => {
        setEditingEvent(null);
        setEventDialogOpen(true);
      },
      category: 'Actions',
    },
    {
      key: 't',
      description: 'Go to today',
      action: () => {
        const today = new Date();
        setSelectedDate(today);
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      },
      category: 'Navigation',
    },
    {
      key: 'ArrowLeft',
      description: 'Previous day',
      action: () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
      },
      category: 'Navigation',
    },
    {
      key: 'ArrowRight',
      description: 'Next day',
      action: () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
      },
      category: 'Navigation',
    },
    {
      key: 'ArrowUp',
      description: 'Previous event',
      action: () => {
        if (selectedDateEvents.length > 0) {
          const newIndex = Math.max(0, selectedEventIndex - 1);
          setSelectedEventIndex(newIndex);
          setSelectedEvent(selectedDateEvents[newIndex] || null);
        }
      },
      category: 'Navigation',
    },
    {
      key: 'ArrowDown',
      description: 'Next event',
      action: () => {
        if (selectedDateEvents.length > 0) {
          const newIndex = Math.min(selectedDateEvents.length - 1, selectedEventIndex + 1);
          setSelectedEventIndex(newIndex);
          setSelectedEvent(selectedDateEvents[newIndex] || null);
        }
      },
      category: 'Navigation',
    },
    {
      key: 'Enter',
      description: 'Edit selected event',
      action: () => {
        if (selectedEvent) {
          setEditingEvent(selectedEvent);
          setEventDialogOpen(true);
        }
      },
      category: 'Actions',
    },
    {
      key: 'Delete',
      description: 'Delete selected event',
      action: async () => {
        if (selectedEvent) {
          if (confirm(`Delete "${selectedEvent.title}"?`)) {
            try {
              await deleteEvent(selectedEvent.id);
              setSelectedEvent(null);
              toastCRUD.deleted('Event');
              refresh();
            } catch (error: any) {
              toastError(error.message || 'Failed to delete event');
            }
          }
        }
      },
      category: 'Actions',
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowShortcutsDialog(true),
      category: 'Help',
    },
  ];

  useKeyboardShortcut(shortcuts);

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const calendar = calendars.find(c => c.id === event.category || c.id === 'all');
      if (calendar && calendar.id !== 'all' && !calendar.visible) return false;

      const eventDate = event.startTime;
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get calendar color
  const getCalendarColor = (category: string) => {
    return calendars.find(c => c.id === category)?.color || '#5BB9EA';
  };

  // Get calendar name
  const getCalendarName = (category: string) => {
    return calendars.find(c => c.id === category)?.name || 'Unknown';
  };

  // Toggle calendar visibility
  const toggleCalendar = (category: string) => {
    setCalendars(calendars.map(cal => 
      cal.id === category ? { ...cal, visible: !cal.visible } : cal
    ));
  };

  // Mini calendar render
  const renderMiniCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`blank-${i}`} className="p-1.5"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const hasEvents = getEventsForDate(date).length > 0;
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-1.5 text-center text-sm rounded-full transition-colors relative ${
            isSelected
              ? 'bg-[#F18825] text-white font-bold'
              : 'text-gray-800 hover:bg-gray-200'
          }`}
        >
          {day}
          {hasEvents && !isSelected && (
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F18825] rounded-full" />
          )}
        </button>
      );
    }
    
    return days;
  };

  // Navigation items (calendars)
  const navigationItems = calendars.map(calendar => ({
    id: calendar.id,
    label: calendar.name,
    icon: (
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: calendar.color }}
      />
    ),
    active: calendar.visible,
    onClick: () => toggleCalendar(calendar.id)
  }));

  // Context menu for events
  const getEventContextMenu = (event: CalendarEvent): ContextMenuItem[] => [
    {
      label: 'Edit Event',
      icon: <Edit size={16} />,
      onClick: () => {
        setEditingEvent(event);
        setEventDialogOpen(true);
      },
      shortcut: 'Enter',
    },
    {
      label: 'Duplicate Event',
      icon: <Copy size={16} />,
      onClick: async () => {
        try {
          const startDate = event.startTime.toISOString().split('T')[0] || '';
          const endDate = event.endTime.toISOString().split('T')[0] || '';
          const startTime = `${event.startTime.getHours().toString().padStart(2, '0')}:${event.startTime.getMinutes().toString().padStart(2, '0')}`;
          const endTime = `${event.endTime.getHours().toString().padStart(2, '0')}:${event.endTime.getMinutes().toString().padStart(2, '0')}`;
          
          await createEvent({
            title: `${event.title} (Copy)`,
            description: event.description,
            location: event.location,
            startDate,
            endDate,
            startTime,
            endTime,
            category: event.category,
            color: event.color,
          });
          
          toastSuccess('Event duplicated successfully');
          refresh();
        } catch (error: any) {
          toastError(error.message || 'Failed to duplicate event');
        }
      },
    },
    {
      label: 'Share Event',
      icon: <Share2 size={16} />,
      onClick: () => {
        toastInfo('Sharing functionality coming soon');
      },
    },
    { separator: true, label: '', onClick: () => {} },
    {
      label: 'Delete Event',
      icon: <Trash2 size={16} />,
      onClick: async () => {
        if (confirm(`Delete "${event.title}"?`)) {
          try {
            await deleteEvent(event.id);
            if (selectedEvent?.id === event.id) {
              setSelectedEvent(null);
            }
            toastCRUD.deleted('Event');
            refresh();
          } catch (error: any) {
            toastError(error.message || 'Failed to delete event');
          }
        }
      },
      danger: true,
      shortcut: 'Del',
    },
  ];

  // List items (events for selected date)
  const listItems = selectedDateEvents.map((event, index) => ({
    id: event.id,
    title: event.title,
    subtitle: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
    timestamp: event.location || '',
    selected: selectedEvent?.id === event.id,
    badge: (
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: getCalendarColor(event.category) }}
      />
    ),
    onClick: () => {
      setSelectedEvent(event);
      setSelectedEventIndex(index);
    },
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      setSelectedEvent(event);
      setSelectedEventIndex(index);
      showContextMenu(e, getEventContextMenu(event));
    }
  }));

  // Header actions
  const headerActions = (
    <>
      <LoomOSActionButton
        icon={<Command size={16} />}
        variant="default"
        onClick={() => setShowShortcutsDialog(true)}
      >
        Shortcuts
      </LoomOSActionButton>
      <LoomOSActionButton
        icon={<Plus size={16} />}
        variant="primary"
        onClick={() => {
          setEditingEvent(null);
          setEventDialogOpen(true);
        }}
      >
        New Event
      </LoomOSActionButton>
    </>
  );

  // Detail pane actions
  const detailActions = selectedEvent && (
    <>
      <LoomOSActionButton
        size="sm"
        icon={<Edit size={14} />}
        onClick={() => {
          setEditingEvent(selectedEvent);
          setEventDialogOpen(true);
        }}
      >
        Edit
      </LoomOSActionButton>
      <LoomOSActionButton
        size="sm"
        variant="danger"
        icon={<Trash2 size={14} />}
        onClick={async () => {
          if (confirm(`Delete "${selectedEvent.title}"?`)) {
            try {
              await deleteEvent(selectedEvent.id);
              setSelectedEvent(null);
              toastCRUD.deleted('Event');
              refresh();
            } catch (error: any) {
              toastError(error.message || 'Failed to delete event');
            }
          }
        }}
      >
        Delete
      </LoomOSActionButton>
    </>
  );

  // Pane 1 content (mini calendar + calendars list)
  const pane1Content = (
    <div className="flex flex-col h-full">
      {/* Month navigation */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-sm font-bold text-gray-700">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Mini calendar */}
        <div className="grid grid-cols-7 gap-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-[10px] font-bold text-gray-400 text-center p-1">
              {day}
            </div>
          ))}
          {renderMiniCalendar()}
        </div>
      </div>

      {/* Calendars list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            My Calendars
          </h4>
        </div>
        <LoomOSNavigationPane
          title="My Calendars"
          items={navigationItems}
          className="border-0"
        />
      </div>
    </div>
  );

  // Menu items for the app window
  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Event', icon: <Plus size={14} />, onClick: () => { setEditingEvent(null); setEventDialogOpen(true); } },
        { label: 'Refresh', icon: <RefreshCw size={14} />, onClick: () => refresh() },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Edit Event', icon: <Edit size={14} />, onClick: () => { if (selectedEvent) { setEditingEvent(selectedEvent); setEventDialogOpen(true); } }, disabled: !selectedEvent },
        { label: 'Delete Event', icon: <Trash2 size={14} />, onClick: async () => { if (selectedEvent && confirm(`Delete "${selectedEvent.title}"?`)) { try { await deleteEvent(selectedEvent.id); setSelectedEvent(null); toastCRUD.deleted('Event'); refresh(); } catch (error: any) { toastError(error.message || 'Failed to delete event'); } } }, disabled: !selectedEvent },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Day View', onClick: () => setViewMode('day') },
        { label: 'Week View', onClick: () => setViewMode('week') },
        { label: 'Month View', onClick: () => setViewMode('month') },
        { label: 'Agenda View', onClick: () => setViewMode('agenda') },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <DesktopAppWrapper
        title="Calendar"
        icon={<CalendarIcon className="w-5 h-5" />}
        gradient={APP_COLORS.calendar.light}
      >
        {/* Calendar Content */}
        <div className="h-full flex overflow-hidden bg-white">
      {/* Pane 1: Mini Calendar + Calendars */}
      {showPane1 && (
        <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-hidden">
          {pane1Content}
        </div>
      )}

      {/* Pane 2: Events List */}
      {showPane2 && (
        <LoomOSListPane
          title={formatDate(selectedDate)}
          items={listItems}
          loading={loading}
          emptyMessage="No events scheduled"
        />
      )}

      {/* Pane 3: Event Detail */}
      <LoomOSDetailPane
        title={selectedEvent?.title}
        subtitle={selectedEvent ? `${formatTime(selectedEvent.startTime)} - ${formatTime(selectedEvent.endTime)}` : undefined}
        actions={detailActions}
        isEmpty={!selectedEvent}
        emptyIcon={<CalendarIcon size={64} />}
        emptyMessage="No event selected"
        emptySubMessage="Select an event from the list to view details"
      >
        {selectedEvent && (
          <div className="p-6 space-y-6">
            {/* Event badge */}
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                style={{ backgroundColor: getCalendarColor(selectedEvent.category) }}
              >
                <CalendarIcon size={24} className="text-white" />
              </div>
              <div>
                <Badge 
                  className="mb-1"
                  style={{ 
                    backgroundColor: getCalendarColor(selectedEvent.category),
                    color: 'white'
                  }}
                >
                  {getCalendarName(selectedEvent.category)}
                </Badge>
                <p className="text-sm text-gray-500">
                  {formatDate(selectedEvent.startTime)}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Details grid */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <p className="text-sm text-gray-600">
                    {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.reminders && selectedEvent.reminders.length > 0 && (
                <div className="flex items-start gap-3">
                  <Bell size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reminders</p>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.reminders.length} reminder(s) set
                    </p>
                  </div>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Attendees</p>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, i) => (
                        <p key={i} className="text-sm text-gray-600">{attendee}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </LoomOSDetailPane>

      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Board Meeting, Resident Social..."
                defaultValue={editingEvent?.title}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add event details..."
                rows={3}
                defaultValue={editingEvent?.description}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  defaultValue={editingEvent?.startTime.toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  defaultValue={editingEvent?.endTime.toISOString().slice(0, 16)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Community Room, Rooftop..."
                defaultValue={editingEvent?.location}
              />
            </div>
            <div>
              <Label htmlFor="calendar">Calendar</Label>
              <Select defaultValue={editingEvent?.category || 'personal'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.map(cal => (
                    <SelectItem key={cal.id} value={cal.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cal.color }}
                        />
                        {cal.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEventDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (editingEvent) {
                    toastCRUD.updated('Event');
                  } else {
                    toastCRUD.created('Event');
                  }
                  setEventDialogOpen(false);
                }}
              >
                {editingEvent ? 'Save Changes' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={showShortcutsDialog}
        onOpenChange={setShowShortcutsDialog}
        shortcuts={shortcuts}
        appName="Calendar"
      />

      {/* Context Menu Portal */}
      <ContextMenuPortal
        contextMenu={contextMenu}
        onClose={hideContextMenu}
      />
        </div>
      </DesktopAppWrapper>
    </ErrorBoundary>
  );
}
