import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import RegisterDriverPageServerWithSuspense from '@/webpages/register-driver/RegisterDriverServer';

interface RegisterDriverPageProps {
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
    namespace: 'application.register_driver.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function RegisterDriverPage({ params }: RegisterDriverPageProps) {
  return <RegisterDriverPageServerWithSuspense />;
}

export default RegisterDriverPage;
