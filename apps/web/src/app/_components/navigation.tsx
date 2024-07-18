import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';

import { validateRequest } from '@/lib/auth';

import { menus } from '../menu';
import Avatar from './avatar';
import Menu from './hamburger-menu';

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
          className="flex h-12 w-40 items-center gap-2 text-3xl font-semibold"
        >
          <div className="relative h-12 w-40">
            <Image
              src={logo.result?.logo ?? '/logo.webp'}
              alt="Pilates Reform"
              className="absolute -top-5 left-0"
              width={160}
              height={48}
            />
          </div>
        </Link>

        <div className="flex flex-grow flex-row items-center justify-end">
          {/* auth profile */}
          <div className="mr-6 hidden h-full flex-row gap-4 pt-1 font-medium uppercase md:flex xl:gap-6">
            <Link href="/classes">
              <Button
                variant="link"
                size="default"
                className="uppercase text-primary-foreground"
              >
                Classes
              </Button>
            </Link>
            <Link
              href={`/schedules${auth?.user?.locationId !== undefined ? `?location_name=${auth?.user?.locationId}` : ''}`}
            >
              <Button
                variant="link"
                size="default"
                className="uppercase text-primary-foreground"
              >
                Schedules
              </Button>
            </Link>
            <Link href="/packages">
              <Button
                variant="link"
                size="default"
                className="uppercase text-primary-foreground"
              >
                Packages
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="link"
                size="default"
                className="uppercase text-primary-foreground"
              >
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="flex-shrink-0">
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
                  {menus.map((menu) =>
                    menu?.role === auth?.user?.role ||
                    menu.role === undefined ? (
                      <DropdownMenuItem key={menu.path} asChild>
                        <Link className="cursor-pointer" href={menu.path}>
                          <span>{menu.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : null,
                  )}
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

          <Menu user={auth?.user ?? null} />
        </div>
      </div>
    </nav>
  );
}
