import Link from 'next/link';
import { useTranslations } from 'next-intl';

import SocialLogin from '../login/SocialLogin';
import CredentialRegister from './CredentialRegister';

function Register() {
  const t = useTranslations();
  return (
    <div className="flex w-full flex-col px-[24px] h-[100dvh] scrollbar-none overflow-y-auto pb-[2rem]">
      <span className="text-[32px] font-semibold leading-[40px] text-wrap mt-[32px]">
        {t('common.registerTitle')}
      </span>
      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {t('auth.createAccountDescription')}
      </span>
      <div className="flex w-full items-center justify-center mb-[24px] mt-[32px]">
        <CredentialRegister />
      </div>
      {/* <div className="flex w-full items-center justify-center  gap-x-[16px]">
        <div className="w-full border-[0.5px] border-[#878787]"></div>
        <span className="text-nowrap text-[#878787] text-[14px] font-[500] leading-[20px]">
          {t('auth.orSignUpWith')}
        </span>
        <div className="w-full border-[0.5px] border-[#878787]"></div>
      </div>
      <div className="flex w-full items-center justify-center mt-[24px]">
        <SocialLogin />
      </div> */}
      <div className="flex w-full items-center justify-center text-[16px] font-[400] leading-[24px]  gap-x-[5px]">
        <span className="text-black">{t('auth.alreadyHaveAccount')}</span>
        <Link className="text-[#FE8C00]" href={'/login'}>
          {t('auth.signIn')}
        </Link>
      </div>
    </div>
  );
}
export default Register;
