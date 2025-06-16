'use client';

import SearchBar from '../common/SearchBar';
import HomeNav from '../home/HomeNav';
import DealOfTheDayList from './DealOfTheDayList';

function DealOfTheDay() {
  return (
    <div className="flex w-full flex-col pt-4 px-4 space-y-5">
      <HomeNav />
      <SearchBar />
      <DealOfTheDayList />
    </div>
  );
}

export default DealOfTheDay;
