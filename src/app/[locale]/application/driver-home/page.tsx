import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import DriverHomePageServerWithSuspense from '@/webpages/driver-home/DriverHomePageServer';

interface DriverHomePageProps {
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
    namespace: 'application.driver_home.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function DriverHomePage({ params }: DriverHomePageProps) {
  return <DriverHomePageServerWithSuspense />;
}

export default DriverHomePage;
