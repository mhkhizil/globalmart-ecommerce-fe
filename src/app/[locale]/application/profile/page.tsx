import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ProfilePageServerWithSuspense from '@/webpages/profile/ProfilePageServer';

interface ProfilePageProps {
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
    namespace: 'application.profile.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ProfilePage({ params }: ProfilePageProps) {
  return <ProfilePageServerWithSuspense />;
}

export default ProfilePage;
