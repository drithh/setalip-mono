'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '#dep/lib/utils';
import { Button } from '#dep/components/ui/button';
import { Calendar, CalendarProps } from '#dep/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#dep/components/ui/popover';

type DatePickerProps = CalendarProps & {
  onDateChange?: (value: Date) => void;
  defaultDate?: Date;
};

export function DatePicker({
  defaultDate,
  onDateChange,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(defaultDate ?? new Date());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...props}
          mode="single"
          selected={date}
          onSelect={(date) => {
            // add 1 day
            if (date) {
              setDate(date);
              if (onDateChange) {
                onDateChange(date);
              }
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
