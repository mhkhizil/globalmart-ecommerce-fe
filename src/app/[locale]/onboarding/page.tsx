'use server';

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import OnboardingPageServerWithSuspense from '@/webpages/onboarding/OnboardingPageServer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'onboarding.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function HomePage() {
  return <OnboardingPageServerWithSuspense />;
}

export default HomePage;
