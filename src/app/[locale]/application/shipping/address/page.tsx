import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ShippingAddress from '@/components/module/shipping/ShippingAddress';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'shipping.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

export default function ShippingAddressPage() {
  return <ShippingAddress />;
}
