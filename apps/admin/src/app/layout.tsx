import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '@repo/ui/global.css';
const inter = Inter({ subsets: ['latin'] });
import { Toaster } from '@repo/ui/components/ui/sonner';
import Navigation from './_components/navigation';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { Button } from '@repo/ui/components/ui/button';
import { SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet';
import {
  Sheet,
  PanelLeft,
  Link,
  Package2,
  Home,
  ShoppingCart,
  Package,
  Users2,
  LineChart,
} from 'lucide-react';
import { Dialog } from '@repo/ui/components/ui/dialog';
import Provider from './_components/provider';
import MobileNav from './_components/header';
import Header from './_components/header';

const monserrat = Montserrat({
  display: 'swap',
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Pilates',
  description: 'Pilates Reformers Indonesia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navigation />
            <div className="flex min-h-screen flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <Header />
              {children}
            </div>
          </div>
        </Provider>
        <Toaster position="top-right" duration={5000} />
      </body>
    </html>
  );
}
