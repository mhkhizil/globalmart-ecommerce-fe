'use client';

import SearchBar from '@/components/gm-module/common/SearchBar';

import CategoryPreview from '../category/CategoryPreview';
import ProductPreviewList from '../product/ProductPreviewList';
import PromotionList from '../promotion/PromotionList';
import DealOfTheDay from './DealOfTheDay';
import SpecialOffers from './SpecialOffers';
import TrendingProducts from './TrendingProducts';

function Home() {
  return (
    <div className="flex w-full flex-col h-full scrollbar-none overflow-y-auto pb-2 px-4 space-y-5">
      <SearchBar />
      <CategoryPreview />
      <PromotionList />
      <div className="flex w-full">
        <DealOfTheDay />
      </div>
      <div className="flex w-full">
        <SpecialOffers />
      </div>
      <div className="flex w-full">
        <ProductPreviewList />
      </div>
      <div className="flex w-full">
        <TrendingProducts />
      </div>
    </div>
  );
}
export default Home;
