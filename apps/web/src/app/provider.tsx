'use client';

import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { setDefaultOptions } from 'date-fns';
import { id } from 'date-fns/locale';

import { TRPCReactProvider } from '@/trpc/react';
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
