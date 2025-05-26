'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import DetailSettingIcon from '@/components/common/icons/DetailSettingIcon';
import LogoutIcon from '@/components/common/icons/LogoutIcon';
import ProfileSettingIcon from '@/components/common/icons/ProfileSettingIcon';
import RightArrowIcon from '@/components/common/icons/RightArrowIcon';
import SettingIcon from '@/components/common/icons/SettingIcon';
import Loader from '@/components/common/loader/Loader';
import CustomerServicePopup from '@/components/module/customer-service/CustomerServicePopup';
import { useLogout } from '@/lib/hooks/service/auth/useLogout';
import { useCart } from '@/lib/hooks/store/useCart';
import {
  resetNavigation,
  setIsSelected,
} from '@/lib/redux/slices/NavigationBarSlice';

function AppSetting() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { setUser } = useCart();
  const router = useRouter();
  const t = useTranslations();
  const { mutateAsync: handleLogout, isPending } = useLogout({
    onSuccess: async () => {
      dispatch(setIsSelected('1'));
      setUser(undefined);
      dispatch(resetNavigation());

      queryClient.invalidateQueries();
      queryClient.clear();

      router.refresh();

      router.push('/login');
    },
  });
  return (
    <div className="flex w-full flex-col">
      <span className="text-[#878787] text-[0.75rem] leading-[1rem] font-[500] mb-[1rem]">
        {t('profile.profileSetting')}
      </span>
      <Link
        className="flex w-full items-center justify-between mb-[1.2rem]"
        href={'/application/personal-data'}
      >
        <div className="flex items-center gap-x-[1rem]">
          <ProfileSettingIcon />
          <span>{t('profile.personalData')}</span>
        </div>
        <RightArrowIcon />
      </Link>
      <Link
        className="flex w-full items-center justify-between mb-[1.5rem]"
        href={'/application/setting'}
      >
        <div className="flex items-center gap-x-[1rem]">
          <SettingIcon />
          <span>{t('profile.setting')}</span>
        </div>
        <RightArrowIcon />
      </Link>
      <span className="text-[#878787] text-[0.75rem] leading-[1rem] font-[500] mb-[1.2rem]">
        {t('profile.support')}
      </span>
      <Link
        className="flex w-full items-center justify-between mb-[1.5rem]"
        href={'/application/faq'}
      >
        <div className="flex items-center gap-x-[1rem]">
          <DetailSettingIcon />
          <span>{t('profile.helpCenter')}</span>
        </div>
        <RightArrowIcon />
      </Link>

      <div className="flex w-full items-center justify-center p-3">
        <CustomerServicePopup />
      </div>

      <button
        type="button"
        onClick={() => handleLogout()}
        className={clsx(
          'flex w-full gap-x-[0.5rem] min-h-[54px] border-[1px] rounded-[100px] mb-[1rem] py-[1rem] items-center justify-center border-[#D6D6D6]',
          {
            'bg-[#FFFF]': !isPending,
            'bg-[#FFFF]/70': isPending,
          }
        )}
      >
        {!isPending && <LogoutIcon />}
        <span className="text-[#F14141] text-[0.875rem] leading-[1.25rem] font-[600]">
          {!isPending && t('profile.signOut')}
          {isPending && (
            <>
              <Loader color={'#F14141'} />
            </>
          )}
        </span>
      </button>
    </div>
  );
}
export default AppSetting;
