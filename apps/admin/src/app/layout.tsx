import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@repo/ui/global.css';
import './global.css';
const inter = Inter({ subsets: ['latin'] });
import { Toaster } from '@repo/ui/components/ui/sonner';

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
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
