'use client';
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get path
  const pathname = usePathname();
  console.log(pathname);

  const getActive = (path: string) => {
    if (pathname === path) {
      return 'text-foreground';
    }
    return 'text-gray-500';
  };

  return (
    <div className="mx-auto flex w-full max-w-[90vw] flex-row pb-32 pt-16 md:max-w-screen-xl">
      <div className="relative hidden md:inline-block">
        <div className="sticky top-[89px] flex h-[calc(100vh-92px)] w-64 flex-col gap-4 border-2 border-r-0 border-primary px-4 py-8 pl-12 ">
          <Link href="/me">
            <p className={cn('uppercase hover:underline', getActive('/me'))}>
              Profile
            </p>
          </Link>
          <Link href="/me/booking">
            <p
              className={cn(
                'uppercase hover:underline',
                getActive('/me/booking'),
              )}
            >
              Booking
            </p>
          </Link>
          <Link href="/me/credit">
            <p
              className={cn(
                'uppercase hover:underline',
                getActive('/me/credit'),
              )}
            >
              Credit
            </p>
          </Link>
          <Link href="/me/loyalty">
            <p
              className={cn(
                'uppercase hover:underline',
                getActive('/me/loyalty'),
              )}
            >
              Loyalty
            </p>
          </Link>
          <Link href="/me/transaction">
            <p
              className={cn(
                'uppercase hover:underline',
                getActive('/me/transaction'),
              )}
            >
              Transaction
            </p>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
