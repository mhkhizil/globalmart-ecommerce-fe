import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import EventDetailPageServerWithSuspense from '@/webpages/event-detail/EventDetailPageServer';

interface IPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.event_detail.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function EventDetailPage(props: IPageProps) {
  const { id } = await props.params;

  return <EventDetailPageServerWithSuspense id={id} />;
}

export default EventDetailPage;
