'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import Link from 'next/link';
import {
  CalendarClock,
  Gift,
  Home,
  LineChart,
  MapPin,
  Package,
  Package2,
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
    <nav className=" hidden h-full flex-grow-[2] flex-row justify-evenly gap-6 pt-1 font-medium md:flex">
      <Link href="classes">
        <Button
          variant="link"
          size="default"
          className="text-lg text-primary-foreground"
        >
          Kelas
        </Button>
      </Link>
      <Link href="packages">
        <Button
          variant="link"
          size="default"
          className="text-lg text-primary-foreground"
        >
          Paket
        </Button>
      </Link>
      {isAuth && (
        <Link href="agendas">
          <Button
            variant="link"
            size="default"
            className="text-lg text-primary-foreground"
          >
            Agenda
          </Button>
        </Link>
      )}
      <Link href="contact">
        <Button
          variant="link"
          size="default"
          className="text-lg text-primary-foreground"
        >
          Kontak
        </Button>
      </Link>

      {/* <Link
        href="packages"
        className="text-primary-foreground transition-colors hover:underline"
      >
        Paket
      </Link>
      <Link
        href="agendas"
        className="text-primary-foreground transition-colors hover:underline"
      >
        Agenda
      </Link>
      <Link
        href="contact"
        className="text-primary-foreground transition-colors hover:underline"
      >
        Kontak
      </Link> */}
    </nav>
  );
}
