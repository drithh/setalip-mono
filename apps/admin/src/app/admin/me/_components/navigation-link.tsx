'use client';
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLinkProps {
  path: string;
  children: React.ReactNode;
}
export default function NavigationLink({
  path,
  children,
}: NavigationLinkProps) {
  const pathname = usePathname();

  const getActive = (path: string) => {
    if (pathname === path) {
      return 'text-foreground  bg-primary bg-opacity-10';
    }
    return 'text-gray-500 hover:text-primary-foreground hover:bg-primary hover:opacity-50';
  };

  return (
    <Link href={path}>
      <div className={cn('rounded-md px-3 py-2', getActive(path))}>
        {children}
      </div>
    </Link>
  );
}
