'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import TimerIcon from '@/components/common/icons/TimerIcon';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

function ConfirmOtp() {
  const router = useRouter();
  const [optValue, setOtpValue] = useState<string>('');
  const { setValue, handleSubmit } = useForm<{ otp: string }>({
    defaultValues: { otp: '' },
  });
  const t = useTranslations();

  const ConfirmOtpHandler = handleSubmit(data => {
    router.push(`/reset-password?otp=${data?.otp}`);
  });

  const otpValueHandler = (value: string) => {
    setOtpValue(value);
    setValue('otp', value);
  };

  return (
    <form className="flex w-full h-full flex-col" onSubmit={ConfirmOtpHandler}>
      <div className="mb-[14px]">
        <InputOTP
          maxLength={6}
          className="flex w-full items-center justify-center"
          value={optValue}
          onChange={otpValueHandler}
        >
          <InputOTPGroup className="flex w-full items-center justify-center gap-x-4">
            <InputOTPSlot index={0} className="h-[4.5rem] w-[4.6875rem]" />
            <InputOTPSlot index={1} className="h-[4.5rem] w-[4.6875rem]" />
            <InputOTPSlot index={2} className="h-[4.5rem] w-[4.6875rem]" />
            <InputOTPSlot index={3} className="h-[4.5rem] w-[4.6875rem]" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex w-full mb-[44px] items-center justify-center mt-[16px]">
        <span className="text-[#878787]  text-[14px] font-[500] leading-[20px]">
          {t('otp.didntReceiveCode')}&nbsp;
        </span>
        <span className="text-[#FE8C00] text-[14px] font-[500] leading-[20px]">
          {t('otp.resend')}
        </span>
      </div>

      <div className="flex w-full items-center justify-center gap-x-[8px] mb-[32px]">
        <TimerIcon />
        <span className="text-[#878787]  text-[14px] font-[500] leading-[20px]">
          {'09.00'}
        </span>
      </div>

      <div className="flex w-full h-full items-end">
        <button className="bg-[#FE8C00] rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white">
          {t('otp.continue')}
        </button>
      </div>
    </form>
  );
}
export default ConfirmOtp;
