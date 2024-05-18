import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@repo/ui/global.css';
import './global.css';
const inter = Inter({ subsets: ['latin'] });
import { Toaster } from '@repo/ui/components/ui/sonner';
import Navigation from './navigation';
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
import Provider from './provider';
import MobileNav from './header';
import Header from './header';

export const metadata: Metadata = {
  title: 'Pilates Reformers',
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
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 min-h-screen">
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
