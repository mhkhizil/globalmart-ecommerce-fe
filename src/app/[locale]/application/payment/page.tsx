import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

// We need to export generateMetadata at the module level
// This is a server component function

interface PaymentPageProps {
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
    namespace: 'application.payment.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function PaymentPage() {
  redirect('/application/customer-payment-selection');
}

export default PaymentPage;
