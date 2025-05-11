import { useTranslations } from 'next-intl';

function RecentSearchList() {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col px-[1rem]">
      <div className="flex w-full items-center justify-between">
        <span className="text-[#101010] text-[1rem] leading-[1.5rem] font-[600]">
          {t('search.recentSearches')}
        </span>
        <button
          className="text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[500]"
          aria-label={t('search.deleteRecentSearches')}
        >
          {t('common.delete')}
        </button>
      </div>
    </div>
  );
}
export default RecentSearchList;
