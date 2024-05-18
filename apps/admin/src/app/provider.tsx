'use client';

import { TooltipProvider } from '@repo/ui/components/ui/tooltip';

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
