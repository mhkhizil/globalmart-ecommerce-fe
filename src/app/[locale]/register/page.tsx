import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import RegisterPageServerWithSuspense from '@/webpages/authentication/register/RegisterPageServer';

interface RegisterPageProps {
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
    namespace: 'register.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function RegisterPage({ params }: RegisterPageProps) {
  return <RegisterPageServerWithSuspense />;
}

export default RegisterPage;
