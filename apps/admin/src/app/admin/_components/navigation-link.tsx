import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/ui/lib/utils';
import React from 'react';

export type Menu = {
  icon: React.ReactNode;
  label: string;
  path: string;
  isBottom?: boolean;
  children?: React.ReactNode;
};

export default function NavLink({ icon, label, path, isBottom }: Menu) {
  const pathname = usePathname();

  const getActive = (path: string) => {
    if (pathname === path) {
      return 'text-foreground bg-primary bg-opacity-10';
    }
    return 'text-gray-500 hover:text-primary-foreground hover:bg-primary hover:opacity-50';
  };

  return (
    <div className={cn(isBottom ? 'mt-auto' : 'mb-0')}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={path}>
            <div
              className={cn(
                'flex items-center justify-start overflow-hidden rounded-lg transition-all duration-300',
                'hover:text-primary-background hover:bg-primary/50',
                getActive(path),
              )}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center">
                {icon}
              </div>
              <span className="ml-2 hidden whitespace-nowrap group-hover:block">
                {label}
              </span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="sidebar-expanded:block hidden">
          {label}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
