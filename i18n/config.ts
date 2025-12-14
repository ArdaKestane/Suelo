import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tr from './locales/tr.json';

// Turkish is the main language - always default to Turkish
const defaultLocale = 'tr';

// Initialize i18n synchronously - must happen before any components use it
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: defaultLocale,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Force set language to ensure it's Turkish
i18n.changeLanguage(defaultLocale);

export default i18n;
