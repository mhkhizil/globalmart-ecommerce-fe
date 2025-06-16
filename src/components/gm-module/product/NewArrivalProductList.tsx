import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { Product } from '@/core/entity/Product';
import { useGetNewArrivalListInfinite } from '@/lib/hooks/service/product/useGetNewArrivalListInfinite';

import TrendingProductCard from './TrendingProductCard';

// Function to get height variant based on index for staggered layout
const getHeightVariant = (index: number): 'short' | 'tall' => {
  const position = index % 4;
  // Pattern: short, tall, tall, short
  return position === 0 || position === 3 ? 'short' : 'tall';
};

// Function to get grid positioning for staggered layout
const getGridPosition = (index: number) => {
  const groupIndex = Math.floor(index / 4);
  const positionInGroup = index % 4;

  // Base row calculation: each group takes 11 rows (5 + 6 with gap)
  const baseRow = groupIndex * 11 + 1;

  switch (positionInGroup) {
    case 0: {
      // Short, left, top-aligned
      return {
        gridColumn: '1',
        gridRow: `${baseRow} / ${baseRow + 5}`,
      };
    }
    case 1: {
      // Tall, right, top-aligned
      return {
        gridColumn: '2',
        gridRow: `${baseRow} / ${baseRow + 6}`,
      };
    }
    case 2: {
      // Tall, left, fills gap from position 0
      return {
        gridColumn: '1',
        gridRow: `${baseRow + 5} / ${baseRow + 11}`,
      };
    }
    case 3: {
      // Short, right, fills gap from position 1
      return {
        gridColumn: '2',
        gridRow: `${baseRow + 6} / ${baseRow + 11}`,
      };
    }
    default: {
      return {
        gridColumn: '1',
        gridRow: 'auto',
      };
    }
  }
};

function NewArrivalProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL params for sort and filter
  const sortFromUrl = searchParams.get('sort') || 'newest';
  const filterFromUrl = searchParams.get('filter') || '';

  const [sortOption, setSortOption] = useState<string>(sortFromUrl);
  const [filterOptions, setFilterOptions] = useState<number[]>(
    filterFromUrl ? filterFromUrl.split(',').map(Number) : []
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Infinite scrolling setup
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Use infinite query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetNewArrivalListInfinite({
    per_page: 2,
  });

  // Flatten all pages into a single array of products
  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(
      page => (page as ProductListResponseDto).products || []
    );
  }, [data]);

  // Load more when scroll trigger is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Update URL when sort/filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (sortOption !== 'newest') {
      params.set('sort', sortOption);
    }
    if (filterOptions.length > 0) {
      params.set('filter', filterOptions.join(','));
    }

    const parameterString = params.toString();
    const newUrl = parameterString
      ? `${globalThis.location.pathname}?${parameterString}`
      : globalThis.location.pathname;

    // Only update URL if it's different to avoid unnecessary history changes
    if (globalThis.location.href !== globalThis.location.origin + newUrl) {
      globalThis.history.replaceState({}, '', newUrl);
    }
  }, [sortOption, filterOptions]);

  // Sync state with URL params on mount and when searchParams change
  useEffect(() => {
    const sortFromUrl = searchParams.get('sort') || 'newest';
    const filterFromUrl = searchParams.get('filter') || '';

    setSortOption(sortFromUrl);
    setFilterOptions(filterFromUrl ? filterFromUrl.split(',').map(Number) : []);
  }, [searchParams]);

  // Sort handler
  const handleSortSelect = useCallback((selectedSort: string) => {
    setSortOption(selectedSort);
    setSortOpen(false);
  }, []);

  // Filter handlers
  const handleFilterReset = useCallback(() => {
    setFilterOptions([]);
    setFilterOpen(false);
  }, []);

  const handleFilterApply = useCallback(() => {
    setFilterOpen(false);
  }, []);

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
      router.push(`/application/new-arrival?${params.toString()}`);
    },
    [router]
  );
  return (
    <div>
      {' '}
      {/* Sort and Filter */}
      <div className="flex w-full flex-col items-start justify-center">
        <div className="flex w-full justify-between items-center mb-4 pr-4">
          <h1 className="text-lg font-semibold font-['Montserrat']">
            {allProducts.length > 0 ? `${allProducts.length}+ Items` : 'Items'}
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
                  <div className="space-y-4">{'sort options'}</div>
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
                    {'filter options'}
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
      {/* New Arrival Product List */}
      <div className="w-full">
        {/* Loading state for initial load */}
        {isLoading && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gridAutoRows: '50px',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const gridPos = getGridPosition(index);
              const contentHeight = 120;
              const imageHeight =
                getHeightVariant(index) === 'short' ? 160 : 220;
              const cardHeight = imageHeight + contentHeight;

              return (
                <div
                  key={index}
                  className="w-full bg-white rounded-[8px] shadow-sm overflow-hidden animate-pulse flex flex-col"
                  style={{
                    boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
                    height: `${cardHeight}px`,
                    gridColumn: gridPos.gridColumn,
                    gridRow: gridPos.gridRow,
                  }}
                >
                  <div
                    className="w-full bg-gray-200 flex-shrink-0"
                    style={{
                      height: `${imageHeight}px`,
                    }}
                  />
                  <div
                    className="px-2 pt-2 space-y-2 flex flex-col"
                    style={{ height: `${contentHeight}px` }}
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="flex justify-between items-center mt-auto flex-shrink-0">
                      <div className="flex gap-0">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <div
                            key={starIndex}
                            className="w-[14px] h-[14px] bg-gray-200 rounded-sm"
                          />
                        ))}
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-8" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-4 py-8 text-center">
            <p className="text-red-500 text-sm">
              Failed to load products. Please try again.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && allProducts.length > 0 && (
          <div className="w-full">
            {/* Products Grid */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: '1fr 1fr',
                gridAutoRows: '50px',
              }}
            >
              {allProducts.map((product: Product, index: number) => {
                const gridPos = getGridPosition(index);
                return (
                  <div
                    key={`${product.id}-${index}`}
                    style={{
                      gridColumn: gridPos.gridColumn,
                      gridRow: gridPos.gridRow,
                    }}
                  >
                    <TrendingProductCard
                      product={product}
                      index={index}
                      heightVariant={getHeightVariant(index)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Loading more indicator */}
            {isFetchingNextPage && (
              <div
                className="grid gap-4 mt-6"
                style={{
                  gridTemplateColumns: '1fr 1fr',
                  gridAutoRows: '50px',
                }}
              >
                {Array.from({ length: 4 }).map((_, index) => {
                  const loadingIndex = allProducts.length + index;
                  const gridPos = getGridPosition(loadingIndex);
                  const contentHeight = 120;
                  const imageHeight =
                    getHeightVariant(loadingIndex) === 'short' ? 160 : 220;
                  const cardHeight = imageHeight + contentHeight;

                  return (
                    <div
                      key={`loading-${index}`}
                      className="w-full bg-white rounded-[8px] shadow-sm overflow-hidden animate-pulse flex flex-col"
                      style={{
                        boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
                        height: `${cardHeight}px`,
                        gridColumn: gridPos.gridColumn,
                        gridRow: gridPos.gridRow,
                      }}
                    >
                      <div
                        className="w-full bg-gray-200 flex-shrink-0"
                        style={{
                          height: `${imageHeight}px`,
                        }}
                      />
                      <div
                        className="px-2 pt-2 space-y-2 flex flex-col"
                        style={{ height: `${contentHeight}px` }}
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="flex justify-between items-center mt-auto flex-shrink-0">
                          <div className="flex gap-0">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <div
                                key={starIndex}
                                className="w-[14px] h-[14px] bg-gray-200 rounded-sm"
                              />
                            ))}
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-8" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div
              ref={loadMoreRef}
              className="h-10 flex items-center justify-center mt-4"
            >
              {hasNextPage && !isFetchingNextPage && (
                <div className="text-sm text-gray-500">Loading more...</div>
              )}
            </div>
          </div>
        )}

        {/* No products state */}
        {!isLoading && !error && allProducts.length === 0 && (
          <div className="px-4 py-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-gray-400">📦</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewArrivalProductList;
