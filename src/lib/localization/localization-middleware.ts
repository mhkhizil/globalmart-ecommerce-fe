import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

import { i18n, validateLocale } from './locale';

async function getUserPreferredLanguageFromDatabase(userId: string) {
  //TODO: get user preferred language from database and return
  return 'en';
}

function getUserPreferredLanguageFromUrl(request: NextRequest) {
  const headers = {
    'accept-language': request.headers.get('accept-language') ?? '',
  };
  const languages = new Negotiator({ headers }).languages();
  return validateLocale(languages);
}

export function localizationMiddleware(request: NextRequest) {
  const userId = request.cookies.get('userId');
  const locale = getUserPreferredLanguageFromUrl(request);
  const { pathname } = request.nextUrl;

  const pathHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );
  if (pathHasLocale) {
    return;
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
