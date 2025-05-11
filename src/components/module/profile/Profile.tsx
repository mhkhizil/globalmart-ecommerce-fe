'use client';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useSession } from '@/lib/hooks/session/useSession';

import CustomerServicePopup from '../customer-service/CustomerServicePopup';
import AppSetting from './AppSetting';
import BalanceDisplay from './BalanceDisplay';
import ProfileHeader from './ProfileHeader';
import ProfileOrderPreview from './ProfileOrderPreview';

function Profile() {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations();
  // console.log(sessionData);
  return (
    <div className="flex w-full h-full flex-col px-[1.5rem]">
      {sessionData?.user && (
        <>
          <span className="text-[#101010] text-[1rem] leading-[1.5rem] font-[600] flex w-full items-center justify-center mt-[1.125rem]">
            {t('profile.profileSetting')}
          </span>
          <div className="flex w-full mb-[1.75rem]">
            <ProfileHeader />
          </div>
          {sessionData?.user.roles === 1 && (
            <div className="flex w-full">
              <BalanceDisplay sessionData={sessionData} />
            </div>
          )}
          {(sessionData?.user.roles === 1 || sessionData?.user.roles === 2) && (
            <div className="flex w-full">
              <ProfileOrderPreview sessionData={sessionData} />
            </div>
          )}
          <div className="flex w-full border-[#EDEDED] border-[1px] my-[1.5rem]"></div>
          <div>
            <AppSetting />
          </div>
        </>
      )}
      {!sessionData?.user && (
        <div className="flex w-full flex-col items-center justify-center flex-1 h-full gap-[1.5rem]">
          <button
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['session'],
              });
              router.push('/login');
            }}
            type="button"
            className={clsx(
              ' rounded-[100px] py-[16px] min-h-[52px] bg-[#FE8C00] w-full text-[14px] font-semibold leading-[20px] text-white'
            )}
          >
            {t('profile.logInNow')}
          </button>
          <CustomerServicePopup />
        </div>
      )}
    </div>
  );
}
export default Profile;
