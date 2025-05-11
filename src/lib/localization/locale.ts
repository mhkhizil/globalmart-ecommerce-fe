import { match } from '@formatjs/intl-localematcher';

export const i18n = {
  defaultLocale: 'cn',
  locales: ['en', 'cn', 'mm', 'th'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export function validateLocale(userLocale: string[]) {
  return match(userLocale, i18n.locales, i18n.defaultLocale);
}
