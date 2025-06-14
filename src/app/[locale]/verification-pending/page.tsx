import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import VerificationPending from '@/components/module/auth/VerificationPending';

interface VerificationPendingPageProps {
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
    namespace: 'auth.verification',
  });

  return {
    title: t('title', { defaultValue: 'Email Verification Required' }),
    description: t('description', {
      defaultValue: 'Please verify your email address to continue',
    }),
  };
}

export default function VerificationPendingPage() {
  return <VerificationPending />;
}
