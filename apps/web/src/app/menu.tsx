'use client';
import {
  SheetContent,
  SheetTrigger,
  Sheet as SheetWrapper,
} from '@repo/ui/components/ui/sheet';
import Link from 'next/link';
import {
  CalendarClock,
  Gift,
  Home,
  LineChart,
  MapPin,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  SquarePercent,
  Users2,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@repo/ui/components/ui/navigation-menu';
import { Button } from '@repo/ui/components/ui/button';

interface NavigationProps {
  isAuth: boolean;
}

export default function Navigation({ isAuth }: NavigationProps) {
  return (
    <>
      <SheetWrapper>
        <div className="ml-auto  justify-start md:hidden">
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="bg-transparent text-primary-foreground "
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-foreground"
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Customers
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </SheetWrapper>
      <div className="mr-6 hidden h-full flex-grow flex-row place-content-end gap-4 pt-1 font-gt font-medium uppercase md:flex xl:gap-6">
        <Link href="classes">
          <Button
            variant="link"
            size="default"
            className="uppercase text-primary-foreground"
          >
            Classes
          </Button>
        </Link>
        <Link href="schedules">
          <Button
            variant="link"
            size="default"
            className="uppercase text-primary-foreground"
          >
            Schedules
          </Button>
        </Link>
        <Link href="packages">
          <Button
            variant="link"
            size="default"
            className="uppercase text-primary-foreground"
          >
            Packages
          </Button>
        </Link>
        <Link href="contact">
          <Button
            variant="link"
            size="default"
            className="uppercase text-primary-foreground"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </>
  );
}
