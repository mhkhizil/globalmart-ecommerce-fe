'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import Input from '@/components/common/Input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForgotPassword } from '@/lib/hooks/service/auth/useForgotPassword';

interface FormData {
  email: string;
}

interface ForgotPasswordError {
  message: string;
  code?: string;
}

function ConfirmEmail() {
  const router = useRouter();
  const t = useTranslations();

  // State management
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Form setup with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<FormData>({
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  // Forgot password mutation with comprehensive success handling
  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: data => {
      const email = getValues('email');
      toast.success(data?.message || t('forgotPassword.emailSentSuccess'));

      // Reset form after successful submission
      reset();
      setRetryCount(0);

      // Redirect to OTP page with email as search parameter
      router.push(`/otp-forgot-password?email=${encodeURIComponent(email)}`);
    },
    onError: (error: ForgotPasswordError) => {
      const message = error.message || t('forgotPassword.requestFailed');
      setErrorMessage(message);
      setShowErrorModal(true);
      setRetryCount(previous => previous + 1);
      toast.error(message);
    },
  });

  // Email validation rules
  const emailValidation = {
    required: t('auth.emailRequired') || 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: t('auth.invalidEmail') || 'Please enter a valid email address',
    },
    maxLength: {
      value: 254,
      message: 'Email address is too long',
    },
  };

  // Form submission handler
  const confirmEmailHandler = handleSubmit(
    useCallback(
      async (data: FormData) => {
        // Reset retry count on new submission
        setRetryCount(0);
        setErrorMessage('');

        // Validate email format one more time before submission
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(data.email.trim())) {
          toast.error(t('auth.invalidEmail'));
          return;
        }

        // Submit the request
        forgotPassword({
          email: data.email.trim().toLowerCase(),
        });
      },
      [forgotPassword, t]
    )
  );

  // Modal handlers
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleTryAgainWithNewEmail = () => {
    setShowErrorModal(false);
    setErrorMessage('');
    setRetryCount(0);
    reset();
  };

  const isLoading = isPending || isSubmitting;

  return (
    <>
      <Toaster position="top-right" />

      <form
        className="flex w-full h-full flex-col"
        onSubmit={confirmEmailHandler}
        noValidate
      >
        {/* Email Input Field */}
        <div className="mb-[14px]">
          <span className="text-[14px] font-[500] leading-[20px] text-[#101010] block mb-[8px]">
            {t('forgotPassword.emailAddress')}
          </span>
          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            className="py-[16px] focus:outline-gray-500 border-[#D6D6D6] border-[1px]"
            {...register('email', emailValidation)}
            disabled={isLoading}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span
              id="email-error"
              className="text-[12px] font-[400] leading-[16px] text-red-500 mt-[4px] block"
              role="alert"
            >
              {errors.email.message}
            </span>
          )}
          {!errors.email && (
            <span className="text-[12px] font-[400] leading-[16px] text-[#878787] mt-[4px] block">
              {t('forgotPassword.emailHint') ||
                'Enter the email address associated with your account'}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full h-full items-end">
          <button
            type="submit"
            disabled={isLoading || !!errors.email}
            className="bg-red-500 rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FE8C00]/90 transition-colors"
            aria-label={isLoading ? t('common.processing') : t('auth.continue')}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('common.sending') || 'Sending...'}
              </span>
            ) : (
              t('auth.continue')
            )}
          </button>
        </div>
      </form>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md w-[90%] mx-auto rounded-lg bg-white border-none shadow-2xl">
          <DialogHeader className="text-center space-y-4 pt-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {t('forgotPassword.requestFailedTitle')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed">
              <span className="block text-base text-gray-700 mb-3">
                {errorMessage}
              </span>
              {retryCount > 0 && (
                <span className="block text-sm text-gray-500">
                  {t('common.retry')} {retryCount}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleTryAgainWithNewEmail}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 font-semibold py-3 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              {t('common.tryAgainWithNewEmail')}
            </Button>
            <Button
              onClick={handleCloseErrorModal}
              className="w-full bg-red-500 hover:bg-red-500/90 text-white font-semibold py-3 rounded-full text-sm transition-colors"
            >
              {t('common.tryAgain')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ConfirmEmail;
