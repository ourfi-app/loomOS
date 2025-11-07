
'use client';

import { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  // Generate calendar grid
  const calendarDays = [];
  
  // Empty cells before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => setHoveredDate(day)}
        onMouseLeave={() => setHoveredDate(null)}
        className={cn(
          "aspect-square flex items-center justify-center text-xs rounded-lg transition-all duration-200",
          "hover:bg-primary/10 hover:text-primary",
          isToday(day) && "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground",
          isSelected(day) && !isToday(day) && "bg-primary/20 text-primary font-medium",
          hoveredDate === day && !isToday(day) && "scale-110"
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all">
      <div className="space-y-3">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <MdChevronLeft className="w-5 h-5 text-foreground/60" />
          </button>
          
          <div className="text-sm font-semibold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label="Next month"
          >
            <MdChevronRight className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="aspect-square flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>

        {/* Today's Date */}
        <div className="text-xs text-center text-muted-foreground border-t border-border/30 pt-2">
          Today: {new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </Card>
  );
}
