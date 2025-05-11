import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ResetPasswordPageServerWithSuspense from '@/webpages/authentication/reset-password/ResetPasswordPageServer';

interface ResetPasswordPageProps {
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
    namespace: 'reset_password.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return <ResetPasswordPageServerWithSuspense />;
}

export default ResetPasswordPage;
