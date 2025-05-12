'use client';

import SearchBar from '@/components/gm-module/common/SearchBar';

import CategoryPreview from '../category/CategoryPreview';

function Home() {
  return (
    <div className="flex w-full flex-col h-full scrollbar-none overflow-y-auto pb-2 px-4 space-y-5">
      <SearchBar />
      <CategoryPreview />
    </div>
  );
}
export default Home;
