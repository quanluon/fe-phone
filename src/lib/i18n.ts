import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Can be imported from a shared config
const locales = ['vi', 'en'];

export default getRequestConfig(async () => {
  // Get locale from custom header set by middleware
  const headersList = await headers();
  const headerLocale = headersList.get('x-locale');
  
  // Use header locale if available, otherwise fall back to default
  const validLocale = headerLocale && locales.includes(headerLocale as 'vi' | 'en') 
    ? headerLocale as 'vi' | 'en' 
    : 'vi'; // default locale

  return {
    locale: validLocale,
    messages: (await import(`../locales/${validLocale}/common.json`)).default
  };
});

export { locales };
