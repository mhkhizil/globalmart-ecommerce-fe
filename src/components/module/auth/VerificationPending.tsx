'use client';

import { Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function VerificationPending() {
  const router = useRouter();
  const t = useTranslations('auth.verification');
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Here you would call your API to resend the verification email
    // Example: await resendVerificationEmail(email);
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <Mail className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {t('verifyEmail')}
          </h1>

          <p className="text-gray-600 mt-2">{t('emailSent')}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-red-700">{t('checkSpam')}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900"
          >
            {isResending ? t('sending') : t('resendEmail')}
          </Button>

          <Button
            onClick={handleGoToLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            {t('goToLogin')}
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{t('needHelp')}</p>
      </div>
    </div>
  );
}

export default VerificationPending;
