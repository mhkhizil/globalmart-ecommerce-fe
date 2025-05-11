'use client';

import { useTranslations } from 'next-intl';

import AppleIcon from '@/components/common/icons/AppleIcon';
import FaceBookIcon from '@/components/common/icons/FacebookIcon';
import GoogleIcon from '@/components/common/icons/GoogleIcon';
import { useGoogleLogin } from '@/lib/hooks/service/auth/useGoogleLogin';

function SocialLogin() {
  const t = useTranslations();
  const googleLogin = useGoogleLogin({});

  return (
    <div className="flex items-center justify-cente gap-x-[16px]">
      <button
        onClick={async () => await googleLogin.mutateAsync()}
        aria-label={t('auth.loginWithGoogle')}
      >
        <GoogleIcon />
      </button>
      {/* <button aria-label={t('auth.loginWithFacebook')}>
        <FaceBookIcon />
      </button>
      <button aria-label={t('auth.loginWithApple')}>
        <AppleIcon />
      </button> */}
    </div>
  );
}
export default SocialLogin;
