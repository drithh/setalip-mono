'use client';

import * as React from 'react';
import { format, setDate } from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { cn } from '#dep/lib/utils';
import { Button } from '#dep/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#dep/components/ui/popover';

interface MonthPickerProps {
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function MonthPicker({
  onDateChange,
  defaultDate,
}: MonthPickerProps = {}) {
  const [date, setDate] = React.useState<Date>(defaultDate || new Date());
  const [isOpen, setIsOpen] = React.useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleMonthChange = (month: number) => {
    const newDate = new Date(date.getFullYear(), month, 1);
    setDate(newDate);
    setIsOpen(false);
    onDateChange?.(newDate);
  };

  const handleYearChange = (increment: number) => {
    const newDate = new Date(
      date.getFullYear() + increment,
      date.getMonth(),
      1
    );
    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'MMMM d, yyyy') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={() => handleYearChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold">{date.getFullYear()}</div>
            <Button
              variant="outline"
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={() => handleYearChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3">
            {months.map((month, index) => (
              <Button
                key={month}
                onClick={() => handleMonthChange(index)}
                variant={date.getMonth() === index ? 'default' : 'outline'}
                className="h-9"
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
