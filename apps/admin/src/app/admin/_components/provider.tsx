'use client';

import { TRPCReactProvider } from '@/trpc/react';
import { setDefaultOptions } from 'date-fns';
import { id } from 'date-fns/locale';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
setDefaultOptions({ locale: id });

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
