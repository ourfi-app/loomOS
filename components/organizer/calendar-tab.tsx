'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Video
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  LoomOSNavigationPane,
  LoomOSListPane,
  LoomOSDetailPane,
  LoomOSActionButton,
  LoomOSEmptyState,
  LoomOSLoadingState,
} from '@/components/webos';
import { useCalendarEvents, type CalendarEvent } from '@/hooks/use-api';
import { format, parseISO, isSameDay } from 'date-fns';

// webOS-inspired event color schemes
const EVENT_COLORS = {
  work: {
    bg: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-600',
    light: 'bg-blue-100',
    gradient: 'from-blue-400 to-blue-600'
  },
  personal: {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
    light: 'bg-red-100',
    gradient: 'from-red-400 to-red-600'
  },
  meeting: {
    bg: 'bg-yellow-500',
    text: 'text-gray-900',
    border: 'border-yellow-600',
    light: 'bg-yellow-100',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  deadline: {
    bg: 'bg-purple-500',
    text: 'text-white',
    border: 'border-purple-600',
    light: 'bg-purple-100',
    gradient: 'from-purple-400 to-purple-600'
  },
  social: {
    bg: 'bg-green-500',
    text: 'text-white',
    border: 'border-green-600',
    light: 'bg-green-100',
    gradient: 'from-green-400 to-green-600'
  }
};

export default function CalendarTab() {
  const { data: events, isLoading, refresh } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get events for selected date
  const selectedDateEvents = (events || []).filter(event => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Calendar month view helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasEventsOnDate = (date: Date | null) => {
    if (!date || !events) return false;
    return events.some(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date: Date | null) => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="h-full flex">
      {/* Calendar View */}
      <div className="w-96 flex-shrink-0 border-r border-border flex flex-col">
        {/* Month Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  disabled={!date}
                  className={cn(
                    "aspect-square p-2 rounded-lg text-sm relative",
                    "hover:bg-muted transition-colors",
                    !date && "invisible",
                    isToday(date) && "bg-primary/10 font-semibold",
                    isSelectedDate(date) && "bg-primary text-primary-foreground",
                    hasEventsOnDate(date) && "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-current"
                  )}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Events List */}
      <div className="w-80 flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <LoomOSLoadingState message="Loading events..." />
          ) : selectedDateEvents.length === 0 ? (
            <LoomOSEmptyState
              icon={<CalendarIcon className="w-12 h-12" />}
              title="No events"
              description="No events scheduled for this day"
            />
          ) : (
            <div className="p-4 space-y-3">
              {selectedDateEvents.map((event, index) => {
                // Map event category to color scheme
                const categoryLower = (event.category || 'work').toLowerCase();
                const colorScheme = EVENT_COLORS[categoryLower as keyof typeof EVENT_COLORS] || EVENT_COLORS.work;
                
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200",
                      "hover:scale-[1.02] hover:shadow-lg",
                      selectedEvent?.id === event.id && "ring-2 ring-white shadow-xl scale-[1.02]"
                    )}
                    style={{
                      animation: `slide-up 0.3s ease-out ${index * 0.05}s backwards`
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Colorful Background Gradient - webOS Style */}
                    <div className={cn(
                      "bg-gradient-to-br p-4",
                      colorScheme.bg === 'bg-yellow-500' 
                        ? 'from-yellow-400 to-orange-500'
                        : colorScheme.bg === 'bg-blue-500'
                        ? 'from-blue-400 to-cyan-600'
                        : colorScheme.bg === 'bg-red-500'
                        ? 'from-red-400 to-rose-600'
                        : colorScheme.bg === 'bg-purple-500'
                        ? 'from-purple-400 to-violet-600'
                        : 'from-green-400 to-emerald-600'
                    )}>
                      {/* Event Title */}
                      <h4 className={cn(
                        "font-medium text-base mb-2 leading-snug",
                        colorScheme.text
                      )}>
                        {event.title}
                      </h4>
                      
                      {/* Event Time */}
                      <div className={cn(
                        "flex items-center gap-1.5 text-sm mb-1",
                        colorScheme.text,
                        "opacity-90"
                      )}>
                        <span className="italic">
                          {event.startTime || 'All day'}
                          {event.endTime && ` - ${event.endTime}`}
                        </span>
                      </div>

                      {/* Event Location */}
                      {event.location && (
                        <div className={cn(
                          "flex items-center gap-1.5 text-xs mt-1",
                          colorScheme.text,
                          "opacity-80 italic"
                        )}>
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Event Details */}
      <LoomOSDetailPane
        title={selectedEvent?.title}
        subtitle={selectedEvent?.location}
        isEmpty={!selectedEvent}
        emptyIcon={<CalendarIcon className="w-16 h-16" />}
        emptyMessage="No event selected"
        emptySubMessage="Select an event from the list to view details"
      >
        {selectedEvent && (
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm">{selectedEvent.description || 'No description'}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Time
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedEvent.startTime}
                      {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEvent.location && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Location
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Category
                </h3>
                <Badge>{selectedEvent.category}</Badge>
              </div>
            </div>
          </ScrollArea>
        )}
      </LoomOSDetailPane>
    </div>
  );
}
