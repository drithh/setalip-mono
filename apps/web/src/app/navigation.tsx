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
    <nav className="mr-6 hidden h-full flex-grow flex-row place-content-end gap-4 pt-1 font-gt font-medium uppercase md:flex xl:gap-6">
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
    </nav>
  );
}
