import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import '@repo/ui/global.css';
import './global.css';

import { Toaster } from '@repo/ui/components/ui/sonner';
import Navigation from './menu';
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
import MobileNav from './navigation';
import Header from './navigation';
import Footer from './footer';

const rozhaOne = localFont({
  src: '../../public/rozhaone-regular.otf',
  variable: '--font-rozhaone',
});

const basicCommercial = localFont({
  src: '../../public/basic-commercial.woff2',
  variable: '--font-basic-commercial',
});

const gtAmerica = localFont({
  src: '../../public/gt-america.woff2',
  variable: '--font-gt-america',
});

const neueWorld = localFont({
  src: '../../public/neue-world.woff2',
  variable: '--font-neue-world',
});
const inter = Inter({
  display: 'swap',
  variable: '--font-inter',
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
    <html
      lang="en"
      className={`${rozhaOne.variable} ${inter.variable} ${basicCommercial.variable} ${gtAmerica.variable} ${neueWorld.variable}`}
    >
      <body className="font-basic">
        <Provider>
          <div className="flex w-full flex-col bg-secondary">
            <Header />
            {children}
            <Footer />
          </div>
        </Provider>
        <Toaster position="top-right" duration={5000} />
      </body>
    </html>
  );
}
