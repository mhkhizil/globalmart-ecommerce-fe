import debounce from 'lodash.debounce';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  Command,
  CommandCustomInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useGetSearchSuggestion } from '@/lib/hooks/service/search/useGetSearchSuggestion';

function SearchInputWithSuggestion() {
  const t = useTranslations();
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const { data: SearchResults } = useGetSearchSuggestion(debouncedQuery);

  useEffect(() => {
    const debounceFunction = debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300);

    debounceFunction(query);

    return () => {
      debounceFunction.cancel();
    };
  });

  return (
    <div className="flex w-full px-[0.5rem] mt-[1rem]">
      <Command className="">
        <CommandCustomInput
          placeholder={t('search.searchFoodPlaceholder')}
          onValueChange={(search: string) => {
            setQuery(search);
          }}
        />
        <CommandList>
          <CommandEmpty>{t('search.noFoodFound')}</CommandEmpty>
          <CommandGroup heading={t('search.suggestions')}>
            <CommandItem>{t('search.suggestionBurger')}</CommandItem>
            <CommandItem>{t('search.suggestionPizza')}</CommandItem>
            <CommandItem>{t('search.suggestionCola')}</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
export default SearchInputWithSuggestion;
