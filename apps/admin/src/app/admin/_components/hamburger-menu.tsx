'use client';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  Sheet as SheetWrapper,
  SheetContent,
  SheetTrigger,
} from '@repo/ui/components/ui/sheet';
import { User } from 'lucia';
import { CalendarClock, Home, Menu, Phone, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { menus } from './menu';
import Avatar from './avatar';

interface MenuProps {
  user: User | null;
}

export default function HamburgerMenu({ user }: MenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <SheetWrapper open={open} onOpenChange={setOpen}>
      <div className="ml-8 justify-start md:hidden">
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="border bg-transparent text-primary-foreground "
          >
            <Menu className="h-7 w-7 text-primary-foreground" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {user && (
            <>
              <Link className="flex place-items-center gap-4" href="/profile">
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar user={user} />
                </Button>
                <p>{user.name}</p>
              </Link>
              {menus.map((menu) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={menu.path}
                  href={menu.path}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  {menu.icon}
                  {menu.label}
                </Link>
              ))}
              <Separator />
            </>
          )}
        </nav>
      </SheetContent>
    </SheetWrapper>
  );
}
