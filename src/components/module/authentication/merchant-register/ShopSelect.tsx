import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
import { ShopType } from '@/core/entity/Shop';
import { cn } from '@/lib/utils';
interface InputProps {
  options: ShopType[];
  setShop: Dispatch<SetStateAction<number>>;
}

function ShopSelect(props: InputProps) {
  const { options, setShop } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const t = useTranslations();
  const handleShopSelect = (currentValue: string, optionId: number) => {
    setValue(currentValue === value ? '' : currentValue);

    setShop(
      Number.parseInt(
        JSON.stringify(options.find(shop => shop.id == optionId)?.id)
      )
    );

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[58px] justify-between"
        >
          {value
            ? options.find(option => JSON.stringify(option.name) === value)
                ?.name
            : t('common.selectShop')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search shop..." />
          <CommandList>
            <CommandEmpty>No shop found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  className="bg-white"
                  key={option.id}
                  value={JSON.stringify(option.name)}
                  onSelect={currentValue => {
                    // console.log(currentValue, value);
                    setValue(currentValue == value ? '' : currentValue);
                    setShop(option.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.replaceAll('"', '').trim() === option.name.trim()
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {/* {value} */}
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
export default ShopSelect;
