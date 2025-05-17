'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useGetProductByMerchantId } from '@/lib/hooks/service/product/useGetProductByMerchantId';

import ProductCard from './ProductCard';

// Custom SVG component for Review Icon
const ReviewIcon = () => (
  <div className="relative w-6 h-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_1_7510)">
        <path
          d="M2.52998 19.65L3.86998 20.21V11.18L1.43998 17.04C1.02998 18.06 1.51998 19.23 2.52998 19.65ZM22.03 15.95L17.07 3.98C16.76 3.23 16.03 2.77 15.26 2.75C15 2.75 14.73 2.79 14.47 2.9L7.09998 5.95C6.34998 6.26 5.88998 6.98 5.86998 7.75C5.85998 8.02 5.90998 8.29 6.01998 8.55L10.98 20.52C11.29 21.28 12.03 21.74 12.81 21.75C13.07 21.75 13.33 21.7 13.58 21.6L20.94 18.55C21.96 18.13 22.45 16.96 22.03 15.95ZM12.83 19.75L7.86998 7.79L15.22 4.75H15.23L20.18 16.7L12.83 19.75Z"
          fill="#323232"
        />
        <path
          d="M11 10C11.5523 10 12 9.55228 12 9C12 8.44772 11.5523 8 11 8C10.4477 8 10 8.44772 10 9C10 9.55228 10.4477 10 11 10Z"
          fill="#323232"
        />
        <path
          d="M5.88 19.75C5.88 20.85 6.78 21.75 7.88 21.75H9.33L5.88 13.41V19.75Z"
          fill="#323232"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_7510">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
);

// Custom SVG component for View Similar Icon
const ViewSimilarIcon = () => (
  <div className="relative w-6 h-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_1_7507)">
        <path
          d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C19.17 15.37 15.8 17.5 12 17.5C8.2 17.5 4.83 15.37 3.18 12C4.83 8.63 8.21 6.5 12 6.5ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5ZM12 7.5C9.52 7.5 7.5 9.52 7.5 12C7.5 14.48 9.52 16.5 12 16.5C14.48 16.5 16.5 14.48 16.5 12C16.5 9.52 14.48 7.5 12 7.5Z"
          fill="#232327"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_7507">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
);

interface FilterState {
  categoryIds: number[];
  sortOption: string;
}

interface ProductActionProps {
  onViewSimilar?: () => void;
  onReviews?: () => void;
  defaultCategories?: number[];
  defaultSortOption?: string;
  onApplyFilters?: (filterState: FilterState) => void;
  merchantId: number;
}

export default function ProductAction({
  onViewSimilar,
  onReviews,
  defaultCategories = [],
  defaultSortOption = 'newest',
  onApplyFilters,
  merchantId,
}: ProductActionProps) {
  const router = useRouter();
  const [sortOption, setSortOption] = useState<string>(defaultSortOption);
  const [filterOptions, setFilterOptions] =
    useState<number[]>(defaultCategories);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const { data: products } = useGetProductByMerchantId({
    merchant_id: merchantId.toString(),
    page: 1,
    per_page: 10,
  });

  const sortOptions = [
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
    { id: 'price_high_to_low', label: 'Price: High to Low' },
    { id: 'price_low_to_high', label: 'Price: Low to High' },
  ];

  const filterCategories = [
    { id: 1, label: 'Category 1' },
    { id: 2, label: 'Category 2' },
    { id: 3, label: 'Category 3' },
    { id: 4, label: 'Category 4' },
  ];

  // Sort handler
  const handleSortSelect = useCallback(
    (selectedSort: string) => {
      setSortOption(selectedSort);
      setSortOpen(false);

      onApplyFilters?.({
        categoryIds: filterOptions,
        sortOption: selectedSort,
      });
    },
    [filterOptions, onApplyFilters]
  );

  // Filter handlers
  const handleFilterReset = useCallback(() => {
    setFilterOptions([]);
    setFilterOpen(false);

    onApplyFilters?.({
      categoryIds: [],
      sortOption,
    });
  }, [sortOption, onApplyFilters]);

  const handleFilterApply = useCallback(() => {
    setFilterOpen(false);

    onApplyFilters?.({
      categoryIds: filterOptions,
      sortOption,
    });
  }, [filterOptions, sortOption, onApplyFilters]);

  // Toggle category selection
  const handleCategoryChange = useCallback(
    (categoryId: number, checked: boolean) => {
      if (checked) {
        setFilterOptions(previous => [...previous, categoryId]);
      } else {
        setFilterOptions(previous => previous.filter(id => id !== categoryId));
      }
    },
    []
  );

  // Handle category card click
  const handleCategoryClick = useCallback(
    (categoryId: number) => {
      const params = new URLSearchParams({
        categoryId: categoryId.toString(),
      });
      router.push(`/application/product/list?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="w-full">
      <div className="flex w-full mb-6 justify-between gap-x-1">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onViewSimilar}
          className="flex-1 h-[50px] bg-white border border-[#D9D9D9] rounded-lg flex items-center justify-center gap-2 px-4 py-1"
        >
          <ViewSimilarIcon />
          <span className="text-[14px] font-medium text-black font-['Montserrat']">
            View Similar
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onReviews}
          className="flex-1 h-[50px] bg-white border border-[#D9D9D9] rounded-lg flex items-center justify-center gap-2 px-4 py-1"
        >
          <ReviewIcon />
          <span className="text-[14px] font-medium text-[#232327] font-['Montserrat']">
            Reviews
          </span>
        </motion.button>
      </div>

      {/* Sort and Filter */}
      <div className="flex w-full flex-col items-start justify-center">
        <span className="text-[20px] font-semibold text-[#232327] font-['Montserrat']">
          Similar To
        </span>
        <div className="flex w-full justify-between items-center mb-4 pr-4">
          <h1 className="text-lg font-semibold font-['Montserrat']">
            282+ Iteams
          </h1>
          <div className="flex gap-2">
            {/* Sort Button */}
            <Drawer open={sortOpen} onOpenChange={setSortOpen}>
              <DrawerTrigger asChild>
                <div className="flex items-center gap-1 bg-white font-['Montserrat'] font-[400] rounded-md px-2 py-1 shadow-[1px_1px_16px_0px_rgba(0,0,0,0.08)] cursor-pointer">
                  <span className="text-sm">Sort</span>
                  <div className="flex flex-col items-center">
                    <img
                      src="/icons/sort-icon-2.svg"
                      alt="Sort"
                      className="w-3 h-3"
                    />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="px-4">
                <DrawerHeader>
                  <DrawerTitle className="text-lg font-semibold">
                    Sort
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <div className="space-y-4">
                    {sortOptions.map(option => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => handleSortSelect(option.id)}
                      >
                        <span>{option.label}</span>
                        <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                          {sortOption === option.id && (
                            <div className="w-3 h-3 rounded-full bg-black"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Filter Button */}
            <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
              <DrawerTrigger asChild>
                <div className="flex items-center gap-1 bg-white font-['Montserrat'] font-[400] text-[12px] rounded-md px-2 py-1 shadow-[1px_1px_16px_0px_rgba(0,0,0,0.08)] cursor-pointer">
                  <span className="text-sm">Filter</span>
                  <div className="flex items-center">
                    <img
                      src="/icons/filter-icon-1.svg"
                      alt="Filter"
                      className="w-3 h-3"
                    />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="w-full h-[70dvh] flex flex-col">
                <DrawerHeader className="px-4 py-2">
                  <DrawerTitle className="text-lg font-semibold">
                    Filter
                  </DrawerTitle>
                </DrawerHeader>

                {/* Scrollable Categories Section */}
                <div className="flex-1 overflow-y-auto px-4">
                  <div className="flex w-full pt-0 flex-col">
                    {filterCategories.map(category => (
                      <div
                        key={category.id}
                        className="flex w-full items-center justify-between py-3"
                      >
                        <span>{category.label}</span>
                        <Checkbox
                          checked={filterOptions.includes(category.id)}
                          className="data-[state=checked]:border-gray-100"
                          onCheckedChange={checked =>
                            handleCategoryChange(category.id, Boolean(checked))
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
                    onClick={handleFilterReset}
                  >
                    Reset
                  </button>
                  <button
                    className="flex-1 py-2 bg-[#FE8C00] text-white px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleFilterApply}
                  >
                    Apply
                  </button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Similar Product List */}
      <div className="flex w-full flex-1 gap-x-4 overflow-x-auto">
        {products?.product.map((product: any) => (
          <div key={product.id}>
            <ProductCard product={product} showRating />
          </div>
        ))}
      </div>
    </div>
  );
}
