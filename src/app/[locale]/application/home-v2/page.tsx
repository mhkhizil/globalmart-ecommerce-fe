import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import HomeV2PageServerWithSuspense from '@/webpages/home-v2/Homev2PageServer';

interface HomeV2PageProps {
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
    namespace: 'application.home_v2.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function HomeV2Page({ params }: HomeV2PageProps) {
  return <HomeV2PageServerWithSuspense />;
}

export default HomeV2Page;
