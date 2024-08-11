'use client';

import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { setDefaultOptions } from 'date-fns';
import { id } from 'date-fns/locale';
import { FloatingWhatsApp } from './_components/floating-whatsapp/floating-whatsapp';

import { TRPCReactProvider } from '@/trpc/react';
import { env } from '@repo/shared/env';
setDefaultOptions({ locale: id });

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <TooltipProvider>
        {children}
        <FloatingWhatsApp
          phoneNumber="6281511673808"
          accountName="Pilates Reform"
          avatar={`/favicon-96x96.png`}
          chatMessage="Halo, ada yang bisa kami bantu?"
          allowEsc
          allowClickAway
          notification
          notificationSound
        />
      </TooltipProvider>
    </TRPCReactProvider>
  );
}
