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
import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';
interface InputProps {
  defaultCateogories?: number[];
  onApply?: (categories: number[]) => void;
}

function FilterCategory(props: InputProps) {
  const { onApply, defaultCateogories } = props;
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    defaultCateogories ?? []
  );
  const { data: categoryList, isLoading } = useGetCategoryList();
  const [open, setOpen] = useState(false);
  // Toggle category selection based on checkbox change.
  const handleCheckboxChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories(previous => [...previous, categoryId]);
    } else {
      setSelectedCategories(previous =>
        previous.filter(name => name !== categoryId)
      );
    }
  };

  const t = useTranslations();

  // Reset selected categories.
  const handleReset = () => {
    setSelectedCategories([]);
    onApply?.([]);
    setOpen(false);
  };

  // Send selected categories back to the parent.
  const handleApply = () => {
    onApply?.(selectedCategories);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className="rounded-[15px] px-[1rem] py-[0.2rem] border-[1px] w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </div>
      </DrawerTrigger>
      <DrawerContent className="w-full h-[70dvh] flex flex-col">
        <DrawerHeader className="flex w-full flex-col items-start px-[20px] py-[3px]">
          <DrawerTitle className="text-[24px] leading[32px] font-semibold">
            {t('filterCategory.selectFilter')}
          </DrawerTitle>
        </DrawerHeader>

        {/* Scrollable Categories Section */}
        <div className="flex-1 overflow-y-auto px-[20px]">
          <div className="flex w-full pt-0 flex-col">
            {!isLoading &&
              categoryList?.category.map((currentCategory, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between py-[1rem]"
                >
                  <span>{currentCategory.name}</span>
                  <Checkbox
                    // Ensure the checkbox reflects the current state.
                    checked={selectedCategories.includes(currentCategory.id)}
                    className="data-[state=checked]:border-gray-100"
                    onCheckedChange={checked =>
                      handleCheckboxChange(currentCategory.id, Boolean(checked))
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

export default FilterCategory;
