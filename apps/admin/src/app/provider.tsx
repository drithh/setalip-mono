'use client';

import { Dialog } from '@repo/ui/components/ui/dialog';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <Dialog>{children}</Dialog>
    </TooltipProvider>
  );
}
