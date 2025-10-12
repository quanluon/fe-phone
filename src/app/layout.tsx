import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import './globals.css';
import { Providers } from './providers';
import { CONTACT_INFO } from '@/lib/constants';
import { LocaleInitializer } from '@/components/common/LocaleInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: CONTACT_INFO.title,
  description: 'Your trusted destination for the latest Apple products and accessories. We offer competitive prices, fast shipping, and exceptional customer service.',
  keywords: 'Apple, iPhone, iPad, MacBook, Apple Watch, AirPods, electronics, technology',
  authors: [{ name: CONTACT_INFO.name }],
  creator: CONTACT_INFO.name,
  publisher: CONTACT_INFO.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: CONTACT_INFO.title,
    description: 'Your trusted destination for the latest Apple products and accessories.',
    url: '/',
    siteName: CONTACT_INFO.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: CONTACT_INFO.name,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: CONTACT_INFO.title,
    description: 'Your trusted destination for the latest Apple products and accessories.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <LocaleInitializer locale={locale as 'vi' | 'en'} />
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}