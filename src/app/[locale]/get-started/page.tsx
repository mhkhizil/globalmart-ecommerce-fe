import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';
import GetStartedPageServerWithSuspense from '@/webpages/get-started/GetStartedPageServer';

interface GetStartedPageProps {
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
    namespace: 'application.get_started.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function GetStartedPage({ params }: GetStartedPageProps) {
  return <GetStartedPageServerWithSuspense />;
}

export default GetStartedPage;
