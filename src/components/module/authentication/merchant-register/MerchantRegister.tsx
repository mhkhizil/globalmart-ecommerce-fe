import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ShopType } from '@/core/entity/Shop';

import SocialLogin from '../login/SocialLogin';
import CredentialMerchantRegister from './CredentialMerchantRegister';
interface InputProps {
  shopList: ShopType[];
  countryList: any;
  stateList: any;
  cityList: any;
}

function MerchantRegister(props: InputProps) {
  const t = useTranslations();
  return (
    <div className="flex w-full h-[100dvh] overflow-y-auto scrollbar-none pb-[2rem] flex-col px-[24px]">
      <span className="text-[32px] font-semibold leading-[40px] text-wrap mt-[32px]">
        {t('auth.createMerchantAccount')}
      </span>
      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {t('auth.createAccountDescription')}
      </span>
      <div className="flex w-full items-center justify-center mb-[24px] mt-[32px]">
        <CredentialMerchantRegister {...props} />
      </div>
      <div className="flex w-full items-center justify-center  gap-x-[16px]">
        <div className="w-full border-[0.5px] border-[#878787]"></div>
        <span className="text-nowrap text-[#878787] text-[14px] font-[500] leading-[20px]">
          {t('auth.orSignUpWith')}
        </span>
        <div className="w-full border-[0.5px] border-[#878787]"></div>
      </div>
      {/* <div className="flex w-full items-center justify-center mt-[24px]">
        <SocialLogin />
      </div> */}
      <div className="flex w-full items-center justify-center text-[16px] font-[400] leading-[24px] mt-[32px] gap-x-[5px]">
        <span className="text-black">{t('auth.alreadyHaveAccount')}</span>
        <Link className="text-[#FE8C00]" href={'/login'}>
          {' '}
          {t('auth.signIn')}
        </Link>
      </div>
    </div>
  );
}
export default MerchantRegister;
