'use client';

import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { setDefaultOptions } from 'date-fns';
import { id } from 'date-fns/locale';

import { TRPCReactProvider } from '@/trpc/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

setDefaultOptions({ locale: id });

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if there are error, toasts it
    if (params.get('error')) {
      toast.error(params.get('error'));
      router.replace(pathname);
    }
  }, [params]);

  return (
    <TRPCReactProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </TRPCReactProvider>
  );
}
