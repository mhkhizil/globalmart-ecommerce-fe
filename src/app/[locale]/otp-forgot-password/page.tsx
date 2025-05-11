import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import OtpPageServerWithSuspense from '@/webpages/authentication/otp/OtpPageServer';

interface IPageProps {
  searchParams: Promise<{ email: string }>;
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
    namespace: 'otp_forgot_password.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function OtpPage(props: IPageProps) {
  const { email } = await props.searchParams;
  return <OtpPageServerWithSuspense email={email} />;
}

export default OtpPage;
