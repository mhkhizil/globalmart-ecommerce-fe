'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';
const IMAGE_FALLBACK_SRC = '/food-fallback.png';

function CategoryList() {
  const { data: categoryList, isLoading } = useGetCategoryList();
  const router = useRouter();
  const t = useTranslations('category-list');
  return (
    <div className="flex w-full flex-col">
      <span className="flex w-full items-center justify-center text-[1.3rem] text-black leading-[1rem] font-[600] mt-[1rem]">
        {t('categories')}
      </span>
      <div className="flex w-full flex-col gap-y-5 py-[2rem] px-[1.5rem]">
        {!isLoading &&
          categoryList?.category.map(currentCategory => {
            return (
              <div
                className="flex w-full items-center justify-start gap-x-3 cursor-pointer hover:bg-[#FE8C00] p-1 group  hover:rounded-[5px]"
                key={currentCategory.id}
                onClick={() => {
                  const params = new URLSearchParams({
                    categoryId: currentCategory.id.toString(),
                  });
                  router.push(`/application/product/list?${params.toString()}`);
                }}
              >
                <div className="flex p-3 border-[1px] rounded-[5px] shadow-md group group-hover:border-[#FE8C00] group-hover:bg-white">
                  <Image
                    src={currentCategory.image || IMAGE_FALLBACK_SRC}
                    alt={currentCategory.name}
                    width={512}
                    height={512}
                    className="size-[3rem] rounded-[5px]"
                  />
                </div>
                <span className="text-black text-[0.9rem] font-serif font-[550] group group-hover:text-white">
                  {currentCategory.name}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default CategoryList;
