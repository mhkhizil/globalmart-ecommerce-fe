'use server';

import { redirect } from 'next/navigation';

import { supportedLocales } from '@/lib/redux/slices/LanguageSlice';

export default async function Home() {
  // Default to 'cn' as the fallback locale
  const locale = 'cn';

  // Redirect to the onboarding page with the determined locale
  redirect(`/${locale}/onboarding`);
}
