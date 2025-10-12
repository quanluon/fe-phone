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
    company: [
      { label: t('aboutUs'), href: '/about' },
      { label: t('contact'), href: '/contact' },
      { label: t('careers'), href: '/careers' },
      { label: t('press'), href: '/press' },
    ],
    support: [
      { label: t('helpCenter'), href: '/help' },
      { label: t('shippingInfo'), href: '/shipping' },
      { label: t('returns'), href: '/returns' },
      { label: t('sizeGuide'), href: '/size-guide' },
    ],
    legal: [
      { label: t('privacyPolicy'), href: '/privacy' },
      { label: t('termsOfService'), href: '/terms' },
      { label: t('cookiePolicy'), href: '/cookies' },
      { label: t('accessibility'), href: '/accessibility' },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <ShoppingCartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <span className="text-lg sm:text-xl font-bold">{CONTACT_INFO.name}</span>
            </Link>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-md">
              {t('description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <p>
                📧{' '}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-blue-400 transition-colors underline"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p>
                📞{' '}
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-blue-400 transition-colors underline"
                >
                  {CONTACT_INFO.phone}
                </a>
              </p>
              {/* <p>📍 {CONTACT_INFO.address}</p> */}
              <p>🕒 {CONTACT_INFO.hours}</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={`Follow us on ${platform}`}
                >
                  <span className="text-xs sm:text-sm font-medium">
                    {platform.charAt(0).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('support')}</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('categories')}</h3>
            <ul className="space-y-1 sm:space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <button
                    onClick={() => handleCategoryClick(category._id)}
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors text-left"
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
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {currentYear} {CONTACT_INFO.name}. {t('allRightsReserved')}
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
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

