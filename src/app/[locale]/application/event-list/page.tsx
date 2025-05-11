import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import EventListPageServerWithSuspense from '@/webpages/event-list/EventListPageServer';

interface EventListPageProps {
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
    namespace: 'application.EventList.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function EventListPage({ params }: EventListPageProps) {
  return <EventListPageServerWithSuspense />;
}

export default EventListPage;
