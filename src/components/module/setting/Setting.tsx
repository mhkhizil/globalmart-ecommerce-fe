'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import BackIcon from '@/components/common/icons/BackIcon';
import RightArrowIcon from '@/components/common/icons/RightArrowIcon';
import { Switch } from '@/components/ui/switch';

import SelectLanguageDrawer from './SelectLanguageDrawer';

function Setting() {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="flex w-full flex-col px-[1.5rem]">
      <div className="flex relative w-full  items-center justify-center mt-[1.5rem]">
        <div className="absolute left-0">
          <button onClick={() => router.back()}>
            <BackIcon />
          </button>
        </div>
        <div className="">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {t('settings.settings')}
          </span>
        </div>
      </div>
      <span className="text-[#878787] text-[0.75rem] leading-[1rem] font-[500] mb-[0.625rem] mt-[1.75rem]">
        {t('settings.profile')}
      </span>
      {/* <div className="flex w-full items-center justify-between">
        <span className="text-[#101010] text-[0.875rem] leading-[0.625rem] font-[500]">
          {t('settings.location')}
        </span>
        <Switch
          id="airplane-mode"
          className="data-[state=checked]:bg-[#FE8C00]"
          color="#FE8C00"
        />
      </div> */}
      <div className="flex w-full items-center justify-between ">
        <span className="text-[#101010] text-[0.875rem] leading-[0.625rem] font-[500]">
          {t('settings.language')}
        </span>
        <SelectLanguageDrawer />
      </div>
      <span className="text-[#878787] text-[0.75rem] leading-[1rem] font-[500] mb-[1.125rem] mt-[2.125rem]">
        {t('settings.other')}
      </span>
      <div className="flex w-full items-center justify-between mb-[1.7rem]">
        <span className="text-[#101010] text-[0.875rem] leading-[0.625rem] font-[500]">
          {t('settings.aboutTickets')}
        </span>
        <RightArrowIcon />
      </div>
      <div className="flex w-full items-center justify-between mb-[1.7rem]">
        <span className="text-[#101010] text-[0.875rem] leading-[0.625rem] font-[500]">
          {t('settings.privacyPolicy')}
        </span>
        <RightArrowIcon />
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[#101010] text-[0.875rem] leading-[0.625rem] font-[500]">
          {t('settings.termsAndConditions')}
        </span>
        <RightArrowIcon />
      </div>
    </div>
  );
}
export default Setting;
