'use client';

import SearchBar from '../common/SearchBar';
import HomeNav from '../home/HomeNav';
import TrendingProductList from './TrendingProductList';

function TrendingProduct() {
  return (
    <div className="flex w-full flex-col pt-4 px-4 space-y-5">
      <HomeNav />
      <SearchBar />
      <TrendingProductList />
    </div>
  );
}

export default TrendingProduct;
