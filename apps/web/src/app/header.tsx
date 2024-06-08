import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@repo/ui/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@repo/ui/components/ui/navigation-menu';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@repo/ui/components/ui/dropdown-menu';
import {
  Sheet as SheetWrapper,
  SheetTrigger,
  SheetContent,
} from '@repo/ui/components/ui/sheet';
import {
  Sheet,
  PanelLeft,
  Package2,
  Home,
  ShoppingCart,
  Package,
  Users2,
  LineChart,
} from 'lucide-react';
import Link from 'next/link';
import Navigation from './navigation';
import { getAuth } from '@/lib/get-auth';

export default async function Header() {
  const auth = await getAuth();
  return (
    <header className="sticky top-0 z-30 h-auto gap-4 border-0  border-b bg-primary px-4 py-4 sm:static  sm:h-auto sm:px-6">
      <div className="mx-auto flex max-w-screen-xl items-center justify-center">
        <Link
          href="#"
          className="flex items-center gap-2 text-2xl font-bold text-background"
        >
          Pilates Reform
        </Link>
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
        <Navigation isAuth={auth !== null} />
        <div className=" hidden flex-shrink-0 flex-grow md:block">
          {auth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex place-content-end gap-2 text-base">
              <Link href="/login">
                <Button
                  className="w-24 border-background bg-primary text-primary-foreground"
                  variant="outline"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="w-24 border-background bg-primary text-primary-foreground"
                  variant="outline"
                >
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
