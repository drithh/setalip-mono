import type { Metadata } from 'next';
import '@repo/ui/global.css';
import Navigation from './_components/navigation';

import Header from './_components/header';
import { validateAdmin } from '@/lib/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await validateAdmin();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navigation />
      <div className="z-0 flex min-h-screen flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header auth={auth} />
        {children}
      </div>
    </div>
  );
}
