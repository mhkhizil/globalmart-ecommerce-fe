import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

function OfferCategory() {
  const t = useTranslations();
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="flex rounded-[15px] px-[1rem] py-[0.2rem] border-[1px] w-fit">
          <span className="text-nowrap">{t('filterCategory.offer')}</span>
          <ChevronDown />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-[430px]">
        <DrawerHeader className="flex w-full flex-col items-start px-[20px] py-[3px]">
          <DrawerTitle className="text-[24px] leading[32px] font-semibold">
            {t('filterCategory.offer')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full pt-0 px-[20px] flex-col">
          {t('filterCategory.offer')}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default OfferCategory;
