import { Locale } from '../localization/locale';

declare module 'next-intl' {
  interface CustomTranslations {
    welcome: string;
    title: string;
    switchLanguage: string;
  }
}

declare module 'next/navigation' {
  export interface NextRouter {
    locale: Locale;
  }
}
