import { Locale, supportedLocales } from './redux/slices/LanguageSlice';

export const isValidLocale = (locale: string): locale is Locale => {
  return supportedLocales.includes(locale as Locale);
};

export const getLanguageName = (locale: Locale): string => {
  const names: Record<Locale, string> = {
    en: 'English',
    cn: '中文',
    mm: 'မြန်မာ',
    th: 'ไทย',
  };
  return names[locale];
};
