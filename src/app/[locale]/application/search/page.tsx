import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SearchPageServerWithSuspense from '@/webpages/search/SearchPageServer';

interface SearchPageProps {
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
    namespace: 'application.search.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function SearchPage({ params }: SearchPageProps) {
  return <SearchPageServerWithSuspense />;
}

export default SearchPage;
