import { getIronSession } from 'iron-session';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';
import DealOfTheDayPageServerWithSuspense from '@/webpages/deal-of-the-day/DealOfTheDayPageServer';

interface DealOfTheDayPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.deal_of_the_day.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function DealOfTheDayPage({ params }: DealOfTheDayPageProps) {
  return <DealOfTheDayPageServerWithSuspense />;
}

export default DealOfTheDayPage;
