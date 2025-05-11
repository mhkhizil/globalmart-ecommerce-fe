import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useGetAllShops } from '@/lib/hooks/service/shop/useGetAllShops';

interface InputProps {
  defaultCateogories?: number[];
  onApply?: (categories: number[]) => void;
}

function ShopCategory(props: InputProps) {
  const t = useTranslations();
  const { onApply, defaultCateogories } = props;
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    defaultCateogories ?? []
  );
  const { data: shopsData, isLoading } = useGetAllShops();
  const [open, setOpen] = useState(false);
  // Toggle category selection based on checkbox change.
  const handleCheckboxChange = (shopId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories(previous => [...previous, shopId]);
    } else {
      setSelectedCategories(previous => previous.filter(id => id !== shopId));
    }
  };

  // Reset selected categories.
  const handleReset = () => {
    setSelectedCategories([]);
  };

  // Send selected categories back to the parent.
  const handleApply = () => {
    onApply?.(selectedCategories);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className="flex rounded-[15px] px-[1rem] py-[0.2rem] border-[1px] w-fit">
          <span className="text-nowrap">{t('filterCategory.shop')}</span>
          <ChevronDown />
        </div>
      </DrawerTrigger>
      <DrawerContent className="w-full h-[70dvh] flex flex-col">
        <DrawerHeader className="flex w-full flex-col items-start px-[20px] py-[3px]">
          <DrawerTitle className="text-[24px] leading[32px] font-semibold">
            {t('filterCategory.shop')}
          </DrawerTitle>
        </DrawerHeader>

        {/* Scrollable Categories Section */}
        <div className="flex-1 overflow-y-auto px-[20px]">
          <div className="flex w-full pt-0 flex-col">
            {!isLoading &&
              shopsData?.shops.map((shop, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between py-[1rem]"
                >
                  <span>{shop.name}</span>
                  <Checkbox
                    // Ensure the checkbox reflects the current state.
                    checked={selectedCategories.includes(shop.id)}
                    className="data-[state=checked]:border-gray-100"
                    onCheckedChange={checked =>
                      handleCheckboxChange(shop.id, Boolean(checked))
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Sticky Bottom Buttons */}
        <div className="sticky bottom-0 bg-background border-t p-4 flex justify-between gap-4">
          <button
            className="flex-1 py-2 px-4 rounded-lg border hover:bg-gray-100"
            onClick={handleReset}
          >
            {t('filterCategory.reset')}
          </button>
          <button
            className="flex-1 py-2 bg-[#FE8C00] text-white px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleApply}
          >
            {t('filterCategory.apply')}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default ShopCategory;
