import Link from 'next/link';
import { useTranslations } from 'next-intl';

import PromotionIcon from '@/components/common/icons/PromotionIcon';
import { useGetPromoList } from '@/lib/hooks/service/promotion/useGetPromoList';

import PromotionList from './PromotionList';

function Promotion() {
  const t = useTranslations();

  // Fetch promotion data once at this level
  const { data, isLoading, error } = useGetPromoList({ type: 'promo' });

  // If loading, show a loading skeleton
  if (isLoading) {
    return (
      <div className="flex w-full flex-col px-[0.8rem] mt-1 animate-pulse h-12">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  // If no promotions available, don't show the section
  if (!data || !data.promotion || data.promotion.length <= 0) {
    return;
  }

  return (
    <div className="flex w-full flex-col px-[0.8rem] mt-1">
      <div className="flex w-full items-center gap-x-[1.5px] mb-[1px]">
        <div className="">
          <PromotionIcon />
        </div>
        <div className="flex-shrink-0 text-[#202020] text-[1rem] leading-[1.5] font-[700]">
          {t('home.promotional')}
        </div>
        <div className="flex w-full justify-end underline text-[#FE8C00] font-[600] text-[0.813rem] leading-[1.219rem]">
          <Link href={'#'}>{t('home.more')}</Link>
        </div>
      </div>
      <div className="flex w-full">
        <PromotionList
          promotions={data.promotion}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
export default Promotion;
