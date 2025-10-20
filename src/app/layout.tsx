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
  description: 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất. Giá cả cạnh tranh, giao hàng nhanh chóng và dịch vụ khách hàng xuất sắc. Mua iPhone, iPad, MacBook, Apple Watch, AirPods chính hãng tại NC Mobile.',
  keywords: 'Apple, iPhone, iPad, MacBook, Apple Watch, AirPods, điện thoại Apple, máy tính Apple, phụ kiện Apple, mua online, NC Mobile, chính hãng, giá rẻ',
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
    description: 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất. Giá cả cạnh tranh, giao hàng nhanh chóng.',
    url: '/',
    siteName: CONTACT_INFO.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: CONTACT_INFO.name,
        type: 'image/jpeg',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
    countryName: 'Vietnam',
  },
  twitter: {
    card: 'summary_large_image',
    title: CONTACT_INFO.title,
    description: 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất.',
    images: {
      url: '/og-image.jpg',
      alt: CONTACT_INFO.name,
    },
    creator: '@ncmobile',
    site: '@ncmobile',
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
  // Additional meta tags for Vietnamese social platforms
  other: {
    // Enhanced Open Graph tags
    'og:title': CONTACT_INFO.title,
    'og:description': 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất. Giá cả cạnh tranh, giao hàng nhanh chóng.',
    'og:image': '/og-image.jpg',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:alt': CONTACT_INFO.name,
    'og:url': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'og:type': 'website',
    'og:site_name': CONTACT_INFO.name,
    'og:locale': 'vi_VN',
    'og:country-name': 'Vietnam',
    
    // Zalo sharing
    'zalo:title': CONTACT_INFO.title,
    'zalo:description': 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất. Mua iPhone, iPad, MacBook chính hãng.',
    'zalo:image': '/og-image.jpg',
    
    // Facebook Messenger
    'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    
    // WhatsApp sharing
    'whatsapp:title': CONTACT_INFO.title,
    'whatsapp:description': 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất.',
    'whatsapp:image': '/og-image.jpg',
    
    // Viber sharing
    'viber:title': CONTACT_INFO.title,
    'viber:description': 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất.',
    'viber:image': '/og-image.jpg',
    
    // Telegram sharing
    'telegram:title': CONTACT_INFO.title,
    'telegram:description': 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất.',
    'telegram:image': '/og-image.jpg',
    
    // Vietnamese SEO
    'geo.region': 'VN',
    'geo.placename': 'Vietnam',
    'geo.position': '16.0583;108.2772',
    'ICBM': '16.0583, 108.2772',
    
    // Business information
    'business:contact_data:phone_number': CONTACT_INFO.phone,
    'business:contact_data:email': CONTACT_INFO.email,
    'business:contact_data:website': process.env.NEXT_PUBLIC_APP_URL || '',
    
    // Mobile app tags
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': CONTACT_INFO.name,
    
    // Additional meta tags
    'theme-color': '#1f2937',
    'msapplication-TileColor': '#1f2937',
    'msapplication-TileImage': '/og-image.jpg',
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
      <head>
        {/* Preconnect to critical origins for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://oh8kpjl5uf.execute-api.ap-southeast-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://d10gwy2ckxccqn.cloudfront.net" />
      </head>
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