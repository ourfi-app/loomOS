
'use client';

/**
 * WebOS Date Picker Component
 * Based on WebOS design patterns for date selection
 * Features a custom visual calendar matching WebOS style
 */

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type WebOSDatePickerProps = {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function WebOSDatePicker({
  date,
  onDateChange,
  disabled,
  placeholder = 'No due date',
}: WebOSDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setIsOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          className={cn(
            'z-50 w-auto rounded-lg bg-card shadow-2xl border border-border',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          {/* Custom WebOS Calendar */}
          <div className="p-3">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleSelect}
              showOutsideDays={true}
              className="p-0"
              classNames={{
                months: 'flex flex-col',
                month: 'space-y-3',
                caption: 'flex justify-between items-center px-2 py-2 relative',
                caption_label: 'text-base font-medium',
                nav: 'flex items-center gap-1',
                nav_button: cn(
                  'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100',
                  'inline-flex items-center justify-center rounded-md',
                  'hover:bg-muted transition-colors'
                ),
                nav_button_previous: 'absolute left-0',
                nav_button_next: 'absolute right-0',
                table: 'w-full border-collapse',
                head_row: 'flex w-full',
                head_cell: 'text-muted-foreground w-10 font-medium text-sm uppercase',
                row: 'flex w-full mt-1',
                cell: cn(
                  'relative p-0 text-center focus-within:relative focus-within:z-20',
                  'w-10 h-10'
                ),
                day: cn(
                  'h-10 w-10 p-0 font-normal rounded-md',
                  'hover:bg-muted hover:text-foreground transition-colors',
                  'focus:bg-muted focus:text-foreground focus:outline-none'
                ),
                day_selected: cn(
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary hover:text-primary-foreground',
                  'focus:bg-primary focus:text-primary-foreground'
                ),
                day_today: 'bg-accent text-accent-foreground font-semibold',
                day_outside: 'text-muted-foreground/40 opacity-50',
                day_disabled: 'text-muted-foreground/30 opacity-30',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-5 w-5" />,
                IconRight: () => <ChevronRight className="h-5 w-5" />,
              }}
            />
          </div>

          {/* Date Display and Actions */}
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {date ? `Date selected: ${format(date, 'MMMM d, yyyy')}` : 'No date selected'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border px-3 py-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                onDateChange?.(undefined);
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary/90 hover:bg-primary"
              onClick={() => setIsOpen(false)}
              disabled={!date}
            >
              OK
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
