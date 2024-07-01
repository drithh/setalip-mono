import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';
import '@repo/ui/global.css';

import { Toaster } from '@repo/ui/components/ui/sonner';
import Navigation from './_components/menu';
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
import MobileNav from './_components/navigation';
import Header from './_components/navigation';
import Footer from './_components/footer';

const neueWorld = localFont({
  src: '../../public/neue-world.woff2',
  variable: '--font-neue-world',
});

const monserrat = Montserrat({
  display: 'swap',
  variable: '--font-montserrat',
  subsets: ['latin'],
});

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
    <html lang="en" className={`${monserrat.variable}  ${neueWorld.variable}`}>
      <body className="font-sans">
        <Provider>
          <div className="flex min-h-screen w-full flex-col  bg-background">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
        </Provider>
        <Toaster position="top-right" duration={5000} />
      </body>
    </html>
  );
}
