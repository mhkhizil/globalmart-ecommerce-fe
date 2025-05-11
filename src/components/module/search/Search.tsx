'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import BackIcon from '@/components/common/icons/BackIcon';

import RecentSearchList from './RecentSearchList';
import SearchInputWithSuggestion from './SearchInputWithSuggestion';

function Search() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      <div className="flex relative w-full mt-[20px] items-center justify-center px-[1.5rem]">
        <div className="absolute left-2">
          <button onClick={() => router.back()} aria-label={t('common.back')}>
            <BackIcon />
          </button>
        </div>
        <div className="">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {t('search.searchFood')}
          </span>
        </div>
      </div>
      <SearchInputWithSuggestion />
      <RecentSearchList />
    </div>
  );
}
export default Search;
