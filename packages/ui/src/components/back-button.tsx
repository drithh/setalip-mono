'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '#dep/components/ui/button';

export function BackButton() {
  const onClick = () => {
    window.history.back();
  };
  return (
    <div className="flex place-items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        className="h-7 w-7"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
    </div>
  );
}
