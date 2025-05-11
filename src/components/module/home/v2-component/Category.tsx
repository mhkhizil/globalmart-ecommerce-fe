import { ChevronDown } from 'lucide-react';

import FilterCategory from './FilterCategory';
import MenuCategory from './MenuCategory';
import OfferCategory from './OfferCategory';
import ShopCategory from './ShopCategory';
import SortCategory from './SortCategory';

function Category() {
  return (
    <div className="flex w-full space-x-4 py-4 overflow-x-auto scrollbar-none flex-shrink-0 ]">
      <FilterCategory />
      <MenuCategory />
      <SortCategory />
      <OfferCategory />
      <ShopCategory />
    </div>
  );
}
export default Category;
