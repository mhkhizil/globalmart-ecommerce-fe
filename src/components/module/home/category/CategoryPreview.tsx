'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';

import CategoryCard from './CategoryCard';
const IMAGE_FALLBACK_SRC = '/food-fallback.png';

function CategoryPreview() {
  const { data: categoryList, isLoading } = useGetCategoryList();
  const router = useRouter();
  const t = useTranslations();
  return (
    <div className="flex w-full flex-col mt-[0.5rem] px-[0.8rem] ">
      <div className="flex w-full items-center">
        <div className="flex-shrink-0 text-[#101010] text-[1rem] leading-[1.5rem] font-semibold">
          {t('home.findByCategory')}
        </div>

        <div className="flex w-full justify-end text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[500] ">
          <span
            onClick={() => router.push('/application/category-list')}
            className="cursor-pointer"
          >
            {t('home.seeAll')}
          </span>
        </div>
      </div>
      <div className="flex w-full justify-start overflow-x-auto scrollbar-none gap-x-[0.5rem] items-center mt-1">
        {!isLoading &&
          categoryList?.category.map(category => {
            return (
              <div
                className="flex min-w-[5rem] w-[5rem] rounded-[0.5rem] "
                key={category.id}
                onClick={() => {
                  const params = new URLSearchParams({
                    categoryId: category.id.toString(),
                  });
                  router.push(`/application/product/list?${params.toString()}`);
                }}
              >
                <CategoryCard
                  imageUrl={category.image || IMAGE_FALLBACK_SRC}
                  name={category.name}
                />
              </div>
            );
          })}
      </div>
      <div className="flex w-full"></div>
    </div>
  );
}
export default CategoryPreview;
