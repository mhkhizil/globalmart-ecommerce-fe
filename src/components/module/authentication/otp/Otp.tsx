'use client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import BackIcon from '@/components/common/icons/BackIcon';

import ConfirmOtp from './ConfirmOtp';

interface IOptPageProps {
  email: string;
}

function Otp(props: IOptPageProps) {
  const { email } = props;
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="flex w-full h-[100dvh] flex-col px-[24px]">
      <div className="flex relative w-full mt-[20px] items-center justify-center">
        <div className="absolute left-0">
          <button onClick={() => router.back()} aria-label={t('common.back')}>
            <BackIcon />
          </button>
        </div>
        <div className="">
          <span className="text-[#101010] text-[16px] leading-[24px] font-semibold">
            {t('otp.otpTitle')}
          </span>
        </div>
      </div>
      <span className="text-[32px] font-semibold leading-[40px]  mt-[32px]">
        {t('otp.emailVerification')}
      </span>

      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {t('otp.enterVerificationCode')}{' '}
      </span>
      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {email}
      </span>
      <div className="flex w-full  items-center justify-center mb-[30px] mt-[32px]">
        <ConfirmOtp />
      </div>
    </div>
  );
}
export default Otp;
