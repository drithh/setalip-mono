import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/ui/lib/utils';

export type Menu = {
  icon: React.ReactNode;
  label: string;
  path: string;
  isBottom?: boolean;
};

export default function NavLink({ icon, label, path, isBottom }: Menu) {
  const pathname = usePathname();

  const getActive = (path: string) => {
    if (pathname === path) {
      return 'text-foreground  bg-primary bg-opacity-10';
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
                'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                'hover:text-primary-background hover:bg-primary/50',
                getActive(path),
              )}
            >
              {icon}
              <span className="sr-only">{label}</span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </div>
  );
}
