import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ShoppingBagServer from '@/webpages/shopping-bag/ShoppingBagServer';

interface ShoppingBagPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // You'll need to add translations for shopping bag in your i18n files
  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.shopping-bag.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ShoppingBagPage({ params }: ShoppingBagPageProps) {
  return <ShoppingBagServer />;
}

export default ShoppingBagPage;
