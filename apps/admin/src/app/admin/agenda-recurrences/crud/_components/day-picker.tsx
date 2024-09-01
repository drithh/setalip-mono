'use client';
import { cn } from '@repo/ui/lib/utils';

import React from 'react';
import { DAYS } from '../constant';

interface DayPickerProps {
  dayOfWeek: number;
  setDayOfWeek: (dayOfWeek: number) => void;
}

export default function DayPicker({ dayOfWeek, setDayOfWeek }: DayPickerProps) {
  const handleDateClick = (index: number) => {
    setDayOfWeek(index);
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-4 pt-2 sm:mb-8 sm:flex-row">
      <div className="flex w-full grid-cols-3 flex-wrap place-content-center gap-2">
        {DAYS.map((day, index) => (
          <div
            key={index}
            className={cn(
              'h-[4.6rem] w-[4.6rem] cursor-pointer rounded-md p-2  sm:h-24 sm:w-24 sm:rounded-lg',
              index === dayOfWeek
                ? 'bg-secondary text-white md:animate-scale-in'
                : 'bg-primary md:animate-scale-out',
            )}
            onClick={() => handleDateClick(index)} // Use handleDateClick instead of inline function
          >
            <div className="flex h-full flex-col items-center justify-center text-center text-base sm:text-lg">
              <p className="font-semibold">{day}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
