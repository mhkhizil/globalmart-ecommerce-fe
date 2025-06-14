import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import EmailVerifiedSuccessPageServerWithSuspense from '@/webpages/authentication/email-verified-success/EmailVerifiedSuccessPageServer';

interface EmailVerifiedSuccessPageProps {
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
    namespace: 'application.EmailVerifiedSuccess.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function EmailVerifiedSuccessPage({
  params,
}: EmailVerifiedSuccessPageProps) {
  return <EmailVerifiedSuccessPageServerWithSuspense />;
}

export default EmailVerifiedSuccessPage;
