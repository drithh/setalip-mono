import { validateAdmin, validateRequest } from '@/lib/auth';

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

export default async function Header() {
  const auth = await validateRequest();
  return (
    <header className="sticky top-0 z-30 flex h-14  place-content-end place-items-center gap-4 border-b bg-background px-4  sm:static sm:h-auto sm:border-0  sm:px-6">
      <div>
        {auth?.user && (
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
                <Link className="cursor-pointer" href="/me">
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
        )}
      </div>
      <HamburgerMenu user={auth?.user ?? null} />
    </header>
  );
}
