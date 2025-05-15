'use client';

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
import { useGetCategoryList } from '@/lib/hooks/service/category/useGetCategoryList';

import CategoryCircleCard from './CategoryCircleCard';

interface FilterState {
  categoryIds: number[];
  sortOption: string;
}

interface CategoryPreviewProps {
  defaultCategories?: number[];
  defaultSortOption?: string;
  onApplyFilters?: (filterState: FilterState) => void;
}

const FALLBACK_IMAGE = '/food-fallback.png';

function CategoryPreview({
  defaultCategories = [],
  defaultSortOption = 'newest',
  onApplyFilters,
}: CategoryPreviewProps) {
  const router = useRouter();
  const { data: categoryList, isLoading } = useGetCategoryList();
  const [sortOption, setSortOption] = useState<string>(defaultSortOption);
  const [filterOptions, setFilterOptions] =
    useState<number[]>(defaultCategories);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

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
    <>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="flex flex-col w-full">
        {/* Filter */}
        <div className="flex justify-between items-center mb-4 pr-4">
          <h1 className="text-lg font-semibold font-['Montserrat']">
            All Featured
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

        {/* Category List */}
        <div className="bg-white p-2 rounded-[10px] shadow-sm">
          <div className="flex overflow-x-auto gap-4 hide-scrollbar">
            {!isLoading &&
              categoryList?.category.map(category => (
                <div
                  key={category.id}
                  className="flex-shrink-0"
                  //   style={{ width: '96px' }}
                >
                  <CategoryCircleCard
                    imageUrl={category.image || FALLBACK_IMAGE}
                    name={category.name}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                </div>
              ))}

            {isLoading &&
              Array.from({ length: 6 })
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: '96px' }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-2"></div>
                      <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}

            {/* Show empty state if no categories */}
            {!isLoading &&
              (!categoryList?.category ||
                categoryList.category.length <= 0) && (
                <div className="w-full py-8 text-center text-gray-500">
                  No categories available
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryPreview;
