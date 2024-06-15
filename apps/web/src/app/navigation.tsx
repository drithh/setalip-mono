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
import { SheetTrigger, SheetContent } from '@repo/ui/components/ui/sheet';
import Link from 'next/link';
import Menu from './menu';
import { getAuth } from '@/lib/get-auth';
import Image from 'next/image';

export default async function Navigation() {
  const auth = await getAuth();
  return (
    <nav className="sticky top-0 z-30 h-auto gap-4 border-0 bg-secondary px-4 py-4  sm:h-auto sm:px-6">
      <div className="mx-auto flex max-w-screen-xl items-center justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 font-rozhaone text-3xl font-semibold"
        >
          <Image
            src="/logo.webp"
            alt="Pilates Reform"
            width={160}
            height={40}
          />
        </Link>

        <Menu isAuth={auth !== null} />
        <div className=" hidden flex-shrink-0 md:block">
          {auth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar user={auth} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Booking</DropdownMenuItem>
                <DropdownMenuItem>Loyalty</DropdownMenuItem>
                <DropdownMenuItem>Transaction</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex place-content-end gap-2 ">
              <Link href="/login">
                <Button
                  className="w-24 border-background bg-primary font-gt uppercase text-primary-foreground"
                  variant="default"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
