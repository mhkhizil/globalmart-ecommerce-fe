import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ForgotPasswordPageServerWithSuspense from '@/webpages/authentication/forgot-password/ForgotPasswordPageServer';

interface ForgotPasswordPageProps {
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
    namespace: 'forgot_password.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  return <ForgotPasswordPageServerWithSuspense />;
}

export default ForgotPasswordPage;
