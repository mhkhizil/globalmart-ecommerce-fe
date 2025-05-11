'use client';

import { useRouter } from 'next/navigation';

import BackIcon from '@/components/common/icons/BackIcon';

import ConfirmPassword from './ConfirmPassword';

function ResetPassword() {
  const router = useRouter();
  return (
    <div className="flex w-full h-[100dvh] flex-col px-[24px]">
      <div className="flex relative w-full mt-[20px] items-center justify-center">
        <div className="absolute left-0">
          <button onClick={() => router.back()}>
            <BackIcon />
          </button>
        </div>
        <div className="">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            Reset Password
          </span>
        </div>
      </div>
      <span className="text-[32px] font-semibold leading-[40px]  mt-[32px]">
        Reset Password
      </span>

      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        Your new password must be different from the previously used
        password{' '}
      </span>
      <div className="flex h-full w-full items-center justify-center mb-[24px] mt-[32px]">
        <ConfirmPassword />
      </div>
    </div>
  );
}
export default ResetPassword;
