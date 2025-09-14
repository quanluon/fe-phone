import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['vi', 'en'];

export default getRequestConfig(async () => {
  // For static export, we'll use a default locale
  // In a real app, you might want to handle locale detection differently
  const validLocale = 'vi'; // default locale

  return {
    locale: validLocale,
    messages: (await import(`../locales/${validLocale}/common.json`)).default
  };
});

export { locales };
