'use client';

import { TRPCReactProvider } from '@/trpc/react';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { ParallaxProvider } from 'react-scroll-parallax';
export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <TooltipProvider>
        <ParallaxProvider>{children}</ParallaxProvider>
      </TooltipProvider>
    </TRPCReactProvider>
  );
}
