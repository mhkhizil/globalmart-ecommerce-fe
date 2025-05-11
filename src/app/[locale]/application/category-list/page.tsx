import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CategoryListPageServerWithSuspense from '@/webpages/category-list/CategoryListPageServer';

interface CategoryListPageProps {
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
    namespace: 'application.category_list.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function CategoryListPage({ params }: CategoryListPageProps) {
  return <CategoryListPageServerWithSuspense />;
}

export default CategoryListPage;
