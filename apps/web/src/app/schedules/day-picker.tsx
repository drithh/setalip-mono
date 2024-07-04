'use client';
import { cn } from '@repo/ui/lib/utils';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { startOfDay, addDays, isBefore } from 'date-fns';

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
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [currentDayIndex, setCurrentDayIndex] = useState(
    selectedDate.getDay() % numberOfDays,
  );

  useEffect(() => {
    function handleResize() {
      setNumberOfDays(calculateNumberOfDays());
    }
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function calculateNumberOfDays() {
    if (window.innerWidth > 880) {
      return 7;
    } else if (window.innerWidth > 520) {
      return 5;
    } else {
      return 3;
    }
  }

  const handleArrowClick = (direction: string) => {
    const currentDate = startOfDay(new Date());
    let newDate = selectedDate;

    if (direction === 'left') {
      newDate = addDays(selectedDate, -1);
    } else if (direction === 'right') {
      newDate = addDays(selectedDate, 1);
    }

    console.log(newDate, currentDate, selectedDate);

    if (isBefore(newDate, currentDate)) {
      toast.error('Cannot go back to past dates');
      return;
    }

    setSelectedDate(newDate);
    setCurrentDayIndex(newDate.getDay() % numberOfDays);
  };

  const handleDateClick = (index: number) => {
    if (index === currentDayIndex) return;

    const currentDate = startOfDay(new Date());
    const daysToAdd = index - currentDayIndex;
    const newDate = addDays(selectedDate, daysToAdd);

    if (isBefore(newDate, currentDate)) {
      toast.error('Cannot go back to past dates');
      return;
    }

    setSelectedDate(newDate);
    setCurrentDayIndex(index);
  };

  return (
    <div className="mx-auto mb-8 flex w-full max-w-screen-lg flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
      <button
        className="hidden h-16 rounded-full sm:inline"
        onClick={() => handleArrowClick('left')}
      >
        <ChevronLeft className="h-16 w-16 text-secondary" />
      </button>
      <div className="flex w-full place-content-between gap-2">
        {Array.from(
          { length: numberOfDays },
          (_, index) => index - currentDayIndex,
        ).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-24 w-24 cursor-pointer rounded-lg p-2',
              index === currentDayIndex
                ? 'bg-secondary text-white md:animate-scale-in'
                : 'bg-primary md:animate-scale-out',
            )}
            onClick={() => handleDateClick(index)} // Use handleDateClick instead of inline function
          >
            <div className="flex h-full flex-col items-center justify-center text-center text-lg">
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
          <ChevronLeft className="h-16 w-16 text-secondary" />
        </button>
        <button
          className="inline rounded-full"
          onClick={() => handleArrowClick('right')}
        >
          <ChevronRight className="h-16 w-16 text-secondary" />
        </button>
      </div>
    </div>
  );
}
