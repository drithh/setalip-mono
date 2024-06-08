'use client';

import { TRPCReactProvider } from '@/trpc/react';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </TRPCReactProvider>
  );
}
