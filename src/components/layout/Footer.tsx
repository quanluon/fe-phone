import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { SOCIAL_LINKS, CONTACT_INFO } from '@/lib/constants';
import { useCategories } from '@/hooks/useCategories';

export const Footer: React.FC = () => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();
  const { data: categories = [] } = useCategories();
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };


  const footerLinks = {
    support: [
      { label: t('helpCenter'), href: '/#' },
      { label: t('shippingInfo'), href: '/#' },
      { label: t('returns'), href: '/#' },
      { label: t('sizeGuide'), href: '/#' },
    ],
    legal: [
      { label: t('privacyPolicy'), href: '/privacy' },
      { label: t('termsOfService'), href: '/terms' },
      { label: t('cookiePolicy'), href: '/cookies' },
      { label: t('accessibility'), href: '/accessibility' },
    ]
  };

  const trustItems = [
    t('trust.freeShipping'),
    t('trust.secureCheckout'),
    t('trust.officialWarranty'),
    t('trust.liveSupport'),
  ];

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur sm:grid-cols-[1.3fr_0.7fr] sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">{t('trust.eyebrow')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{t('trust.title')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            {trustItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="mb-5 flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950">
                <ShoppingCartIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold uppercase tracking-[0.18em]">{CONTACT_INFO.name}</span>
            </Link>
            <p className="mb-5 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
              {t('description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <span className="text-sky-300">{t('contactInfo.email')}</span>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="transition-colors hover:text-white"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-300">{t('contactInfo.phone')}</span>
                <a
                  href={`tel:${CONTACT_INFO.phoneLink}`}
                  className="transition-colors hover:text-white"
                >
                  {CONTACT_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2"><span className="text-sky-300">{t('contactInfo.hours')}</span>{CONTACT_INFO.hours}</p>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-3 sm:space-x-4">
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white hover:text-slate-950"
                  aria-label={`Follow us on ${platform}`}
                >
                  <span className="text-xs font-medium">
                    {platform.charAt(0).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold sm:text-lg">{t('support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition-colors hover:text-white sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-base font-semibold sm:text-lg">{t('categories')}</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <button
                    onClick={() => handleCategoryClick(category._id)}
                    className="text-left text-sm text-slate-300 transition-colors hover:text-white sm:text-base"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="border-t border-gray-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-2">{t('stayUpdated')}</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              {t('newsletterDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={t('enterEmail')}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <button className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center text-xs text-slate-400 sm:text-left sm:text-sm">
              © {currentYear} {CONTACT_INFO.name}. {t('allRightsReserved')}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:justify-end sm:gap-6 sm:text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
