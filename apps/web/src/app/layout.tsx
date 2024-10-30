import '@repo/ui/global.css';

import { Toaster } from '@repo/ui/components/ui/sonner';

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import Footer from './_components/footer';
import Header from './_components/navigation';
import Provider from './provider';
import GlobalToast from './_components/global-toast';
import { Suspense } from 'react';

const monserrat = Montserrat({
  display: 'swap',
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pilates Reform',
  description: 'Pilates Reform Indonesia',
  applicationName: 'Pilates Reform',
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pilates Reform',
  },
  twitter: {
    card: 'summary',
    site: '@pilatesreform',
    title: 'Pilates Reform',
    description: 'Pilates Reform Indonesia',
    images: [
      {
        url: '/favicon-96x96.png',
        alt: 'Pilates Reform',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Pilates Reform',
    description: 'Pilates Reform Indonesia',
    siteName: 'Pilates Reform',
    url: 'https://pilatesreform.id',
    images: [
      {
        url: '/favicon-96x96.png',
        alt: 'Pilates Reform',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${monserrat.variable} `}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#fbf8ef" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans">
        <Provider>
          <Suspense>
            <GlobalToast />
          </Suspense>
          <div className="flex min-h-screen w-full flex-col  bg-background">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
        </Provider>
        <Toaster
          theme="light"
          richColors
          closeButton={true}
          position="top-right"
          duration={5000}
        />
      </body>
    </html>
  );
}
