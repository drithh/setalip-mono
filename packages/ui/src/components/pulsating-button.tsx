'use client';

import React from 'react';

import { cn } from '#dep/lib/utils';
import { Button } from '#dep/components/ui/button';

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export default function PulsatingButton({
  className,
  children,
  // red
  pulseColor = '#EF4444',
  duration = '4s',
  ...props
}: PulsatingButtonProps) {
  return (
    <Button
      className={cn(
        'relative text-center cursor-pointer flex justify-center items-center rounded-lg bg-red-500 text-white font-semibold px-4 py-2  hover:bg-red-700',
        className
      )}
      style={
        {
          '--pulse-color': pulseColor,
          '--duration': duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </Button>
  );
}
