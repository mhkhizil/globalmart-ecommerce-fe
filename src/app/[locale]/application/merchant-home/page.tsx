import { getIronSession } from 'iron-session';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';
import MerchantHomePageServerWithSuspense from '@/webpages/merchant-home/MerchantHomePageServer';

interface MerchantShopListPageProps {
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
    namespace: 'application.merchant_home.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantShopListPage({ params }: MerchantShopListPageProps) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return (
    <MerchantHomePageServerWithSuspense
      merchant_id={session?.user?.user?.merchant_id}
    />
  );
}

export default MerchantShopListPage;
