'use client';
import HamburgerMenu from './hamburger-menu';
import Avatar from './avatar';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@repo/ui/components/ui/dropdown-menu';
import Link from 'next/link';
import { menus } from './navigation';
import { usePathname } from 'next/navigation';
import { Session, User } from 'lucia';

interface HeaderProps {
  auth: {
    user: User;
    session: Session;
  };
}

export default function Header({ auth }: HeaderProps) {
  const pathname = usePathname();

  const getActive = () => {
    const menu = menus.find((menu) => {
      if (menu.path === '/admin') {
        if (pathname === '/admin') {
          return true;
        } else {
          return false;
        }
      }
      return pathname.startsWith(menu.path);
    });
    return menu?.label || '';
  };

  console.log(getActive());

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full place-content-between  place-items-center gap-4 border-b bg-background px-4 sm:static  sm:border-0  sm:px-6">
      <h2 className="text-2xl font-semibold">{getActive()}</h2>
      <div className="flex place-items-center gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="mt-2 overflow-hidden rounded-full"
              >
                <Avatar user={auth.user} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="/admin/me">
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="/logout">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <HamburgerMenu user={auth.user ?? null} />
      </div>
    </header>
  );
}
