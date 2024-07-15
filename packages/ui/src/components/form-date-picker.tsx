'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '#dep/lib/utils';
import { Button } from '#dep/components/ui/button';
import { Calendar } from '#dep/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#dep/components/ui/popover';
import { FormControl } from '#dep/components/ui/form';

interface DatePickerProps {
  value?: Date;
  onChange?: (value: Date) => void;
}

export function FormDatePicker(props: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !props.value && 'text-muted-foreground'
            )}
          >
            {props.value ? (
              format(props.value, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          captionLayout="dropdown"
          fromYear={1970}
          toYear={2025}
          mode="single"
          selected={props.value}
          onSelect={(date) => props.onChange && date && props.onChange(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
