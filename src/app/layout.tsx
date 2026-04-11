import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { FirebaseAnalyticsTracker } from '@/components/analytics/FirebaseAnalyticsTracker';
import { LocaleInitializer } from '@/components/common/LocaleInitializer';
import { CONTACT_INFO } from '@/lib/constants';
import { buildOrganizationJsonLd, getDefaultMetaDescription, getSiteUrlObject, toAbsoluteUrl } from '@/lib/seo';
import { Providers } from './providers';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-display',
  display: 'swap',
});

const siteUrl = getSiteUrlObject();
const defaultDescription = getDefaultMetaDescription();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: CONTACT_INFO.title,
    template: `%s | ${CONTACT_INFO.name}`,
  },
  description: defaultDescription,
  keywords: [
    'Apple',
    'iPhone',
    'iPad',
    'MacBook',
    'Apple Watch',
    'AirPods',
    'điện thoại Apple',
    'máy tính Apple',
    'phụ kiện Apple',
    'Nguyen Cong Mobile',
  ],
  authors: [{ name: CONTACT_INFO.name }],
  creator: CONTACT_INFO.name,
  publisher: CONTACT_INFO.name,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: CONTACT_INFO.name,
    title: CONTACT_INFO.title,
    description: defaultDescription,
    locale: 'vi_VN',
    images: [
      {
        url: toAbsoluteUrl('/web-app-manifest-512x512.png'),
        width: 512,
        height: 512,
        alt: CONTACT_INFO.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: CONTACT_INFO.title,
    description: defaultDescription,
    images: [toAbsoluteUrl('/web-app-manifest-512x512.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f2937',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://d10gwy2ckxccqn.cloudfront.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://d10gwy2ckxccqn.cloudfront.net" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={`${manrope.variable} ${fraunces.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleInitializer locale={locale as 'vi' | 'en'} />
          <FirebaseAnalyticsTracker locale={locale} />
          <Providers>
            {children}
            <SpeedInsights />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
