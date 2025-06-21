import '@/app/globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';

import { ExchangeRateProvider } from '@/components/common/ExchangeRateProvider';
import TanStackQueryClientProvider from '@/components/common/query-client/TanStackQueryClientProvider';
import ReduxPersistProvider from '@/components/common/redux-provider/ReduxPersistProvider';
import { ReduxProvider } from '@/lib/redux/Provider'; // Ensure this matches your actual path

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Poppins and Merienda fonts are loaded via CSS

export const metadata: Metadata = {
  title: 'Global Takeout',
  description: 'Takeout system by ELITESTAR.NET',
};

export function generateStaticParams() {
  return [{ locale: 'cn' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The locale will be handled by the [locale] folder structure
  // We don't need to extract it here

  // For canonical tag, use the base URL from environment or default
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://globaltakeout.com';

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QKC5Y7SKJF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QKC5Y7SKJF');
          `}
        </Script>
        <link rel="canonical" href={baseUrl} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden overflow-y-hidden h-[100dvh] flex w-full items-center justify-center bg-gray-100`}
      >
        <div className="md:max-w-[430px] w-full border-[0.5px] border-gray-400 h-full bg-[#FDFDFD]">
          <ReduxProvider>
            <ReduxPersistProvider>
              <TanStackQueryClientProvider>
                <ExchangeRateProvider>{children}</ExchangeRateProvider>
              </TanStackQueryClientProvider>
            </ReduxPersistProvider>
          </ReduxProvider>
        </div>
      </body>
    </html>
  );
}
