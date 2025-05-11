import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantRegisterPageServerWithSuspense from '@/webpages/authentication/merchant-register/MerchantRegisterPageServer';

interface MerchantRegisterPageProps {
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
    namespace: 'merchant_register.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantRegisterPage({ params }: MerchantRegisterPageProps) {
  return <MerchantRegisterPageServerWithSuspense />;
}

export default MerchantRegisterPage;
