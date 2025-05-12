'use client';

import SearchBar from '@/components/gm-module/common/SearchBar';

function Home() {
  return (
    <div className="flex w-full flex-col h-full scrollbar-none overflow-y-auto pb-2 px-4">
      <SearchBar />
    </div>
  );
}
export default Home;
