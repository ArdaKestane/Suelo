import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lang: 'tr' | 'en') => {
    i18n.changeLanguage(lang);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language as 'tr' | 'en',
  };
}
