import { CONTACT_INFO } from '@/lib/constants';

const FALLBACK_SITE_URL = 'http://localhost:3000';

function normalizeSiteUrl(value?: string | null): string {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return FALLBACK_SITE_URL;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue.replace(/\/$/, '');
  }

  return `https://${trimmedValue.replace(/\/$/, '')}`;
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL);
}

export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}

export function toAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) {
    return new URL('/android-chrome-512x512.png', getSiteUrl()).toString();
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`, getSiteUrl()).toString();
}

export function stripHtmlTags(value?: string | null): string {
  if (!value) {
    return '';
  }

  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncateForMeta(value: string, maxLength: number = 160): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

export function getDefaultMetaDescription(): string {
  return 'Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất. Giá tốt, hàng 99% mới về, giao nhanh và hỗ trợ tận tâm từ Nguyen Cong Mobile.';
}

export function getOrganizationName(): string {
  return CONTACT_INFO.name;
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: CONTACT_INFO.name,
    description: getDefaultMetaDescription(),
    url: getSiteUrl(),
    logo: toAbsoluteUrl('/android-chrome-512x512.png'),
    image: toAbsoluteUrl('/android-chrome-512x512.png'),
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    openingHours: CONTACT_INFO.hours,
    areaServed: 'VN',
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
