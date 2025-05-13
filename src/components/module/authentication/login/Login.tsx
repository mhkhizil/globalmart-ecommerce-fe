'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/lib/redux/ReduxStore';
import { Locale, setLocale } from '@/lib/redux/slices/LanguageSlice';

import CustomerServicePopup from '../../customer-service/CustomerServicePopup';
import CredentialLogin from './CredentialLogin';
import SocialLogin from './SocialLogin';
import GoogleIcon from '@/components/common/icons/GoogleIcon';
import FaceBookIcon from '@/components/common/icons/FacebookIcon';

function Login({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentLocale = useSelector(
    (state: RootState) => state.language.locale
  );

  // Sync initial locale from URL with Redux (runs only once on mount)
  if (locale !== currentLocale) {
    dispatch(setLocale(locale as Locale));
  }

  const switchLanguage = () => {
    const newLocale = currentLocale === 'cn' ? 'en' : 'cn';
    dispatch(setLocale(newLocale));
    router.push(`/${newLocale}`);
  };

  return (
    <div className="flex w-full h-[100dvh] flex-col px-[24px] pb-[1.5rem] overflow-y-auto scrollbar-none">
      <span className="text-[32px] font-semibold leading-[40px] text-wrap mt-[32px]">
        {t('common.loginTitle')}
      </span>
      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {t('auth.pleaseSignIn')}
      </span>
      <div className="flex w-full items-center justify-center mb-[24px] mt-[32px]">
        <CredentialLogin />
      </div>
      <div className=" flex  justify-center items-center gap-4">
        <div className=" rounded-full w-12 h-12 flex items-center justify-center border border-red-500">
          <GoogleIcon />
        </div>
        <div className=" rounded-full w-12 h-12 flex items-center justify-center border border-red-500">
          <FaceBookIcon />
        </div>
      </div>
      {/* <div className="flex w-full items-center justify-center  gap-x-[16px]">
        <div className="w-full border-[0.5px] border-[#878787]"></div>
        <span className="text-nowrap text-[#878787] text-[14px] font-[500] leading-[20px]">
          {t('auth.orSignInWith')}
        </span>
        <div className="w-full border-[0.5px] border-[#878787]"></div>
      </div> */}
      {/* <div className="flex w-full items-center justify-center mt-[24px]">
        <SocialLogin />
      </div> */}
      <div className="flex w-full justify-center mt-3">
        <button
          onClick={() => router.push('/application//home')}
          type="button"
          className="text-white gap-x-2  items-center justify-center rounded-[5px] flex bg-red-500 px-[2rem] font-[600] py-[0.2rem]"
        >
          {t('auth.skip')}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
            />
          </svg> */}
        </button>
      </div>
      <div className="flex w-full items-center justify-center text-[16px] font-[400] leading-[24px] mt-[32px] gap-x-[5px]">
        <span className="text-black">{t('auth.dontHaveAccount')}</span>
        <Link className="text-red-500" href={'/register'}>
          {' '}
          {t('auth.register')}
        </Link>
      </div>
      <div className="flex w-full items-center justify-center mt-[16px]">
        <CustomerServicePopup />
      </div>
    </div>
  );
}
export default Login;
