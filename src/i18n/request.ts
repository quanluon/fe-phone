import { getRequestConfig } from 'next-intl/server';
import { headers, cookies } from 'next/headers';

// Can be imported from a shared config
const locales = ['vi', 'en'];
const defaultLocale = 'vi';

export default getRequestConfig(async () => {
  // Get locale from cookie or header set by middleware
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const headerLocale = headersList.get('x-locale');
  
  // Determine the locale to use
  let validLocale: 'vi' | 'en' = defaultLocale;
  
  if (headerLocale && locales.includes(headerLocale)) {
    validLocale = headerLocale as 'vi' | 'en';
  } else if (localeFromCookie && locales.includes(localeFromCookie)) {
    validLocale = localeFromCookie as 'vi' | 'en';
  }

  return {
    locale: validLocale,
    messages: (await import(`../locales/${validLocale}/common.json`)).default
  };
});

export { locales };

