import { Check, ChevronsUpDown } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Country {
  name: string;
  isoCode: string;
  flag: string;
  phonecode: string;
  currency: string;
}

interface InputProps {
  options: Country[];
  setCountry: Dispatch<SetStateAction<any>>;
}

function CountrySelect({ options, setCountry }: InputProps) {
  // 'selectedCountry' stores the selected country's isoCode.
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  // 'searchQuery' is used to control the CommandInput search.
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[58px] justify-between"
        >
          {selectedCountry
            ? options.find(option => option.isoCode === selectedCountry)?.name
            : 'Select Country'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* Make the CommandInput controlled by the searchQuery state */}
          <CommandInput
            placeholder="Search Country..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No Country found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  className="bg-white"
                  key={`${option.isoCode}-${index}`}
                  // Set the value to option.name so that filtering happens by name.
                  value={option.name}
                  onSelect={() => {
                    // When an option is selected, update the selected isoCode.
                    setSelectedCountry(option.isoCode);
                    // Pass the isoCode back to the parent.
                    setCountry(option);
                    // Close the popover and clear the search.
                    setOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCountry === option.isoCode
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CountrySelect;
