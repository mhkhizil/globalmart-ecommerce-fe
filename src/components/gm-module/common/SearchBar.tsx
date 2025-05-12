'use client';

import { Mic, Search } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onMicClick?: () => void;
  initialValue?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      placeholder = 'Search any Product..',
      onSearch,
      onMicClick,
      initialValue = '',
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState(initialValue);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
      onSearch?.(event.target.value);
    };

    const handleMicClick = () => {
      onMicClick?.();
    };

    return (
      <div
        className={cn(
          'flex items-center w-full rounded-md bg-white px-4 py-2 shadow-[0px_2px_9px_0px_rgba(0,0,0,0.04)]',
          className
        )}
        {...props}
      >
        <Search
          className="h-5 w-5 text-[#BBBBBB] flex-shrink-0"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none px-3 py-0.5 font-['Montserrat'] text-sm text-[#BBBBBB] placeholder:text-[#BBBBBB]"
          aria-label="Search"
        />
        <button
          type="button"
          onClick={handleMicClick}
          className="p-0 bg-transparent border-none cursor-pointer"
          aria-label="Search by voice"
        >
          <Mic
            className="h-5 w-5 text-[#BBBBBB] flex-shrink-0"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
