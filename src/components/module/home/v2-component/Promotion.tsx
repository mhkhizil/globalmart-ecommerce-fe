import BackIcon from '@/components/common/icons/BackIcon';

import PromotionCard from '../promotion/PromotionCard';

function Promotion() {
  return (
    <div className="flex flex-col w-full mt-[1.5rem]">
      <div className="flex w-full items-center justify-between px-[1.2rem]">
        <span className="text-[1rem] font-[600] leading-[1.8rem]">
          Today&apos;s Offers
        </span>
        <BackIcon className="rotate-180" />
      </div>
      <div className="flex w-full space-x-4 p-4 scrollbar-none overflow-x-auto">
        <PromotionCard
          imageUrl={
            'https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabu3sRg8vaEbKSZGzHiWI4JoUPBayFmX8Cc576'
          }
          name="Combo Burgur King"
          className="w-[90dvw] sm:w-[380px] flex-shrink-0"
          p_id={1}
        />
        <PromotionCard
          imageUrl={
            'https://eiee6dhaa8.ufs.sh/f/4PbNtc78sfabfiUCXZwQCdNc2WXxOiF8RLjDuTGkYs7zZytB'
          }
          name="Combo Burgur King"
          className="w-[90dvw] sm:w-[380px] flex-shrink-0"
          p_id={2}
        />
      </div>
    </div>
  );
}
export default Promotion;
