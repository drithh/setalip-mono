'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function GlobalToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (params.get('error')) {
      toast.error(params.get('error'));
      router.replace(pathname);
    }
  }, [params]);

  return null;
}
