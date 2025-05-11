import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { flattenObjectValues } from '@/lib/util/flatten-object';
import { cn } from '@/lib/utils';

interface City {
  name: string;
  countryCode: string;
  statCode: string;
  longitude: string;
  latitude: string;
}

interface InputProps {
  options: any;
  setCityId: React.Dispatch<React.SetStateAction<any>>;
  disabled: boolean;
}

interface ItemData {
  options: any[]; // The filtered options to render.
  selectedCity: string;
  handleSelect: (option: any) => void;
}

function flattenCityData(json: any) {
  let result: any = [];

  // Iterate over each country
  for (let country in json) {
    // Iterate over each state in the country
    for (let state in json[country]) {
      // Iterate over each city in the state
      json[country][state].forEach((city: any) => {
        // Add the city object to the result array
        result.push(city);
      });
    }
  }

  return result;
}

// The Row component receives its data via the `itemData` prop.
const Row: FC<ListChildComponentProps<ItemData>> = ({ index, style, data }) => {
  const option = data.options[index];
  const isSelected = data.selectedCity === option.name;
  return (
    <div
      style={style}
      className={cn(
        'cursor-pointer p-2 hover:bg-gray-100 flex items-center',
        isSelected ? 'bg-gray-200' : ''
      )}
      onClick={() => data.handleSelect(option)}
    >
      <Check
        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {option.name}
    </div>
  );
};

const CitySelect: FC<InputProps> = ({ options, setCityId, disabled }) => {
  // Store the selected City's name.
  const [selectedCity, setSelectedCity] = useState<string>('');
  // The search query typed by the user.
  const [searchQuery, setSearchQuery] = useState<string>('');
  // A debounced version of the search query.
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  // Control the popover open City.
  const [open, setOpen] = useState<boolean>(false);

  // Flatten the options once.
  const flattenedOptions: any = useMemo(() => options, [options]);
  // console.log(flattenedOptions);
  // Debounce the search query (300ms delay).
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter options based on the debounced search query.
  const filteredOptions = useMemo(() => {
    if (!debouncedSearchQuery) return flattenedOptions;
    return flattenedOptions.filter((option: any) =>
      option.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, flattenedOptions]);

  // Called when an option is selected.
  const handleSelect = (option: any) => {
    setSelectedCity(option.name);
    setCityId(option);
    setOpen(false);
    setSearchQuery('');
  };

  // Build the itemData object for react-window.
  const itemData: ItemData = {
    options: filteredOptions,
    selectedCity,
    handleSelect,
  };

  // Virtualized list settings.
  const itemSize = 40; // height in pixels for each row
  const listHeight = Math.min(filteredOptions.length * itemSize, 300);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full h-[58px] justify-between"
        >
          {selectedCity
            ? flattenedOptions.find(
                (option: any) => option.name === selectedCity
              )?.name
            : 'Select City'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="">
          <div className="flex w-full border-b-[1px] pl-4 items-center">
            <Search className="size-[20px] stroke-gray-400" />
            <input
              type="text"
              placeholder="Search City..."
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              className="w-full  p-2  focus:outline-none focus:ring-0 text-[0.9rem]"
            />
          </div>
          {filteredOptions.length === 0 ? (
            <div className="p-2">No City found.</div>
          ) : (
            <List
              height={listHeight}
              itemCount={filteredOptions.length}
              itemSize={itemSize}
              width="100%"
              itemData={itemData}
            >
              {Row}
            </List>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelect;
