// import { Check, ChevronsUpDown } from 'lucide-react';
// import { Dispatch, setStateIdAction, useMemo, useState } from 'react';

// import { Button } from '@/components/ui/button';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';

// import { cn } from '@/lib/utils';
// import { flattenObjectValues } from '@/lib/util/flatten-object';

// interface State {
//   name: string;
//   isoCode: string;
//   flag: string;
//   phonecode: string;
//   currency: string;
// }

// interface InputProps {
//   options: any;
//   setStateId: Dispatch<setStateIdAction<string>>;
// }

// function StateSelect({ options, setStateId }: InputProps) {
//   // 'selectedState' stores the selected State's isoCode.
//   const [selectedState, setSelectedState] = useState<string>('');
//   // 'searchQuery' is used to control the CommandInput search.
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [open, setOpen] = useState<boolean>(false);
//   const flattenedOptions:any = useMemo(() => {
//     return flattenObjectValues(options);
//   }, [options]);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full h-[58px] justify-between"
//         >
//           {selectedState
//             ? flattenedOptions.find(
//                 (option: any) => option.isoCode === selectedState
//               )?.name
//             : 'Select State'}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           {/* Make the CommandInput controlled by the searchQuery state */}
//           <CommandInput
//             placeholder="Search State..."
//             value={searchQuery}
//             onValueChange={setSearchQuery}
//           />
//           <CommandList>
//             <CommandEmpty>No State found.</CommandEmpty>
//             <CommandGroup>
//               {flattenedOptions.map((option:any, index:any) => (
//                 <CommandItem
//                   className="bg-white"
//                   key={`${option.isoCode}-${index}`}
//                   // Set the value to option.name so that filtering happens by name.
//                   value={option.name}
//                   onSelect={() => {
//                     // When an option is selected, update the selected isoCode.
//                     setSelectedState(option.isoCode);
//                     // Pass the isoCode back to the parent.
//                     setStateId(option.isoCode);
//                     // Close the popover and clear the search.
//                     setOpen(false);
//                     setSearchQuery('');
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       'mr-2 h-4 w-4',
//                       selectedState === option.isoCode
//                         ? 'opacity-100'
//                         : 'opacity-0'
//                     )}
//                   />
//                   {option.name}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

// export default StateSelect;

// import { useState, useMemo, useEffect, FC } from 'react';
// import { FixedSizeList as List } from 'react-window';
// import { Check, ChevronsUpDown } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// import { cn } from '@/lib/utils';
// import { flattenObjectValues } from '@/lib/util/flatten-object';

// interface State {
//   name: string;
//   isoCode: string;
//   flag: string;
//   phonecode: string;
//   currency: string;
// }

// interface InputProps {
//   options: any;
//   setStateId: React.Dispatch<React.setStateIdAction<string>>;
// }

// const StateSelect: FC<InputProps> = ({ options, setStateId }) => {
//   // Store the selected state's isoCode.
//   const [selectedState, setSelectedState] = useState<string>('');
//   // The actual search query typed by the user.
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   // A debounced version of the search query to reduce filtering frequency.
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
//   // Control the popover open state.
//   const [open, setOpen] = useState<boolean>(false);

//   // Flatten the options (assume a nested structure) once.
//   const flattenedOptions:any = useMemo(() => flattenObjectValues(options), [options]);

//   // Debounce the search query so filtering only occurs after a short pause.
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearchQuery(searchQuery);
//     }, 300);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   // Filter options based on the debounced search query.
//   const filteredOptions = useMemo(() => {
//     if (!debouncedSearchQuery) return flattenedOptions;
//     return flattenedOptions.filter((option: any) =>
//       option.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
//     );
//   }, [debouncedSearchQuery, flattenedOptions]);

//   // Called when an option is selected.
//   const handleSelect = (option: any) => {
//     setSelectedState(option.isoCode);
//     setStateId(option.isoCode);
//     setOpen(false);
//     setSearchQuery('');
//   };

//   // Virtualized list settings.
//   const itemSize = 40; // height for each row in pixels
//   const listHeight = Math.min(filteredOptions.length * itemSize, 300); // limit the height

//   // Row renderer for react-window.
//   const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
//     const option:any = filteredOptions[index];
//     return (
//       <div
//         style={style}
//         className={cn(
//           'cursor-pointer p-2 hover:bg-gray-100 flex items-center',
//           selectedState === option.isoCode ? 'bg-gray-200' : ''
//         )}
//         onClick={() => handleSelect(option)}
//       >
//         <Check
//           className={cn('mr-2 h-4 w-4', selectedState === option.isoCode ? 'opacity-100' : 'opacity-0')}
//         />
//         {option.name}
//       </div>
//     );
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full h-[58px] justify-between"
//         >
//           {selectedState
//             ? flattenedOptions.find((option: any) => option.isoCode === selectedState)?.name
//             : 'Select State'}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <div className="p-2">
//           <input
//             type="text"
//             placeholder="Search State..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full border p-2 mb-2"
//           />
//           {filteredOptions.length === 0 ? (
//             <div className="p-2">No State found.</div>
//           ) : (
//             <List
//               height={listHeight}
//               itemCount={filteredOptions.length}
//               itemSize={itemSize}
//               width="100%"
//             >
//               {Row}
//             </List>
//           )}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default StateSelect;

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

interface State {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
}

interface InputProps {
  options: any;
  setStateId: React.Dispatch<React.SetStateAction<any>>;
  disabled: boolean;
}

interface ItemData {
  options: any[]; // The filtered options to render.
  selectedState: string;
  handleSelect: (option: any) => void;
}

function flattenStateData(json: any): any[] {
  const result: any[] = [];

  for (const country in json) {
    if (json.hasOwnProperty(country)) {
      for (const state of json[country]) {
        result.push(state);
      }
    }
  }

  return result;
}

// The Row component receives its data via the `itemData` prop.
const Row: FC<ListChildComponentProps<ItemData>> = ({ index, style, data }) => {
  const option = data.options[index];
  const isSelected = data.selectedState === option.isoCode;
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

const StateSelect: FC<InputProps> = ({ options, setStateId, disabled }) => {
  // Store the selected state's isoCode.
  const [selectedState, setSelectedState] = useState<string>('');
  // The search query typed by the user.
  const [searchQuery, setSearchQuery] = useState<string>('');
  // A debounced version of the search query.
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  // Control the popover open state.
  const [open, setOpen] = useState<boolean>(false);

  // Flatten the options once.
  const flattenedOptions: any = useMemo(() => options, [options]);
  //   console.log(flattenedOptions);

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
    setSelectedState(option.name);
    setStateId(option);
    setOpen(false);
    setSearchQuery('');
  };

  // Build the itemData object for react-window.
  const itemData: ItemData = {
    options: filteredOptions,
    selectedState,
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
          {selectedState
            ? flattenedOptions.find(
                (option: any) => option.name === selectedState
              )?.name
            : 'Select State'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="">
          <div className="flex w-full border-b-[1px] pl-4 items-center">
            <Search className="size-[20px] stroke-gray-400" />
            <input
              type="text"
              placeholder="Search State..."
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              className="w-full  p-2  focus:outline-none focus:ring-0 text-[0.9rem]"
            />
          </div>
          {filteredOptions.length === 0 ? (
            <div className="p-2">No State found.</div>
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

export default StateSelect;
