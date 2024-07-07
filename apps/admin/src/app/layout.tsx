import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '@repo/ui/global.css';
import { Toaster } from '@repo/ui/components/ui/sonner';

import Provider from './admin/_components/provider';

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
      <body className={monserrat.className}>
        <Provider>{children}</Provider>
        <Toaster position="top-right" duration={5000} />
      </body>
    </html>
  );
}
