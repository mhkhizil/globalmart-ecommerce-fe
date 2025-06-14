'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import TimerIcon from '@/components/common/icons/TimerIcon';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useResendOtp } from '@/lib/hooks/service/auth/useResendOtp';
import { useVerifyOtp } from '@/lib/hooks/service/auth/useVerifyOpt';

interface ConfirmOtpProps {
  email: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

function ConfirmOtp({ email }: ConfirmOtpProps) {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<{ otp: string }>({
    defaultValues: { otp: '' },
  });

  const t = useTranslations();

  const { mutate: verifyOtp, isPending } = useVerifyOtp({
    onSuccess: data => {
      toast.success(data.message || 'OTP verified successfully');
      // Redirect to reset password with email and OTP as search params
      router.push(
        `/reset-password?otp=${otpValue}&email=${encodeURIComponent(email)}`
      );
    },
    onError: error => {
      toast.error(
        error.message ||
          t('otp.verificationFailed') ||
          'OTP verification failed!'
      );
      setIsSubmitting(false);
    },
  });

  const { mutate: resendOtp, isPending: isResendOtpPending } = useResendOtp({
    onSuccess: data => {
      toast.success(
        data.message || t('otp.resendSuccess') || 'OTP sent successfully!'
      );
      // Start countdown after successful resend
      startResendCountdown();
    },
    onError: error => {
      toast.error(
        error.message || t('otp.resendFailed') || 'Failed to resend OTP'
      );
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const startResendCountdown = () => {
    setCanResend(false);
    setCountdown(60); // 60 seconds countdown
  };

  const confirmOtpHandler = handleSubmit(data => {
    if (!data.otp || data.otp.length !== 6) {
      toast.error(t('otp.invalidLength') || 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);

    // Call the OTP verification API
    verifyOtp({
      email,
      otp: data.otp,
    });
  });

  const otpValueHandler = (value: string) => {
    // Handle paste functionality - if pasted value has more than 6 characters, take only first 6
    const sanitizedValue = value.slice(0, 6);

    setOtpValue(sanitizedValue);
    setValue('otp', sanitizedValue);

    // If we have a complete OTP (6 digits), we could auto-submit
    // Uncomment the lines below if you want auto-submit on complete OTP
    // if (sanitizedValue.length === 6) {
    //   setTimeout(() => {
    //     confirmOtpHandler();
    //   }, 100);
    // }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');

    // Extract only numbers from pasted content
    const numbers = pastedData.replaceAll(/\D/g, '');

    if (numbers.length > 0) {
      // Take first 6 digits and distribute them
      const otpDigits = numbers.slice(0, 6);
      setOtpValue(otpDigits);
      setValue('otp', otpDigits);
    }
  };

  const handleResendOtp = () => {
    if (!canResend || isResendOtpPending) return;

    resendOtp({
      email,
    });
  };

  const isLoading = isPending || isSubmitting;

  return (
    <div className="flex w-full h-full flex-col">
      <Toaster position="top-center" />

      <form
        className="flex w-full h-full flex-col"
        onSubmit={confirmOtpHandler}
      >
        <div className="mb-[14px]">
          <InputOTP
            maxLength={6}
            className="flex w-full items-center justify-center"
            value={otpValue}
            onChange={otpValueHandler}
            onPaste={handlePaste}
            disabled={isLoading}
          >
            <InputOTPGroup className="flex w-full items-center justify-center gap-x-2">
              <InputOTPSlot
                index={0}
                className={`h-[4.5rem] w-[4.2rem] ${isLoading ? 'opacity-50' : ''}`}
              />
              <InputOTPSlot
                index={1}
                className={`h-[4.5rem] w-[4.2rem] ${isLoading ? 'opacity-50' : ''}`}
              />
              <InputOTPSlot
                index={2}
                className={`h-[4.5rem] w-[4.2rem] ${isLoading ? 'opacity-50' : ''}`}
              />
              <InputOTPSlot
                index={3}
                className={`h-[4.5rem] w-[4.2rem] ${isLoading ? 'opacity-50' : ''}`}
              />
              <InputOTPSlot
                index={4}
                className={`h-[4.5rem] w-[4.2rem] ${isLoading ? 'opacity-50' : ''}`}
              />
              <InputOTPSlot
                index={5}
                className={`h-[4.5rem] w-[4.2rem] ${isLoading ? 'opacity-50' : ''}`}
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {errors.otp && (
          <div className="text-red-500 text-sm text-center mb-2">
            {errors.otp.message}
          </div>
        )}

        <div className="flex w-full mb-[44px] items-center justify-center mt-[16px]">
          <span className="text-[#878787] text-[14px] font-[500] leading-[20px]">
            {t('otp.didntReceiveCode')}&nbsp;
          </span>
          <button
            type="button"
            className={`text-[14px] font-[500] leading-[20px] focus:outline-none transition-colors ${
              canResend && !isResendOtpPending
                ? 'text-[#FE8C00] hover:underline cursor-pointer'
                : 'text-[#CCCCCC] cursor-not-allowed'
            }`}
            disabled={!canResend || isResendOtpPending || isLoading}
            onClick={handleResendOtp}
          >
            {isResendOtpPending ? (
              <>
                <span className="inline-block animate-spin rounded-full h-3 w-3 border border-[#FE8C00] border-t-transparent mr-1"></span>
                {t('otp.resending') || 'Sending...'}
              </>
            ) : canResend ? (
              t('otp.resend')
            ) : (
              `${t('otp.resendIn') || 'Resend in'} ${formatTime(countdown)}`
            )}
          </button>
        </div>

        <div className="flex w-full items-center justify-center gap-x-[8px] mb-[32px]">
          <TimerIcon />
          <span className="text-[#878787] text-[14px] font-[500] leading-[20px]">
            {countdown > 0 ? formatTime(countdown) : '00:00'}
          </span>
        </div>

        <div className="flex w-full h-full items-end">
          <button
            type="submit"
            className="bg-red-500 rounded-[100px] py-[16px] w-full text-[14px] font-semibold leading-[20px] text-white hover:bg-[#e67c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading || otpValue.length !== 6}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {t('otp.verifying') || 'Verifying...'}
              </>
            ) : (
              t('otp.continue')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfirmOtp;
