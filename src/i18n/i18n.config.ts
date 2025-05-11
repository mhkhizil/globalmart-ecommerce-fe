export type Locale = (typeof locales)[number];

export const locales = ['en', 'cn', 'mm', 'th'] as const;
export const defaultLocale: Locale = 'cn';
