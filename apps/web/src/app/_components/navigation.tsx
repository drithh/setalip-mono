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
import Menu from './menu';
import Image from 'next/image';
import { validateRequest } from '@/lib/auth';
import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';

export default async function Navigation() {
  const auth = await validateRequest();

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const logo = await webSettingService.findLogo();

  return (
    <nav className="sticky top-0 z-30 h-auto gap-4 border-b-2 border-b-primary bg-background px-4 py-4  sm:h-auto sm:px-6">
      <div className="mx-auto flex max-w-screen-xl items-center justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-3xl font-semibold"
        >
          <Image
            src={logo.result?.logo ?? '/logo.webp'}
            alt="Pilates Reform"
            width={160}
            height={40}
          />
        </Link>

        <Menu user={auth?.user ?? null} />
        <div className=" hidden flex-shrink-0 md:block">
          {auth?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
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
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/me/booking">
                    Booking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/me/loyalty">
                    Loyalty
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/me/package">
                    Package
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
          ) : (
            <div className="flex place-content-end gap-2 ">
              <Link href="/login">
                <Button
                  className="w-24 border-background bg-primary uppercase text-primary-foreground"
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
