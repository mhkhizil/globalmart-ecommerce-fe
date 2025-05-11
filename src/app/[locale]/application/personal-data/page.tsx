import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PersonalDataPageServerWithSuspense from '@/webpages/personal-data/PersonalDataPageServer';

interface PersonalDataPageProps {
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
    namespace: 'application.personal_data.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function PersonalDataPage({ params }: PersonalDataPageProps) {
  return <PersonalDataPageServerWithSuspense />;
}

export default PersonalDataPage;
