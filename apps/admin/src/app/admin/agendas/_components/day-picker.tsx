'use client';
import { cn } from '@repo/ui/lib/utils';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface DayPickerProps {
  date: Date;
  setDate: (date: Date) => void;
  // onDateChange: (value: Date) => void;
}

export default function DayPicker({
  date: selectedDate,
  setDate: setSelectedDate,
  // onDateChangex
}: DayPickerProps) {
  const numberOfDays = 7;
  const [currentDayIndex, setCurrentDayIndex] = useState(
    selectedDate.getDay() % numberOfDays,
  );

  const handleArrowClick = (direction: string) => {
    const currentDate = startOfDay(new Date());
    let newDate = selectedDate;

    if (direction === 'left') {
      newDate = addDays(selectedDate, -1);
    } else if (direction === 'right') {
      newDate = addDays(selectedDate, 1);
    }

    setSelectedDate(newDate);
    setCurrentDayIndex(newDate.getDay() % numberOfDays);
  };

  const handleDateClick = (index: number) => {
    if (index === currentDayIndex) return;

    const currentDate = startOfDay(new Date());
    const daysToAdd = index - currentDayIndex;
    const newDate = addDays(selectedDate, daysToAdd);

    setSelectedDate(newDate);
    setCurrentDayIndex(index);
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-4 pt-2 sm:mb-8 sm:flex-row">
      <button
        className="hidden h-16 rounded-full sm:inline"
        onClick={() => handleArrowClick('left')}
      >
        <ChevronLeft className="h-16 w-16 text-secondary" />
      </button>
      <div className="flex w-full grid-cols-3 flex-wrap place-content-center gap-2">
        {Array.from(
          { length: numberOfDays },
          (_, index) => index - currentDayIndex,
        ).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-[4.6rem] w-[4.6rem] cursor-pointer rounded-md p-2  sm:h-24 sm:w-24 sm:rounded-lg',
              index === currentDayIndex
                ? 'bg-secondary text-white md:animate-scale-in'
                : 'bg-primary md:animate-scale-out',
            )}
            onClick={() => handleDateClick(index)} // Use handleDateClick instead of inline function
          >
            <div className="flex h-full flex-col items-center justify-center text-center text-base sm:text-lg">
              <p className="font-semibold">
                {format(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate() + index - currentDayIndex,
                  ),
                  'EEE',
                )}
              </p>
              <p>
                {format(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate() + index - currentDayIndex,
                  ),
                  'MMM d',
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          className="inline rounded-full sm:hidden"
          onClick={() => handleArrowClick('left')}
        >
          <ChevronLeft className="h-12 w-12 text-secondary sm:h-16 sm:w-16" />
        </button>
        <button
          className="inline rounded-full"
          onClick={() => handleArrowClick('right')}
        >
          <ChevronRight className="h-12 w-12 text-secondary sm:h-16 sm:w-16" />
        </button>
      </div>
    </div>
  );
}
