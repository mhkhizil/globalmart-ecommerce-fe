'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import ConfirmEmail from './ConfirmEmail';

function ForgotPassword() {
  const t = useTranslations();

  return (
    <div className="flex w-full h-[100dvh] flex-col px-[24px]">
      <span className="text-[32px] font-semibold leading-[40px]  mt-[32px]">
        {t('forgotPassword.title')}
      </span>

      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {t('forgotPassword.description')}
      </span>
      <div className="flex w-full h-full items-center justify-center mb-[30px] mt-[32px]">
        <ConfirmEmail />
      </div>
    </div>
  );
}
export default ForgotPassword;
