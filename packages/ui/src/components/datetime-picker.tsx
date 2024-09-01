import { cn } from '#dep/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/ui/components/ui/popover';
import { format } from 'date-fns';
import { Calendar, CalendarProps } from '#dep/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { FormControl } from '#dep/components/ui/form';
import React from 'react';
import { TimePickerInput } from '#dep/components/time-picker-input';
import { Button } from '#dep/components/ui/button';

type DatetimePickerProps = CalendarProps & {
  value: Date;
  onChange: (value: Date) => void;
};

export function DatetimePicker({
  value,
  onChange,
  ...props
}: DatetimePickerProps) {
  return (
    <Popover>
      <FormControl>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP HH:mm:ss') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
      </FormControl>
      <PopoverContent className="w-auto p-0 bg-background">
        <Calendar
          {...props}
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={onChange} date={value} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="flex gap-2">
      <div className="grid gap-1 text-center">
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={(date) => date && setDate(date)}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={(date) => date && setDate(date)}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
    </div>
  );
}
