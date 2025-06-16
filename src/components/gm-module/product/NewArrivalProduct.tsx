'use client';

import SearchBar from '../common/SearchBar';
import HomeNav from '../home/HomeNav';
import NewArrivalProductList from './NewArrivalProductList';

function NewArrivalProduct() {
  return (
    <div className="flex w-full flex-col pt-4 px-4 space-y-5">
      <HomeNav />
      <SearchBar />
      <NewArrivalProductList />
    </div>
  );
}

export default NewArrivalProduct;
