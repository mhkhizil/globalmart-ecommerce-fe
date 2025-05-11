'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import LanguageSelectedIcon from '@/components/common/icons/LanguageSelectedIcon';
import RightArrowIcon from '@/components/common/icons/RightArrowIcon';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RootState } from '@/lib/redux/ReduxStore';
import {
  Locale,
  setLocale,
  supportedLocales,
} from '@/lib/redux/slices/LanguageSlice';
const languageDisplayMap: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  cn: { name: 'Chinese', flag: '🇨🇳' },
  mm: { name: 'Myanmar', flag: '🇲🇲' },
  th: { name: 'Thai', flag: '🇹🇭' },
};

function SelectLanguageDrawer() {
  const currentLocale = useSelector(
    (state: RootState) => state.language.locale
  );
  const dispatch = useDispatch();
  const t = useTranslations();
  const handleSelectLanguage = (locale: Locale) => {
    dispatch(setLocale(locale)); // Just update Redux; URL sync happens in ClientLocaleWrapper
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="flex items-center gap-x-[1rem]">
          <span>{languageDisplayMap[currentLocale].name}</span>
          <RightArrowIcon />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex w-full px-[1.5rem]">
          <DrawerTitle>{t('language')}</DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full px-[1.5rem] flex-col my-[1.5rem] gap-y-[1rem]">
          {supportedLocales.map(locale => (
            <div
              className={clsx(
                'flex w-full items-center justify-between p-[1rem] border-[1px] rounded-[16px] cursor-pointer',
                {
                  'border-[#FF9C44]': locale === currentLocale,
                  'border-[#EAEAEA]': locale !== currentLocale,
                }
              )}
              onClick={() => handleSelectLanguage(locale)}
              key={locale}
            >
              <div className="flex items-center gap-x-[0.75rem]">
                <div className="rounded-full flex items-center justify-center bg-[#F3F6FB] p-[0.25rem] h-[2rem] w-[2rem]">
                  {languageDisplayMap[locale].flag}
                </div>
                <span>{languageDisplayMap[locale].name}</span>
              </div>
              {locale === currentLocale && <LanguageSelectedIcon />}
            </div>
          ))}
          <DrawerClose asChild>
            <button className="bg-[#FE8C00] rounded-[100px] mt-[1rem] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white">
              Close
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SelectLanguageDrawer;
