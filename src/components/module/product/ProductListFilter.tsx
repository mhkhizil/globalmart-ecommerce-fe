import { useCallback, useMemo } from 'react';

import FilterCategory from '../home/v2-component/FilterCategory';
import MenuCategory from '../home/v2-component/MenuCategory';
import OfferCategory from '../home/v2-component/OfferCategory';
import ShopCategory from '../home/v2-component/ShopCategory';
import SortCategory from '../home/v2-component/SortCategory';

interface FilterState {
  categoryIds: number[];
  shopIds: number[];
}

interface InputProps {
  defaultCategories: number[];
  defaultShops: number[];
  onApplyFilters: (filterState: FilterState) => void;
}

function ProductListFilter(props: InputProps) {
  const { onApplyFilters, defaultCategories, defaultShops } = props;

  // Wrap the filter state in useMemo to prevent recreation on every render
  const currentFilterState = useMemo(
    () => ({
      categoryIds: defaultCategories,
      shopIds: defaultShops,
    }),
    [defaultCategories, defaultShops]
  );

  const handleCategoryFilterApply = useCallback(
    (selectedCategories: number[]) => {
      onApplyFilters({
        ...currentFilterState,
        categoryIds: selectedCategories,
      });
    },
    [onApplyFilters, currentFilterState]
  );

  const handleShopFilterApply = useCallback(
    (selectedShops: number[]) => {
      onApplyFilters({
        ...currentFilterState,
        shopIds: selectedShops,
      });
    },
    [onApplyFilters, currentFilterState]
  );

  return (
    <div className="flex w-full space-x-4 py-4 overflow-x-auto flex-shrink-0">
      <FilterCategory
        onApply={handleCategoryFilterApply}
        defaultCateogories={defaultCategories}
      />
      {/* <MenuCategory /> */}
      <SortCategory />
      <OfferCategory />
      <ShopCategory
        onApply={handleShopFilterApply}
        defaultCateogories={defaultShops}
      />
    </div>
  );
}
export default ProductListFilter;
