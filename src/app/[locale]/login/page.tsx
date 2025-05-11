import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import LoginPageServerWithSuspense from '@/webpages/authentication/login/LoginPageServer';

interface LoginPageProps {
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
    namespace: 'login.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  return <LoginPageServerWithSuspense locale={locale} />;
}

export default LoginPage;
