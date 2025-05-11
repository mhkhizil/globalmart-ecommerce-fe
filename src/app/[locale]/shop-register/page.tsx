import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantProfileRegisterPageServerWithSuspense from '@/webpages/authentication/merchant-profile-register/MerchantProfileRegisterPageServer';

interface MerchantProfileRegisterPageProps {
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
    namespace: 'shop_register.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantProfileRegisterPage({
  params,
}: MerchantProfileRegisterPageProps) {
  return <MerchantProfileRegisterPageServerWithSuspense />;
}

export default MerchantProfileRegisterPage;
