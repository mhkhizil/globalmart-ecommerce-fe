import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SettingPageServerWithSuspense from '@/webpages/setting/SettingPageServer';

interface SettingPageProps {
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
    namespace: 'application.setting.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function SettingPage({ params }: SettingPageProps) {
  return <SettingPageServerWithSuspense />;
}

export default SettingPage;
